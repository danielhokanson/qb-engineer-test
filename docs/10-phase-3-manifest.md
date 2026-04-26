# Phase 3 Scenario Manifest

```yaml
phase: P3
title: First transactions — POs, receipts, asset commissioning, opening balances, cycle counts
description: |
  Move from describing things to doing things. First real PO, first
  inventory in the door, first fixed asset on the books, first cycle
  count, first vendor payment.
estimated_total_minutes: 110

default_fixture: cascade-components-mid

sequence:
  - id: P3-REQ-001
    required: false
    scale_tags: [mid-market, enterprise]

  - id: P3-PO-001
    required: true
    note: Blocking. Most subsequent P3 cases depend on at least one issued PO.
  - id: P3-PO-002
    required: false
  - id: P3-PO-003
    required: false

  - id: P3-RECV-001
    required: true
    note: Blocking. Without a received PO, no inventory exists for downstream phases.
  - id: P3-RECV-002
    required: false
  - id: P3-RECV-003
    required: false

  - id: P3-ASSET-COMM-001
    required: false
    note: Required if P3-PO-002 was run with a fixed-asset line.
    prerequisite_cases:
      - P3-PO-002

  - id: P3-AP-001
    required: true
    note: Required to verify 3-way match works.
    prerequisite_cases:
      - P3-RECV-001

  - id: P3-OB-001
    required: false
    note: Run only on a migration / cutover scenario.
  - id: P3-OB-002
    required: false
    scale_tags: [mid-market, enterprise]

  - id: P3-COUNT-001
    required: true
    note: Required to verify counts and variance handling.
  - id: P3-COUNT-002
    required: false
    scale_tags: [mid-market, enterprise]

  - id: P3-PAY-001
    required: true
    note: Required to close the AP cycle.
    prerequisite_cases:
      - P3-AP-001
  - id: P3-PAY-002
    required: false
    note: Batch / payment-run flow.
    prerequisite_cases:
      - P3-AP-001
  - id: P3-AP-CM-001
    required: false
    note: Vendor credit memo (paired with vendor return / dispute).
    prerequisite_cases:
      - P3-AP-001

  # Procurement extensions
  - id: P3-RFQ-001
    required: false
    scale_tags: [mid-market, enterprise]
    note: Multi-vendor RFQ flow.
  - id: P3-RECV-004
    required: false
    note: Over-receipt tolerance handling.
    prerequisite_cases:
      - P3-PO-001
  - id: P3-PO-SHORTCLOSE-001
    required: false
    note: Short-close partially received PO.
    prerequisite_cases:
      - P3-RECV-002

  # Planning
  - id: P3-SS-001
    required: false
    note: |
      Configure safety stock / reorder point. Recommended before
      P3-MRP-001 to make the MRP run produce meaningful output.
  - id: P3-MRP-001
    required: false
    note: |
      Run MRP and inspect recommendations. Useful once demand and
      supply both exist (post-P4-QUOTE-003 and P3-RECV-001).
    prerequisite_cases:
      - P3-SS-001
  - id: P3-MPS-001
    required: false
    scale_tags: [mid-market, enterprise]
    note: Master production schedule feeding MRP.
  - id: P3-FCST-001
    required: false
    scale_tags: [mid-market, enterprise]
    note: Demand forecast consumed by actuals.
  - id: P3-CAP-001
    required: false
    note: Finite capacity check on a scheduled work center.
  - id: P3-ATP-001
    required: false
    note: Available-to-promise on a quote line.
  - id: P3-DROPSHIP-001
    required: false
    scale_tags: [mid-market, enterprise]
    note: Drop-ship from vendor direct to customer.

  # Inventory extensions
  - id: P3-PHYS-001
    required: false
    note: Annual physical inventory.
  - id: P3-RESERVE-001
    required: false
    note: Reservation against a confirmed SO.
  - id: P3-LOTEXP-001
    required: false
    note: Lot expiry tracking and FEFO consumption.
    prerequisite_cases:
      - P3-RECV-001
  - id: P3-HAZMAT-001
    required: false
    note: Hazmat-flagged part requires SDS + shipping classification.

checkpoints:
  - after: P3-PO-001
    state_summary: |
      First PO is issued and pending receipt.
  - after: P3-RECV-001
    state_summary: |
      First inventory exists. PO closed. GR/IR pending invoice match.
  - after: P3-AP-001
    state_summary: |
      AP entry posted, ready for payment.
  - after: P3-COUNT-002
    state_summary: |
      Cycle count complete with variance handled. Bin transfers verified.
  - after: P3-PAY-001
    state_summary: |
      Full vendor cycle complete: PO → receive → AP → pay.

branches: []

roles_introduced:
  - Warehouse / Logistics
  - QC Inspector

flows_used_heavily:
  - vendor-to-asset
  - part-to-inventory
  - cycle-count

dedicated_suites_referenced:
  - i18n-suite
  - accessibility-suite

completion_criteria:
  - At least one PO has been issued, received, and paid.
  - At least one cycle count has reconciled successfully.
  - GL postings tie out for inventory and AP.

out_of_scope:
  - Sales transactions (P4).
  - PM scheduling (P5).
```
