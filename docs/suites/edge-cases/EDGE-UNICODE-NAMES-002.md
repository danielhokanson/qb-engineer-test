## EDGE-UNICODE-NAMES-002 — Right-to-left script in vendor name renders without breaking layout

```yaml
id: EDGE-UNICODE-NAMES-002
title: A vendor name in Arabic or Hebrew (right-to-left) saves and displays without breaking surrounding layout
goal: |
  Verify that a vendor name written in a right-to-left script saves
  cleanly, displays in the correct direction within its field, and
  does not flip or break the layout of surrounding left-to-right UI
  elements.
roles:
  - Administrator
  - AP Clerk
capabilities:
  - CAP-MD-VENDORS
  - CAP-P2P-PO
  - CAP-CROSS-DOCS
preconditions:
  - Vendor creation is available.
steps:
  - n: 1
    action: |
      Create a vendor with the name "شركة الاختبار" (or a Hebrew
      equivalent like "חברת בדיקות"). Save.
    expected: |
      Save succeeds.
  - n: 2
    action: |
      Reload the vendor record. Inspect the layout.
    expected: |
      Vendor name displays right-to-left within its own field.
      Surrounding labels, columns, and buttons remain in the
      application's primary direction (typically LTR for English UI).
      No bidirectional override leaks into the rest of the page.
  - n: 3
    action: |
      Issue a PO to this vendor. Inspect the printed/PDF PO output.
    expected: |
      Vendor name appears correctly oriented on the document. The
      surrounding document structure is unaffected.
  - n: 4
    action: |
      Search for a substring of the vendor name.
    expected: |
      Search finds the vendor.
expected_overall: |
  Right-to-left names render natively without polluting layout.
pass_criteria: |
  Name displays RTL in its field AND surrounding UI direction
  preserved AND PO document handles the name correctly.
why_this_matters: |
  RTL handling is the case that exposes bidirectional text bugs —
  layout flips, broken column alignment, leaked direction overrides.
  Any system used in a global supply chain has to get this right.
est_minutes: 10
```
