## PERM-HR-PostJE-001 — HR cannot post a journal entry

```yaml
id: PERM-HR-PostJE-001
title: HR is denied posting a general journal entry
goal: |
  Verify an HR user, who has authority over employee records and
  payroll runs but not general-ledger postings, cannot post manual
  journal entries.
roles:
  - HR
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An HR user exists with no other roles attached.
  - The chart of accounts is initialized.
steps:
  - n: 1
    action: |
      Sign in as HR. Look in the navigation for a journal-entries
      surface (separate from payroll).
    expected: |
      No general JE creation surface is reachable.
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
  HR cannot post a general JE through any path.
pass_criteria: |
  No JE created AND UI denies access AND direct URL blocked AND API
  rejects the request.
notes: |
  Payroll postings are tested separately under PostPayroll. This
  case is specifically about manual general-ledger entries, which
  belong to Finance.
est_minutes: 4
```
