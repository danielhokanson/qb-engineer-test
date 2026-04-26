## PERM-PROCUREMENT-ApproveECR-001 — Procurement cannot approve an ECR

```yaml
id: PERM-PROCUREMENT-ApproveECR-001
title: Procurement is denied approving an engineering change request
goal: |
  Verify a Procurement user cannot approve ECRs. Procurement provides
  cost / supplier feasibility input but the approval is engineering's.
roles:
  - Procurement
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one open ECR exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Open the ECR if visible.
    expected: |
      Approve action is hidden or disabled.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Procurement cannot approve an ECR.
pass_criteria: |
  ECR not approved AND attempt rejected.
est_minutes: 3
```
