
import axios from 'axios';

async function testApi() {
    const url = 'http://localhost:3000/api/google-place-detail';
    console.log(`Testing POST to ${url}...`);

    try {
        const response = await axios.post(url, {
            placeName: 'Eiffel Tower'
        });
        console.log('✅ Success! Status:', response.status);
        console.log('Data:', response.data);
    } catch (error: any) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.statusText);
            // console.error('Data:', error.response.data); // Don't print huge HTML if 404
            if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
                console.error('❌ Received HTML response (likely 404 Page or 500 Error Page)');
            } else {
                console.log('Data:', error.response.data);
            }
        } else {
            console.error('❌ Connection Error:', error.message);
        }
        process.exit(1);
    }
}

testApi();
