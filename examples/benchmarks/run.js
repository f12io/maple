import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const artifactsDir = path.join(__dirname, 'artifacts');
const reportsDir = path.join(__dirname, 'reports');
const propAbbreviationsPath = path.join(
  projectRoot,
  'src/generated/precalculated-prop-abbreviations.ts',
);

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3005;
const baseUrl = `http://localhost:${port}`;
const sizes = ['small', 'medium', 'large'];
const variants = sizes.flatMap((size) => [`${size}-runtime`, `${size}-static`]);
const lightningIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-left:2px; margin-top:-2px;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;

const workloadTargets = {
  small: { target: 2500, fallbackUnique: 600 },
  medium: { target: 5000, fallbackUnique: 1800 },
  large: { target: 9000, fallbackUnique: 3600 },
};

const staticCssTargetKb = {
  small: 20,
  medium: 55,
  large: 110,
};

const benchmarkAliasProperties = new Map([
  ['abs', 'position'],
  ['fixed', 'position'],
  ['rel', 'position'],
  ['sticky', 'position'],
  ['static', 'position'],
  ['block', 'display'],
  ['fx', 'display'],
  ['gr', 'display'],
  ['hidden', 'visibility'],
  ['iblock', 'display'],
  ['ifx', 'display'],
  ['inline', 'display'],
  ['none', 'display'],
  ['table', 'display'],
  ['visible', 'visibility'],
]);

// These profiles are intentionally Chrome DevTools emulations. The benchmark
// still assumes a fast local host and compares variants within the same run.
const networkProfiles = [
  {
    name: 'Fast Network',
    label: 'Fast',
    config: null,
    description: 'No network throttling',
  },
  {
    name: 'Avg Network',
    label: 'Avg',
    config: {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150,
    },
    description: '1.6 Mbps / 750 Kbps, 150ms latency',
  },
  {
    name: 'Slow Network',
    label: 'Slow',
    config: {
      offline: false,
      downloadThroughput: (500 * 1024) / 8,
      uploadThroughput: (500 * 1024) / 8,
      latency: 400,
    },
    description: '500 Kbps / 500 Kbps, 400ms latency',
  },
];

const deviceProfiles = [
  {
    name: 'Fast Device',
    label: 'Fast',
    config: null,
    description: 'No CPU throttling',
  },
  {
    name: 'Avg Device',
    label: 'Avg',
    config: { rate: 4 },
    description: '4x CPU slowdown',
  },
  {
    name: 'Slow Device',
    label: 'Slow',
    config: { rate: 6 },
    description: '6x CPU slowdown',
  },
];

const defaultNetworkConditions = {
  offline: false,
  latency: 0,
  downloadThroughput: -1,
  uploadThroughput: -1,
};

const defaultCpuConditions = { rate: 1 };

function parseOptions(argv) {
  const reuseRatio = parseReuseRatio(argv);
  const { seed, isRandomSeed } = parseSeed(argv);

  return {
    argv,
    expandCss: argv.includes('--add-unused-css'),
    isCachingEnabled: argv.includes('--caching'),
    iterations: parsePositiveIntegerFlag(argv, '--iterations', 5),
    isFastOnly: argv.includes('--fast'),
    isRandomSeed,
    reuseRatio,
    seed,
  };
}

function parsePositiveIntegerFlag(argv, flag, fallback) {
  const flagIndex = argv.indexOf(flag);
  if (flagIndex === -1 || !argv[flagIndex + 1]) return fallback;

  const value = Number.parseInt(argv[flagIndex + 1], 10);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function parseReuseRatio(argv) {
  const flagIndex = argv.indexOf('--reuse-ratio');
  if (flagIndex === -1 || !argv[flagIndex + 1]) return null;

  const ratio = Number.parseFloat(argv[flagIndex + 1]);
  if (!Number.isFinite(ratio)) return null;
  if (ratio < 1) throw new Error('--reuse-ratio should be >= 1');

  return ratio;
}

function parseSeed(argv) {
  const flagIndex = argv.indexOf('--seed');
  if (flagIndex > -1 && argv[flagIndex + 1]) {
    const seed = Number(argv[flagIndex + 1]);

    if (!Number.isSafeInteger(seed)) {
      throw new Error(`Invalid --seed value: ${argv[flagIndex + 1]}`);
    }

    console.log(`🌱 Using provided seed: ${seed}`);
    return { seed, isRandomSeed: false };
  }

  const seed = Math.floor(Math.random() * 1000000);
  console.log(
    `🌱 Generated random seed: ${seed} (run with --seed ${seed} to reproduce)`,
  );

  return { seed, isRandomSeed: true };
}

function createMulberry32(seed) {
  // A tiny deterministic PRNG keeps fixture shape and run ordering reproducible
  // without bringing in a dependency or relying on Math.random().
  return function nextRandom() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(array, random) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function createFixtureStats(reuseRatio) {
  return Object.fromEntries(
    Object.entries(workloadTargets).map(([name, workload]) => [
      name,
      {
        target: workload.target,
        targetUnique: getUniqueTarget(
          workload.target,
          workload.fallbackUnique,
          reuseRatio,
        ),
      },
    ]),
  );
}

function getUniqueTarget(total, fallback, reuseRatio) {
  if (!reuseRatio) return fallback;
  return Math.max(1, Math.min(total, Math.floor(total / reuseRatio)));
}

function ensureDirectories() {
  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
}

function buildAndCopyMaple() {
  console.log('🚀 Building Maple Project...');
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });

  console.log('📋 Copying dist/maple.js to artifacts...');
  const sourcePath = path.join(projectRoot, 'dist', 'maple.js');
  const artifactPath = path.join(artifactsDir, 'maple.js');
  fs.copyFileSync(sourcePath, artifactPath);

  return getGzipSizeKb(fs.readFileSync(artifactPath)).toFixed(2);
}

function loadValidClasses() {
  const validClassesPath = path.join(__dirname, 'valid-classes.json');
  return JSON.parse(fs.readFileSync(validClassesPath, 'utf-8'));
}

function loadPropAbbreviations() {
  const source = fs.readFileSync(propAbbreviationsPath, 'utf-8');
  const abbreviations = new Map();
  const matcher = /^\s*([a-zA-Z0-9_-]+): "([^"]+)",$/gm;

  for (const match of source.matchAll(matcher)) {
    abbreviations.set(match[1], toKebabCase(match[2]));
  }

  return abbreviations;
}

function generateRuntimeFixtures({
  fixtureStats,
  propAbbreviations,
  random,
  validClasses,
}) {
  console.log('\n🚀 Generating HTML Fixtures...');

  for (const size of sizes) {
    const stats = fixtureStats[size];
    const result = generateRuntimeFixture({
      name: size,
      propAbbreviations,
      random,
      totalTarget: stats.target,
      uniqueTarget: stats.targetUnique,
      validClasses,
    });

    Object.assign(stats, result);
  }
}

function generateRuntimeFixture({
  name,
  propAbbreviations,
  random,
  totalTarget,
  uniqueTarget,
  validClasses,
}) {
  const selectedUnique = shuffle(validClasses, random).slice(
    0,
    Math.min(uniqueTarget, validClasses.length),
  );

  let occurrences = 0;
  let uniqueCursor = 0;
  let openTags = 0;
  const actualUnique = new Set();
  let html = createFixtureHtmlHead({ name, totalTarget, uniqueTarget });

  // Generate nested DOMs instead of a flat list so Maple sees a more realistic
  // traversal shape while preserving the requested class-occurrence target.
  while (occurrences < totalTarget) {
    const result = pickClassesForDiv({
      occurrences,
      propAbbreviations,
      random,
      selectedUnique,
      totalTarget,
      uniqueCursor,
    });
    const divClasses = result.classes;

    uniqueCursor = result.uniqueCursor;
    occurrences += divClasses.length;
    if (divClasses.length === 0) continue;
    for (const className of divClasses) {
      actualUnique.add(className);
    }

    const indent = '  '.repeat(openTags + 3);
    html += `${indent}<div class="${divClasses.join(' ')}">\n`;

    if (random() < 0.3 && openTags < 10) {
      openTags++;
      continue;
    }

    html += `${indent}</div>\n`;

    let goUp = random();
    while (goUp > 0.6 && openTags > 0) {
      openTags--;
      html += `${'  '.repeat(openTags + 3)}</div>\n`;
      goUp = random();
    }
  }

  while (openTags > 0) {
    openTags--;
    html += `${'  '.repeat(openTags + 3)}</div>\n`;
  }

  html += `    </div>
  </body>
</html>`;

  fs.writeFileSync(
    path.join(artifactsDir, `${name}-runtime.html`),
    html,
    'utf-8',
  );
  console.log(
    `✅ Generated ${name}-runtime.html with ${occurrences} occurrences and ${actualUnique.size} unique classes.`,
  );

  return {
    occurrences,
    uniqueCount: actualUnique.size,
  };
}

function pickClassesForDiv({
  occurrences,
  propAbbreviations,
  random,
  selectedUnique,
  totalTarget,
  uniqueCursor,
}) {
  const classesForThisDiv = Math.min(
    3 + Math.floor(random() * 4),
    totalTarget - occurrences,
  );
  const result = buildConflictFreeClassList({
    desiredCount: classesForThisDiv,
    propAbbreviations,
    random,
    selectedUnique,
    uniqueCursor,
  });

  return result;
}

function buildConflictFreeClassList({
  desiredCount,
  propAbbreviations,
  random,
  selectedUnique,
  uniqueCursor,
}) {
  const usedConflictKeys = new Set();
  const classes = [];
  let attempts = 0;
  const maxAttempts = desiredCount * 20;
  let nextUniqueCursor = uniqueCursor;

  // Keep each element free of same-property utilities. Maple resolves those
  // conflicts from class order at runtime; static CSS resolves them from rule
  // order, so conflict-free elements preserve semantic parity.
  while (classes.length < desiredCount && attempts < maxAttempts) {
    let className;
    let conflictKey;
    let foundIndex = -1;

    if (nextUniqueCursor < selectedUnique.length) {
      let searchCursor = nextUniqueCursor;
      while (searchCursor < selectedUnique.length && attempts < maxAttempts) {
        const candidate = selectedUnique[searchCursor];
        const key = getBenchmarkConflictKey(candidate, propAbbreviations);
        attempts++;
        if (!hasConflict(usedConflictKeys, key)) {
          className = candidate;
          conflictKey = key;
          foundIndex = searchCursor;
          break;
        }
        searchCursor++;
      }
    }

    if (!className) {
      className = selectedUnique[Math.floor(random() * selectedUnique.length)];
      conflictKey = getBenchmarkConflictKey(className, propAbbreviations);
      attempts++;

      if (hasConflict(usedConflictKeys, conflictKey)) {
        continue;
      }
    } else if (foundIndex !== -1) {
      if (foundIndex !== nextUniqueCursor) {
        const temp = selectedUnique[nextUniqueCursor];
        selectedUnique[nextUniqueCursor] = selectedUnique[foundIndex];
        selectedUnique[foundIndex] = temp;
      }
      nextUniqueCursor++;
    }

    classes.push(className);
    usedConflictKeys.add(conflictKey);
  }

  return { classes, uniqueCursor: nextUniqueCursor };
}

function hasConflict(usedConflictKeys, candidate) {
  for (const existing of usedConflictKeys) {
    if (existing.context !== candidate.context) continue;
    if (propertiesConflict(existing.property, candidate.property)) return true;
  }

  return false;
}

function getBenchmarkConflictKey(className, propAbbreviations) {
  const parsed = parseBenchmarkClass(className, propAbbreviations);
  if (!parsed) return { context: '', property: className };

  return parsed;
}

function parseBenchmarkClass(className, propAbbreviations) {
  const normalizedClass = stripMapleClassFlags(className);
  const utilityDelimiter = findLastTopLevelDelimiter(normalizedClass, ':');
  const context =
    utilityDelimiter === -1 ? '' : normalizedClass.slice(0, utilityDelimiter);
  const utility =
    utilityDelimiter === -1
      ? normalizedClass
      : normalizedClass.slice(utilityDelimiter + 1);
  const rawUtilityKey = getBenchmarkUtilityKey(utility, propAbbreviations);
  const property = getBenchmarkProperty(rawUtilityKey, propAbbreviations);

  if (!property) return null;

  return { context, property };
}

function stripMapleClassFlags(className) {
  let normalizedClass = className;

  if (normalizedClass.startsWith('!')) {
    normalizedClass = normalizedClass.slice(1);
  }

  if (normalizedClass.startsWith('$$')) {
    return normalizedClass.slice(2);
  }

  if (normalizedClass.startsWith('$')) {
    return normalizedClass.slice(1);
  }

  return normalizedClass;
}

function stripNegativePrefix(utility) {
  return utility.startsWith('-') ? utility.slice(1) : utility;
}

function getBenchmarkUtilityKey(utility, propAbbreviations) {
  const normalizedUtility = stripNegativePrefix(utility);
  const utilityOperator = findFirstTopLevelDelimiter(normalizedUtility, '=');

  if (utilityOperator !== -1) {
    return normalizedUtility.slice(0, utilityOperator);
  }

  return findKnownUtilityPrefix(normalizedUtility, propAbbreviations);
}

function findKnownUtilityPrefix(utility, propAbbreviations) {
  let endIndex = utility.length;

  while (endIndex > 0) {
    const candidate = utility.slice(0, endIndex);

    if (isKnownBenchmarkUtility(candidate, propAbbreviations)) {
      return candidate;
    }

    endIndex = utility.lastIndexOf('-', endIndex - 1);
  }

  return utility;
}

function isKnownBenchmarkUtility(utility, propAbbreviations) {
  return (
    benchmarkAliasProperties.has(utility) ||
    propAbbreviations.has(utility) ||
    utility.startsWith('fxcol') ||
    utility.startsWith('fxrow') ||
    utility.startsWith('fxrowself') ||
    utility.startsWith('square')
  );
}

function getBenchmarkProperty(rawUtilityKey, propAbbreviations) {
  if (!rawUtilityKey) return null;

  if (benchmarkAliasProperties.has(rawUtilityKey)) {
    return benchmarkAliasProperties.get(rawUtilityKey);
  }

  if (
    rawUtilityKey.startsWith('fxcol') ||
    rawUtilityKey.startsWith('fxrow') ||
    rawUtilityKey.startsWith('fxrowself')
  ) {
    return 'display';
  }

  if (rawUtilityKey.startsWith('square')) {
    return 'size';
  }

  const directProperty = propAbbreviations.get(rawUtilityKey);
  if (directProperty) return directProperty;

  return toKebabCase(rawUtilityKey);
}

function propertiesConflict(existingProperty, candidateProperty) {
  return (
    existingProperty === candidateProperty ||
    isPropertyAncestor(existingProperty, candidateProperty) ||
    isPropertyAncestor(candidateProperty, existingProperty)
  );
}

function isPropertyAncestor(parentProperty, childProperty) {
  return childProperty.startsWith(`${parentProperty}-`);
}

function findLastTopLevelDelimiter(value, delimiter) {
  let result = -1;
  let depth = 0;
  let quote = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (quote) {
      if (char === quote) quote = '';
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === '[' || char === '(') depth++;
    else if (char === ']' || char === ')') depth--;
    else if (depth === 0 && char === delimiter) result = i;
  }

  return result;
}

function findFirstTopLevelDelimiter(value, delimiter) {
  let depth = 0;
  let quote = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (quote) {
      if (char === quote) quote = '';
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === '[' || char === '(') depth++;
    else if (char === ']' || char === ')') depth--;
    else if (depth === 0 && char === delimiter) return i;
  }

  return -1;
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function createFixtureHtmlHead({ name }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Maple Benchmark - ${name}</title>
    <script>
      window.addEventListener('load', async () => {
        // styledReadyMs is the only timing metric this benchmark records. The
        // forced layout plus two frames waits for both runtime and static CSS to
        // reach the first settled styled frame after navigation start.
        await Promise.resolve();
        await Promise.resolve();
        document.documentElement.getBoundingClientRect();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        window.styledReadyMs = performance.now();
      });
    </script>
    <script src="maple.js"></script>
  </head>
  <body>
    <div id="container">\n`;
}

function createStaticServer() {
  return http.createServer((request, response) => {
    try {
      serveStaticFile(request, response);
    } catch {
      response.writeHead(500);
      response.end('Error');
    }
  });
}

function serveStaticFile(request, response) {
  const requestUrl = new URL(request.url, baseUrl);
  const pathname = decodeURIComponent(requestUrl.pathname);
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.resolve(artifactsDir, `.${requestedPath}`);

  if (!filePath.startsWith(artifactsDir + path.sep)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  const content = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);

  if ((request.headers['accept-encoding'] || '').includes('gzip')) {
    const headers = {
      'Content-Encoding': 'gzip',
      'Content-Type': contentType,
    };
    if (contentType !== 'text/html') {
      headers['Cache-Control'] = 'public, max-age=31536000';
    }
    response.writeHead(200, headers);
    response.end(gzipSync(content));
    return;
  }

  const headers = { 'Content-Type': contentType };
  if (contentType !== 'text/html') {
    headers['Cache-Control'] = 'public, max-age=31536000';
  }
  response.writeHead(200, headers);
  response.end(content);
}

function getContentType(filePath) {
  const extension = path.extname(filePath);

  if (extension === '.css') return 'text/css';
  if (extension === '.html') return 'text/html';
  if (extension === '.js') return 'application/javascript';

  return 'text/plain';
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, resolve);
  });
}

async function closeServer(server) {
  if (!server.listening) return;

  await new Promise((resolve) => {
    server.close(resolve);
  }).catch(() => undefined);
}

async function extractStaticFixtures({
  browser,
  expandCss,
  fixtureStats,
  random,
  validClasses,
}) {
  console.log('\n🚀 Launching Playwright to extract static CSS...');
  const page = await browser.newPage();

  try {
    for (const size of sizes) {
      await extractStaticFixture({
        expandCss,
        page,
        random,
        size,
        validClasses,
      });

      const cssPath = path.join(artifactsDir, `${size}-static.css`);
      fixtureStats[size].cssGzipSize = getGzipSizeKb(
        fs.readFileSync(cssPath),
      ).toFixed(2);
      writeStaticHtml(size);

      console.log(`✅ ${size}-static.html generated.`);
    }
  } finally {
    await page.close().catch(() => undefined);
  }
}

async function extractStaticFixture({
  expandCss,
  page,
  random,
  size,
  validClasses,
}) {
  console.log(`Extracting static CSS for ${size}...`);
  await page.goto(`${baseUrl}/${size}-runtime.html`, {
    waitUntil: 'networkidle',
  });

  const cssText = await readMapleCssText(page);
  if (!cssText) {
    console.warn(
      `⚠️ Warning: No CSS generated for ${size}. Is maple.js loading correctly?`,
    );
  }

  const cssPath = path.join(artifactsDir, `${size}-static.css`);
  fs.writeFileSync(cssPath, cssText, 'utf-8');
  minifyCss(cssPath, size);

  if (expandCss) {
    expandStaticCss({ cssPath, random, size, validClasses });
  }
}

async function readMapleCssText(page) {
  return page.evaluate(() => {
    // The static variant must come from Maple's own generated CSSOM. This keeps
    // runtime and static fixtures semantically identical except for delivery.
    const sheet = document.getElementById('mapleStyles')?.sheet;
    if (!sheet) return '';

    let text = '';
    for (const rule of sheet.cssRules) {
      text += rule.cssText + '\n';
    }

    return text;
  });
}

function minifyCss(cssPath, size) {
  console.log(`Minifying ${size}-static.css with esbuild...`);
  execFileSync(
    'npx',
    [
      'esbuild',
      cssPath,
      '--minify',
      '--allow-overwrite',
      `--outfile=${cssPath}`,
    ],
    { stdio: 'inherit', cwd: projectRoot },
  );
}

function expandStaticCss({ cssPath, random, size, validClasses }) {
  let rawCss = fs.readFileSync(cssPath);
  let currentGzipSize = getGzipSizeKb(rawCss);
  const targetKb = staticCssTargetKb[size];

  if (currentGzipSize >= targetKb) return;

  console.log(
    `  Injecting unused CSS to simulate global stylesheet (~${targetKb}kb)...`,
  );

  let unusedCss = '';
  let batchIndex = 0;

  // Optional ballast models global CSS that is downloaded and parsed but never
  // matched by the page. It is disabled by default because it changes payloads.
  while (currentGzipSize < targetKb) {
    for (let i = 0; i < 500; i++) {
      const className = validClasses[batchIndex % validClasses.length];
      const safeClassName = className.replace(/[^a-zA-Z0-9-]/g, '');
      batchIndex++;

      if (!safeClassName) continue;

      unusedCss += `.page${batchIndex}-${safeClassName} { padding: ${batchIndex % 100}px; color: #${Math.floor(
        random() * 16777215,
      )
        .toString(16)
        .padStart(6, '0')}; }\n`;
    }

    currentGzipSize = getGzipSizeKb(
      Buffer.from(rawCss.toString() + '\n' + unusedCss),
    );
  }

  fs.appendFileSync(cssPath, '\n' + unusedCss);
  minifyCss(cssPath, size);
}

function writeStaticHtml(size) {
  const runtimeHtmlPath = path.join(artifactsDir, `${size}-runtime.html`);
  const staticHtmlPath = path.join(artifactsDir, `${size}-static.html`);
  const html = fs.readFileSync(runtimeHtmlPath, 'utf-8').replace(
    // The DOM and readiness script stay byte-for-byte aligned with runtime;
    // only Maple JS delivery is swapped for pre-extracted CSS delivery.
    '<script src="maple.js"></script>',
    `<link rel="stylesheet" href="${size}-static.css">`,
  );

  fs.writeFileSync(staticHtmlPath, html, 'utf-8');
}

async function runBenchmarks({
  activeDevices,
  activeNetworks,
  browser,
  options,
}) {
  const progress = {
    currentRun: 0,
    totalRuns:
      activeNetworks.length *
      activeDevices.length *
      (options.iterations + 1) *
      variants.length,
  };
  const allResults = [];

  console.log(
    `\n⏱️ Running Benchmarks (1 warmup, ${options.iterations} iterations per config)...`,
  );

  for (const network of activeNetworks) {
    for (const device of activeDevices) {
      allResults.push(
        await runBenchmarkSuite({
          browser,
          cpuConfig: device.config,
          iterations: options.iterations,
          matrixName: `${network.name} - ${device.name}`,
          networkConfig: network.config,
          progress,
          random: options.random,
          isCachingEnabled: options.isCachingEnabled,
        }),
      );
    }
  }

  return allResults;
}

async function runBenchmarkSuite({
  browser,
  cpuConfig,
  iterations,
  matrixName,
  networkConfig,
  progress,
  random,
  isCachingEnabled,
}) {
  const variantResults = Object.fromEntries(
    variants.map((variant) => [variant, { styledReadyTimes: [] }]),
  );
  const totalRuns = iterations + 1;

  for (let iteration = 0; iteration < totalRuns; iteration++) {
    // Shuffle each iteration to reduce bias from thermal state, cache behavior,
    // or browser startup effects favoring a fixed variant order.
    for (const variant of shuffle(variants, random)) {
      writeProgress({ iteration, matrixName, progress, variant });

      const metrics = await measureVariant({
        browser,
        cpuConfig,
        networkConfig,
        variant,
        isCachingEnabled,
      });

      // The first pass warms the browser, server, and generated assets; only
      // subsequent iterations are included in the reported percentiles.
      if (iteration === 0) continue;

      if (metrics.styledReady !== null) {
        variantResults[variant].styledReadyTimes.push(metrics.styledReady);
      } else {
        console.warn(
          `    ⚠️ Warning: Missing styledReady for ${variant}. Excluding from median.`,
        );
      }
    }
  }

  return {
    matrixName,
    results: summarizeVariantResults(variantResults),
  };
}

function writeProgress({ iteration, matrixName, progress, variant }) {
  progress.currentRun++;

  const percentage = Math.round(
    (progress.currentRun / progress.totalRuns) * 100,
  );
  const barLength = 20;
  const filled = Math.round((percentage / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  const iterationLabel = iteration === 0 ? 'Warmup' : `Iter ${iteration}`;

  process.stdout.write(
    `\r  ➤ [${bar}] ${percentage}% (${progress.currentRun}/${progress.totalRuns}) - ${matrixName} - ${iterationLabel} [${variant}]\x1b[0K`,
  );
}

async function measureVariant({
  browser,
  cpuConfig,
  networkConfig,
  variant,
  isCachingEnabled,
}) {
  const context = await browser.newContext();

  try {
    const page = await context.newPage();
    const client = await context.newCDPSession(page);

    if (isCachingEnabled) {
      await page.goto(`${baseUrl}/${variant}.html`, {
        waitUntil: 'networkidle',
        timeout: 60000,
      });
    }

    await client.send(
      'Network.emulateNetworkConditions',
      networkConfig ?? defaultNetworkConditions,
    );
    await client.send(
      'Emulation.setCPUThrottlingRate',
      cpuConfig ?? defaultCpuConditions,
    );

    await page.goto(`${baseUrl}/${variant}.html`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    // The page itself defines styledReadyMs so both variants use the same
    // readiness contract regardless of whether styles came from JS or CSS.
    await page.waitForFunction(() => Number.isFinite(window.styledReadyMs), {
      timeout: 60000,
    });

    return await page.evaluate(() => ({
      styledReady: Number.isFinite(window.styledReadyMs)
        ? window.styledReadyMs
        : null,
    }));
  } finally {
    await context.close().catch(() => undefined);
  }
}

function summarizeVariantResults(variantResults) {
  return Object.fromEntries(
    variants.map((variant) => {
      const styledReadyTimes = [
        ...variantResults[variant].styledReadyTimes,
      ].sort((a, b) => a - b);

      return [
        variant,
        {
          styledReady: getPercentile(styledReadyTimes, 0.5),
          styledReadyP25: getPercentile(styledReadyTimes, 0.25),
          styledReadyP75: getPercentile(styledReadyTimes, 0.75),
        },
      ];
    }),
  );
}

function getPercentile(values, percentile) {
  if (values.length === 0) return 0;

  const index = (values.length - 1) * percentile;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) return values[lower];

  return values[lower] + (values[upper] - values[lower]) * (index - lower);
}

function getGzipSizeKb(content) {
  return gzipSync(content).length / 1000;
}

function getAverageWinner(runtimeAverage, staticAverage) {
  if (runtimeAverage === staticAverage) return 'tie';
  return runtimeAverage < staticAverage ? 'runtime' : 'static';
}

function compareRuntimeAndStatic(runtimeResult, staticResult, metric) {
  const runtime = runtimeResult?.[metric] ?? 0;
  const stat = staticResult?.[metric] ?? 0;
  const runtimeIqr =
    (runtimeResult?.[`${metric}P75`] ?? runtime) -
    (runtimeResult?.[`${metric}P25`] ?? runtime);
  const staticIqr =
    (staticResult?.[`${metric}P75`] ?? stat) -
    (staticResult?.[`${metric}P25`] ?? stat);
  const diff = Math.abs(runtime - stat);
  // Treat tiny margins as noise. The fixed 25ms floor prevents low-IQR samples
  // from overstating wins that are beneath practical browser timing variance.
  const noise = Math.max(25, (runtimeIqr + staticIqr) / 2);

  return {
    diff,
    isRuntimeWin: runtime < stat,
    isTie: diff < noise,
    runtime,
    runtimeIqr,
    stat,
    staticIqr,
  };
}

function summarizeAggregate({ activeDevices, activeNetworks, allResults }) {
  const summary = {
    styledReady: {
      bySize: {},
      overall: createEmptySummaryBucket(),
    },
  };

  for (const size of sizes) {
    const sizeSummary = createEmptySummaryBucket();

    for (const network of activeNetworks) {
      for (const device of activeDevices) {
        const matrixName = `${network.name} - ${device.name}`;
        const matrixResult = allResults.find(
          (item) => item.matrixName === matrixName,
        );

        if (!matrixResult) continue;

        applyComparisonToSummary(
          sizeSummary,
          compareRuntimeAndStatic(
            matrixResult.results[`${size}-runtime`],
            matrixResult.results[`${size}-static`],
            'styledReady',
          ),
        );
      }
    }

    finalizeSummaryBucket(sizeSummary);
    summary.styledReady.bySize[size] = sizeSummary;
    mergeSummaryBucket(summary.styledReady.overall, sizeSummary);
  }

  finalizeSummaryBucket(summary.styledReady.overall);
  return summary;
}

function createEmptySummaryBucket() {
  return {
    count: 0,
    runtimeTotal: 0,
    staticTotal: 0,
    runtimeWins: 0,
    staticWins: 0,
    ties: 0,
  };
}

function applyComparisonToSummary(summary, comparison) {
  summary.runtimeTotal += comparison.runtime;
  summary.staticTotal += comparison.stat;
  summary.count++;

  if (comparison.isTie) {
    summary.ties++;
  } else if (comparison.isRuntimeWin) {
    summary.runtimeWins++;
  } else {
    summary.staticWins++;
  }
}

function mergeSummaryBucket(target, source) {
  target.count += source.count;
  target.runtimeTotal += source.runtimeTotal;
  target.staticTotal += source.staticTotal;
  target.runtimeWins += source.runtimeWins;
  target.staticWins += source.staticWins;
  target.ties += source.ties;
}

function finalizeSummaryBucket(summary) {
  summary.averageRuntime =
    summary.count > 0 ? summary.runtimeTotal / summary.count : 0;
  summary.averageStatic =
    summary.count > 0 ? summary.staticTotal / summary.count : 0;
  summary.averageMargin = Math.abs(
    summary.averageRuntime - summary.averageStatic,
  );
  summary.winner = getAverageWinner(
    summary.averageRuntime,
    summary.averageStatic,
  );
  summary.percentSaved = getPercentSaved(summary);
}

function getPercentSaved(summary) {
  if (summary.winner === 'tie') return 0;

  if (summary.winner === 'runtime') {
    return summary.averageStatic > 0
      ? (summary.averageMargin / summary.averageStatic) * 100
      : 0;
  }

  return summary.averageRuntime > 0
    ? (summary.averageMargin / summary.averageRuntime) * 100
    : 0;
}

function formatTime(ms) {
  return ms > 1000 ? (ms / 1000).toFixed(2) + 's' : Math.round(ms) + 'ms';
}

function formatWinner(winner) {
  if (winner === 'tie') return 'Tie';
  return winner === 'runtime' ? 'Runtime' : 'Static';
}

function formatWinnerWithSignal(winner, margin) {
  const signal = margin > 500 ? lightningIcon : '';
  return `${formatWinner(winner)}${signal}`;
}

function winnerClass(winner) {
  if (winner === 'tie') return 'c-peru-500';
  return winner === 'runtime' ? 'c-limegreen-700' : 'c-deepskyblue-700';
}

function winnerBgClass(winner) {
  if (winner === 'tie') return 'bgc-peru-50 c-peru-500';
  return winner === 'runtime'
    ? 'bgc-limegreen-50 c-limegreen-700'
    : 'bgc-deepskyblue-50 c-deepskyblue-700';
}

function renderMatrixCell({ allResults, deviceName, networkName, size }) {
  const matrixName = networkName + ' - ' + deviceName;
  const matrixResult = allResults.find(
    (result) => result.matrixName === matrixName,
  );
  if (!matrixResult) return `<td class="p-px">-</td>`;

  const runtimeResult = matrixResult.results[size + '-runtime'];
  const staticResult = matrixResult.results[size + '-static'];
  const comparison = compareRuntimeAndStatic(
    runtimeResult,
    staticResult,
    'styledReady',
  );

  let styledReadyBgClass = 'bgc-peru-50 c-peru-500';
  let styledReadyWinnerText = 'Tie';

  if (!comparison.isTie) {
    styledReadyBgClass = comparison.isRuntimeWin
      ? 'bgc-limegreen-50 c-limegreen-700'
      : 'bgc-deepskyblue-50 c-deepskyblue-700';
    styledReadyWinnerText = comparison.isRuntimeWin ? 'Runtime' : 'Static';

    if (comparison.diff > 500) {
      styledReadyWinnerText += lightningIcon;
    }
  }

  const styledReadyPrimaryTime = comparison.isTie
    ? `Margin: ${formatTime(comparison.diff)}`
    : `${formatTime(comparison.diff)} faster`;
  const styledReadyStats = `R: ${formatTime(comparison.runtime)}, IQR ${formatTime(comparison.runtimeIqr)} <br/> S: ${formatTime(comparison.stat)}, IQR ${formatTime(comparison.staticIqr)}`;

  return `
<td class="p-0 br brc-white @dark:brc-black h-px">
  <div class="p-3 ${styledReadyBgClass} fxcol-ss g-1 h-% of=hidden ts-150_transform_ease-out &:hover:scale-1.25 &:hover:z-10 &:hover:rad-4 &:hover:bshadow=0_10px_30px_#0005">
    <div class="fw=500 fs-3">${styledReadyWinnerText}</div>
    <div class="fs-3 op-80">${styledReadyPrimaryTime}</div>
    <div class="fs-2.5 op-60 mt-1">${styledReadyStats}</div>
  </div>
</td>`;
}

function renderSizeTable({
  activeDevices,
  activeNetworks,
  allResults,
  fixtureStats,
  mapleJsGzipSize,
  size,
  summary,
}) {
  const stat = fixtureStats[size];
  const devices = activeDevices.map((device) => device.name);
  const networks = activeNetworks.map((network) => network.name);

  return `
<div class="bgc-white @dark:bgc-black p-3 br-2 rad-4">
  <div class="fxcol-sh gap-2 p-4 rad-4 mb-3 fs-3.5 bgc-darkgray-65">
    <h3 class="fs-5 fw=700 ttf-capitalize mt-0 mb-2">${size}</h3>
    <div class="fxcol-sh @lg:fxrow-sw @lg:g-2">
      <div>
        <div><span class="c-darkgray-500">Total Classes: </span><span>${stat.occurrences.toLocaleString()}</span></div>
        <div><span class="c-darkgray-500">Unique Classes: </span><span>${stat.uniqueCount.toLocaleString()}</span></div>
        <div><span class="c-darkgray-500">Reuse Ratio: </span><span>${(stat.occurrences / stat.uniqueCount).toFixed(1)}x</span></div>
      </div>
      <div>
        <div><span class="c-darkgray-500">Static CSS: </span><span class="c-deepskyblue-600">${stat.cssGzipSize} KB .gz</span></div>
        <div><span class="c-darkgray-500">Runtime JS: </span><span class="c-deepskyblue-600">${mapleJsGzipSize} KB .gz</span></div>
      </div>
    </div>
  </div>
  <table class="w-% fs-3.5 bgc-darkgray-65 rad-4 borderCollapse=collapse">
    <thead>
      <tr>
        <th class="p-2 fw=400 w-5 br brc-white @dark:brc-black c-darkgray-600"></th>
        ${devices.map((device) => `<th class="p-2 fw=400 br brc-white @dark:brc-black c-darkgray-600">${device}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${networks
        .map(
          (networkName) => `
        <tr>
          <td class="p-2 br brc-white @dark:brc-black c-darkgray-600 ta=center">
            <span class="writingMode=sideways-lr">${networkName}</span>
          </td>
          ${devices
            .map((deviceName) =>
              renderMatrixCell({
                allResults,
                deviceName,
                networkName,
                size,
              }),
            )
            .join('')}
        </tr>
      `,
        )
        .join('')}
    </tbody>
  </table>
  
  <!-- Aggregate Section -->
  <div class="gr cols-1 @sm:cols-3 g-2 mt-3 fs-3.5">
    <div class="fxcol-cc g-1 px-5 py-4 rad-4 bgc-darkgray-65">
      <div class="fs-3 c-darkgray-500">Runtime Avg</div>
      <div class="fs-4.5 c-limegreen-700">${formatTime(summary.styledReady.bySize[size].averageRuntime)}</div>
      <div class="fs-2.5 c-darkgray-400">${summary.styledReady.bySize[size].runtimeWins} wins</div>
    </div>
    <div class="fxcol-cc g-1 px-5 py-4 rad-4 bgc-darkgray-65">
      <div class="fs-3 c-darkgray-500">Static Avg</div>
      <div class="fs-4.5 c-deepskyblue-700">${formatTime(summary.styledReady.bySize[size].averageStatic)}</div>
      <div class="fs-2.5 c-darkgray-400">${summary.styledReady.bySize[size].staticWins} wins</div>
    </div>
    <div class="fxcol-cc g-1 px-5 py-4 rad-4 ${winnerBgClass(summary.styledReady.bySize[size].winner)} ${winnerClass(summary.styledReady.bySize[size].winner)}">
      <div class="fs-3">
        ${formatWinnerWithSignal(
          summary.styledReady.bySize[size].winner,
          summary.styledReady.bySize[size].averageMargin,
        )} ${
          summary.styledReady.bySize[size].winner === 'tie'
            ? 'on average'
            : 'wins by'
        }
      </div>
      <div class="fs-4.5">${formatTime(summary.styledReady.bySize[size].averageMargin)}</div>
    </div>
  </div>
</div>`;
}

function renderProfileList({ activeProfiles, allProfiles }) {
  return allProfiles
    .map((profile) => {
      const isActive = activeProfiles.some(
        (active) => active.name === profile.name,
      );
      const opacity = isActive ? 'op-100' : 'op-40';
      const activeBadge = isActive
        ? ''
        : ' <span class="fs-3 c-darkgray-400">(Skipped)</span>';

      return `<div class="fs-3.5 mb-1 ${opacity}"><span class="c-darkgray-500">${profile.label}</span>: ${profile.description}${activeBadge}</div>`;
    })
    .join('');
}

function generateReportHtml({
  activeDevices,
  activeNetworks,
  allResults,
  fixtureStats,
  mapleJsGzipSize,
  options,
}) {
  console.log('\n📝 Generating HTML Report...');

  const summary = summarizeAggregate({
    activeDevices,
    activeNetworks,
    allResults,
  });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportsDir, `report-${timestamp}.html`);
  const cpus = os.cpus();
  const cpuModel = cpus.length ? cpus[0].model : 'Unknown CPU';
  const cpuCores = cpus.length;
  const totalSeconds = performance.now() / 1000;
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toFixed(1);
  const durationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  const tablesHtml = sizes
    .map((size) =>
      renderSizeTable({
        activeDevices,
        activeNetworks,
        allResults,
        fixtureStats,
        mapleJsGzipSize,
        size,
        summary,
      }),
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en" class="@dark:--l-shift=-0.7">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maple Benchmark Report</title>
  <script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js?lg=1200px"></script>
</head>
<body class="bgc-darkgray-70 c-darkgray-900 ff-sans m-0 p-8 ff-arial /*:boxSizing=border-box">
  <div class="fxcol-sh @lg:fxrow-sw g-6 mb-4">
    <div>
      <h1 class="fs-8 fw=700 c-darkgray-900 mb-2 mt-0">Maple Benchmark Report</h1>
      <p class="fs-3.5 c-darkgray-500 mb-1">
        Generated on ${new Date().toLocaleString()} with ${cpuModel} (${cpuCores} cores) in ${durationStr}
      </p>
      <pre class="c-crimson-400 mb-1">node run.js ${options.argv.join(' ')}</pre>
      <p class="fs-3 c-darkgray-500 mb-1">
        The benchmark measures navigation start to the first settled styled frame after load, microtask drains, forced style/layout, and two animation frames.
      </p>
      <p class="fs-3 c-darkgray-500 mb-1 mt-0">
        Slower network and device profiles are simulated by introducing artificial throttling on top of the machine's baseline performance.
      </p>
      <p class="fs-3 c-darkgray-500 mb-1 mt-0">
        Matrix cells count as ties when the runtime/static margin is below max(25ms, average IQR); average winners tie only when averages are equal. The lightning mark highlights margins over 500ms.
      </p>
      ${
        options.isRandomSeed
          ? `<p class="fs-3 c-limegreen-400 mb-1">Seed: <code>${options.seed}</code></p>`
          : ''
      }
    </div>
    
    <div class="p-6 bgc-white @dark:bgc-black rad-4 of=auto">
      <div class="fxcol-sh @md:fxrow-ss g-4">
        <div>
          <h3 class="fs-4 mb-2 mt-0">Networks</h3>
          ${renderProfileList({
            activeProfiles: activeNetworks,
            allProfiles: networkProfiles,
          })}
        </div>
        <div>
          <h3 class="fs-4 mb-2 mt-0">Emulated Devices</h3>
          ${renderProfileList({
            activeProfiles: activeDevices,
            allProfiles: deviceProfiles,
          })}
        </div>
      </div>
    </div>
  </div>

  <div class="gr cols-1 @lg:cols-3 g-6">
    ${tablesHtml}
  </div>

  <div class="mt-6 p-6 bgc-white @dark:bgc-black rad-4 maxw=800px mx=auto">
    <h3 class="fs-5 fw=700 ttf-capitalize my-0">Overall Performance</h3>
    <p class="fs-3.5 c-darkgray-500 mb-4 mt-1">
      Aggregated across all sizes (small, medium, large) and all emulation configs (${activeNetworks.length * activeDevices.length * sizes.length} total runs).
    </p>
    
    <div class="gr cols-1 @md:cols-3 g-4 ta=center">
      <div class="p-3 rad-4 bgc-darkgray-65">
        <div class="fs-3 c-darkgray-500">Runtime Avg</div>
        <div class="fs-6 c-limegreen-700 my-1">${formatTime(summary.styledReady.overall.averageRuntime)}</div>
        <div class="fs-3 c-darkgray-400">${summary.styledReady.overall.runtimeWins} total wins</div>
      </div>
      
      <div class="p-3 rad-4 bgc-darkgray-65">
        <div class="fs-3 c-darkgray-500">Static Avg</div>
        <div class="fs-6 c-deepskyblue-700 my-1">${formatTime(summary.styledReady.overall.averageStatic)}</div>
        <div class="fs-3 c-darkgray-400">${summary.styledReady.overall.staticWins} total wins</div>
      </div>

      <div class="p-3 rad-4 fxcol-cc g-1 ${winnerBgClass(summary.styledReady.overall.winner)} ${winnerClass(summary.styledReady.overall.winner)}">
        <div class="fs-3 mb-1">
          ${formatWinnerWithSignal(
            summary.styledReady.overall.winner,
            summary.styledReady.overall.averageMargin,
          )} ${
            summary.styledReady.overall.winner === 'tie'
              ? 'on average'
              : 'wins by'
          }
        </div>
        <div class="fs-6">
          ${formatTime(summary.styledReady.overall.averageMargin)}
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(reportPath, html, 'utf-8');
  console.log(
    `✅ Report generated at examples/benchmarks/reports/report-${timestamp}.html`,
  );
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  options.random = createMulberry32(options.seed);

  const fixtureStats = createFixtureStats(options.reuseRatio);
  const propAbbreviations = loadPropAbbreviations();
  const validClasses = loadValidClasses();
  const activeNetworks = options.isFastOnly
    ? [networkProfiles[0]]
    : [...networkProfiles];
  const activeDevices = [...deviceProfiles];
  const server = createStaticServer();
  let browser;

  ensureDirectories();
  const mapleJsGzipSize = buildAndCopyMaple();
  generateRuntimeFixtures({
    fixtureStats,
    propAbbreviations,
    random: options.random,
    validClasses,
  });

  try {
    await listen(server);

    browser = await chromium.launch();
    await extractStaticFixtures({
      browser,
      expandCss: options.expandCss,
      fixtureStats,
      random: options.random,
      validClasses,
    });

    const allResults = await runBenchmarks({
      activeDevices,
      activeNetworks,
      browser,
      options,
    });

    generateReportHtml({
      activeDevices,
      activeNetworks,
      allResults,
      fixtureStats,
      mapleJsGzipSize,
      options,
    });
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }

    await closeServer(server);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
