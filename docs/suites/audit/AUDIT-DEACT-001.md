## AUDIT-DEACT-001 — Record deactivations log the actor and target

```yaml
id: AUDIT-DEACT-001
title: Deactivating a customer, vendor, or user records actor and target
goal: |
  Verify deactivating any of the three entities (customer, vendor,
  user) records the action in the audit log.
roles:
  - Administrator
  - Procurement
  - IT Admin
preconditions:
  - At least one customer, one vendor, and one user are in a state
    where they can be deactivated.
prerequisite_cases:
  - P2-VENDOR-005
  - P1-USER-003
steps:
  - n: 1
    action: |
      Deactivate one of each entity (per existing P1-USER-003,
      P2-VENDOR-005, and the equivalent customer flow).
    expected: |
      All three deactivations succeed.
  - n: 2
    action: |
      Open the audit log filtered to deactivation events.
    expected: |
      Three entries are present, each with actor, target entity,
      target ID, and timestamp.
expected_overall: |
  Deactivations are uniformly audited across entity types.
pass_criteria: |
  All three deactivations recorded with full attribution.
est_minutes: 5
```
