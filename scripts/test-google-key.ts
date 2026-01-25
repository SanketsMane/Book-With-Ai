
import axios from 'axios';

const GOOGLE_KEY = 'AIzaSyBY8g-Hp0p_NTXemBSN0SZNW_0kr3b8xyA';
const SERP_KEY = '5dd3e9a6866994362e2d4b8e64091739a726f4a235fe8c4952ad5e00466bd221';

async function testGoogleKey() {
    console.log('Testing Google Places API...');

    const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.id'
        }
    };

    console.time('Google API Call');
    try {
        const result = await axios.post(BASE_URL, {
            textQuery: 'Eiffel Tower'
        }, config);
        console.timeEnd('Google API Call');
        console.log('✅ Google API Success:', result.status);
    } catch (error: any) {
        console.timeEnd('Google API Call');
        console.error('❌ Google API Error:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

async function testSerpApi() {
    console.log('\nTesting SerpAPI Images...');
    const url = `https://serpapi.com/search.json?engine=google_images&q=Eiffel+Tower&api_key=${SERP_KEY}`;

    console.time('SerpAPI Call');
    try {
        const result = await axios.get(url);
        console.timeEnd('SerpAPI Call');
        console.log('✅ SerpAPI Success:', result.status);
    } catch (error: any) {
        console.timeEnd('SerpAPI Call');
        console.error('❌ SerpAPI Error:', error.message);
    }
}

async function run() {
    await testGoogleKey();
    await testSerpApi();
}

run();
