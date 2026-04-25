import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/**
 * Self-contained "Practice App" used by the onboarding tutorial.
 *
 * The tutorial cases reference these widgets directly. Behavior is intentionally
 * stable across releases — tutorial cases tied to it stay valid forever.
 */
@Component({
  selector: 'app-practice-app',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './practice-app.component.css',
  template: `
    <div class="practice surface-card">
      <div class="practice-head">
        <span class="label-mono">practice app</span>
        <span class="practice-sub">Use this to follow the tutorial steps.</span>
      </div>

      <div class="counter-row">
        <span class="counter-display" aria-live="polite">{{ display() }}</span>
        @if (showDouble() && !crashed()) {
          <span class="double-display">(×2 = {{ counter() * 2 }})</span>
        }
      </div>

      <div class="control-row">
        <button class="btn-secondary" type="button" (click)="add()">Add 1</button>
        <button class="btn-secondary" type="button" (click)="subtract()">Subtract 1</button>
        <button class="btn-secondary" type="button" (click)="reset()">Reset</button>
      </div>

      <div class="control-row">
        <label class="toggle-row">
          <input
            type="checkbox"
            class="toggle-check"
            [checked]="showDouble()"
            (change)="toggleDouble()" />
          <span>Show double</span>
        </label>
        <button
          class="btn-secondary danger"
          type="button"
          (click)="crash()">
          Crash on purpose
        </button>
      </div>

      <div class="greet-row">
        <input
          type="text"
          class="input-field"
          [formControl]="name"
          placeholder="Your name" />
        <button class="btn-primary" type="button" (click)="greet()">
          Greet me
        </button>
      </div>

      @if (greeting(); as g) {
        <div class="greeting" aria-live="polite">{{ g }}</div>
      }
    </div>
  `,
})
export class PracticeAppComponent {
  protected readonly counter = signal(0);
  protected readonly showDouble = signal(false);
  protected readonly crashed = signal(false);
  protected readonly greeting = signal<string | null>(null);

  protected readonly name = new FormControl<string>('', { nonNullable: true });

  protected readonly display = computed(() => {
    return this.crashed() ? 'BANANA' : String(this.counter());
  });

  add(): void {
    this.crashed.set(false);
    this.counter.update(n => n + 1);
  }

  subtract(): void {
    this.crashed.set(false);
    this.counter.update(n => n - 1);
  }

  reset(): void {
    this.crashed.set(false);
    this.counter.set(0);
  }

  toggleDouble(): void {
    this.showDouble.update(b => !b);
  }

  crash(): void {
    this.crashed.set(true);
  }

  greet(): void {
    const n = this.name.value.trim();
    this.greeting.set(n.length > 0 ? `Hello, ${n}.` : 'Hello, friend.');
  }
}
