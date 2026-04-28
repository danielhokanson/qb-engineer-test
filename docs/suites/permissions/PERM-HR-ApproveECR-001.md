## PERM-HR-ApproveECR-001 — HR cannot approve an ECR

```yaml
id: PERM-HR-ApproveECR-001
title: HR is denied approving an engineering change request
goal: |
  Verify an HR user cannot approve ECRs.
roles:
  - HR
capabilities:
  - CAP-MD-ECO
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An HR user exists with no other roles attached.
  - At least one open ECR exists.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for any ECR area.
    expected: |
      ECR admin is not reachable.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  HR cannot approve an ECR.
pass_criteria: |
  ECR not approved AND attempt rejected.
est_minutes: 3
```
