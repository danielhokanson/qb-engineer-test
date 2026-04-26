## PERM-PROCUREMENT-PostJE-001 — Procurement cannot post a journal entry

```yaml
id: PERM-PROCUREMENT-PostJE-001
title: Procurement is denied posting a journal entry
goal: |
  Verify a Procurement user, who can approve POs within a threshold
  but has no general-ledger authority, cannot post manual journal
  entries.
roles:
  - Procurement
preconditions:
  - A Procurement user exists with no other roles attached.
  - The chart of accounts is initialized.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Look in the navigation for a
      journal-entries surface.
    expected: |
      No JE creation surface is reachable from the navigation.
  - n: 2
    action: |
      Type the journal-entries URL directly into the address bar.
    expected: |
      The JE form does not render. Permission denial or redirect.
  - n: 3
    action: |
      If an API is exposed, attempt the create-JE call.
    expected: |
      The request is rejected with an authorization error.
expected_overall: |
  Procurement cannot post a JE through any path.
pass_criteria: |
  No JE created AND UI denies access AND direct URL blocked AND API
  rejects the request.
est_minutes: 4
```
