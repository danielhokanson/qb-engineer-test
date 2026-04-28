## PERM-SALES-IssueCreditMemo-001 — Sales cannot issue a credit memo

```yaml
id: PERM-SALES-IssueCreditMemo-001
title: Sales / Account Manager is denied issuing a customer credit memo
goal: |
  Verify a Sales user cannot issue credit memos. Sales can request
  one (and likely originates the request as part of customer
  resolution), but issuance — which posts to GL — is a Controller
  action.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-O2C-CREDITMEMO
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one customer with an open AR balance exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Open the customer's AR.
    expected: |
      A "request credit memo" or draft surface may exist, but the
      Issue / post action is hidden, disabled, or replaced with a
      handoff to Controller.
  - n: 2
    action: |
      Attempt the issue-credit-memo endpoint via direct URL or API.
    expected: |
      The action is rejected with an authorization error.
expected_overall: |
  Sales cannot issue (post) a credit memo.
pass_criteria: |
  No credit memo posted AND no GL entries created by this user AND
  endpoint rejected.
why_this_matters: |
  Credit memos hit revenue. Letting the customer-facing role post
  them — even with good intent — removes the independent financial
  check that a credit is justified.
est_minutes: 4
```
