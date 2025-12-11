import fs from "fs";
import path from "path";
import SxPB from "@sxproto/sxpb";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsFile = path.join(__dirname, "dirs.sxpb");
const dirsToScan = SxPB.parse(fs.readFileSync(dirsFile, "utf8"));

let sxpbFiles = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file);
    } else {
      if (file.endsWith(".sxpb")) {
        sxpbFiles.push(file);
      }
    }
  });
}

const projectRoot = path.join(__dirname, "..");

dirsToScan.forEach((dir) => {
  const fullPath = path.join(projectRoot, dir);
  walk(fullPath);
});

if (sxpbFiles.length === 0) {
  console.error("No .sxpb files found");
  process.exit(1);
}

let failed = false;

sxpbFiles.forEach((file) => {
  try {
    // 1. Read the file via the library, using precise=true
    const content = fs.readFileSync(file, "utf8");
    const obj1 = SxPB.parse(content, { precise: true });

    // 2. Write the sxpb to a string
    const s1 = SxPB.stringify(obj1);

    // 3. Parse sxpb from the string, using precise=true
    const obj2 = SxPB.parse(s1, { precise: true });

    // 4. Write the sxpb to another string
    const s2 = SxPB.stringify(obj2);

    // 5. Compare the 2 written strings
    if (s1 !== s2) {
      throw new Error(
        `Idempotency check failed. Expected length ${s1.length}, got ${s2.length}`,
      );
    }

    console.log(`Validated ${file}`);
  } catch (error) {
    console.error(`Validation failed for ${file}:`, error);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
}
