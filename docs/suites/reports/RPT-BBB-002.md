## RPT-BBB-002 — Backlog trend over multiple periods walks correctly period-over-period

```yaml
id: RPT-BBB-002
title: Backlog trend over consecutive periods follows opening + bookings - billings = ending
goal: |
  Run the BBB report in trend mode for 3+ consecutive periods.
  Verify each period's ending backlog equals the next period's
  opening, and the period-over-period roll-forward identity holds
  for every period.
roles:
  - Sales / Account Manager
  - Controller
preconditions:
  - SO and invoice activity span at least 3 consecutive periods.
prerequisite_cases:
  - RPT-BBB-001
steps:
  - n: 1
    action: |
      Run the BBB report in trend / multi-period mode for 3
      consecutive periods.
    expected: |
      Report shows opening backlog, bookings, billings, ending
      backlog per period.
  - n: 2
    action: |
      For each period, verify opening + bookings - billings =
      ending.
    expected: |
      Identity holds within $0.01 per period.
  - n: 3
    action: |
      Verify period N's ending backlog equals period N+1's opening
      backlog (continuity).
    expected: |
      Match within $0.01.
expected_overall: |
  Backlog trend is continuous and roll-forward holds period by
  period.
pass_criteria: |
  Identity holds within $0.01 every period AND period-to-period
  continuity holds within $0.01.
est_minutes: 8
```
