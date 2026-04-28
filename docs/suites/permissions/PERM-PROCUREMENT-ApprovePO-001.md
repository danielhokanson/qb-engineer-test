## PERM-PROCUREMENT-ApprovePO-001 — Procurement can approve a PO under their threshold

```yaml
id: PERM-PROCUREMENT-ApprovePO-001
title: Procurement is allowed to approve a PO within their authority
goal: |
  Verify a Procurement user can approve a draft PO whose total is
  within their approval threshold, and that approval records who
  and when.
roles:
  - Procurement
capabilities:
  - CAP-P2P-APPROVALS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Procurement user exists with a defined approval threshold (e.g., $25,000).
  - A draft PO under the threshold exists for them to approve.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Open a draft PO with a total below the
      approval threshold.
    expected: |
      Approve action is enabled.
  - n: 2
    action: |
      Approve the PO.
    expected: |
      PO transitions to Approved (or Issued, per workflow).
  - n: 3
    action: |
      Check the PO history.
    expected: |
      Approval recorded with user and timestamp.
expected_overall: |
  Procurement approves an in-threshold PO; approval auditable.
pass_criteria: |
  PO approved AND audit shows approver and timestamp.
est_minutes: 4
```
