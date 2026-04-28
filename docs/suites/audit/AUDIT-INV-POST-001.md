## AUDIT-INV-POST-001 — Customer invoice posting is logged with GL effect

```yaml
id: AUDIT-INV-POST-001
title: Posting a customer invoice records actor, amount, and GL postings
goal: |
  Verify that posting a customer invoice records actor, timestamp,
  invoice number, customer, total amount, and a reference to the GL
  postings produced.
roles:
  - AR Clerk
  - Controller
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A draft customer invoice tied to a shipment or SO exists.
prerequisite_cases:
  - AUDIT-SO-CREATE-001
steps:
  - n: 1
    action: |
      Post the invoice.
    expected: |
      Invoice posts and is no longer in draft.
  - n: 2
    action: |
      Open the invoice's audit log.
    expected: |
      Posting entry shows actor, timestamp, invoice number, customer,
      total amount, and a link or reference to the GL journal lines
      produced.
expected_overall: |
  Invoice posting is fully attributed and tied to the resulting GL
  effect.
pass_criteria: |
  Posting entry present AND captures attribution, amount, and GL
  reference.
est_minutes: 5
moot:
  decision: moot-by-design
  determined_at: 2026-04-28
  determined_by: Phase 3 closeout / orchestrator-approved
  reason: |
    The "GL reference" pass criterion is unsatisfiable in standalone mode
    (no local GL by design) and in QB-connected mode the operational
    equivalent is the QB sync ID, not a local GL journal-line reference.
    The case wording assumes a local GL ledger that the application
    intentionally does not maintain.
  consultant_guidance: |
    In QB-connected mode the QB sync ID (quickbooksDocId on the synced
    invoice) serves the audit-trail purpose the case originally targeted.
    The audit-log row itself (with actor, timestamp, invoice, amount) is
    produced by the system-wide audit log post-WU-03; the missing piece
    is only the local GL link, which doesn't exist by design.
  alternative_behavior: |
    /admin/audit-log records the InvoicePosted event with actor + amount.
    The downstream GL effect is recorded on the connected accounting
    provider's books; trace via the QB sync surface.
```
