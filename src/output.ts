import fs from 'fs';
import path from 'path';

export function saveOutput(data: Object): boolean {
    try {
        const json: string = JSON.stringify(data, null, 2);
        const outputDir = path.join(__dirname, '../output');
        const outputPath = path.join(outputDir, `output-${Date.now()}.json`);

        fs.writeFile(outputPath, json, (error) => {
            if (error) throw error;
        });

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}