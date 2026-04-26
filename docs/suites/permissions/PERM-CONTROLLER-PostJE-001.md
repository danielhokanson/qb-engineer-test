## PERM-CONTROLLER-PostJE-001 — Controller can post a journal entry

```yaml
id: PERM-CONTROLLER-PostJE-001
title: Controller is allowed to post a journal entry
goal: |
  Verify that a user signed in as Controller can post a manual journal
  entry, and that the action records cleanly in the audit log.
roles:
  - Controller
preconditions:
  - A user with the Controller role exists and can sign in.
  - The chart of accounts is initialized.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as the Controller user. Find and open the journal entries
      area.
    expected: |
      The journal-entry area is visible and the option to create a
      new entry is enabled.
  - n: 2
    action: |
      Create a balanced two-line journal entry: debit Cash $100, credit
      Owner's Equity $100. Date in the current open period. Post it.
    expected: |
      The entry posts successfully. A confirmation appears with the JE
      number.
  - n: 3
    action: |
      Open the audit log (or the journal entry's history tab). Find
      the entry just posted.
    expected: |
      The audit record names the Controller user, the timestamp, and
      the JE number / amounts.
expected_overall: |
  Controller successfully posts a JE and the action is audited.
pass_criteria: |
  JE posted AND audit log shows Controller user AND timestamp AND amounts.
est_minutes: 6
```
