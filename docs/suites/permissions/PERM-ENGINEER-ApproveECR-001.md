## PERM-ENGINEER-ApproveECR-001 — Engineer can approve an ECR

```yaml
id: PERM-ENGINEER-ApproveECR-001
title: Engineer / R&D is allowed to approve an engineering change request
goal: |
  Verify an Engineer / R&D user can approve an open engineering
  change request (ECR), and that the approval drives the linked BOM
  / routing change to released status with full audit attribution.
roles:
  - Engineer / R&D
capabilities:
  - CAP-MD-ECO
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An Engineer / R&D user exists.
  - At least one open ECR exists with linked BOM / routing changes
    awaiting approval.
steps:
  - n: 1
    action: |
      Sign in as Engineer. Open the ECR. Review the linked changes.
    expected: |
      The Approve action is enabled. Linked BOM / routing changes are
      visible with their proposed deltas.
  - n: 2
    action: |
      Approve the ECR. Provide reason or sign-off note if prompted.
    expected: |
      ECR transitions to Approved. Linked BOM / routing changes
      transition to Released at the next revision.
  - n: 3
    action: |
      Open the ECR audit log.
    expected: |
      Approval is attributed to the Engineer with timestamp, sign-off
      note, and a snapshot of what was approved.
expected_overall: |
  Engineer approves an ECR; approval and downstream rev release are
  auditable.
pass_criteria: |
  ECR approved AND linked changes released AND audit log captures
  user, timestamp, note, and approved snapshot.
est_minutes: 6
```
