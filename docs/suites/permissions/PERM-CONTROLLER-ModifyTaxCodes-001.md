## PERM-CONTROLLER-ModifyTaxCodes-001 — Controller can modify tax codes

```yaml
id: PERM-CONTROLLER-ModifyTaxCodes-001
title: Controller is allowed to modify tax-code rates and mappings
goal: |
  Verify a Controller can edit a tax code's rate or its GL mapping,
  and that the change is captured with prior / new values for audit.
roles:
  - Controller
preconditions:
  - A Controller user exists.
  - At least one tax code is configured (e.g., a state sales tax with
    a rate and a mapped GL liability account).
steps:
  - n: 1
    action: |
      Sign in as Controller. Open the tax-code configuration. Open
      one tax code and change its rate to a different value (e.g.,
      from 7.5% to 7.75%) effective today.
    expected: |
      Change saves. The new rate is now active.
  - n: 2
    action: |
      Open the tax-code audit log.
    expected: |
      The change is recorded with the Controller user, timestamp,
      prior rate, new rate, and effective date.
expected_overall: |
  Controller modifies a tax code; change is fully auditable.
pass_criteria: |
  Tax code updated AND audit log shows actor, timestamp, before /
  after, and effective date.
est_minutes: 5
```
