## PERM-ITADMIN-PostJE-001 — IT Admin cannot post a journal entry

```yaml
id: PERM-ITADMIN-PostJE-001
title: IT Admin is denied posting a journal entry
goal: |
  Verify the IT Admin role — which owns user and role management but
  no financial authority — cannot post manual journal entries.
roles:
  - IT Admin
preconditions:
  - An IT Admin user exists with no other roles attached.
  - The chart of accounts is initialized.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Look in the navigation for any
      journal-entries surface.
    expected: |
      The JE area is not visible, or visible read-only with no create /
      post action.
  - n: 2
    action: |
      Type the journal-entries URL directly into the address bar.
    expected: |
      The page does not render a JE creation form. A permission denial
      appears or the user is redirected.
  - n: 3
    action: |
      If an API is exposed, attempt the JE create call with this user.
    expected: |
      The request is rejected (e.g., 403). No JE is created.
expected_overall: |
  IT Admin cannot post a JE through any path.
pass_criteria: |
  No JE created AND UI denies access AND direct URL is blocked AND
  API rejects the request.
why_this_matters: |
  An IT Admin who can also post journal entries can both grant
  themselves financial access and act on it — a classic SoD failure.
est_minutes: 4
```
