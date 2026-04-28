## EDGE-PERMZERO-001 — A permission boundary at exactly zero (cannot approve $0+) is enforced

```yaml
id: EDGE-PERMZERO-001
title: A user with approval limit zero cannot approve a transaction of any amount, including zero-dollar
goal: |
  Verify that when a user's approval limit is configured to exactly 0,
  they cannot approve any approval-bearing transaction — including a
  $0 one — because "approval limit 0" means "cannot approve," not
  "can approve up to 0."
roles:
  - Administrator
  - AP Clerk
capabilities:
  - CAP-IDEN-ROLES
  - CAP-CROSS-PERMS-MATRIX
  - CAP-P2P-APPROVALS
preconditions:
  - A role exists with an "approval limit" field set to exactly 0.
  - A user assigned to that role.
  - At least one approval-bearing transaction type (e.g., AP invoice).
steps:
  - n: 1
    action: |
      As the zero-limit user, attempt to approve an AP invoice for $1.
    expected: |
      Approval is blocked with a clear "exceeds your approval limit"
      message.
  - n: 2
    action: |
      Attempt to approve an AP invoice for exactly $0.
    expected: |
      Approval is blocked. The user has no approval authority at all.
  - n: 3
    action: |
      Read the role configuration UI.
    expected: |
      The semantics of "approval limit 0" are unambiguous (e.g., a
      separate "no approval" toggle, OR explicit help text stating
      that 0 means no approval at any amount). Silent ambiguity
      between "cannot approve" and "can approve up to 0" is
      unacceptable.
expected_overall: |
  Zero approval limit means no approval authority, never "approve up
  to 0."
pass_criteria: |
  No transaction approvable AND UI semantics of 0 are explicit.
why_this_matters: |
  Off-by-one at zero is the classic permission boundary bug. A user
  who shouldn't approve anything but can approve $0 transactions is a
  control gap that auditors will not forgive.
est_minutes: 6
```
