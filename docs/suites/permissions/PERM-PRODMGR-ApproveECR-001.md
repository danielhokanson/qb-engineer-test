## PERM-PRODMGR-ApproveECR-001 — Production Manager cannot approve an ECR

```yaml
id: PERM-PRODMGR-ApproveECR-001
title: Production Manager is denied approving an engineering change request
goal: |
  Verify a Production Manager cannot approve ECRs. They participate
  in change-board review and provide production sign-off, but the
  formal Approve action belongs to Engineering.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one open ECR exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Open the ECR (read-only / review
      access is acceptable).
    expected: |
      Approve action is hidden, disabled, or replaced with a
      "production sign-off" handoff that does not finalize the ECR.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL or API.
    expected: |
      The action is rejected with an authorization error.
expected_overall: |
  Production Manager cannot finalize an ECR approval.
pass_criteria: |
  ECR not approved AND linked changes not released AND attempt
  rejected.
notes: |
  This is the kind of "powerful but bounded" boundary that often
  drifts. ProdMgrs participate in change boards; granting them the
  formal approve permission collapses change control.
est_minutes: 4
```
