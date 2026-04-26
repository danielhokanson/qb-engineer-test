## PERM-SALES-ApproveECR-001 — Sales cannot approve an ECR

```yaml
id: PERM-SALES-ApproveECR-001
title: Sales / Account Manager is denied approving an engineering change request
goal: |
  Verify a Sales user cannot approve ECRs.
roles:
  - Sales / Account Manager
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one open ECR exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look for any ECR area.
    expected: |
      ECR admin is not reachable, or the ECR is read-only.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Sales cannot approve an ECR.
pass_criteria: |
  ECR not approved AND attempt rejected.
est_minutes: 3
```
