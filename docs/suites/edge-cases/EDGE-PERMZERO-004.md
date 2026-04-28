## EDGE-PERMZERO-004 — Zero-record visibility (e.g., zero accessible locations) blocks transaction entry cleanly

```yaml
id: EDGE-PERMZERO-004
title: A user whose location-visibility list is empty cannot enter location-bearing transactions and sees a clear message
goal: |
  Verify that when a user's permitted locations list is empty (zero
  accessible locations) — perhaps because their assignment was
  revoked but their account remains active — they cannot enter or
  approve transactions that require a location, and the UI explains
  the access gap rather than silently rendering empty dropdowns or
  ambiguous errors.
roles:
  - Administrator
  - Inventory Clerk
capabilities:
  - CAP-IDEN-ROLES
  - CAP-CROSS-PERMS-MATRIX
  - CAP-MD-LOCATIONS
  - CAP-INV-CORE
preconditions:
  - A user assigned to a role that requires location filtering.
  - That user's accessible-locations list explicitly = 0 entries.
steps:
  - n: 1
    action: |
      As the zero-location user, open the inventory transaction entry
      form.
    expected: |
      The form either:
      (a) refuses to load with a clear "no locations available; ask
      your administrator" message, OR
      (b) loads with the location dropdown disabled and a visible
      explanation.
      A blank dropdown with no explanation is unacceptable.
  - n: 2
    action: |
      Attempt to submit any location-bearing transaction.
    expected: |
      Submission is blocked. The block reason is the location
      authority gap.
  - n: 3
    action: |
      Confirm the user CAN still access non-location-bearing screens
      (e.g., view their own profile).
    expected: |
      Lockout is scoped to location-required actions, not the entire
      application.
  - n: 4
    action: |
      Have the administrator grant the user one location. Re-attempt
      the transaction.
    expected: |
      Form now loads normally; submission succeeds.
expected_overall: |
  Zero-visibility on a required scope produces a clear lockout, not
  silent empty UI.
pass_criteria: |
  No submission possible at zero access AND lockout reason is visible
  AND grant restores expected behavior.
why_this_matters: |
  Empty dropdowns with no explanation are the worst user experience
  in any ERP — the user thinks "the system is broken" when really
  their permissions are. The system has to surface the cause.
est_minutes: 8
```
