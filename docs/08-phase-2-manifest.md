# Phase 2 Scenario Manifest

```yaml
phase: P2
title: Master data — vendors, customers, parts, BOMs, routings, pricing, R&D
description: |
  Populate the records that transactions will reference. Multi-role:
  Procurement owns vendors, Sales owns customers, R&D owns parts/BOMs/
  routings, Controller approves pricing and credit limits.
estimated_total_minutes: 180

default_fixture: cascade-components-mid

sequence:
  # Vendors
  - id: P2-VENDOR-001
    required: true
    note: Blocking. Most P2 cases that touch purchasing depend on this.
  - id: P2-VENDOR-002
    required: false
  - id: P2-VENDOR-003
    required: false
  - id: P2-VENDOR-004
    required: false
  - id: P2-VENDOR-005
    required: false

  # Customers
  - id: P2-CUST-001
    required: true
    note: Blocking. Sales-side downstream depends on this.
  - id: P2-CUST-002
    required: false
  - id: P2-CUST-003
    required: true
    note: Required to verify credit-limit handling.
  - id: P2-CUST-004
    required: false
    scale_tags: [mid-market, enterprise]

  # Parts
  - id: P2-PART-001
    required: true
    note: Blocking. Raw material is a prerequisite for BOMs.
  - id: P2-PART-002
    required: true
    note: Blocking. Finished goods needed for BOMs and quotes.
  - id: P2-PART-003
    required: true
    note: Required to verify lot-tracking enforcement downstream.
  - id: P2-PART-004
    required: false
    scale_tags: [mid-market, enterprise]
  - id: P2-PART-005
    required: false

  # BOMs
  - id: P2-BOM-001
    required: true
    note: Blocking. WOs and routings depend on a BOM existing.
  - id: P2-BOM-002
    required: false
    scale_tags: [mid-market, enterprise]
  - id: P2-BOM-003
    required: false
  - id: P2-BOM-004
    required: false

  # Routings
  - id: P2-ROUTE-001
    required: true
    note: Blocking. WOs need a routing.
  - id: P2-ROUTE-002
    required: false
  - id: P2-ROUTE-003
    required: false
    scale_tags: [enterprise]

  # Pricing
  - id: P2-PRICE-001
    required: true
  - id: P2-PRICE-002
    required: false
  - id: P2-PRICE-003
    required: false

  # R&D
  - id: P2-RD-001
    required: false
  - id: P2-RD-002
    required: false
    scale_tags: [mid-market, enterprise]
  - id: P2-RD-003
    required: false
  - id: P2-RD-004
    required: false

  # Leads
  - id: P2-LEAD-001
    required: false
  - id: P2-LEAD-002
    required: false

checkpoints:
  - after: P2-VENDOR-005
    state_summary: |
      Multiple vendors exist (domestic, international, sole proprietor)
      with terms and tax-form tracking.
  - after: P2-CUST-004
    state_summary: |
      At least 4 customers exist including credit limits and
      international.
  - after: P2-PART-005
    state_summary: |
      Parts exist across types (raw, finished, lot, serial), with
      bulk import demonstrated.
  - after: P2-ROUTE-003
    state_summary: |
      BOMs and routings configured, including subcontract and parallel
      operations where applicable.

branches: []

roles_introduced:
  - Sales / Account Manager
  - Engineer / R&D

flows_introduced:
  - vendor-to-asset
  - part-to-inventory
  - lead-to-customer
  - quote-to-cash
  - rd-to-product

dedicated_suites_referenced:
  - i18n-suite
  - accessibility-suite

completion_criteria:
  - At least one vendor and one customer exist.
  - At least one finished-good part has a BOM and routing.
  - At least one customer has a credit limit configured.

out_of_scope:
  - Inventory transactions (P3+).
  - Production execution (P4+).
```
