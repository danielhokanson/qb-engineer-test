## P5-QC-CAPA-001 — Corrective action and preventive action (CAPA)

```yaml
id: P5-QC-CAPA-001
title: Open a CAPA from an NCR and track to closure
goal: |
  Verify the CAPA workflow: from a recurring NCR pattern, open a
  CAPA, assign owner, capture root cause and corrective action,
  define preventive action, and close with verification.
roles:
  - QC Inspector
  - Production Manager
  - Engineer / R&D
flows:
  - part-to-inventory
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-QC-CAPA
  - CAP-QC-NCR
preconditions:
  - At least one NCR exists (P5-QC-NCR-001).
prerequisite_cases:
  - P5-QC-NCR-001
steps:
  - n: 1
    action: |
      From an NCR (or independently), open a CAPA. Set:
      - Description: short summary of the issue
      - Owner: assigned engineer
      - Due date: 30 days from today
    expected: |
      CAPA saves with a stable ID, in "Open" status.
  - n: 2
    action: |
      As the owner, document root cause analysis (e.g., "Vendor's
      lot heat-treatment was off-spec") and corrective action ("Reject
      lot, request vendor re-test"). Save.
    expected: |
      RCA and CA saved.
  - n: 3
    action: |
      Document preventive action ("Add incoming hardness check to
      inspection plan for steel from this vendor").
    expected: |
      PA saved.
  - n: 4
    action: |
      Close the CAPA with a verification step (e.g., "Updated plan
      P5-QC-INSPECT-001 with hardness check, verified active 2026-04-25").
    expected: |
      CAPA transitions to Closed. Closure includes verification text
      and date.
expected_overall: |
  CAPA captures the full Plan-Do-Check-Act loop with audit trail.
pass_criteria: |
  CAPA opened AND RCA / CA / PA all captured AND closure verified.
est_minutes: 15
why_this_matters: |
  CAPAs that don't track to verified closure are theater. Auditors
  for ISO / AS9100 specifically check that closures have evidence.
```
