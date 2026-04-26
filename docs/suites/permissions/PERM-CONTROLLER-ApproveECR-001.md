## PERM-CONTROLLER-ApproveECR-001 — Controller cannot approve an ECR

```yaml
id: PERM-CONTROLLER-ApproveECR-001
title: Controller is denied approving an engineering change request
goal: |
  Verify a Controller cannot approve ECRs. Cost-impact review may
  involve Controller, but the formal Approve action remains with
  Engineering.
roles:
  - Controller
preconditions:
  - A Controller user exists with no other roles attached.
  - At least one open ECR exists.
steps:
  - n: 1
    action: |
      Sign in as Controller. Open the ECR if visible.
    expected: |
      Approve action is hidden or disabled.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Controller cannot approve an ECR.
pass_criteria: |
  ECR not approved AND attempt rejected.
est_minutes: 3
```
