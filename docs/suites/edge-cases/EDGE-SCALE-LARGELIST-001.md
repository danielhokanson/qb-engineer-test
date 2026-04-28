## EDGE-SCALE-LARGELIST-001 — List view stays usable with 5,000+ rows

```yaml
id: EDGE-SCALE-LARGELIST-001
title: A list view remains usable when the underlying record count crosses 5,000
goal: |
  Verify that a list view (e.g., parts) loads, filters, sorts, and
  paginates within tolerable response time when the record count is
  in the thousands. Many ERPs are usable at 100 rows and useless at
  10,000.
roles:
  - Administrator
  - Procurement
capabilities:
  - CAP-CROSS-LIST-UX
preconditions:
  - |
    Either 5,000+ part records exist in the test environment, OR a bulk-seed
    script can be run to create them.
notes: |
  If 5,000 records cannot be seeded, mark the case Blocked and report
  it. Do not weaken the case to fit a smaller dataset.
steps:
  - n: 1
    action: |
      Open the parts list view.
    expected: |
      First page of results renders within 5 seconds. Total count is
      visible (e.g., "5,234 parts").
  - n: 2
    action: |
      Apply a filter (e.g., "type = Raw material"). Type into the
      filter — observe the filter behavior.
    expected: |
      Filtered list returns within 3 seconds. Results count updates.
  - n: 3
    action: |
      Sort by a non-indexed-looking column (e.g., description).
    expected: |
      Sort completes within 5 seconds. Pages reflect sorted order.
  - n: 4
    action: |
      Paginate to the last page.
    expected: |
      Last page loads within 5 seconds. Returns the expected tail of
      the sorted set.
  - n: 5
    action: |
      Use the search box for a specific part number.
    expected: |
      Search resolves within 2 seconds.
expected_overall: |
  Large list view stays responsive within the listed time bounds.
pass_criteria: |
  Each operation completes within its documented time bound AND no
  partial / truncated results are silently returned.
why_this_matters: |
  ERP list views are where everyday users live. A list that's fast
  at 100 records and unusable at 5,000 silently destroys productivity
  as the company grows.
est_minutes: 10
```
