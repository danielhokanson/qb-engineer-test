import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CatalogService } from '../../data/catalog.service';
import { SessionService } from '../../data/session.service';
import { Case, CaseStatus, Session } from '../../data/types';
import { PracticeAppComponent } from '../../shared/practice-app/practice-app.component';

@Component({
  selector: 'app-case',
  imports: [RouterLink, ReactiveFormsModule, PracticeAppComponent],
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
          <app-practice-app />
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

  readonly canSubmit = computed(() => {
    const choice = this.resultChoice();
    if (!choice) return false;
    if (choice === 'pass') return true;
    return this.noteControl.value.trim().length > 0;
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
    await this.sessionSvc.recordResult({
      sessionId: this.sessionId(),
      caseId: this.caseId(),
      status: choice,
      failureNote: note,
    });
    await this.router.navigate(['/run', this.sessionId()]);
  }
}
