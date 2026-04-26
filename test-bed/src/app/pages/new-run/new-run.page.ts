import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../data/catalog.service';
import { SessionService } from '../../data/session.service';

/** Human-readable labels for flow ids. The flow id stays canonical
 * (kebab-case), this is just for the UI. */
const FLOW_LABELS: Record<string, string> = {
  'tenant-onboarding': 'Tenant onboarding',
  'foundational-records': 'Foundational records',
  'vendor-to-asset': 'Vendor to asset',
  'part-to-inventory': 'Part to inventory',
  'lead-to-customer': 'Lead to customer',
  'quote-to-cash': 'Quote to cash',
  'hire-to-first-assignment': 'Hire to first assignment',
  'rd-to-product': 'R&D to product',
  'damage-to-completion': 'Damage to completion',
  'wear-to-repair': 'Wear and tear to repair',
  'customer-return': 'Customer return',
  'period-close': 'Period close',
  'cycle-count': 'Cycle count',
};

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
        <div class="label-mono">configure your run</div>
        <h1 class="title">Configure a new test run</h1>
        <p class="sub">
          Pick the roles you'll be wearing and (optionally) the specific
          business flows you want to test. The runner shows you only the
          cases that match.
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
                      [checked]="isRoleSelected(role)"
                      (change)="toggleRole(role)" />
                    <span class="role-name">{{ role }}</span>
                    <span class="role-count">
                      {{ catalog.caseCountForRole(role) }} cases
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

        @if (selectedRolesArray().length > 0) {
          <div class="field">
            <div class="field-label-row">
              <span class="field-label">Flows (optional)</span>
              <span class="field-meta">{{ flowSummary() }}</span>
            </div>
            @if (availableFlows().length === 0) {
              <div class="role-empty">
                No flows tagged on cases for the selected roles.
              </div>
            } @else {
              <ul class="role-list">
                @for (flow of availableFlows(); track flow.id) {
                  <li>
                    <label class="role-row">
                      <input
                        type="checkbox"
                        class="role-check"
                        [checked]="isFlowSelected(flow.id)"
                        (change)="toggleFlow(flow.id)" />
                      <span class="role-name">{{ flow.label }}</span>
                      <span class="role-count">
                        {{ flow.count }} cases
                      </span>
                    </label>
                  </li>
                }
              </ul>
            }
            <p class="field-hint">
              A flow is a cross-phase business journey (e.g., quote-to-cash,
              vendor-to-asset). Pick one or more to scope your run to a
              specific outcome instead of every case for your role. Leave
              empty to run everything for the selected roles.
            </p>
            <div class="filter-summary">
              <span class="filter-label">Will surface</span>
              <span class="filter-count">{{ effectiveCaseCount() }}</span>
              <span class="filter-label-after">cases for this run.</span>
            </div>
          </div>
        }

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
  private readonly _selectedFlows = signal<Set<string>>(new Set());

  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly roles = computed(() => this.catalog.roles());

  readonly selectedRolesArray = computed(() => [...this._selectedRoles()]);

  /** Flows that have at least one case matching the currently selected roles.
   * If no roles are selected, the list is empty (we only ask after roles). */
  readonly availableFlows = computed(() => {
    const roles = this.selectedRolesArray();
    if (roles.length === 0) return [];
    const allFlows = this.catalog.flows();
    return allFlows
      .map(id => ({
        id,
        label: FLOW_LABELS[id] ?? id,
        count: this.catalog.caseCountForFlow(id, roles),
      }))
      .filter(f => f.count > 0);
  });

  readonly roleSummary = computed(() => {
    const n = this._selectedRoles().size;
    if (n === 0) return 'none selected';
    return n === 1 ? '1 selected' : `${n} selected`;
  });

  readonly flowSummary = computed(() => {
    const n = this._selectedFlows().size;
    if (n === 0) return 'all flows for these roles';
    return n === 1 ? '1 flow' : `${n} flows`;
  });

  /** How many cases will the runner ultimately surface, given current
   * role + flow selections. Updates live as the user toggles checkboxes. */
  readonly effectiveCaseCount = computed(() => {
    const roles = this.selectedRolesArray();
    const flows = [...this._selectedFlows()];
    return this.catalog.casesForRolesAndFlows(roles, flows).length;
  });

  readonly canSubmit = computed(() => {
    return (
      this.formStatus() === 'VALID' &&
      this._selectedRoles().size > 0 &&
      this.effectiveCaseCount() > 0
    );
  });

  constructor() {
    void this.catalog.load();
  }

  isRoleSelected(role: string): boolean {
    return this._selectedRoles().has(role);
  }

  toggleRole(role: string): void {
    this._selectedRoles.update(set => {
      const next = new Set(set);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
    // When roles change, prune any selected flow that's no longer reachable.
    const reachable = new Set(this.availableFlows().map(f => f.id));
    this._selectedFlows.update(set => {
      const next = new Set<string>();
      for (const f of set) if (reachable.has(f)) next.add(f);
      return next;
    });
  }

  isFlowSelected(flow: string): boolean {
    return this._selectedFlows().has(flow);
  }

  toggleFlow(flow: string): void {
    this._selectedFlows.update(set => {
      const next = new Set(set);
      if (next.has(flow)) next.delete(flow);
      else next.add(flow);
      return next;
    });
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    const name = this.form.controls.name.value.trim();
    const fixture = this.catalog.fixtures()[0];
    const session = await this.sessionSvc.createSession({
      name,
      fixtureId: fixture?.id ?? 'cascade-components-mid',
      selectedRoles: this.selectedRolesArray(),
      selectedFlows: [...this._selectedFlows()],
    });
    await this.router.navigate(['/run', session.id]);
  }
}
