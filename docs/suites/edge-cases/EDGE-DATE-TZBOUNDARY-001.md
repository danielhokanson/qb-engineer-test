## EDGE-DATE-TZBOUNDARY-001 — Transactions near midnight respect tenant time zone

```yaml
id: EDGE-DATE-TZBOUNDARY-001
title: Transaction posted near midnight uses the tenant time zone, not UTC
goal: |
  Verify that a transaction posted at, e.g., 11:50 PM tenant-local
  time on day X stays on day X in reports — not day X+1 because the
  server stored it as UTC.
roles:
  - Controller
capabilities:
  - CAP-IDEN-TENANT-CONFIG
  - CAP-RPT-FINANCIALS
preconditions:
  - The tenant is configured to a non-UTC time zone (Pacific from
    P0-TENANT-003 is fine).
  - It is currently late evening tenant-local time, OR the test
    environment supports backdating a timestamp to one.
steps:
  - n: 1
    action: |
      At 11:50 PM tenant-local time (or backdate-create a transaction
      with that local timestamp), post a journal entry.
    expected: |
      Entry posts. The visible posting timestamp shows 11:50 PM tenant
      local time.
  - n: 2
    action: |
      Run a daily transaction register filtered to "today" tenant-time.
    expected: |
      The 11:50 PM entry is included in today's register, not
      tomorrow's.
  - n: 3
    action: |
      Run the same register filtered to "tomorrow" tenant-time.
    expected: |
      The 11:50 PM entry is NOT included.
expected_overall: |
  Tenant time zone determines the calendar day for transactions.
pass_criteria: |
  Late-evening tenant-local entry appears under the correct tenant
  date in both daily filters.
why_this_matters: |
  When servers store UTC and clients display local, "today" can mean
  two different days depending on which side resolved it. The
  invariant is "transaction date is what the user thought it was when
  they clicked save." Anything else is a bug.
est_minutes: 6
```
