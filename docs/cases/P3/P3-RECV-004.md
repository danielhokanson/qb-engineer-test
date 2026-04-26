## P3-RECV-004 — Over-receipt within tolerance, then beyond

```yaml
id: P3-RECV-004
title: Over-receipt within tolerance is allowed; beyond requires override
goal: |
  Verify the application supports a documented over-receipt tolerance
  (typically 5% or 10%). Receipts within tolerance post automatically;
  receipts beyond require explicit Buyer / Controller override.
roles:
  - Warehouse / Logistics
  - Procurement
flows:
  - part-to-inventory
preconditions:
  - An open PO line exists for a part with a defined over-receipt
    tolerance configured (in Procurement settings or per-vendor).
prerequisite_cases:
  - P3-PO-001
steps:
  - n: 1
    action: |
      For a 100-unit PO line, receive 105 units (5% over).
    expected: |
      Receipt is allowed (within tolerance). The 5-unit overage is
      noted on the receipt but not blocked.
  - n: 2
    action: |
      For another 100-unit PO line, receive 120 units (20% over).
    expected: |
      Receipt is blocked or requires Buyer / Controller override.
      The reason is clearly stated.
  - n: 3
    action: |
      Override (per role allowed). Receive the full 120.
    expected: |
      Receipt completes. The override is audit-logged with reason.
expected_overall: |
  Over-receipt tolerance is enforced and overrides are auditable.
pass_criteria: |
  In-tolerance receipt allowed AND beyond-tolerance blocked or
  audited override AND audit captures the override.
est_minutes: 8
negative_variants:
  - id: P3-RECV-004-N1
    title: Floor Operator role cannot apply over-receipt override
    action: |
      As a Floor Operator (or any non-procurement role), attempt the
      override.
    expected: |
      The override action is unavailable; only authorized roles can
      apply it.
    pass_criteria: |
      Unauthorized role cannot override.
  - id: P3-RECV-004-N2
    title: Override requires a documented reason
    action: |
      Attempt to apply the override without entering a reason.
    expected: |
      Save is blocked or warns; reason is required for audit.
    pass_criteria: |
      Reason-less override refused.
```
