## EDGE-DATE-TZSHIFT-002 — Shift in a remote-employee time zone respects that zone, not the tenant's

```yaml
id: EDGE-DATE-TZSHIFT-002
title: A remote employee's shift logged in their local time zone reports correctly across both their and the tenant's calendars
goal: |
  Verify that an employee assigned to a different time zone than the
  tenant — e.g., an India-based engineer logging time against a
  US-based tenant — has shifts recorded in their own local time and
  reported correctly under both perspectives.
roles:
  - Administrator
  - HR
capabilities:
  - CAP-HR-TIMETRACK
  - CAP-MFG-LABOR
  - CAP-MD-EMPLOYEES
preconditions:
  - The tenant time zone is set (e.g., US Pacific).
  - At least one employee record exists with a different time zone
    (e.g., India Standard Time).
notes: |
  If the application does not support per-employee time zone, mark
  the case Not Applicable and document the limitation.
steps:
  - n: 1
    action: |
      As (or for) the IST-zoned employee, create a labor entry from
      9:00 AM to 5:00 PM IST on a chosen weekday.
    expected: |
      Entry accepts. Times displayed in IST in the employee's view.
  - n: 2
    action: |
      Switch to a tenant-zone view (e.g., Controller in US Pacific).
      Read the same labor entry.
    expected: |
      Entry shows the same instant in tenant-zone display (e.g., 8:30
      PM previous day to 4:30 AM same day Pacific). The two views
      describe the same wall-clock work.
  - n: 3
    action: |
      Run a labor report grouped by tenant calendar day.
    expected: |
      The 8 hours are attributed per the documented rule (start date
      vs end date vs split) and total to 8 hours.
expected_overall: |
  Per-employee time zones are honored without losing the tenant-side
  reporting view.
pass_criteria: |
  Both views describe the same instant AND total elapsed equals 8
  hours regardless of view AND day attribution rule is documented.
why_this_matters: |
  Distributed teams are normal in modern manufacturing — engineering
  in one country, production in another. A system that hardcodes
  employee time to tenant zone makes remote staff's records wrong.
est_minutes: 12
```
