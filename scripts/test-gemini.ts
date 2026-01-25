
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Manual env loader
const loadEnv = (filePath: string) => {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.error(`Failed to load ${filePath}`, e);
    }
};

loadEnv(path.resolve(process.cwd(), '.env'));
loadEnv(path.resolve(process.cwd(), '.env.local'));

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Checking Gemini API Key...');

    if (!apiKey) {
        console.error('❌ Error: GEMINI_API_KEY is missing from environment variables.');
        return;
    }

    console.log('✅ Key found (starts with):', apiKey.substring(0, 5) + '...');

    const genAI = new GoogleGenerativeAI(apiKey);

    const models = [
        'gemini-2.5-flash'
    ];

    console.log('Starting model availability check...');

    for (const modelName of models) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello via " + modelName);
            const response = await result.response;
            const text = response.text();
            console.log(`✅ Success with ${modelName}:`, text);
        } catch (error: any) {
            console.error(`❌ Failed with ${modelName}.`);
            console.error('Error message:', error.message);
            console.error('Full error:', JSON.stringify(error, null, 2));
        }
    }
}

testGemini();
