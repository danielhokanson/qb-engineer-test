## EDGE-SCALE-LARGELIST-003 — Bulk action on a filtered selection of 5,000+ rows applies only to the filtered set

```yaml
id: EDGE-SCALE-LARGELIST-003
title: A bulk operation on a filtered list view applies only to the filtered rows, never to all rows
goal: |
  Verify that on a list view with 10,000 records, when the user
  filters to 5,234 rows and clicks "select all" → "deactivate," the
  operation applies to exactly those 5,234 rows — not to all 10,000
  and not to the visible page only.
roles:
  - Administrator
capabilities:
  - CAP-CROSS-BULK-OPS
  - CAP-CROSS-LIST-UX
preconditions:
  - 10,000+ records exist for the entity.
  - The list view supports filtering and a bulk action (e.g.,
    deactivate or status change).
notes: |
  This is a high-stakes case. If "select all" semantics are unclear,
  the user can wipe records they didn't intend to. The application
  must make the scope of "all" explicit.
  Reconciled in Phase 2 — bulk endpoints take an explicit ID list,
  not an implicit filter. Filtered-set bulk actions are the UI's job
  to translate to ID lists: when the user asks to act on a filtered
  set, the UI must construct the explicit array of entity IDs and
  submit it in the request payload. The case still tests bulk-action
  scope correctness; the contract shape is now explicit.
steps:
  - n: 1
    action: |
      Filter the list to a known subset (e.g., 5,234 rows). The count
      is visible.
    expected: |
      Filtered count visible.
  - n: 2
    action: |
      Click "select all." Read the confirmation language.
    expected: |
      Confirmation explicitly states the count being acted on (5,234)
      and distinguishes between "all on this page" and "all matching
      filter."
  - n: 3
    action: |
      Confirm the bulk deactivate. Wait for completion.
    expected: |
      Operation completes. Progress / completion is visible.
  - n: 4
    action: |
      Verify exactly 5,234 records were deactivated by re-running the
      filter.
    expected: |
      All 5,234 are deactivated; no record outside the filter was
      touched.
expected_overall: |
  Bulk action scope is exact — matches the explicit set the user
  intended, no more, no less. The contract is that bulk operations
  accept an explicit array of entity IDs in the request payload;
  behavior against a filtered-on-screen set is the UI's
  responsibility (the UI constructs the ID list from the filter and
  submits it).
pass_criteria: |
  Acted-on count equals the count of IDs submitted in the request
  payload exactly AND no record outside that explicit ID list was
  modified. When the user's intent is "all rows matching my current
  filter," the UI is responsible for materializing that filter into
  an explicit ID array before submitting; the bulk endpoint itself
  acts only on the IDs it receives.
why_this_matters: |
  "Select all" that secretly means "all 10,000" instead of "the 5,234
  I filtered" is a one-click data disaster. The semantics must be
  explicit, especially at scale.
est_minutes: 12
```
