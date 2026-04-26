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
import { TutorialService } from '../../data/tutorial.service';
import { Case, CaseStatus } from '../../data/types';

@Component({
  selector: 'app-tutorial-case',
  imports: [RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../case/case.page.css',
  template: `
    <main class="page">
      <nav class="breadcrumbs">
        <a routerLink="/">Home</a>
        <span class="sep">/</span>
        <a routerLink="/tutorial">Tutorial</a>
        <span class="sep">/</span>
        <span class="current">{{ caseId() }}</span>
      </nav>

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
                placeholder="e.g. After clicking Add 1, the counter showed 'BANANA' instead of a number."></textarea>
            </div>
          }
          <div class="actions">
            <a routerLink="/tutorial" class="btn-secondary">
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
export class TutorialCasePage {
  readonly caseId = input.required<string>();

  private readonly catalog = inject(CatalogService);
  private readonly tutorial = inject(TutorialService);
  private readonly router = inject(Router);

  readonly caseDef = signal<Case | undefined>(undefined);
  readonly existingStatus = signal<CaseStatus | null>(null);

  readonly resultChoice = signal<CaseStatus | null>(null);
  readonly noteControl = new FormControl<string>('', { nonNullable: true });

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
      const cid = this.caseId();
      if (!cid) return;
      await this.catalog.load();
      this.caseDef.set(this.catalog.caseById(cid));
      const existing = this.tutorial.results().find(r => r.case_id === cid);
      this.existingStatus.set(existing?.status ?? null);
      if (existing?.failure_note) {
        this.noteControl.setValue(existing.failure_note);
      }
    });
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
    await this.tutorial.record({
      caseId: this.caseId(),
      status: choice,
      failureNote: note,
    });
    await this.router.navigate(['/tutorial']);
  }
}
