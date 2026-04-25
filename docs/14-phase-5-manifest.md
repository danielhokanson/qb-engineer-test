# Phase 5 Scenario Manifest

```yaml
phase: P5
title: First exception cycles — damage, PM, returns, period close, traceability, subcontract
description: |
  The grey paths through the system. Each flow stands largely on its
  own; testers can run them in any order once the prior phases have
  established the foundation.
estimated_total_minutes: 175

default_fixture: cascade-components-mid

sequence:
  # Damage to completion
  - id: P5-DAMAGE-001
    required: false
    note: Run on the damage-to-completion flow.
  - id: P5-DAMAGE-002
    required: false
    prerequisite_cases:
      - P5-DAMAGE-001
  - id: P5-DAMAGE-003
    required: false
    prerequisite_cases:
      - P5-DAMAGE-002

  # PM
  - id: P5-PM-001
    required: false
    note: Run on the wear-to-repair flow.
  - id: P5-PM-002
    required: false
    prerequisite_cases:
      - P5-PM-001

  # QC fail
  - id: P5-QC-FAIL
    required: false
    note: Run during a Phase 4 production cycle when a QC step is reachable.

  # RMA
  - id: P5-RMA-001
    required: false
    note: Run on the customer-return flow.
    prerequisite_cases:
      - P4-INV-001
  - id: P5-RMA-002
    required: false
    prerequisite_cases:
      - P5-RMA-001
  - id: P5-RMA-003
    required: false
    prerequisite_cases:
      - P5-RMA-002

  # Vendor return
  - id: P5-VENDOR-RETURN
    required: false

  # Inventory adjustment
  - id: P5-INV-ADJ
    required: false

  # R&D feedback
  - id: P5-RD-FEEDBACK
    required: false

  # Stoppage
  - id: P5-STOPPAGE
    required: false
    note: Floor stoppage tracking. Pairs naturally with an in-progress WO.

  # Period close
  - id: P5-CLOSE-001
    required: true
    note: Period close is required to verify the books tie out at month-end.
  - id: P5-CLOSE-002
    required: true
    prerequisite_cases:
      - P5-CLOSE-001
  - id: P5-CLOSE-003
    required: true
    prerequisite_cases:
      - P3-ASSET-COMM-001
  - id: P5-CLOSE-004
    required: true
    prerequisite_cases:
      - P5-CLOSE-001
      - P5-CLOSE-002
      - P5-CLOSE-003

  # Routine cycle count
  - id: P5-CYCLE-001
    required: false

  # Warranty / recall traceability
  - id: P5-WARRANTY
    required: false
    scale_tags: [mid-market, enterprise]
  - id: P5-RECALL
    required: false
    note: |
      Critical for any business that has lot traceability requirements
      (food, medical, aerospace, automotive). Strongly recommended.

  # Subcontract
  - id: P5-OFFSITE-SEND
    required: false
    prerequisite_cases:
      - P2-ROUTE-002
  - id: P5-OFFSITE-RECV
    required: false
    prerequisite_cases:
      - P5-OFFSITE-SEND

checkpoints:
  - after: P5-DAMAGE-003
    state_summary: |
      One full damage-to-completion cycle complete.
  - after: P5-PM-002
    state_summary: |
      PM cycle exercised, asset's PM schedule advanced.
  - after: P5-RMA-003
    state_summary: |
      One full customer-return cycle complete with credit memo.
  - after: P5-CLOSE-004
    state_summary: |
      Period closed. Books locked. Reports stable.
  - after: P5-OFFSITE-RECV
    state_summary: |
      Subcontract round-trip complete. WO continued correctly post-receipt.

branches: []

roles_used_heavily:
  - Floor Operator
  - Maintenance Manager
  - Maintenance Tech
  - QC Inspector
  - Warehouse / Logistics
  - Controller
  - Sales / Account Manager
  - Engineer / R&D

flows_completed:
  - damage-to-completion
  - wear-to-repair
  - customer-return
  - period-close
  - cycle-count

dedicated_suites_referenced:
  - i18n-suite
  - accessibility-suite

completion_criteria:
  - Period close completes successfully and the period locks.
  - At least one of damage, PM, RMA, recall, or subcontract has run
    end-to-end.

out_of_scope:
  - Multi-period historical reporting (deferred).
  - Multi-entity / inter-company transactions (not in scope of this
    library yet).
  - Advanced exception modes (foreign-currency revaluation, complex
    consolidation).
```
