## PERM-PRODMGR-PostJE-001 — Production Manager cannot post a journal entry

```yaml
id: PERM-PRODMGR-PostJE-001
title: Production Manager is denied posting a journal entry
goal: |
  Verify the Production Manager role — which has legitimate access
  to manufacturing data but no financial authority — cannot post
  manual journal entries.
roles:
  - Production Manager
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A user assigned only the Production Manager role exists and can
    sign in.
  - The chart of accounts is initialized.
steps:
  - n: 1
    action: |
      Sign in as the Production Manager. Look for the journal-entries
      area in the navigation.
    expected: |
      The JE area is not visible, or is visibly disabled.
  - n: 2
    action: |
      Type the journal-entries URL directly into the address bar.
    expected: |
      The JE form does not render. A clear authorization message or a
      redirect to the user's home page appears.
expected_overall: |
  Production Manager cannot post a JE.
pass_criteria: |
  No JE created AND UI denies access AND direct URL is blocked.
notes: |
  Production Manager is a common "trusted but not financial" role —
  the kind of role where over-permissioning happens because admins
  conflate "trusted" with "should have access to everything they're
  trusted with." Verifying the boundary holds is worth the case.
est_minutes: 4
```
