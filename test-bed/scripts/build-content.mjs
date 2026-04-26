#!/usr/bin/env node
/**
 * Compile docs/ Markdown+YAML into runtime JSON for the runner.
 *
 * Inputs:
 *   docs/02-onboarding-tutorial.md                          → tutorial.json
 *   docs/{03,05,07,09,11,13}-phase-*.md                     → cases.json (merged)
 *   docs/cases/{phase}/*.md (recursive)                     → cases.json (merged)
 *   docs/suites/{name}/*.md (excluding manifest.md)         → cases.json (merged)
 *   docs/{04,06,08,10,12,14}-phase-N-manifest.md            → manifests/p{N}.json
 *   docs/suites/{name}/manifest.md                          → suites/{name}.json
 *
 * Outputs go to test-bed/public/assets/data/.
 *
 * Roles and flows are NOT pre-computed — the runner derives them from
 * the union across cases.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
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
        `YAML parse error in ${relative(repoRoot, filePath)} (block #${i + 1}): ${err.message}`,
      );
    }
  });
}

/** Recursively walk a directory, returning absolute paths to every .md file.
 * Skips dotfiles. */
function walkMarkdown(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...walkMarkdown(full));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
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

/** Add a case to the master map, failing loudly on duplicate IDs. */
function addCase(map, c, sourcePath) {
  const rel = relative(repoRoot, sourcePath);
  const existing = map.get(c.id);
  if (existing) {
    throw new Error(
      `Duplicate case id "${c.id}" found in:\n  - ${existing.source}\n  - ${rel}\nPick one source; case IDs must be unique across the whole library.`,
    );
  }
  map.set(c.id, { case: c, source: rel });
}

/** Pull a `cases:` list from a suite manifest, returning canonical case IDs.
 * Suite manifests we wrote earlier use `cases: [{ id: ..., intent: ... }, ...]`
 * — extract just the IDs. Returns null if the manifest doesn't enumerate them
 * (in which case we fall back to discovered case files). */
function extractManifestCaseIds(manifest) {
  if (!manifest) return null;
  const list = manifest.cases;
  if (!Array.isArray(list)) return null;
  const ids = list
    .map(entry => (typeof entry === 'string' ? entry : entry?.id))
    .filter(Boolean);
  return ids.length > 0 ? ids : null;
}

function main() {
  mkdirSync(outDir, { recursive: true });
  mkdirSync(join(outDir, 'manifests'), { recursive: true });
  mkdirSync(join(outDir, 'suites'), { recursive: true });

  // ── Tutorial ─────────────────────────────────────────────────────
  const topLevelDocs = readdirSync(docsDir).filter(f => f.endsWith('.md'));
  const tutorialFile = topLevelDocs.find(f => f.includes('onboarding-tutorial'));
  if (!tutorialFile) throw new Error('Tutorial file not found in docs/');
  const tutorial = parseBlocks(join(docsDir, tutorialFile));
  for (const c of tutorial) validateCase(c, tutorialFile, { isTutorial: true });
  writeFileSync(join(outDir, 'tutorial.json'), JSON.stringify(tutorial, null, 2));
  console.log(`✓ tutorial.json — ${tutorial.length} cases`);

  // ── Cases: phase content files at docs/ root ──────────────────────
  const phaseContentFiles = topLevelDocs
    .filter(f => /^\d{2}-phase-/.test(f) && !f.includes('manifest'))
    .sort();

  /** Map<caseId, { case, source }> for duplicate detection across all sources. */
  const caseMap = new Map();

  for (const f of phaseContentFiles) {
    const fullPath = join(docsDir, f);
    const cases = parseBlocks(fullPath);
    for (const c of cases) {
      validateCase(c, f);
      addCase(caseMap, c, fullPath);
    }
    console.log(`  + ${f} — ${cases.length} cases`);
  }

  // ── Cases: docs/cases/**/*.md (recursive, per-file or per-folder) ──
  const casesDir = join(docsDir, 'cases');
  const caseFiles = walkMarkdown(casesDir).sort();
  let casesUnderCasesDir = 0;
  for (const fullPath of caseFiles) {
    const cases = parseBlocks(fullPath);
    for (const c of cases) {
      validateCase(c, relative(repoRoot, fullPath));
      addCase(caseMap, c, fullPath);
      casesUnderCasesDir++;
    }
  }
  if (caseFiles.length > 0) {
    console.log(`  + docs/cases/ (${caseFiles.length} files) — ${casesUnderCasesDir} cases`);
  }

  // ── Suites: walk docs/suites/{name}/ for manifest + case files ────
  const suitesDir = join(docsDir, 'suites');
  /** Map<directoryName, { manifest, caseIds[], caseFileCount }> */
  const suiteMap = new Map();
  let suiteCaseTotal = 0;

  let suiteNames = [];
  try {
    suiteNames = readdirSync(suitesDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .sort();
  } catch {
    // No suites/ directory; that's fine.
  }

  for (const suiteName of suiteNames) {
    const suiteDir = join(suitesDir, suiteName);
    const manifestPath = join(suiteDir, 'manifest.md');
    let manifest = null;
    try {
      statSync(manifestPath);
      const blocks = parseBlocks(manifestPath);
      if (blocks.length === 0) {
        console.warn(`  ! suites/${suiteName}/manifest.md has no YAML blocks; skipping suite.`);
        continue;
      }
      manifest = blocks[0];
    } catch {
      console.warn(`  ! suites/${suiteName}/ has no manifest.md; skipping suite.`);
      continue;
    }

    // Walk every .md file in this suite directory except manifest.md.
    const allInSuite = walkMarkdown(suiteDir).sort();
    const caseFilesInSuite = allInSuite.filter(p => basename(p) !== 'manifest.md');

    const discoveredIds = [];
    for (const fullPath of caseFilesInSuite) {
      const cases = parseBlocks(fullPath);
      for (const c of cases) {
        validateCase(c, relative(repoRoot, fullPath));
        addCase(caseMap, c, fullPath);
        discoveredIds.push(c.id);
        suiteCaseTotal++;
      }
    }
    discoveredIds.sort();

    suiteMap.set(suiteName, {
      manifest,
      caseFileCount: caseFilesInSuite.length,
      caseIds: discoveredIds,
    });
  }

  // ── Emit cases.json (sorted by ID for determinism) ────────────────
  // This must happen before suite JSON emission so we can intersect
  // manifest-declared case IDs against what actually exists.
  const allCases = [...caseMap.values()]
    .map(v => v.case)
    .sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(join(outDir, 'cases.json'), JSON.stringify(allCases, null, 2));
  console.log(`✓ cases.json — ${allCases.length} cases total`);
  if (suiteCaseTotal > 0) {
    console.log(`  (docs/suites/ contributed ${suiteCaseTotal} cases across ${suiteMap.size} suites)`);
  }

  // ── Emit per-suite JSON (after cases.json so intersection is correct) ─
  const suiteIndex = [];
  for (const [name, entry] of [...suiteMap.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    const suiteId = entry.manifest.suite ?? name;
    const manifestCaseIds = extractManifestCaseIds(entry.manifest);
    // Prefer manifest-declared case IDs (curated order) over filesystem
    // discovery. Filter to only IDs that actually exist as cases — this
    // prevents the suite page from rendering broken links for cases the
    // manifest plans but no one has authored yet.
    const plannedIds = manifestCaseIds ?? entry.caseIds;
    const existingIds = plannedIds.filter(id => caseMap.has(id));
    const missingIds = plannedIds.filter(id => !caseMap.has(id));
    const out = {
      id: suiteId,
      directory: name,
      title: entry.manifest.title ?? name,
      description: entry.manifest.description ?? '',
      estimated_total_minutes: entry.manifest.estimated_total_minutes ?? null,
      case_ids: existingIds,
      planned_case_ids: plannedIds,
      missing_case_ids: missingIds,
      raw: entry.manifest,
    };
    writeFileSync(
      join(outDir, 'suites', `${name}.json`),
      JSON.stringify(out, null, 2),
    );
    const tail = missingIds.length > 0
      ? ` (${plannedIds.length} planned, ${missingIds.length} not yet authored)`
      : '';
    console.log(`  + suites/${name}.json — ${existingIds.length} cases${tail}`);
    suiteIndex.push({
      id: suiteId,
      directory: name,
      title: out.title,
      description: out.description,
      estimated_total_minutes: out.estimated_total_minutes,
      case_count: existingIds.length,
      planned_count: plannedIds.length,
    });
  }
  writeFileSync(
    join(outDir, 'suites', 'index.json'),
    JSON.stringify(suiteIndex, null, 2),
  );

  // ── Phase manifests ──────────────────────────────────────────────
  const manifestFiles = topLevelDocs
    .filter(f => /^\d{2}-phase-.*-manifest/.test(f))
    .sort();

  for (const f of manifestFiles) {
    const blocks = parseBlocks(join(docsDir, f));
    if (blocks.length === 0) {
      console.warn(`  ! ${f} has no YAML blocks; skipping.`);
      continue;
    }
    const manifest = blocks[0];
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

  // ── Stories ──────────────────────────────────────────────────────
  const storiesFile = topLevelDocs.find(f => f === 'stories.md');
  const stories = [];
  if (storiesFile) {
    const blocks = parseBlocks(join(docsDir, storiesFile));
    const knownIds = new Set([...allCases, ...tutorial].map(c => c.id));
    for (const story of blocks) {
      const sceneCases = (story.chapters ?? [])
        .flatMap(ch => ch.scenes ?? [])
        .map(s => s.case);
      for (const cid of sceneCases) {
        if (!knownIds.has(cid)) {
          throw new Error(`Story "${story.id}" references unknown case "${cid}".`);
        }
      }
      stories.push(story);
    }
    writeFileSync(join(outDir, 'stories.json'), JSON.stringify(stories, null, 2));
    console.log(`✓ stories.json — ${stories.length} stories`);
  }

  // ── Cross-cutting summary ────────────────────────────────────────
  const roleSet = new Set();
  const flowSet = new Set();
  for (const c of allCases) {
    for (const r of c.roles ?? []) roleSet.add(r);
    for (const fl of c.flows ?? []) flowSet.add(fl);
  }

  const summary = {
    library_version: '0.4.0',
    built_at: new Date().toISOString(),
    case_count: allCases.length,
    tutorial_count: tutorial.length,
    story_count: stories.length,
    suite_count: suiteMap.size,
    roles: [...roleSet].sort(),
    flows: [...flowSet].sort(),
    phase_files: phaseContentFiles,
  };
  writeFileSync(join(outDir, 'index.json'), JSON.stringify(summary, null, 2));
  console.log(
    `✓ index.json — ${summary.case_count} cases, ${summary.suite_count} suites, ` +
      `${summary.roles.length} roles, ${summary.flows.length} flows`,
  );
}

try {
  main();
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}
