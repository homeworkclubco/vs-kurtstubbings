#!/usr/bin/env node
/**
 * Migrates case study markdown frontmatter from bare image paths to { src, alt } objects.
 *
 * Before:
 *   featuredImage: ../../assets/uploads/...
 *   gallery:
 *     - ../../assets/uploads/...
 *
 * After:
 *   featuredImage:
 *     src: ../../assets/uploads/...
 *     alt: ""
 *   gallery:
 *     - src: ../../assets/uploads/...
 *       alt: ""
 */

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const dir = join(process.cwd(), "src/content/caseStudies");
const files = readdirSync(dir).filter(
  f => f.endsWith(".md") && f !== ".gitkeep"
);

let migrated = 0;
let skipped = 0;

for (const file of files) {
  const filepath = join(dir, file);
  let content = readFileSync(filepath, "utf-8");
  const original = content;

  // Convert: featuredImage: path → featuredImage:\n  src: path\n  alt: ""
  // Only matches if value is a bare path (not already an object)
  content = content.replace(
    /^(featuredImage):\s*(\.\.[^\n]+)$/m,
    (_, key, path) => `${key}:\n  src: ${path.trim()}\n  alt: ""`
  );

  // Convert gallery list items: "  - path" → "  - src: path\n    alt: """
  // Only matches bare paths (starting with ../ or assets/)
  content = content.replace(
    /^( {2}- )(\.\.[^\n]+)$/gm,
    (_, indent, path) => `  - src: ${path.trim()}\n    alt: ""`
  );

  if (content !== original) {
    writeFileSync(filepath, content, "utf-8");
    console.log(`✓ migrated: ${file}`);
    migrated++;
  } else {
    console.log(`- skipped (already migrated or no image paths): ${file}`);
    skipped++;
  }
}

console.log(`\nDone. ${migrated} files migrated, ${skipped} skipped.`);
