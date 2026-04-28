## P3-HAZMAT-001 — Hazmat-flagged part requires SDS and shipping classification

```yaml
id: P3-HAZMAT-001
title: A hazmat-flagged part carries SDS, UN number, and shipping class
goal: |
  Verify a part can be marked hazmat with associated SDS document,
  UN number, hazard class, and packing group, and that shipments
  containing the part require hazmat documentation before release.
roles:
  - Engineer / R&D
  - Warehouse / Logistics
flows:
  - part-to-inventory
  - quote-to-cash
capabilities:
  - CAP-INV-HAZMAT
  - CAP-O2C-SHIP
preconditions:
  - At least one part exists that can be marked hazmat.
steps:
  - n: 1
    action: |
      Open a part. Mark it hazmat. Enter UN number, hazard class,
      packing group. Attach an SDS document.
    expected: |
      Settings save. SDS is downloadable from the part record.
  - n: 2
    action: |
      Try to ship the part on an SO without the hazmat declaration
      checked off.
    expected: |
      Shipping is blocked until the declaration is captured AND a
      hazmat-compatible carrier service is selected.
  - n: 3
    action: |
      Generate the shipping documents.
    expected: |
      Shipping label includes UN number / hazard class. SDS is
      included or referenced on the BOL.
expected_overall: |
  Hazmat parts force compliant shipping documentation.
pass_criteria: |
  SDS attached AND ship blocked without declaration AND documents
  reflect hazmat data.
why_this_matters: |
  Shipping hazmat without proper declaration is a fineable offense
  per DOT / IATA / IMDG. The system has to make non-compliance hard.
est_minutes: 8
negative_variants:
  - id: P3-HAZMAT-001-N1
    title: Reject hazmat flag without UN number
    action: |
      Mark a part hazmat but leave UN number blank.
    expected: |
      Save is blocked with a clear "UN number is required for hazmat"
      message.
    pass_criteria: |
      Hazmat without UN refused.
  - id: P3-HAZMAT-001-N2
    title: Reject expired SDS at ship time
    action: |
      Attach an SDS dated more than 3 years ago. Try to ship the
      part.
    expected: |
      Shipping is blocked or warns; SDS is outside the typical 3-year
      revision window.
    pass_criteria: |
      Stale SDS surfaces an explicit warning.
```
