## PERM-CONTROLLER-ApproveJE-001 — Controller can approve a high-value JE

```yaml
id: PERM-CONTROLLER-ApproveJE-001
title: Controller is allowed to approve a journal entry above the threshold
goal: |
  Verify a Controller can approve a posted JE whose absolute amount
  exceeds the approval-required threshold (so it sits in pending-
  approval state), and that the approval is recorded with a separate
  attribution from the original poster.
roles:
  - Controller
capabilities:
  - CAP-ACCT-FULLGL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Controller user exists, distinct from the user who posted the
    pending JE.
  - At least one over-threshold JE awaiting approval exists, posted
    by a different user.
steps:
  - n: 1
    action: |
      Sign in as Controller (the approver). Open the pending JE.
    expected: |
      The JE shows as awaiting approval. The Approve action is
      enabled. The original poster is shown.
  - n: 2
    action: |
      Approve the JE.
    expected: |
      The JE transitions to Posted-and-Approved. The GL impact is
      recognized at the post date if it wasn't already.
  - n: 3
    action: |
      Open the JE audit log.
    expected: |
      Audit log lists both the poster (original timestamp) and the
      approver (this Controller, separate timestamp).
expected_overall: |
  Controller approves a high-value JE; both poster and approver are
  recorded.
pass_criteria: |
  JE approved AND audit log shows distinct poster and approver, both
  with timestamps.
notes: |
  This case exercises the segregation-of-duties pattern even within
  the Controller role: the *approver* must not be the *poster* on
  the same entry.
est_minutes: 6
```
