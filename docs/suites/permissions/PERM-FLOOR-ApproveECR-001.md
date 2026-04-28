## PERM-FLOOR-ApproveECR-001 — Floor Operator cannot approve an ECR

```yaml
id: PERM-FLOOR-ApproveECR-001
title: Floor Operator is denied approving an engineering change request
goal: |
  Verify a Floor Operator cannot approve ECRs.
roles:
  - Floor Operator
capabilities:
  - CAP-MD-ECO
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one open ECR exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any ECR area.
    expected: |
      ECR admin is not reachable.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Floor Operator cannot approve an ECR.
pass_criteria: |
  ECR not approved AND attempt rejected.
est_minutes: 3
```
