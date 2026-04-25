# Flows

A **flow** is a named cross-phase business journey that delivers a complete outcome. Cases tag one or more flows; testers pick which flows they want to run rather than committing to every case in their role.

Flows are orthogonal to phases. A phase is "where in time" (P0 bootstrap, P1 foundations, etc.). A flow is "what business outcome am I working toward." Quote-to-cash is a flow that lives entirely in Phase 4. Vendor-to-asset is a flow that touches P2 (vendor master data) and P3 (the actual PO and receipt).

## Standard flows

| ID | Name | One-line | Spans |
|---|---|---|---|
| `tenant-onboarding` | Tenant onboarding | Bootstrap a brand-new tenant from an empty database to a configured starting state. | P0 |
| `foundational-records` | Foundational records | Build the records that master data and transactions reference: locations, work centers, accounts, calendars, employees, users, assets. | P1 |
| `vendor-to-asset` | Vendor to asset | Onboard a supplier and acquire a piece of capital equipment from them, ending with a depreciating fixed asset on the books. | P1, P2, P3 |
| `part-to-inventory` | Part to inventory | Define a purchased part, set up its BOM and routing where applicable, and receive the first inventory of it. | P2, P3 |
| `lead-to-customer` | Lead to customer | Capture a sales lead, qualify it, and convert it to a real customer record. | P2, P4 |
| `quote-to-cash` | Quote to cash | Quote → sales order → work order → ship → invoice → cash applied. The full sales-side lifecycle. | P4 |
| `hire-to-first-assignment` | Hire to first assignment | Onboard a new employee end-to-end (records, documents, system access, role) and put them on a first task. | P1, P4 |
| `rd-to-product` | R&D to product | Take an internal or customer-driven idea through prototyping and revision to a released BOM/routing. | P2 |
| `damage-to-completion` | Damage to completion | Report damage on equipment, schedule and execute the repair work order, close out. | P5 |
| `wear-to-repair` | Wear and tear to repair | Preventative-maintenance trigger generates a work order, maintenance executes it before damage occurs. | P5 |
| `customer-return` | Customer return | Customer initiates a return, the warehouse receives it, finance issues a credit memo. | P5 |
| `period-close` | Period close | Reconcile, close the fiscal period, roll balances forward. | P5 |
| `cycle-count` | Cycle count | Count a portion of inventory, reconcile any variance, post adjustments. | P3, P5 |

## How cases reference flows

Each case can list one or more flows in its `flows` field:

```yaml
id: P3-PO-001
title: Issue a purchase order to a vendor
flows:
  - vendor-to-asset
  - part-to-inventory
roles:
  - Procurement
```

When the runner shows cases for a tester who selected the `vendor-to-asset` flow, this case appears. So does the same case for someone running `part-to-inventory`.

A case without any `flows` field belongs to no specific journey and is shown only when a tester opts to run "everything for this role" (or the runner's flow filter is off).

## Authoring rule of thumb

Tag a case with a flow if the flow genuinely depends on it. If a case is tangentially related ("any administrator should know this exists"), don't tag it — that dilutes the flow's signal. Better to leave it untagged and rely on role filtering to surface it.

A case can belong to multiple flows when those flows share a step. Setting up the first vendor is part of `vendor-to-asset` and `part-to-inventory` because both journeys need a vendor record. That's a real overlap. But "configure tenant locale" doesn't belong in `quote-to-cash` even though every quote-to-cash run depends on a configured tenant — the dependency is implicit, not active.
