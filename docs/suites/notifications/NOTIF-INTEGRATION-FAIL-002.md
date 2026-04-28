## NOTIF-INTEGRATION-FAIL-002 — Failed inbound EDI document alerts EDI coordinator

```yaml
id: NOTIF-INTEGRATION-FAIL-002
title: Rejected inbound EDI document (e.g., 850, 856) alerts EDI coordinator with document detail
goal: |
  Verify that when an inbound EDI document fails validation (schema
  error, partner mapping error, missing reference), an alert fires to
  the EDI coordinator and the relevant business owner (e.g., customer
  service for 850, receiving for 856), naming the trading partner,
  document type, control number, and rejection reason.
roles:
  - Integrations Owner
  - Customer Service
  - Receiving Clerk
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-CROSS-INTEG-EDI
preconditions:
  - EDI integration is configured for at least one trading partner
    with a documented document-type mapping.
prerequisite_cases:
  - P4-INTEG-001
steps:
  - n: 1
    action: |
      Submit an inbound EDI document that fails validation (malformed,
      unknown partner reference, or invalid item).
    expected: |
      An alert fires to the EDI coordinator and the document-type
      business owner with partner, document type, control number, and
      reason.
  - n: 2
    action: |
      Resubmit a corrected version.
    expected: |
      Document accepts. The prior alert clears or is marked resolved.
  - n: 3
    action: |
      Open the EDI log.
    expected: |
      Both rejection and acceptance are recorded with control numbers.
expected_overall: |
  EDI rejections do not silently disappear; they reach the right team
  with traceable detail.
pass_criteria: |
  Rejection alert fires with full document detail AND recovery is
  recorded AND business owner routing is correct per document type.
est_minutes: 9
```
