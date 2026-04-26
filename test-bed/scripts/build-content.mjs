#!/usr/bin/env node
/**
 * Compile docs/ Markdown+YAML into runtime JSON for the runner.
 *
 * Inputs:
 *   docs/02-onboarding-tutorial.md      → tutorial.json
 *   docs/03/05/07/09/11/13-phase-*.md   → cases.json (merged)
 *   docs/{04,06,08,10,12,14}-phase-N-manifest.md → manifests/p{N}.json
 *
 * Outputs go to test-bed/public/assets/data/.
 *
 * Roles and flows are NOT pre-computed — the runner derives them from
 * the union across cases.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');
const docsDir = join(repoRoot, 'docs');
const outDir = join(repoRoot, 'test-bed', 'public', 'assets', 'data');

/** Extract every ```yaml ... ``` block from a Markdown file. */
function extractYamlBlocks(markdown) {
  const blocks = [];
  const fence = /^```yaml\s*\n([\s\S]*?)^```\s*$/gm;
  let m;
  while ((m = fence.exec(markdown)) !== null) {
    blocks.push(m[1]);
  }
  return blocks;
}

function parseBlocks(filePath) {
  const md = readFileSync(filePath, 'utf-8');
  const blocks = extractYamlBlocks(md);
  return blocks.map((src, i) => {
    try {
      return yaml.load(src);
    } catch (err) {
      throw new Error(
        `YAML parse error in ${basename(filePath)} (block #${i + 1}): ${err.message}`,
      );
    }
  });
}

/** Validate a case has the required fields.
 * Tutorial cases are universal — they intentionally don't carry roles. */
function validateCase(c, source, { isTutorial = false } = {}) {
  const required = ['id', 'title', 'goal', 'preconditions', 'steps', 'expected_overall', 'pass_criteria'];
  if (!isTutorial) required.push('roles');
  for (const f of required) {
    if (c[f] === undefined || c[f] === null) {
      throw new Error(`Case in ${source} missing required field "${f}". id=${c.id ?? '<no id>'}`);
    }
  }
  if (!isTutorial && (!Array.isArray(c.roles) || c.roles.length === 0)) {
    throw new Error(`Case ${c.id} in ${source} has empty roles[].`);
  }
  if (!Array.isArray(c.steps) || c.steps.length === 0) {
    throw new Error(`Case ${c.id} in ${source} has empty steps[].`);
  }
}

function main() {
  mkdirSync(outDir, { recursive: true });
  mkdirSync(join(outDir, 'manifests'), { recursive: true });

  const docFiles = readdirSync(docsDir).filter(f => f.endsWith('.md'));

  // Tutorial cases
  const tutorialFile = docFiles.find(f => f.includes('onboarding-tutorial'));
  if (!tutorialFile) throw new Error('Tutorial file not found in docs/');
  const tutorial = parseBlocks(join(docsDir, tutorialFile));
  for (const c of tutorial) validateCase(c, tutorialFile, { isTutorial: true });
  writeFileSync(join(outDir, 'tutorial.json'), JSON.stringify(tutorial, null, 2));
  console.log(`✓ tutorial.json — ${tutorial.length} cases`);

  // Phase content files: 03, 05, 07, 09, 11, 13 (odd numbers from 03)
  // The pattern: phase content files have "phase-N-" but not "manifest"
  const phaseContentFiles = docFiles
    .filter(f => /^\d{2}-phase-/.test(f) && !f.includes('manifest'))
    .sort();

  const allCases = [];
  for (const f of phaseContentFiles) {
    const cases = parseBlocks(join(docsDir, f));
    for (const c of cases) validateCase(c, f);
    allCases.push(...cases);
    console.log(`  + ${f} — ${cases.length} cases`);
  }
  writeFileSync(join(outDir, 'cases.json'), JSON.stringify(allCases, null, 2));
  console.log(`✓ cases.json — ${allCases.length} cases total`);

  // Phase manifests: 04, 06, 08, 10, 12, 14
  const manifestFiles = docFiles
    .filter(f => /^\d{2}-phase-.*-manifest/.test(f))
    .sort();

  for (const f of manifestFiles) {
    const blocks = parseBlocks(join(docsDir, f));
    if (blocks.length === 0) {
      console.warn(`  ! ${f} has no YAML blocks; skipping.`);
      continue;
    }
    const manifest = blocks[0]; // first block is the manifest
    const phaseId = (manifest.phase ?? '').toLowerCase();
    if (!phaseId) {
      console.warn(`  ! ${f} manifest missing phase id; skipping.`);
      continue;
    }
    writeFileSync(
      join(outDir, 'manifests', `${phaseId}.json`),
      JSON.stringify(manifest, null, 2),
    );
    console.log(`  + manifests/${phaseId}.json`);
  }

  // Cross-cutting summary
  const roleSet = new Set();
  const flowSet = new Set();
  for (const c of allCases) {
    for (const r of c.roles ?? []) roleSet.add(r);
    for (const fl of c.flows ?? []) flowSet.add(fl);
  }

  const summary = {
    library_version: '0.2.0',
    built_at: new Date().toISOString(),
    case_count: allCases.length,
    tutorial_count: tutorial.length,
    roles: [...roleSet].sort(),
    flows: [...flowSet].sort(),
    phase_files: phaseContentFiles,
  };
  writeFileSync(join(outDir, 'index.json'), JSON.stringify(summary, null, 2));
  console.log(`✓ index.json — ${summary.case_count} cases, ${summary.roles.length} roles, ${summary.flows.length} flows`);
}

try {
  main();
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}
