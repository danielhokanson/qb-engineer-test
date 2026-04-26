# Reports Suite

Verifies that standard reports tie out to a known transaction set. The premise: any report that doesn't reconcile to the underlying records is a defect, no matter how "right" the report looks. Reports are where executives live in the system; numbers that don't tie destroy trust.

Each case begins with a known transaction set (typically the state established by Phases 0–5) and asserts that the report under test reconciles to that set within rounding tolerance. Every case (1) declares the prerequisite cases that establish the source transactions, (2) includes at least one hand-computation step that sums the source register and compares to the report, (3) names the rounding tolerance explicitly in `pass_criteria`, and (4) tests drill-through where the report supports it.

## ID convention

`RPT-{REPORT}-NNN`. `REPORT` codes used here:

Existing-family (Phase 2.3 baseline):

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

Added in Phase 2.3 expansion:

- `ARAGE` — AR Aging Detail
- `APAGE` — AP Aging Detail
- `GRIRAGE` — Goods-Received / Invoice-Received Aging
- `FAROLL` — Fixed-Asset Roll-Forward
- `LOTTRACE` — Lot / Serial Trace (forward and backward)
- `SCRAPRWK` — Scrap and Rework Summary
- `CUSTSTMT` — Customer Statement
- `VENDSTMT` — Vendor Statement / Reconciliation
- `SALESTAX` — Sales Tax / VAT Return
- `WHHOLD` — Withholding Remittance
- `CYCLECNT` — Cycle Count History
- `STOCKOUT` — Stockouts / Backorder
- `KITVAR` — Kitting / Sub-Assembly Variance
- `BBB` — Bookings / Billings / Backlog
- `QUOTECONV` — Quote Conversion Rate
- `LEADFUN` — Lead Funnel
- `HEADCNT` — Headcount and Turnover
- `BUDGET` — Budget vs. Actual
- `MARGIN` — Gross Margin by Product
- `POOPEN` — Open PO Commitments
- `SOBACK` — Open SO Backlog
- `SCHEDATT` — Production Schedule Attainment
- `INVTURN` — Inventory Turnover and Days On Hand
- `EANDO` — Excess and Obsolete Inventory
- `PMSUM` — Preventive Maintenance Summary

## Sequence

Reports cases are independent. Run any in any order against the post-Phase-5 state.

```yaml
suite: reports
title: Standard reports tie out to source transactions
description: |
  For each canonical report, verify it reconciles to the underlying
  records that produced it. The bar is not "the report runs without
  error" but "the totals match the source data within rounding."
estimated_total_minutes: 720

prerequisites:
  phase_completed: P5
  state_summary: |
    At least one full quote-to-cash cycle has run (Phase 4), opening
    balances and a vendor cycle have been posted (Phase 3), period
    depreciation has run (P5-CLOSE-003), and the period has been
    closed (P5-CLOSE-004). Reports run as of the closed period
    boundary. Multi-period variants (comparative P&L, BBB trend,
    backlog continuity) require two consecutive closed periods.

cases:
  # ── P&L ─────────────────────────────────────────────────────
  - id: RPT-PNL-001
  - id: RPT-PNL-002
  - id: RPT-PNL-003
  - id: RPT-PNL-004
  - id: RPT-PNL-005
  # ── Balance sheet ──────────────────────────────────────────
  - id: RPT-BALSHEET-001
  - id: RPT-BALSHEET-002
  - id: RPT-BALSHEET-003
  - id: RPT-BALSHEET-004
  # ── Cash flow ──────────────────────────────────────────────
  - id: RPT-CASHFLOW-001
  - id: RPT-CASHFLOW-002
  - id: RPT-CASHFLOW-003
  # ── Trial balance ──────────────────────────────────────────
  - id: RPT-TRIALBAL-001
  - id: RPT-TRIALBAL-002
  - id: RPT-TRIALBAL-003
  # ── Inventory valuation ────────────────────────────────────
  - id: RPT-INVVAL-001
  - id: RPT-INVVAL-002
  - id: RPT-INVVAL-003
  - id: RPT-INVVAL-004
  # ── Work order variance ────────────────────────────────────
  - id: RPT-WOVAR-001
  - id: RPT-WOVAR-002
  - id: RPT-WOVAR-003
  # ── MRP exception ──────────────────────────────────────────
  - id: RPT-MRPEX-001
  - id: RPT-MRPEX-002
  - id: RPT-MRPEX-003
  # ── Capacity utilization ───────────────────────────────────
  - id: RPT-CAPUTIL-001
  - id: RPT-CAPUTIL-002
  - id: RPT-CAPUTIL-003
  # ── Sales by customer ──────────────────────────────────────
  - id: RPT-SALESCUST-001
  - id: RPT-SALESCUST-002
  - id: RPT-SALESCUST-003
  - id: RPT-SALESCUST-004
  # ── Sales by product ───────────────────────────────────────
  - id: RPT-SALESPROD-001
  - id: RPT-SALESPROD-002
  - id: RPT-SALESPROD-003
  - id: RPT-SALESPROD-004
  # ── Vendor performance ─────────────────────────────────────
  - id: RPT-VENDORPERF-001
  - id: RPT-VENDORPERF-002
  - id: RPT-VENDORPERF-003
  - id: RPT-VENDORPERF-004
  # ── Employee labor distribution ────────────────────────────
  - id: RPT-EMPLABOR-001
  - id: RPT-EMPLABOR-002
  - id: RPT-EMPLABOR-003
  # ── OEE ────────────────────────────────────────────────────
  - id: RPT-OEE-001
  - id: RPT-OEE-002
  - id: RPT-OEE-003
  # ── Depreciation schedule ──────────────────────────────────
  - id: RPT-DEPSCH-001
  - id: RPT-DEPSCH-002
  - id: RPT-DEPSCH-003
  # ── AR aging ───────────────────────────────────────────────
  - id: RPT-ARAGE-001
  - id: RPT-ARAGE-002
  - id: RPT-ARAGE-003
  # ── AP aging ───────────────────────────────────────────────
  - id: RPT-APAGE-001
  - id: RPT-APAGE-002
  - id: RPT-APAGE-003
  # ── GR/IR aging ────────────────────────────────────────────
  - id: RPT-GRIRAGE-001
  # ── Fixed-asset roll-forward ───────────────────────────────
  - id: RPT-FAROLL-001
  # ── Lot / serial trace ─────────────────────────────────────
  - id: RPT-LOTTRACE-001
  - id: RPT-LOTTRACE-002
  # ── Scrap and rework ───────────────────────────────────────
  - id: RPT-SCRAPRWK-001
  # ── Customer statement ─────────────────────────────────────
  - id: RPT-CUSTSTMT-001
  # ── Vendor statement ───────────────────────────────────────
  - id: RPT-VENDSTMT-001
  # ── Sales tax / VAT return ─────────────────────────────────
  - id: RPT-SALESTAX-001
  # ── Withholding remittance ─────────────────────────────────
  - id: RPT-WHHOLD-001
  # ── Cycle count history ────────────────────────────────────
  - id: RPT-CYCLECNT-001
  # ── Stockouts / backorder ──────────────────────────────────
  - id: RPT-STOCKOUT-001
  # ── Kitting / sub-assembly variance ────────────────────────
  - id: RPT-KITVAR-001
  # ── Bookings / billings / backlog ──────────────────────────
  - id: RPT-BBB-001
  - id: RPT-BBB-002
  # ── Quote conversion ───────────────────────────────────────
  - id: RPT-QUOTECONV-001
  # ── Lead funnel ────────────────────────────────────────────
  - id: RPT-LEADFUN-001
  # ── Headcount and turnover ─────────────────────────────────
  - id: RPT-HEADCNT-001
  # ── Budget vs. actual ──────────────────────────────────────
  - id: RPT-BUDGET-001
  # ── Gross margin by product ────────────────────────────────
  - id: RPT-MARGIN-001
  # ── Open PO commitments ────────────────────────────────────
  - id: RPT-POOPEN-001
  # ── Open SO backlog ────────────────────────────────────────
  - id: RPT-SOBACK-001
  # ── Production schedule attainment ─────────────────────────
  - id: RPT-SCHEDATT-001
  # ── Inventory turnover and DOH ─────────────────────────────
  - id: RPT-INVTURN-001
  # ── Excess and obsolete ────────────────────────────────────
  - id: RPT-EANDO-001
  # ── Preventive maintenance summary ─────────────────────────
  - id: RPT-PMSUM-001

completion_criteria:
  - Every report runs to completion without errors.
  - Each report's totals reconcile to the source data within the
    rounding tolerance documented in the case's pass_criteria.
  - Drill-through (where supported) lands on the correct underlying
    transaction and per-level sums reconcile to the parent line.
```
