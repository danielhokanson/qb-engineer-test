import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../data/catalog.service';
import { SessionService } from '../../data/session.service';

@Component({
  selector: 'app-new-run',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './new-run.page.css',
  template: `
    <main class="page">
      <nav class="breadcrumbs">
        <a routerLink="/">All runs</a>
        <span class="sep">/</span>
        <span class="current">New run</span>
      </nav>

      <header class="head">
        <div class="label-mono">step 1 of 1</div>
        <h1 class="title">Configure a new test run</h1>
        <p class="sub">
          Give the run a name you'll recognize later, and pick the roles you want
          to test. The runner will pull the cases that match those roles.
        </p>
      </header>

      <form class="form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label class="field-label" for="run-name">Run name</label>
          <input
            id="run-name"
            class="input-field"
            type="text"
            formControlName="name"
            placeholder="e.g. April release smoke test"
            autocomplete="off"
            autofocus />
          <p class="field-hint">
            A short label so you can identify this run later. Required.
          </p>
        </div>

        <div class="field">
          <div class="field-label-row">
            <span class="field-label">Roles</span>
            <span class="field-meta">{{ roleSummary() }}</span>
          </div>
          @if (!catalog.loaded()) {
            <div class="role-loading">Loading available roles…</div>
          } @else if (roles().length === 0) {
            <div class="role-empty">
              No roles defined in the test library yet. Add cases with a
              <code>roles</code> field to populate this list.
            </div>
          } @else {
            <ul class="role-list">
              @for (role of roles(); track role) {
                <li>
                  <label class="role-row">
                    <input
                      type="checkbox"
                      class="role-check"
                      [checked]="isSelected(role)"
                      (change)="toggleRole(role)" />
                    <span class="role-name">{{ role }}</span>
                    <span class="role-count">
                      {{ caseCountForRole(role) }} cases
                    </span>
                  </label>
                </li>
              }
            </ul>
          }
          <p class="field-hint">
            Pick at least one. The runner shows you only the cases that match
            roles you select.
          </p>
        </div>

        <div class="actions">
          <a routerLink="/" class="btn-secondary">Cancel</a>
          <button type="submit" class="btn-primary" [disabled]="!canSubmit()">
            Start run
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </main>
  `,
})
export class NewRunPage {
  protected readonly catalog = inject(CatalogService);
  private readonly sessionSvc = inject(SessionService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  private readonly _selectedRoles = signal<Set<string>>(new Set());

  readonly roles = computed(() => this.catalog.roles());

  readonly roleSummary = computed(() => {
    const n = this._selectedRoles().size;
    if (n === 0) return 'none selected';
    if (n === 1) return '1 selected';
    return `${n} selected`;
  });

  readonly canSubmit = computed(() => {
    return this.form.valid && this._selectedRoles().size > 0;
  });

  constructor() {
    void this.catalog.load();
    // Re-emit `valid` changes via a tracked signal so canSubmit recomputes.
    effect(onCleanup => {
      const sub = this.form.statusChanges.subscribe(() => {
        // statusChanges fires on validity transitions; signal read in canSubmit
        // already covers it, but we touch _selectedRoles to nudge the computed.
        this._selectedRoles.update(s => new Set(s));
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  isSelected(role: string): boolean {
    return this._selectedRoles().has(role);
  }

  toggleRole(role: string): void {
    this._selectedRoles.update(set => {
      const next = new Set(set);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  }

  caseCountForRole(role: string): number {
    return this.catalog.cases().filter(c => c.roles.includes(role)).length;
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    const name = this.form.controls.name.value.trim();
    const fixture = this.catalog.fixtures()[0];
    const session = await this.sessionSvc.createSession({
      name,
      fixtureId: fixture?.id ?? 'cascade-components-mid',
      selectedRoles: [...this._selectedRoles()],
    });
    await this.router.navigate(['/run', session.id]);
  }
}
