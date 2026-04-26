# Reports Suite

Verifies that standard reports tie out to a known transaction set. The premise: any report that doesn't reconcile to the underlying records is a defect, no matter how "right" the report looks. Reports are where executives live in the system; numbers that don't tie destroy trust.

Each case begins with a known transaction set (typically the state established by Phases 0–5) and asserts that the report under test reconciles to that set within rounding tolerance.

## ID convention

`RPT-{REPORT}-NNN`. `REPORT` codes used here:

- `PNL` — Profit & Loss / Income Statement
- `BALSHEET` — Balance Sheet
- `CASHFLOW` — Cash Flow Statement
- `TRIALBAL` — Trial Balance
- `INVVAL` — Inventory Valuation
- `WOVAR` — Work Order Variance
- `MRPEX` — MRP Exception
- `CAPUTIL` — Capacity Utilization
- `SALESCUST` — Sales by Customer
- `SALESPROD` — Sales by Product
- `VENDORPERF` — Vendor Performance
- `EMPLABOR` — Employee Labor Distribution
- `OEE` — Overall Equipment Effectiveness
- `DEPSCH` — Depreciation Schedule
- `ARAGE` / `APAGE` — AR / AP Aging (already covered in P5-CLOSE-002; not duplicated here)

## Sequence

Reports cases are independent. Run any in any order against the post-Phase-5 state.

```yaml
suite: reports
title: Standard reports tie out to source transactions
description: |
  For each canonical report, verify it reconciles to the underlying
  records that produced it. The bar is not "the report runs without
  error" but "the totals match the source data within rounding."
estimated_total_minutes: 100

prerequisites:
  phase_completed: P5
  state_summary: |
    At least one full quote-to-cash cycle has run (Phase 4), opening
    balances and a vendor cycle have been posted (Phase 3), period
    depreciation has run (P5-CLOSE-003), and the period has been
    closed (P5-CLOSE-004). Reports run as of the closed period
    boundary.

cases:
  - id: RPT-PNL-001
  - id: RPT-BALSHEET-001
  - id: RPT-CASHFLOW-001
  - id: RPT-TRIALBAL-001
  - id: RPT-INVVAL-001
  - id: RPT-WOVAR-001
  - id: RPT-MRPEX-001
  - id: RPT-CAPUTIL-001
  - id: RPT-SALESCUST-001
  - id: RPT-SALESPROD-001
  - id: RPT-VENDORPERF-001
  - id: RPT-EMPLABOR-001
  - id: RPT-OEE-001
  - id: RPT-DEPSCH-001

completion_criteria:
  - Every report runs to completion without errors.
  - Each report's totals reconcile to the source data within rounding
    tolerance documented per case.
  - Drill-through (where supported) lands on the underlying transaction.
```
