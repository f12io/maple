import maple, {
  loadPrecalculatedProperties,
} from './src/engines/maple/property-extraction.js';

async function run() {
  console.log('Testing Node.js environment with pre-calculated data...');

  // Initially, properties should be empty/undefined because calculations are lazy and document is missing
  console.log(
    'Checking map access (should be undefined):',
    maple.properties.shortMap?.bg,
  );

  console.log('Loading pre-calculated properties...');
  await loadPrecalculatedProperties();

  const props = maple.properties;
  console.log(
    'Properties count after loading:',
    Object.keys(props.shortMap).length,
  );

  const bgKey = props.shortMap['bg'];
  const bgData = props.utilityMap[bgKey];
  console.log('Relation for "bg":', bgData.rel); // should be 'c' for color

  const pKey = props.shortMap['p'];
  const pData = props.utilityMap[pKey];
  console.log('Relation for "p":', pData.rel); // should be 'd' for dimension

  if (bgData.rel === 'c' && pData.rel === 'd') {
    console.log('✅ Node.js verification successful!');
  } else {
    console.error('❌ Node.js verification failed: rel values are incorrect.');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
