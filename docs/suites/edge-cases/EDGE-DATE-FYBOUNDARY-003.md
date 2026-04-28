## EDGE-DATE-FYBOUNDARY-003 — Non-calendar fiscal year boundary respected by reports

```yaml
id: EDGE-DATE-FYBOUNDARY-003
title: A fiscal year that does not start January 1 reports correctly across its boundary
goal: |
  Verify that a tenant configured with a fiscal year starting on a
  non-January date (e.g., July 1) treats its own June 30 / July 1
  boundary as the year boundary for every dated report — not the
  calendar year boundary.
roles:
  - Administrator
  - Controller
capabilities:
  - CAP-IDEN-TENANT-CONFIG
  - CAP-ACCT-PERIOD
  - CAP-RPT-FINANCIALS
preconditions:
  - |
    Either the tenant fiscal calendar starts July 1, OR a separate test
    tenant is configured with a non-calendar fiscal year for this case.
steps:
  - n: 1
    action: |
      Confirm the fiscal year configuration shows start = July 1.
    expected: |
      Configuration is visible and unambiguous.
  - n: 2
    action: |
      Post a journal entry dated June 30 to a revenue account, $500.
    expected: |
      Entry posts in the June period of the closing fiscal year.
  - n: 3
    action: |
      Post another journal entry dated July 1, same account, $500.
    expected: |
      Entry posts in the July period of the new fiscal year.
  - n: 4
    action: |
      Run the annual P&L. Confirm the year boundary is the fiscal
      boundary, not the calendar boundary.
    expected: |
      Closing-year P&L includes June 30 entry; excludes July 1 entry.
      New-year P&L is the inverse.
  - n: 5
    action: |
      Run a calendar-quarter report (e.g., Q3 calendar = Jul–Sep).
    expected: |
      Both entries appear in calendar Q3 if a calendar-aligned report
      exists, OR the report clearly states it follows fiscal periods.
      No ambiguity between calendar and fiscal.
expected_overall: |
  Fiscal-year boundary is honored independently of the calendar year.
pass_criteria: |
  June 30 / July 1 boundary correctly partitions fiscal years AND no
  report silently mixes calendar and fiscal partitioning.
why_this_matters: |
  Many manufacturers run on a non-calendar fiscal year (April, July,
  October starts are all common). An ERP that hardcodes January 1
  boundaries silently mis-states their annual results.
est_minutes: 10
```
