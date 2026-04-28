## PERM-ENGINEER-PostJE-001 — Engineer cannot post a journal entry

```yaml
id: PERM-ENGINEER-PostJE-001
title: Engineer / R&D is denied posting a journal entry
goal: |
  Verify an Engineer / R&D user, who owns BOMs and routings but has
  no financial authority, cannot post manual journal entries.
roles:
  - Engineer / R&D
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An Engineer / R&D user exists with no other roles attached.
  - The chart of accounts is initialized.
steps:
  - n: 1
    action: |
      Sign in as Engineer. Look for any journal-entries surface in
      the navigation.
    expected: |
      No JE creation surface is reachable.
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
  Engineer cannot post a JE through any path.
pass_criteria: |
  No JE created AND UI denies access AND direct URL blocked AND API
  rejects the request.
est_minutes: 4
```
