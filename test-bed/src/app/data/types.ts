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
}

export interface StepResult {
  step_n: number;
  matched_expected: boolean;
  note?: string;
}
