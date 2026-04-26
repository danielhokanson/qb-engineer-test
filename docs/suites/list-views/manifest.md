# List View UX Suite

List views are where everyday users live. A list view that's fine at 100 records and unusable at 5,000 silently destroys productivity. This suite covers the canonical search / filter / sort / paginate behaviors per major list view, in addition to the dedicated EDGE-SCALE cases that probe behavior at scale.

## ID convention

`LIST-{ENTITY}-NNN`.

```yaml
suite: list-views
title: Per-entity list view UX (search, filter, sort, paginate)
description: |
  For each major list view, verify partial search, status filter,
  date range filter, multi-column sort, pagination at scale, and
  saved-view persistence.
estimated_total_minutes: 35

cases:
  - id: LIST-CUST-001
  - id: LIST-VENDOR-001
  - id: LIST-PART-001
  - id: LIST-WO-001
  - id: LIST-PO-001
  - id: LIST-INV-001

completion_criteria:
  - Every list view supports partial search, sort, filter, and pagination.
  - No silent truncation or missing records.
```
