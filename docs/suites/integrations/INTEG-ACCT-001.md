## INTEG-ACCT-001 — Push posted financial transactions to the connected accounting system

```yaml
id: INTEG-ACCT-001
title: Posted financials sync to the connected accounting system
goal: |
  Verify that with the accounting integration set to "connected"
  (P0-INTEG-001), each posted financial transaction (invoice, JE,
  payment) creates a corresponding record in the external accounting
  system within the documented sync window.
roles:
  - Controller
preconditions:
  - The accounting integration is configured to a test sandbox
    (not real).
  - At least one customer invoice has been posted in the period.
prerequisite_cases:
  - P0-INTEG-001
  - P4-INV-001
steps:
  - n: 1
    action: |
      Post a customer invoice (or use one already posted). Open the
      sync status / queue.
    expected: |
      The invoice appears in the queue, status "Pending sync."
  - n: 2
    action: |
      Wait for the next sync (or trigger manually).
    expected: |
      Invoice transitions to "Synced." Sync log captures the external
      ID.
  - n: 3
    action: |
      Open the external accounting sandbox. Find the corresponding
      record.
    expected: |
      Record exists with matching customer, amount, date, and
      reference.
  - n: 4
    action: |
      Force a sync failure (e.g., temporarily revoke the credential).
      Post another transaction.
    expected: |
      Failure is captured in the sync log with a clear reason. The
      transaction stays "Pending" or "Failed" but is NOT silently
      dropped.
expected_overall: |
  Outbound accounting sync is reliable and surfaces failures.
pass_criteria: |
  Successful sync captures external ID AND failure is visible AND
  no silent loss.
est_minutes: 12
```
