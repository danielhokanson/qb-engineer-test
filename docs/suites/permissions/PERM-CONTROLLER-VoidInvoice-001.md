## PERM-CONTROLLER-VoidInvoice-001 — Controller can void a posted invoice

```yaml
id: PERM-CONTROLLER-VoidInvoice-001
title: Controller is allowed to void a posted customer invoice
goal: |
  Verify a Controller can void a posted customer invoice and that the
  void reverses the original GL postings while preserving the audit
  trail.
roles:
  - Controller
preconditions:
  - A Controller user exists.
  - At least one posted customer invoice exists.
  - The fiscal period containing the invoice is still open.
steps:
  - n: 1
    action: |
      Sign in as Controller. Open a posted invoice.
    expected: |
      Void / cancel action is enabled.
  - n: 2
    action: |
      Void the invoice. Provide a reason if prompted.
    expected: |
      Invoice transitions to Voided. The original revenue / AR / tax
      postings are reversed by an offsetting JE on today's date.
  - n: 3
    action: |
      Open the audit log for the invoice.
    expected: |
      Both the original posting and the void action remain visible.
      The void is attributed to the Controller user with a timestamp
      and reason.
expected_overall: |
  Controller voids an invoice; reversal posts and history is preserved.
pass_criteria: |
  Invoice voided AND offsetting GL entries posted AND audit trail
  shows both actions intact.
est_minutes: 6
```
