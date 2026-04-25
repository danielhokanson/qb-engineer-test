# Phase 4 Scenario Manifest

```yaml
phase: P4
title: First production cycle — quote to cash plus hire to first assignment
description: |
  Run the system end-to-end on the sales side: quote, sales order,
  work order, floor execution, ship, invoice, cash. Plus onboard a
  new employee through to their first task.
estimated_total_minutes: 200

default_fixture: cascade-components-mid

sequence:
  # Quote
  - id: P4-QUOTE-001
    required: true
    note: Blocking for quote-to-cash flow.
  - id: P4-QUOTE-002
    required: false
  - id: P4-QUOTE-003
    required: true
    note: Blocking. SO depends on a converted quote.
    prerequisite_cases:
      - P4-QUOTE-001

  # Work order
  - id: P4-WO-001
    required: true
    prerequisite_cases:
      - P4-QUOTE-003
  - id: P4-WO-002
    required: false

  # Floor execution
  - id: P4-WO-START
    required: true
    prerequisite_cases:
      - P4-WO-001
  - id: P4-MATL-ISSUE
    required: true
    prerequisite_cases:
      - P4-WO-START
  - id: P4-LABOR
    required: true
    prerequisite_cases:
      - P4-WO-START
  - id: P4-COMP
    required: true
    prerequisite_cases:
      - P4-MATL-ISSUE
  - id: P4-COMP-FINAL
    required: true
    prerequisite_cases:
      - P4-COMP

  # Warehouse
  - id: P4-PUTAWAY
    required: false
    scale_tags: [mid-market, enterprise]
  - id: P4-PICK
    required: true
    prerequisite_cases:
      - P4-COMP-FINAL
  - id: P4-PACK
    required: true
    prerequisite_cases:
      - P4-PICK

  # Ship
  - id: P4-SHIP
    required: true
    prerequisite_cases:
      - P4-PACK
  - id: P4-SHIP-INTL
    required: false
    scale_tags: [mid-market, enterprise]
    prerequisite_cases:
      - P2-CUST-004

  # Invoice
  - id: P4-INV-001
    required: true
    prerequisite_cases:
      - P4-SHIP

  # Cash
  - id: P4-CASH
    required: true
    prerequisite_cases:
      - P4-INV-001
  - id: P4-CASH-PARTIAL
    required: false
  - id: P4-OVERPAY
    required: false
    scale_tags: [mid-market, enterprise]

  # Hire
  - id: P4-HIRE-001
    required: false
    note: Run on the hire-to-first-assignment flow.
  - id: P4-HIRE-002
    required: false
    prerequisite_cases:
      - P4-HIRE-001
  - id: P4-HIRE-003
    required: false
    prerequisite_cases:
      - P4-HIRE-002

checkpoints:
  - after: P4-QUOTE-003
    state_summary: |
      Quote converted to a confirmed SO. WO not yet released.
  - after: P4-WO-001
    state_summary: |
      WO released and on the floor. No floor activity yet.
  - after: P4-COMP-FINAL
    state_summary: |
      WO complete, finished goods in inventory, ready to ship.
  - after: P4-SHIP
    state_summary: |
      Order shipped, invoice queued or created.
  - after: P4-CASH
    state_summary: |
      Full cycle complete from quote to cash applied.
  - after: P4-HIRE-003
    state_summary: |
      New employee hired, granted access, on first assignment.

branches: []

roles_used_heavily:
  - Sales / Account Manager
  - Production Manager
  - Production Planner
  - Floor Operator
  - Warehouse / Logistics
  - Controller
  - HR

flows_completed:
  - quote-to-cash
  - hire-to-first-assignment

dedicated_suites_referenced:
  - i18n-suite
  - accessibility-suite

completion_criteria:
  - One full quote-to-cash cycle has been executed end-to-end.
  - Inventory has been issued, labor recorded, FG produced, shipped,
    invoiced, and the customer has paid.
  - At least one new employee has been onboarded and assigned.

out_of_scope:
  - Exception handling (P5).
  - Multi-cycle reporting / month-end close (P5).
```
