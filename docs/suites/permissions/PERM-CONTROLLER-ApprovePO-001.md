## PERM-CONTROLLER-ApprovePO-001 — Controller can approve a PO above the procurement threshold

```yaml
id: PERM-CONTROLLER-ApprovePO-001
title: Controller is allowed to approve a PO above procurement's threshold
goal: |
  Verify a Controller can approve a draft PO whose total exceeds the
  procurement role's approval threshold, and that the approval is
  recorded with attribution.
roles:
  - Controller
capabilities:
  - CAP-P2P-APPROVALS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Controller user exists.
  - A draft PO exists with a total above procurement's threshold and
    routed for higher-tier approval.
steps:
  - n: 1
    action: |
      Sign in as Controller. Open the draft PO awaiting higher-tier
      approval.
    expected: |
      The Approve action is enabled for this user.
  - n: 2
    action: |
      Approve the PO.
    expected: |
      PO transitions to Approved (or Issued, per workflow).
  - n: 3
    action: |
      Open the PO history / audit log.
    expected: |
      Approval recorded with the Controller user, timestamp, and the
      threshold tier that triggered higher-level approval.
expected_overall: |
  Controller approves an over-threshold PO; approval auditable.
pass_criteria: |
  PO approved AND audit shows approver, timestamp, and threshold tier.
est_minutes: 5
```
