
import maple, { initMaple } from './src/engines/maple/property-extraction.js';

async function run() {
    console.log('Testing Node.js environment...');

    // Before init, properties might be empty or using mock
    console.log('Initial properties count:', Object.keys(maple.properties.shortMap).length);

    console.log('Initializing JSDOM...');
    await initMaple();

    const props = maple.properties;
    console.log('Properties count after JSDOM init:', Object.keys(props.shortMap).length);

    // Verify a few properties
    const testProps = ['bg', 'p', 'm', 'text'];
    for (const p of testProps) {
        console.log(`Property "${p}":`, props.shortMap[p] ? 'Found' : 'NOT FOUND');
    }

    const bgKey = props.shortMap['bg'];
    const bgData = props.utilityMap[bgKey];
    console.log('Relation for "bg":', bgData.rel); // should be 'c' for color

    const pKey = props.shortMap['p'];
    const pData = props.utilityMap[pKey];
    console.log('Relation for "p":', pData.rel); // should be 'd' for dimension

    if (bgData.rel === 'c' && pData.rel === 'd') {
        console.log('✅ Verification successful!');
    } else {
        console.error('❌ Verification failed: rel values are incorrect.');
        process.exit(1);
    }
}

run().catch(err => {
    console.error('Verification failed with error:', err);
    process.exit(1);
});
