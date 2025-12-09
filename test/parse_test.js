import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as sxpb from 'sxpb';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsFile = path.join(__dirname, 'dirs.sxpb');
// Use sxpb.parse directly as verified in debug
const config = sxpb.parse(fs.readFileSync(dirsFile, 'utf8'));
const dirsToScan = config.dirs || [];

let sxpbFiles = [];

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            walk(file);
        } else {
            if (file.endsWith('.sxpb')) {
                sxpbFiles.push(file);
            }
        }
    });
}

const projectRoot = path.join(__dirname, '..');

dirsToScan.forEach(dir => {
    const fullPath = path.join(projectRoot, dir);
    walk(fullPath);
});

if (sxpbFiles.length === 0) {
    console.error("No .sxpb files found");
    process.exit(1);
}

// Check for sxpb2sxpb availability
let cmdPrefix = 'sxpb2sxpb';
try {
    execSync('which sxpb2sxpb');
} catch (e) {
    cmdPrefix = 'pdm run sxpb2sxpb';
}

let failed = false;

sxpbFiles.forEach(file => {
    try {
        execSync(`${cmdPrefix} --validate_only "${file}"`, { stdio: 'inherit' });
        // Re-enable logging to confirm operation
        console.log(`Validated ${file}`);
    } catch (error) {
        console.error(`Validation failed for ${file}`);
        failed = true;
    }
});

if (failed) {
    process.exit(1);
}
