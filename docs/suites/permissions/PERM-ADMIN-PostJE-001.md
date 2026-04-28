## PERM-ADMIN-PostJE-001 — Administrator cannot post a journal entry

```yaml
id: PERM-ADMIN-PostJE-001
title: Administrator is denied posting a journal entry
goal: |
  Verify the Administrator role — which owns tenant identity and
  integrations but not financial operations — cannot post manual
  journal entries. Posting belongs to Controller.
roles:
  - Administrator
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - The Administrator user exists and can sign in with no other roles attached.
  - The chart of accounts is initialized.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Look in the navigation for any
      journal-entries / accounting-posting surface.
    expected: |
      The JE area is either not visible to the Administrator, or is
      visible read-only with no create / post action.
  - n: 2
    action: |
      Type the journal-entries URL directly into the address bar.
    expected: |
      The page does not render a JE creation form. A clear permission
      denial appears, or the user is redirected to their home.
  - n: 3
    action: |
      If an API endpoint is exposed, attempt the equivalent
      "create journal entry" call with the Administrator's session.
    expected: |
      The request is rejected with a clear authorization error
      (e.g., 403). No JE is created.
expected_overall: |
  Administrator cannot post a JE through any path.
pass_criteria: |
  No JE created AND UI denies access AND direct URL is blocked AND
  any API path returns an authorization error.
why_this_matters: |
  Segregation of duties: a tenant administrator who can also post
  financial transactions defeats the auditability the segregation is
  meant to provide. The Administrator role should be powerful but
  bounded.
est_minutes: 5
```
