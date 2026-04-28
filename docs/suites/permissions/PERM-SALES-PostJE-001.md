## PERM-SALES-PostJE-001 — Sales cannot post a journal entry

```yaml
id: PERM-SALES-PostJE-001
title: Sales / Account Manager is denied posting a journal entry
goal: |
  Verify a Sales user — who creates customer-facing financial
  documents like quotes and draft invoices but has no GL authority —
  cannot post manual journal entries.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - The chart of accounts is initialized.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look in the navigation for any
      journal-entries / accounting surface.
    expected: |
      No JE creation surface is visible or reachable.
  - n: 2
    action: |
      Type the journal-entries URL directly.
    expected: |
      The JE form does not render. Permission denial or redirect.
  - n: 3
    action: |
      If an API is exposed, attempt the create-JE call.
    expected: |
      The request is rejected with an authorization error.
expected_overall: |
  Sales cannot post a JE through any path.
pass_criteria: |
  No JE created AND UI denies access AND direct URL blocked AND API
  rejects the request.
est_minutes: 4
```
