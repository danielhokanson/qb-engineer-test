## PERM-WAREHOUSE-ApproveECR-001 — Warehouse cannot approve an ECR

```yaml
id: PERM-WAREHOUSE-ApproveECR-001
title: Warehouse / Logistics is denied approving an engineering change request
goal: |
  Verify a Warehouse user cannot approve ECRs.
roles:
  - Warehouse / Logistics
preconditions:
  - A Warehouse user exists with no other roles attached.
  - At least one open ECR exists.
steps:
  - n: 1
    action: |
      Sign in as Warehouse. Look for any ECR area.
    expected: |
      ECR admin is not reachable.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Warehouse cannot approve an ECR.
pass_criteria: |
  ECR not approved AND attempt rejected.
est_minutes: 3
```
