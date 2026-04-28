## PERM-FLOOR-PostJE-001 — Floor Operator cannot post a journal entry

```yaml
id: PERM-FLOOR-PostJE-001
title: Floor Operator is denied posting a journal entry
goal: |
  Verify a user with only the Floor Operator role cannot reach or
  perform manual journal entry posting, neither via UI navigation nor
  by addressing the JE area's URL directly.
roles:
  - Floor Operator
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A user assigned only the Floor Operator role exists and can sign in.
  - The chart of accounts is initialized.
  - A Controller user previously signed in and noted the URL of the
    journal-entries area (for the direct-URL check in step 3).
steps:
  - n: 1
    action: |
      Sign in as the Floor Operator. Examine the main navigation.
    expected: |
      The journal-entries / accounting area is either not visible or
      is visibly disabled.
  - n: 2
    action: |
      Search the application's menus and quick-actions for any way to
      reach a journal-entry creation form.
    expected: |
      No path leads to a usable JE form.
  - n: 3
    action: |
      Type the journal-entries URL directly into the address bar.
    expected: |
      The page does not render the JE form. Either the user is
      redirected to their role's home page, or a clear "permission
      denied" page appears. No journal-entry data is visible on
      whatever page does load.
  - n: 4
    action: |
      If the application exposes an API, attempt the equivalent
      "create journal entry" call with the Floor Operator's session
      credentials.
    expected: |
      The request is rejected with a clear authorization error (e.g.,
      403). No JE is created.
expected_overall: |
  Floor Operator cannot post a JE through any available surface.
pass_criteria: |
  No JE is created AND the UI hides or disables the function AND the
  direct URL does not reveal data AND any API path returns an
  authorization error.
why_this_matters: |
  This is the most common version of an access-control bug: the UI
  hides the action but the backend doesn't enforce, so anyone who
  knows the URL can do the action. Verifying both layers catches it.
est_minutes: 6
```
