import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CatalogService } from '../../data/catalog.service';
import { SessionService } from '../../data/session.service';
import {
  Case,
  CaseStatus,
  NegativeVariant,
  Session,
  VariantResult,
} from '../../data/types';

@Component({
  selector: 'app-case',
  imports: [RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './case.page.css',
  template: `
    <main class="page">
      @if (session(); as s) {
        <nav class="breadcrumbs">
          <a routerLink="/">All runs</a>
          <span class="sep">/</span>
          <a [routerLink]="['/run', s.id]">{{ s.name }}</a>
          <span class="sep">/</span>
          <span class="current">{{ caseId() }}</span>
        </nav>
      }

      @if (caseDef(); as c) {
        <header class="head">
          <div class="head-top">
            <span class="case-id">{{ c.id }}</span>
            @if (existingStatus(); as st) {
              <span class="case-status status-{{ st }}">
                {{ statusLabel(st) }}
              </span>
            }
          </div>
          <h1 class="title">{{ c.title }}</h1>
          <p class="goal">{{ c.goal }}</p>
          @if (c.why_this_matters) {
            <details class="why">
              <summary>Why this matters</summary>
              <p>{{ c.why_this_matters }}</p>
            </details>
          }
        </header>

        @if (c.uses_practice_app) {
          <aside class="practice-link">
            <div class="practice-link-text">
              <span class="label-mono">practice app required</span>
              <p class="practice-link-body">
                This case uses the tutorial Practice App. Open it in a new
                tab, follow the steps there, then come back to this tab to
                record your result — the same way you'll use the real
                application later.
              </p>
            </div>
            <a
              href="/practice"
              target="_blank"
              rel="noopener"
              class="btn-primary">
              Open Practice App
              <span aria-hidden="true">↗</span>
            </a>
          </aside>
        }

        <section class="block">
          <div class="block-head">
            <span class="label-mono">preconditions</span>
            <span class="block-sub">Before you start, confirm these are true.</span>
          </div>
          <ul class="precondition-list">
            @for (p of c.preconditions; track p) {
              <li>{{ p }}</li>
            }
          </ul>
        </section>

        <section class="block">
          <div class="block-head">
            <span class="label-mono">steps</span>
            <span class="block-sub">Do the action, then check the expected result.</span>
          </div>
          <ol class="step-list">
            @for (step of c.steps; track step.n) {
              <li class="step">
                <div class="step-number">{{ step.n }}</div>
                <div class="step-body">
                  <div class="step-action">
                    <div class="step-eyebrow">Action</div>
                    <div class="step-text">{{ step.action }}</div>
                  </div>
                  <div class="step-expected">
                    <div class="step-eyebrow">Expected</div>
                    <div class="step-text">{{ step.expected }}</div>
                  </div>
                  @if (step.notes) {
                    <div class="step-notes">{{ step.notes }}</div>
                  }
                </div>
              </li>
            }
          </ol>
        </section>

        <section class="block summary-block">
          <div class="summary-row">
            <div class="summary-col">
              <div class="step-eyebrow">Expected overall</div>
              <div class="summary-text">{{ c.expected_overall }}</div>
            </div>
            <div class="summary-col">
              <div class="step-eyebrow">Pass criteria</div>
              <div class="summary-text accent">{{ c.pass_criteria }}</div>
            </div>
          </div>
        </section>

        @if (c.negative_variants && c.negative_variants.length > 0) {
          <section class="block">
            <div class="block-head">
              <span class="label-mono">negative variants</span>
              <span class="block-sub">
                Run each variant after the parent case. Each one is its own
                pass / fail / blocked.
              </span>
            </div>
            @for (v of c.negative_variants; track v.id) {
              <article class="block result-block" style="margin-top: 1rem;">
                <div class="block-head">
                  <span class="case-id">{{ v.id }}</span>
                  @if (variantStatus(v.id); as st) {
                    <span class="case-status status-{{ st }}">
                      {{ statusLabel(st) }}
                    </span>
                  }
                </div>
                <div class="step-action">
                  <div class="step-eyebrow">Title</div>
                  <div class="step-text">{{ v.title }}</div>
                </div>
                <div class="step-action">
                  <div class="step-eyebrow">Action</div>
                  <div class="step-text">{{ v.action }}</div>
                </div>
                <div class="step-expected">
                  <div class="step-eyebrow">Expected</div>
                  <div class="step-text">{{ v.expected }}</div>
                </div>
                <div class="step-action">
                  <div class="step-eyebrow">Pass criteria</div>
                  <div class="step-text">{{ v.pass_criteria }}</div>
                </div>
                @if (v.notes) {
                  <div class="step-notes">{{ v.notes }}</div>
                }
                <div class="result-row">
                  <button
                    type="button"
                    class="result-btn pass"
                    [class.active]="variantChoice(v.id) === 'pass'"
                    (click)="setVariantChoice(v.id, 'pass')">
                    Passed
                  </button>
                  <button
                    type="button"
                    class="result-btn fail"
                    [class.active]="variantChoice(v.id) === 'fail'"
                    (click)="setVariantChoice(v.id, 'fail')">
                    Failed
                  </button>
                  <button
                    type="button"
                    class="result-btn blocked"
                    [class.active]="variantChoice(v.id) === 'blocked'"
                    (click)="setVariantChoice(v.id, 'blocked')">
                    Blocked
                  </button>
                </div>
                @if (
                  variantChoice(v.id) === 'fail' ||
                  variantChoice(v.id) === 'blocked'
                ) {
                  <div class="note-row">
                    <label class="note-label" [attr.for]="'variant-note-' + v.id">
                      What happened? Be specific.
                    </label>
                    <textarea
                      [id]="'variant-note-' + v.id"
                      class="input-field note-input"
                      rows="3"
                      [value]="variantNote(v.id)"
                      (input)="onVariantNoteInput(v.id, $event)"
                      (blur)="commitVariant(v)"
                      placeholder="What did you see when you tried the variant action?"></textarea>
                  </div>
                }
              </article>
            }
          </section>
        }

        <section class="block result-block">
          <div class="block-head">
            <span class="label-mono">record your result</span>
          </div>
          <div class="result-row">
            <button
              type="button"
              class="result-btn pass"
              [class.active]="resultChoice() === 'pass'"
              (click)="resultChoice.set('pass')">
              Passed
            </button>
            <button
              type="button"
              class="result-btn fail"
              [class.active]="resultChoice() === 'fail'"
              (click)="resultChoice.set('fail')">
              Failed
            </button>
            <button
              type="button"
              class="result-btn blocked"
              [class.active]="resultChoice() === 'blocked'"
              (click)="resultChoice.set('blocked')">
              Blocked
            </button>
          </div>
          @if (resultChoice() === 'fail' || resultChoice() === 'blocked') {
            <div class="note-row">
              <label class="note-label" for="result-note">
                What happened? Be specific.
              </label>
              <textarea
                id="result-note"
                class="input-field note-input"
                rows="4"
                [formControl]="noteControl"
                placeholder="e.g. After clicking Save, the page showed a blank white screen for 30 seconds, then returned to the form with no error."></textarea>
            </div>
          }
          <div class="actions">
            <a [routerLink]="['/run', sessionId()]" class="btn-secondary">
              Back without recording
            </a>
            <button
              type="button"
              class="btn-primary"
              [disabled]="!canSubmit()"
              (click)="submit()">
              Record result
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      } @else {
        <div class="loading">Loading case…</div>
      }
    </main>
  `,
})
export class CasePage {
  readonly sessionId = input.required<string>();
  readonly caseId = input.required<string>();

  private readonly catalog = inject(CatalogService);
  private readonly sessionSvc = inject(SessionService);
  private readonly router = inject(Router);

  readonly session = signal<Session | undefined>(undefined);
  readonly caseDef = signal<Case | undefined>(undefined);
  readonly existingStatus = signal<CaseStatus | null>(null);

  readonly resultChoice = signal<CaseStatus | null>(null);
  readonly noteControl = new FormControl<string>('', { nonNullable: true });

  /** Per-variant chosen status, keyed by variant id. */
  private readonly _variantChoices = signal<Record<string, CaseStatus>>({});
  /** Per-variant note text, keyed by variant id. Persists on textarea blur
   * or when the user clicks a different status button. */
  private readonly _variantNotes = signal<Record<string, string>>({});
  /** Last-committed status per variant — used to render the "previously
   * recorded" badge. May differ from the in-memory choice while the user
   * is mid-edit on the note. */
  private readonly _variantCommitted = signal<Record<string, CaseStatus>>({});

  // Bridge the note input's value to a signal so canSubmit reacts to typing.
  // Reading noteControl.value directly inside a computed is non-reactive.
  private readonly noteValue = toSignal(this.noteControl.valueChanges, {
    initialValue: this.noteControl.value,
  });

  readonly canSubmit = computed(() => {
    const choice = this.resultChoice();
    if (!choice) return false;
    if (choice === 'pass') return true;
    return (this.noteValue() ?? '').trim().length > 0;
  });

  constructor() {
    void this.catalog.load();

    effect(async () => {
      const sid = this.sessionId();
      const cid = this.caseId();
      if (!sid || !cid) return;
      await this.catalog.load();
      this.session.set(await this.sessionSvc.getSession(sid));
      this.caseDef.set(this.catalog.caseById(cid));
      const results = await this.sessionSvc.resultsForSession(sid);
      const existing = results.find(r => r.case_id === cid);
      // Parent case status: only show prior status if the parent was actually
      // recorded; a 'pending' row exists only because variants were recorded
      // first. From the user's perspective the parent is still not started.
      const parentStatus = existing?.status;
      this.existingStatus.set(
        parentStatus && parentStatus !== 'pending' ? parentStatus : null,
      );
      if (existing?.failure_note) {
        this.noteControl.setValue(existing.failure_note);
      }
      // Re-hydrate variant state so reload preserves what the tester recorded.
      const variantMap: Record<string, CaseStatus> = {};
      const noteMap: Record<string, string> = {};
      for (const v of existing?.variant_results ?? []) {
        variantMap[v.variant_id] = v.status;
        if (v.failure_note) noteMap[v.variant_id] = v.failure_note;
      }
      this._variantChoices.set(variantMap);
      this._variantCommitted.set(variantMap);
      this._variantNotes.set(noteMap);
    });
  }

  variantChoice(variantId: string): CaseStatus | null {
    return this._variantChoices()[variantId] ?? null;
  }

  variantStatus(variantId: string): CaseStatus | null {
    // What the badge reflects: only the committed status, not in-flight choices.
    return this._variantCommitted()[variantId] ?? null;
  }

  variantNote(variantId: string): string {
    return this._variantNotes()[variantId] ?? '';
  }

  setVariantChoice(variantId: string, status: CaseStatus): void {
    const prevChoice = this._variantChoices()[variantId];
    this._variantChoices.update(m => ({ ...m, [variantId]: status }));
    // For 'pass' there's no note to wait for — commit immediately.
    // For 'fail' / 'blocked' we wait for the user to type a note and
    // blur the textarea (commitVariant handles that). But if they
    // changed away from a fail/blocked back to pass, that pass should
    // also commit immediately even though we only have the variant id.
    if (status === 'pass') {
      void this.persistVariant({ id: variantId } as NegativeVariant, 'pass', undefined);
    } else if (prevChoice === 'pass' || prevChoice === undefined) {
      // Switched from pass (or unset) to fail/blocked — wait for note.
      // Don't persist yet; the tester will type a reason and blur.
    } else {
      // Switched between fail and blocked — preserve any prior note and
      // commit so the badge updates.
      const note = this._variantNotes()[variantId]?.trim() || undefined;
      void this.persistVariant({ id: variantId } as NegativeVariant, status, note);
    }
  }

  onVariantNoteInput(variantId: string, ev: Event): void {
    const value = (ev.target as HTMLTextAreaElement).value;
    this._variantNotes.update(m => ({ ...m, [variantId]: value }));
  }

  /** Persist whatever's currently chosen for this variant, including the
   * note if applicable. Called on textarea blur. */
  commitVariant(v: NegativeVariant): void {
    const status = this._variantChoices()[v.id];
    if (!status) return;
    const note = status === 'pass'
      ? undefined
      : this._variantNotes()[v.id]?.trim() || undefined;
    if ((status === 'fail' || status === 'blocked') && !note) {
      // Don't commit a fail/blocked without a note — keep the choice
      // in-flight and leave the badge showing the prior committed status.
      return;
    }
    void this.persistVariant(v, status, note);
  }

  private async persistVariant(
    v: NegativeVariant,
    status: CaseStatus,
    note: string | undefined,
  ): Promise<void> {
    await this.sessionSvc.recordVariantResult({
      sessionId: this.sessionId(),
      caseId: this.caseId(),
      variantId: v.id,
      status,
      failureNote: note,
    });
    this._variantCommitted.update(m => ({ ...m, [v.id]: status }));
  }

  statusLabel(s: CaseStatus): string {
    switch (s) {
      case 'pass': return 'Previously passed';
      case 'fail': return 'Previously failed';
      case 'blocked': return 'Previously blocked';
      default: return 'Not started';
    }
  }

  async submit(): Promise<void> {
    const choice = this.resultChoice();
    if (!choice || !this.canSubmit()) return;
    const note = choice === 'pass' ? undefined : this.noteControl.value.trim();
    await this.sessionSvc.recordResult({
      sessionId: this.sessionId(),
      caseId: this.caseId(),
      status: choice,
      failureNote: note,
    });
    await this.router.navigate(['/run', this.sessionId()]);
  }
}
