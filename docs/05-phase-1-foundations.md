# Phase 1 — Foundational Records

This phase covers the records that master data (parts, BOMs, customers, vendors) and transactions (POs, work orders, invoices) will reference. By the end of Phase 1, the application has enough record infrastructure that Phase 2 can begin populating master data.

## Scope

- **Locations** — physical sites where the business operates (primary plant, second site, off-site warehouse).
- **Work centers** — areas within a location where production work happens.
- **Units of measure** — how the business measures things (each, kg, hour, square foot, gallon).
- **General ledger accounts** — the chart of accounts used for posting financial activity.
- **Tax codes** — sales tax, VAT, and other tax classifications applied to transactions.
- **Employees** — people who work for the business, separate from system users.
- **Additional users** — system accounts beyond the first admin, with role assignments.
- **Calendars** — shift schedules, holidays, planned downtime.
- **Asset records** — equipment that work orders reference and PM schedules apply to.

## Roles introduced

Phase 1 expands the role vocabulary beyond P0's `Administrator`. Roles introduced or used heavily here:

- `Administrator` — still owns most of Phase 1 in small shops.
- `IT Admin` — user management, role permissions.
- `Controller` — chart of accounts, tax codes.
- `HR` — employee records, onboarding documentation.
- `Production Manager` — work centers, calendars.
- `Maintenance Manager` — asset records, PM groundwork.

Small shops collapse these to `Administrator`. The library doesn't fork case content for that — it expects the small-shop tester to select multiple roles when running.

## Note on placeholders

Steps reference `{{company_name}}`, `{{primary_location}}`, etc. The runner substitutes from the active fixture. Default fixture: Cascade Components, LLC.

## Note on "find and open"

Phase 1 cases use the same convention as Phase 0: steps say "find and open the work centers area" rather than locking to specific menu paths. If a tester can't find the screen, that's a usability bug, not an instruction failure.

---

## P1-LOC-001 — Create the primary location

```yaml
id: P1-LOC-001
title: Create the primary business location
goal: |
  Add the company's main physical site so other records (work centers,
  inventory, employees) can reference it.
roles:
  - Administrator
preconditions:
  - Phase 0 is complete.
  - You are signed in as an administrator.
  - No locations have been created yet.
steps:
  - n: 1
    action: |
      Find and open the locations area. (Common labels: "Locations,"
      "Sites," "Facilities.")
    expected: |
      The locations list appears, empty by default.
  - n: 2
    action: |
      Choose the action to create a new location. Enter:
      - Name: "{{primary_location}} - Main Plant"
      - Address: a plausible street address in {{primary_location}}
      - Phone: a plausible phone number
      - Type: production / primary
    expected: |
      The form accepts the values and saves successfully.
  - n: 3
    action: |
      Mark this location as the company's default or primary location.
    expected: |
      A primary or default flag is visible on the location record.
expected_overall: |
  The primary location exists with a complete address and is marked as
  the default. Other records can now reference it.
pass_criteria: |
  Location is created AND visible in the list AND flagged as primary.
est_minutes: 5
negative_variants:
  - id: P1-LOC-001-N1
    title: Reject location with missing required fields
    action: |
      Try to create a second location with only a name (no address).
    expected: |
      The form blocks submission and explains which fields are required,
      in plain language.
    pass_criteria: |
      Submission was blocked AND the error message names the missing
      field(s) clearly.
```

---

## P1-LOC-002 — Create a second location

```yaml
id: P1-LOC-002
title: Create a second location
goal: |
  Add a non-primary location to verify the system handles multi-site
  operations.
roles:
  - Administrator
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - P1-LOC-001 has passed.
steps:
  - n: 1
    action: |
      Find and open the locations area. Choose the action to create a
      new location.
    expected: |
      The location creation form appears.
  - n: 2
    action: |
      Enter:
      - Name: "Springfield Warehouse"
      - Address: a plausible warehouse address in a different city
      - Phone: a plausible phone number
      - Type: warehouse / non-primary
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Open the locations list.
    expected: |
      Both locations appear. The primary location is visually
      distinguished from the secondary.
expected_overall: |
  Two locations exist. The primary remains the default; the secondary
  is available for reference but not flagged as primary.
pass_criteria: |
  Both locations exist AND only the primary carries the default flag.
why_this_matters: |
  Many ERPs handle a single location well and break in subtle ways
  when a second is added (records that silently default to "the only
  location," reports that don't filter by location). Catching this
  early saves a lot of rework.
est_minutes: 4
```

---

## P1-WC-001 — Create the first work center

```yaml
id: P1-WC-001
title: Create the first work center
goal: |
  Configure a physical or logical area where production work happens.
  Work orders will be assigned to work centers; labor and overhead
  will post against them.
roles:
  - Production Manager
  - Administrator
preconditions:
  - At least one location exists.
  - You are signed in as a user with permission to configure work centers.
steps:
  - n: 1
    action: |
      Find and open the work centers area.
    expected: |
      The work centers list appears, empty by default.
  - n: 2
    action: |
      Choose the action to create a new work center. Enter:
      - Name: "Press Shop"
      - Location: {{primary_location}} - Main Plant
      - Default labor rate: a plausible hourly rate
      - Capacity: a plausible hours-per-day value
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Open the work center you just created.
    expected: |
      All values you entered are visible. The location is correctly
      linked to the location record from P1-LOC-001.
expected_overall: |
  The work center exists, is linked to a location, and carries default
  values that routings will inherit.
pass_criteria: |
  Work center is in the list AND opens to show entered values AND
  links to the correct location.
est_minutes: 6
negative_variants:
  - id: P1-WC-001-N1
    title: Reject work center without a location
    action: |
      Try to create a work center with no location selected.
    expected: |
      Submission is blocked. The error explains that a location is
      required.
    pass_criteria: |
      Submission blocked AND error names the location field.
```

---

## P1-WC-002 — Create additional work centers covering common operations

```yaml
id: P1-WC-002
title: Create work centers for common operations
goal: |
  Round out the work center list to cover the operations a typical
  fabrication shop performs. Subsequent routings will assign operations
  to these.
roles:
  - Production Manager
preconditions:
  - P1-WC-001 has passed.
steps:
  - n: 1
    action: |
      Create a work center for each of the following:
      - "Cut & Saw" (location: primary)
      - "Weld" (location: primary)
      - "Paint" (location: primary)
      - "Assembly" (location: primary)
      - "Inspection" (location: primary)
    expected: |
      Each work center is created successfully and appears in the list.
  - n: 2
    action: |
      Open the work centers list and sort or filter by name.
    expected: |
      All five new work centers (plus Press Shop) are visible. Sort
      and filter behave as a normal list view should.
expected_overall: |
  Six work centers exist, all linked to the primary location, ready to
  be referenced by routings in Phase 2.
pass_criteria: |
  Six work centers exist AND each links to the primary location.
est_minutes: 8
```

---

## P1-WC-003 — Configure a work center with a calendar override

```yaml
id: P1-WC-003
title: Configure a work center with a non-default calendar
goal: |
  Verify a single work center can run on a different schedule than the
  rest of the plant (e.g., the paint booth running a single shift while
  the rest runs two).
roles:
  - Production Manager
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one calendar exists. (See P1-CAL-001.)
  - P1-WC-002 has passed.
prerequisite_cases:
  - P1-CAL-001
steps:
  - n: 1
    action: |
      Open the "Paint" work center.
    expected: |
      The work center detail view opens.
  - n: 2
    action: |
      Find the calendar or schedule setting. Override the plant default
      with a single-shift calendar.
    expected: |
      The override is accepted. Save succeeds.
  - n: 3
    action: |
      Open a different work center (e.g., "Weld") and verify its
      calendar is unchanged.
    expected: |
      The other work center still uses the plant default calendar.
expected_overall: |
  Paint runs on a non-default calendar; other work centers are
  unaffected. Capacity calculations should reflect the per-work-center
  schedule.
pass_criteria: |
  Paint shows the override calendar AND another work center confirms
  the default is still in place.
est_minutes: 5
```

---

## P1-UOM-001 — Verify the standard units of measure exist

```yaml
id: P1-UOM-001
title: Confirm standard units of measure are available
goal: |
  Verify that common units (each, kg, lb, hour, foot, square foot,
  gallon, liter) exist out of the box. Most ERPs ship with these; if
  yours doesn't, it's a setup gap to flag.
roles:
  - Administrator
preconditions:
  - Phase 0 is complete.
steps:
  - n: 1
    action: |
      Find and open the units of measure area. (Common labels: "Units
      of Measure," "UOM," "Measurement Units.")
    expected: |
      A list of units appears. The list is either pre-populated with
      common units OR offers to seed them.
  - n: 2
    action: |
      Verify the following are present (or seed them if the system
      offers): each, kilogram, pound, hour, foot, square foot, gallon,
      liter.
    expected: |
      All units listed are available.
expected_overall: |
  The unit list contains the common units a fabrication shop will need
  for parts, assemblies, and labor.
pass_criteria: |
  All listed units are present after this case completes.
why_this_matters: |
  Inventing missing units one-by-one as parts are added is slow and
  inconsistent. Confirming the standard set exists early avoids that.
est_minutes: 4
```

---

## P1-UOM-002 — Add a custom unit of measure

```yaml
id: P1-UOM-002
title: Add a custom unit of measure
goal: |
  Verify the system supports adding business-specific units beyond the
  defaults.
roles:
  - Administrator
preconditions:
  - P1-UOM-001 has passed.
steps:
  - n: 1
    action: |
      Open the units of measure area. Choose to add a new unit.
    expected: |
      A form appears with fields for name, abbreviation, and possibly
      a category (length, weight, volume, etc.).
  - n: 2
    action: |
      Add a "sheet" unit (abbreviation: sht), categorized as count or
      pieces.
    expected: |
      The unit saves successfully and appears in the list.
expected_overall: |
  The custom unit exists alongside the defaults and is selectable when
  creating parts later.
pass_criteria: |
  Custom unit is created AND visible in the list.
est_minutes: 3
```

---

## P1-UOM-003 — Define a unit conversion

```yaml
id: P1-UOM-003
title: Define a unit conversion
goal: |
  Set up a conversion factor between two units (e.g., 1 sheet = 32
  square feet) so that the system can convert quantities between
  measurements when issuing or receiving inventory.
roles:
  - Administrator
preconditions:
  - P1-UOM-001 and P1-UOM-002 have passed.
steps:
  - n: 1
    action: |
      Find the unit conversions area. (May be a separate screen or a
      tab on the unit detail page.)
    expected: |
      A way to define conversions appears.
  - n: 2
    action: |
      Define: 1 sheet = 32 square feet.
    expected: |
      The conversion saves. Both directions of the conversion are
      visible (sheet to square feet and square feet to sheet).
  - n: 3
    action: |
      In a part record (or a calculator if the system provides one),
      enter "2 sheets" and verify it equals 64 square feet.
    expected: |
      The conversion is applied correctly.
expected_overall: |
  The conversion exists and is correctly applied wherever the system
  needs to convert between sheet and square foot.
pass_criteria: |
  Round-trip conversion (e.g., 2 sht to 64 sqft to 2 sht) is exact,
  no rounding loss.
why_this_matters: |
  Lots of real production processes consume material in a different
  unit than they purchase it (buy coil by the foot, consume by the
  pound). Wrong conversions are a top source of inventory variance.
est_minutes: 5
```

---

## P1-GL-001 — Confirm the chart of accounts is initialized

```yaml
id: P1-GL-001
title: Confirm the chart of accounts is initialized
goal: |
  Verify that a default chart of accounts exists. Without it, every
  later financial transaction will fail.
roles:
  - Controller
preconditions:
  - Phase 0 is complete.
  - The costing model and currency are configured (P0-TENANT-005).
steps:
  - n: 1
    action: |
      Find and open the chart of accounts area. (Common labels: "Chart
      of Accounts," "GL Accounts," "Accounts.")
    expected: |
      A list of accounts appears. Either pre-populated with a standard
      chart, or the system offers to seed one based on the company's
      industry or tax jurisdiction.
  - n: 2
    action: |
      If the chart is empty, choose to seed it with a standard
      chart-of-accounts template.
    expected: |
      The standard chart loads. It includes asset accounts (cash,
      receivables, inventory), liability accounts (payables), revenue,
      and expense accounts at minimum.
  - n: 3
    action: |
      Spot-check the chart: search for "Cash," "Accounts Receivable,"
      "Inventory," "Sales," "Cost of Goods Sold," "Wages."
    expected: |
      Each of these is present, with a unique account number and
      classification (asset, liability, equity, revenue, expense).
expected_overall: |
  A complete chart of accounts exists, ready for transactions to
  reference.
pass_criteria: |
  Chart contains entries for cash, receivables, inventory, payables,
  sales, COGS, and wages — at minimum.
why_this_matters: |
  Some ERPs ship without a default chart and require you to create
  every account by hand. That's a 1–2 day setup task that's easy to
  get wrong. A seeded chart prevents the mistake.
est_minutes: 6
```

---

## P1-GL-002 — Add a custom GL account

```yaml
id: P1-GL-002
title: Add a custom GL account
goal: |
  Verify the system supports adding accounts beyond the seed chart, in
  case the business has tracking needs the standard chart doesn't
  cover.
roles:
  - Controller
preconditions:
  - P1-GL-001 has passed.
steps:
  - n: 1
    action: |
      Open the chart of accounts. Choose to add a new account.
    expected: |
      A form appears with fields for account number, name, type
      (asset / liability / etc.), and possibly a parent account.
  - n: 2
    action: |
      Add an account: number "5150," name "Subcontractor Costs," type
      Expense.
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Search for "Subcontractor" in the chart.
    expected: |
      The new account appears in the results.
expected_overall: |
  Custom account exists and behaves the same as seeded accounts —
  searchable, postable to, and visible in reports.
pass_criteria: |
  Account is created AND searchable AND its type is correctly recorded.
est_minutes: 4
negative_variants:
  - id: P1-GL-002-N1
    title: Reject duplicate account number
    action: |
      Try to create a second account with number "5150."
    expected: |
      The form blocks submission and explains the number is already
      in use.
    pass_criteria: |
      Submission is blocked AND the duplicate is named.
```

---

## P1-TAX-001 — Configure a sales tax code

```yaml
id: P1-TAX-001
title: Configure a sales tax code
goal: |
  Set up a tax classification for sales in the company's primary tax
  jurisdiction.
roles:
  - Controller
preconditions:
  - P0-INTEG-003 (tax integration choice) is complete.
  - The chart of accounts is initialized.
steps:
  - n: 1
    action: |
      Find and open the tax codes area. (Common labels: "Tax Codes,"
      "Tax Rates," "Tax Configuration.")
    expected: |
      A list of tax codes appears, possibly empty or with seed entries.
  - n: 2
    action: |
      Create a new tax code:
      - Name: "OR Sales Tax" (or wherever the primary location is)
      - Rate: a plausible rate for the jurisdiction (e.g., 0% for
        Oregon, 7.25% for California base)
      - Posting account: link to the appropriate liability account
        from the chart of accounts.
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Verify the tax code is selectable on a sample customer or
      sales-side record.
    expected: |
      The tax code appears in the dropdown wherever taxes are applied.
expected_overall: |
  At least one tax code exists, has a defined rate, and posts to a
  real GL account.
pass_criteria: |
  Tax code is created AND has a non-error posting account AND is
  selectable on customer / order records.
est_minutes: 5
```

---

## P1-TAX-002 — Configure a tax-exempt code

```yaml
id: P1-TAX-002
title: Configure a tax-exempt classification
goal: |
  Set up a tax code that records "no tax was charged" on transactions
  that are legitimately exempt (resale, government, out-of-state).
roles:
  - Controller
preconditions:
  - P1-TAX-001 has passed.
steps:
  - n: 1
    action: |
      Open the tax codes area. Create a new code.
    expected: |
      The tax code form appears.
  - n: 2
    action: |
      Enter:
      - Name: "Tax Exempt - Resale"
      - Rate: 0%
      - Mark as exempt (if there's a flag separate from the rate)
    expected: |
      The form accepts the values and saves.
expected_overall: |
  An exempt classification exists and is distinguishable on reports
  from "0% rate that just happens to compute to zero."
pass_criteria: |
  Exempt code is created AND distinguishable from regular zero-rate
  codes.
why_this_matters: |
  Tax authorities expect exempt sales to be reported as exempt, not as
  "we charged 0%." Conflating the two is a common audit finding.
est_minutes: 3
```
