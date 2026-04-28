## AUDIT-PAY-APPLY-001 — Customer payment application is logged

```yaml
id: AUDIT-PAY-APPLY-001
title: Applying a customer payment records actor, amount, and applications
goal: |
  Verify that recording and applying a customer payment against open
  invoices records actor, timestamp, payment amount, deposit account,
  and each invoice the payment was applied to with the applied amount.
roles:
  - AR Clerk
capabilities:
  - CAP-O2C-CASH
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one posted, unpaid customer invoice exists.
prerequisite_cases:
  - AUDIT-INV-POST-001
steps:
  - n: 1
    action: |
      Record a customer payment. Apply it across one or more open
      invoices.
    expected: |
      Payment posts and the targeted invoices reflect the applied amount.
  - n: 2
    action: |
      Open the payment's audit log.
    expected: |
      Application entry shows actor, timestamp, payment total, deposit
      account, and each invoice / amount applied. A GL reference to the
      cash receipt postings is included.
expected_overall: |
  Cash application is fully attributed and traceable to invoice and GL.
pass_criteria: |
  Entry present with attribution, total, application detail, and GL
  reference.
est_minutes: 5
moot:
  decision: moot-by-design
  determined_at: 2026-04-28
  determined_by: Phase 3 closeout / orchestrator-approved
  reason: |
    Same as AUDIT-INV-POST-001 — the "GL cash-receipt reference" pass
    criterion is unsatisfiable in standalone mode (no local GL) and in
    QB-connected mode the equivalent is the QB sync ID. Local GL ledger
    is intentionally delegated.
  consultant_guidance: |
    In QB-connected mode the QB sync ID for the payment application is
    the operational equivalent of the GL cash-receipt reference. The
    audit row itself (actor, timestamp, payment total, application detail)
    is recorded post-WU-03; the local GL link doesn't exist by design.
  alternative_behavior: |
    /admin/audit-log records the PaymentApplied event with actor + total
    + applied-invoice details. The cash-receipt GL leg lives on the
    connected accounting provider's books.
```
