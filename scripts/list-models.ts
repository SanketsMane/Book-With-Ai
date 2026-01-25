
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

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ Error: GEMINI_API_KEY is missing.');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log('Fetching models from:', url.replace(apiKey, 'HIDDEN'));

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const names = data.models
                .filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
                .map((m: any) => m.name);
            console.log(JSON.stringify(names, null, 2));
        } else {
            console.error('❌ No models found or error:', data);
        }
    } catch (error: any) {
        console.error('❌ Fetch failed:', error.message);
    }
}

listModels();
