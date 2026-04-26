/**
 * Compiled content types — read-only at runtime, sourced from JSON files.
 * Mirrors the schema in docs/01-schema.md.
 */

export type ScaleTag = 'small-shop' | 'mid-market' | 'enterprise';
export type Modality = 'keyboard' | 'touch' | 'scanner' | 'manual-entry';
export type LanguageCode = 'en-US' | 'es-US';

export interface Step {
  n: number;
  action: string;
  expected: string;
  notes?: string;
  branch_id?: string;
}

export interface NegativeVariant {
  id: string;
  title: string;
  action: string;
  expected: string;
  pass_criteria: string;
  notes?: string;
}

export interface BranchOption {
  id: string;
  label: string;
}

export interface BranchDeclaration {
  id: string;
  prompt: string;
  options: BranchOption[];
}

export interface Case {
  id: string;
  title: string;
  phase?: string;
  goal: string;
  roles: string[];
  flows?: string[];
  preconditions: string[];
  steps: Step[];
  expected_overall: string;
  pass_criteria: string;
  why_this_matters?: string;
  scale_tags?: ScaleTag[];
  modality?: Modality[];
  branches?: BranchDeclaration[];
  prerequisite_cases?: string[];
  notes?: string;
  negative_variants?: NegativeVariant[];
  est_minutes?: number;
  uses_practice_app?: boolean;
}

export interface Fixture {
  id: string;
  label: string;
  scale: ScaleTag;
  values: Record<string, string | number | boolean>;
}

export interface StoryScene {
  case: string;
  role: string;
  note?: string;
}

export interface StoryChapter {
  title: string;
  intro?: string;
  scenes: StoryScene[];
}

export interface Story {
  id: string;
  name: string;
  description?: string;
  estimated_total_minutes?: number;
  chapters: StoryChapter[];
}

/** Compiled view of a docs/suites/{name}/manifest.md entry. Each suite is
 * a curated set of case IDs (permissions matrix, reports, edge cases, etc.). */
export interface SuiteSummary {
  id: string;
  directory: string;
  title: string;
  description: string;
  estimated_total_minutes: number | null;
  /** Number of cases that are both planned by the manifest AND have a backing
   * case file. */
  case_count: number;
  /** Total cases the manifest plans, including ones not yet authored. */
  planned_count: number;
}

export interface Suite extends SuiteSummary {
  /** Case IDs that exist in cases.json — what the runner will actually serve. */
  case_ids: string[];
  /** Case IDs the manifest plans, including ones still to be authored. */
  planned_case_ids: string[];
  /** Case IDs the manifest plans but no case file exists for yet. */
  missing_case_ids: string[];
  /** Raw manifest YAML, for fields beyond the canonical summary. */
  raw: Record<string, unknown>;
}

/**
 * Session state — written to IndexedDB.
 */

export type CaseStatus = 'pass' | 'fail' | 'blocked' | 'pending';

export interface Session {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  fixture_id: string;
  language: LanguageCode;
  selected_roles: string[];
  /** Optional. When non-empty, filters cases to those that match at
   * least one of these flows in addition to matching a selected role. */
  selected_flows: string[];
  /** When set, this session is a story walk-through rather than a
   * role-filtered run. selected_roles/flows are unused. */
  story_id?: string;
  /** When set, this session is scoped to a specific list of case IDs
   * (typically from a suite manifest). Filtering by selected_case_ids
   * takes priority over role/flow filtering. */
  selected_case_ids?: string[];
  /** Set when the session was created from a suite. Display only. */
  suite_id?: string;
  branch_choices: Record<string, string>;
  tutorial_completed: boolean;
  current_case_id: string | null;
}

export interface CaseResult {
  id: string;
  session_id: string;
  case_id: string;
  status: CaseStatus;
  started_at: string;
  completed_at?: string;
  failure_note?: string;
  step_results?: StepResult[];
  /** Per-variant pass/fail for the case's negative_variants. Variants are
   * not first-class navigable items — they hang off the parent CaseResult
   * row. Absence of an entry means the variant is not-run. */
  variant_results?: VariantResult[];
}

export interface StepResult {
  step_n: number;
  matched_expected: boolean;
  note?: string;
}

export interface VariantResult {
  variant_id: string;
  status: CaseStatus;
  failure_note?: string;
  recorded_at: string;
}
