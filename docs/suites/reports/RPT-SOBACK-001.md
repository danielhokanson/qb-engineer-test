## RPT-SOBACK-001 — Open SO backlog ties to per-SO unshipped value

```yaml
id: RPT-SOBACK-001
title: Open SO backlog reconciles to unshipped / unbilled SO line value
goal: |
  Run the open SO backlog report. Verify the total open backlog
  equals the sum of (SO line qty - shipped qty) × unit price
  across all open SOs, and that the report's backlog ties to the
  backlog figure on the BBB report (RPT-BBB-001).
roles:
  - Sales / Account Manager
  - Controller
capabilities:
  - CAP-RPT-OPERATIONAL
  - CAP-O2C-SO
  - CAP-O2C-SHIP
preconditions:
  - At least one SO is partially shipped (P4-SHIP-SPLIT-001) and
    at least one is fully open (no shipments yet).
prerequisite_cases:
  - P4-SHIP-SPLIT-001
  - RPT-BBB-001
steps:
  - n: 1
    action: |
      Run the open SO backlog report.
    expected: |
      Report shows per-SO and per-customer: open qty, open value,
      requested ship date.
  - n: 2
    action: |
      For one partially shipped SO, compute open value = (line qty
      - shipped qty) × unit price. Sum across lines.
    expected: |
      Match within $0.01.
  - n: 3
    action: |
      Sum customer subtotals. Compare to grand total.
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Compare the grand total to RPT-BBB-001's backlog figure.
    expected: |
      Match within $0.01.
  - n: 5
    action: |
      Confirm a fully shipped SO does NOT appear (zero open).
    expected: |
      Excluded.
expected_overall: |
  Backlog ties to per-SO open value and reconciles to the BBB
  backlog figure.
pass_criteria: |
  Per-SO open value matches hand computation within $0.01 AND
  fully shipped SOs excluded AND grand total ties to BBB backlog.
est_minutes: 10
```
