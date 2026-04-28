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
flows:
  - foundational-records
capabilities:
  - CAP-MD-LOCATIONS
preconditions:
  - |
    The application is bootstrapped: company identity, locale, time zone, fiscal year, currency, costing model, and integrations are configured, and the first administrator can sign in. (Phase 0 outcomes.)
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
flows:
  - foundational-records
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-LOCATIONS
preconditions:
  - The primary location exists with a complete address and is flagged as the company default. (Established by P1-LOC-001.)
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
negative_variants:
  - id: P1-LOC-002-N1
    title: Reject duplicate location name
    action: |
      Try to create a third location with the same name as the
      primary.
    expected: |
      Save is blocked with a clear "name must be unique" message.
    pass_criteria: |
      Duplicate name rejected AND existing record is identified.
  - id: P1-LOC-002-N2
    title: Cannot demote the only primary
    action: |
      Try to remove the primary flag from the primary location while
      no other location is flagged primary.
    expected: |
      The change is blocked or warns that exactly one primary
      location must exist.
    pass_criteria: |
      Tenant is never left with zero primary locations.
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
flows:
  - foundational-records
capabilities:
  - CAP-MD-WORKCENTERS
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
  - id: P1-WC-001-N2
    title: Reject negative capacity or labor rate
    action: |
      Try to create a work center with capacity = -8 hours/day, then
      again with labor rate = -$25.
    expected: |
      Each submission is blocked with a plain-English error explaining
      that the value must be non-negative. The application does NOT
      silently accept a negative number that would later corrupt
      capacity calculations.
    pass_criteria: |
      Both submissions blocked AND error wording is clear AND no
      record was created.
  - id: P1-WC-001-N3
    title: Reject work center pointing at an inactive location
    action: |
      Deactivate a location (or attempt to point a new work center at
      a known-deactivated location).
    expected: |
      Selection is either filtered out or rejected with a clear
      message that the destination location is inactive.
    pass_criteria: |
      No work center created against an inactive location.
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
flows:
  - foundational-records
capabilities:
  - CAP-MD-WORKCENTERS
  - CAP-CROSS-LIST-UX
preconditions:
  - At least one work center exists (e.g. Press Shop), linked to the primary location, with a default labor rate and capacity. (Established by P1-WC-001.)
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
negative_variants:
  - id: P1-WC-002-N1
    title: Reject duplicate work center name within location
    action: |
      Try to create a second "Weld" work center at the primary
      location.
    expected: |
      Save is blocked with a clear "name must be unique within the
      location" message.
    pass_criteria: |
      Duplicate work center name within the same location is refused.
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
flows:
  - foundational-records
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-WORKCENTERS
  - CAP-MD-CALENDARS
preconditions:
  - At least one calendar exists. (See P1-CAL-001.)
  - Multiple work centers exist covering common operations (Press Shop, Cut & Saw, Weld, Paint, Assembly, Inspection), all linked to the primary location. (Established by P1-WC-002.)
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
negative_variants:
  - id: P1-WC-003-N1
    title: Reject calendar override pointing at deleted calendar
    action: |
      Delete (or deactivate) a calendar that a work center is using
      as an override, then reload the work center.
    expected: |
      The application prevents deletion of an in-use calendar OR
      explicitly resets the work center to the default with a clear
      warning. No silent dangling reference.
    pass_criteria: |
      No work center carries a reference to a non-existent calendar.
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
flows:
  - foundational-records
capabilities:
  - CAP-MD-UOM
preconditions:
  - |
    The application is bootstrapped: company identity, locale, time zone, fiscal year, currency, costing model, and integrations are configured, and the first administrator can sign in. (Phase 0 outcomes.)
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
negative_variants:
  - id: P1-UOM-001-N1
    title: Cannot delete a built-in unit that is in use
    action: |
      Try to delete the "each" unit (a default that other records
      will reference once parts exist).
    expected: |
      Deletion is blocked or warns that the unit is built-in /
      referenced. No silent removal that breaks downstream forms.
    pass_criteria: |
      Built-in unit deletion is refused with a clear reason.
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
flows:
  - foundational-records
capabilities:
  - CAP-MD-UOM
preconditions:
  - Standard units of measure are available (each, kilogram, pound, hour, foot, square foot, gallon, liter). (Established by P1-UOM-001.)
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
negative_variants:
  - id: P1-UOM-002-N1
    title: Reject duplicate UoM abbreviation
    action: |
      Try to add another custom unit with the same abbreviation as an
      existing unit (e.g., "ea" if "each" already uses "ea").
    expected: |
      Submission is blocked with a clear message that the abbreviation
      is already in use.
    pass_criteria: |
      Submission blocked AND duplicate is named.
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
flows:
  - foundational-records
capabilities:
  - CAP-MD-UOM
preconditions:
  - Standard units of measure exist (each, kilogram, pound, hour, foot, square foot, gallon, liter) plus at least one custom unit (e.g. "sheet"). (Established by P1-UOM-001 and P1-UOM-002.)
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
negative_variants:
  - id: P1-UOM-003-N1
    title: Reject zero or negative conversion factor
    action: |
      Try to define "1 sheet = 0 square feet" or "1 sheet = -32
      square feet."
    expected: |
      Save is blocked with a plain-English message that conversion
      factors must be positive.
    pass_criteria: |
      Non-positive factor is rejected.
  - id: P1-UOM-003-N2
    title: Reject conversion across incompatible categories
    action: |
      Try to define "1 hour = 5 kilograms" (time to mass).
    expected: |
      The application either blocks or warns clearly that a
      conversion across categories is meaningless.
    pass_criteria: |
      Cross-category conversion is refused or surfaces an explicit
      warning.
  - id: P1-UOM-003-N3
    title: Reject conflicting reverse conversion
    action: |
      After saving "1 sheet = 32 sqft", try to save "1 sheet = 50
      sqft" (a contradicting factor).
    expected: |
      The save is blocked or asks the user to confirm overwriting
      the prior conversion.
    pass_criteria: |
      Conflicting conversion is detected and surfaced.
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
flows:
  - foundational-records
capabilities:
  - CAP-ACCT-FULLGL
preconditions:
  - |
    The application is bootstrapped: company identity, locale, time zone, fiscal year, currency, costing model, and integrations are configured, and the first administrator can sign in. (Phase 0 outcomes.)
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
negative_variants:
  - id: P1-GL-001-N1
    title: Re-seeding chart does not duplicate existing accounts
    action: |
      After seeding once, attempt to seed the chart again from the
      same template.
    expected: |
      The application warns that the chart is already populated and
      either skips, merges with explicit confirmation, or refuses.
      No silent duplicates appear in the account list.
    pass_criteria: |
      No duplicate accounts created on re-seed.
  - id: P1-GL-001-N2
    title: Cannot delete a system-required account
    action: |
      Try to delete the system "Cash" or "Accounts Receivable"
      account.
    expected: |
      Deletion is blocked with a clear "this is a system-required
      account" message.
    pass_criteria: |
      System-required accounts cannot be removed.
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
flows:
  - foundational-records
capabilities:
  - CAP-ACCT-FULLGL
preconditions:
  - |
    The chart of accounts is initialized with standard accounts: cash, accounts receivable, inventory, accounts payable, sales, cost of goods sold, and wages — at minimum. (Established by P1-GL-001.)
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
flows:
  - foundational-records
capabilities:
  - CAP-MD-TAXCODES
preconditions:
  - |
    Tax calculation has been configured: a tax provider has been chosen (integrated provider or manual rates) and the choice persists across tenant settings. (Established by P0-INTEG-003.)
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
negative_variants:
  - id: P1-TAX-001-N1
    title: Reject tax code without a posting account
    action: |
      Try to save a tax code with the GL posting account left blank.
    expected: |
      Save is blocked with a clear "posting account is required"
      message.
    pass_criteria: |
      Save blocked AND missing field is named.
  - id: P1-TAX-001-N2
    title: Reject tax code with rate above 100%
    action: |
      Try to save a tax code with a rate of 250%.
    expected: |
      Save is blocked or warns; the rate must fall within a sensible
      bound.
    pass_criteria: |
      Out-of-range rate refused.
  - id: P1-TAX-001-N3
    title: Posting account must be a liability
    action: |
      Try to set the posting account to a Revenue or Expense account.
    expected: |
      The application either filters the dropdown to liability
      accounts or rejects the save with a clear "tax must post to a
      liability account" message.
    pass_criteria: |
      Tax cannot post to a non-liability account.
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
flows:
  - foundational-records
capabilities:
  - CAP-MD-TAXCODES
preconditions:
  - At least one sales tax code exists with a defined rate, exemption flag, and posting GL account. (Established by P1-TAX-001.)
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
negative_variants:
  - id: P1-TAX-002-N1
    title: Exempt classification requires exemption reason
    action: |
      Try to save a tax-exempt code without selecting or entering an
      exemption reason / category.
    expected: |
      Save is blocked or warns that an exemption reason is required
      for audit purposes.
    pass_criteria: |
      Exempt code without reason is rejected or surfaces an explicit
      warning.
```

---

## P1-EMP-001 — Create the first employee record

```yaml
id: P1-EMP-001
title: Create the first employee record
goal: |
  Add the founder/first administrator as an employee. Employee records
  are separate from system users — every employee may not have a
  login, and every user may not be an employee.
roles:
  - HR
  - Administrator
flows:
  - foundational-records
capabilities:
  - CAP-MD-EMPLOYEES
preconditions:
  - The first administrator has a system account (P0-ADMIN-001).
  - At least one location exists (P1-LOC-001).
steps:
  - n: 1
    action: |
      Find and open the employees area. (Common labels: "Employees,"
      "People," "Team.")
    expected: |
      The employees list appears, empty by default.
  - n: 2
    action: |
      Choose the action to create a new employee. Enter:
      - First and last name
      - Hire date (today or a plausible date in the past)
      - Default location: {{primary_location}} - Main Plant
      - Department or role title (e.g., "Owner / Admin")
      - Pay type: salaried or hourly with a plausible rate
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Open the employee record you just created.
    expected: |
      All entered values are visible. The record carries an ID. There
      is a way to link this employee to a system user account
      (separately or in a follow-up step).
expected_overall: |
  The first employee exists, with a location, pay info, and a stable
  ID. Can be referenced by labor records and time tracking later.
pass_criteria: |
  Employee record exists AND links to the primary location AND has
  pay information set.
est_minutes: 6
why_this_matters: |
  An "employee" and a "user" are different things. The cleaning crew
  has employee records but no system access. A consultant has a
  system user but no employee record. ERPs that conflate the two
  break in subtle ways when this distinction matters.
negative_variants:
  - id: P1-EMP-001-N1
    title: Reject hire date far in the future
    action: |
      Try to set hire date to one year from today and save.
    expected: |
      Submission is blocked or warns. The application does not
      silently accept a hire date that would distort labor reports.
    pass_criteria: |
      Future-dated hire is blocked or surfaces a warning that
      requires explicit override.
  - id: P1-EMP-001-N2
    title: Reject negative pay rate
    action: |
      Try to set pay rate to a negative value.
    expected: |
      Submission is blocked with a clear error.
    pass_criteria: |
      Negative pay rate rejected.
```

---

## P1-EMP-002 — Link an employee to a system user

```yaml
id: P1-EMP-002
title: Link an employee record to a system user
goal: |
  Connect the first employee record to the first administrator's
  system user account, so labor and audit trails attribute to the
  same person consistently.
roles:
  - HR
  - IT Admin
  - Administrator
flows:
  - foundational-records
capabilities:
  - CAP-MD-EMPLOYEES
  - CAP-IDEN-USERS
preconditions:
  - The first employee record exists with hire date, default location, department, and pay info. (Established by P1-EMP-001.)
steps:
  - n: 1
    action: |
      Open the employee record from P1-EMP-001.
    expected: |
      The employee detail view opens.
  - n: 2
    action: |
      Find the linkage to a system user (may be on the main detail
      page or a separate "Account" tab). Link to the first
      administrator's user.
    expected: |
      The link is created. The user's email or username is now
      visible on the employee record.
  - n: 3
    action: |
      Open the system user record and verify the reverse link is
      present.
    expected: |
      The user record shows it is linked to the employee record.
expected_overall: |
  Employee and user records cross-reference each other. Reports that
  combine the two (e.g., "labor hours by employee, who else has system
  access") work consistently.
pass_criteria: |
  Both directions of the link are visible AND removing one removes
  the other (or at least surfaces a warning).
est_minutes: 4
negative_variants:
  - id: P1-EMP-002-N1
    title: Cannot link the same user to multiple employees
    action: |
      Create a second employee record. Try to link the first
      administrator's user account to it as well.
    expected: |
      The link is blocked with a clear message that this user is
      already linked to another employee.
    pass_criteria: |
      Many-to-one is refused; user-employee link is one-to-one.
  - id: P1-EMP-002-N2
    title: Cannot link an employee to a deactivated user
    action: |
      Deactivate a user (per P1-USER-003), then try to link a new
      employee record to it.
    expected: |
      The link is blocked or warns that the target user is
      deactivated.
    pass_criteria: |
      Linking to deactivated users is refused or surfaces a warning.
```

---

## P1-EMP-003 — Add additional employees

```yaml
id: P1-EMP-003
title: Add additional employees with varied pay types
goal: |
  Build out a small employee roster covering the variety of pay
  structures the system needs to support: hourly production, salaried
  management, exempt vs. non-exempt.
roles:
  - HR
flows:
  - foundational-records
capabilities:
  - CAP-MD-EMPLOYEES
preconditions:
  - The first employee record exists with hire date, default location, department, and pay info. (Established by P1-EMP-001.)
steps:
  - n: 1
    action: |
      Create three more employees:
      - One hourly production worker with an overtime-eligible pay
        rate.
      - One salaried-exempt manager (no overtime).
      - One salaried-non-exempt supervisor (eligible for overtime
        even though salaried).
    expected: |
      Each employee saves successfully. Pay-type / exemption
      classifications are captured.
  - n: 2
    action: |
      Open the employees list.
    expected: |
      All four employees appear (the original from P1-EMP-001 plus
      the three new ones). Pay type and exemption are visible or
      filterable.
expected_overall: |
  A small but representative employee roster exists. Records cover
  the three main pay-classification combinations.
pass_criteria: |
  Four employees total AND each one's pay-type and exemption fields
  reflect what was entered.
est_minutes: 8
why_this_matters: |
  Many ERPs handle hourly and salaried but get exempt vs. non-exempt
  classification wrong, which leads to overtime miscalculations.
  Verifying both options exist and stick is worth the extra minute.
negative_variants:
  - id: P1-EMP-003-N1
    title: Reject duplicate employee identifier
    action: |
      Try to create a second employee with the same employee number
      / identifier as an existing one.
    expected: |
      Save is blocked with a clear "ID already in use" message.
    pass_criteria: |
      Duplicate employee identifier rejected.
  - id: P1-EMP-003-N2
    title: Salary value cannot be zero on a salaried employee
    action: |
      Try to save a salaried employee with $0 salary.
    expected: |
      Save is blocked or warns; salaried employees must have a
      non-zero pay rate.
    pass_criteria: |
      Zero-salary salaried employee refused or flagged.
```

---

## P1-USER-001 — Invite a second system user

```yaml
id: P1-USER-001
title: Invite a second system user with a non-admin role
goal: |
  Create a second user account assigned to a less-privileged role,
  to verify role-based access actually restricts what the user can
  see and do.
roles:
  - IT Admin
  - Administrator
flows:
  - foundational-records
capabilities:
  - CAP-IDEN-USERS
  - CAP-IDEN-ROLES
preconditions:
  - At least one non-admin role exists (P0-USER-001).
  - At least four employees exist covering varied pay classifications (hourly with overtime, salaried-exempt, salaried-non-exempt). (Established by P1-EMP-003.)
steps:
  - n: 1
    action: |
      Find and open the users area. Choose to invite a new user.
    expected: |
      The invite form appears with fields for email, name, and role.
  - n: 2
    action: |
      Invite a user with email "operator@example.com" assigned to a
      Floor Operator role (or equivalent non-admin role from P0).
    expected: |
      The invite is sent (or the user is created directly with a
      temporary credential, depending on your auth flow).
  - n: 3
    action: |
      Optionally link the new user to one of the employee records
      from P1-EMP-003.
    expected: |
      The link is recorded. The user record reflects the employee
      linkage.
expected_overall: |
  A second user exists with a non-admin role and (optionally) is
  linked to an employee record.
pass_criteria: |
  User exists with the assigned role AND can sign in (verify in
  P1-USER-002) AND, if linked, the employee linkage is visible.
est_minutes: 6
negative_variants:
  - id: P1-USER-001-N1
    title: Reject invitation to deactivated role
    action: |
      Deactivate or delete a non-admin role, then try to invite a
      user assigned to that role.
    expected: |
      The save is blocked with a clear message that the chosen role
      is unavailable.
    pass_criteria: |
      Invitation to a non-active role is refused.
  - id: P1-USER-001-N2
    title: Reject invite without email
    action: |
      Try to send an invite with the email field empty.
    expected: |
      Save is blocked with a clear "email is required" error.
    pass_criteria: |
      Invite without email is refused.
```

---

## P1-USER-002 — Verify role-based restrictions actually restrict

```yaml
id: P1-USER-002
title: Verify role-based access restricts what a non-admin user can see
goal: |
  Sign in as the user created in P1-USER-001 and confirm they cannot
  see or change administrator-only settings.
roles:
  - IT Admin
flows:
  - foundational-records
capabilities:
  - CAP-IDEN-ROLES
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A second non-admin system user exists, assigned a Floor Operator (or equivalent) role and able to sign in. (Established by P1-USER-001.)
  - You can sign in as the user created in P1-USER-001 (a credential
    or invite link).
steps:
  - n: 1
    action: |
      Sign out from the administrator account. Sign in as the second
      user.
    expected: |
      Sign-in succeeds. The home / landing page is appropriate to a
      Floor Operator (work order list, scanner workflow, etc.) — NOT
      the administrator setup pages.
  - n: 2
    action: |
      Try to navigate to the administrator-only areas: company
      settings, user management, role permissions, integrations,
      chart of accounts.
    expected: |
      Each area is either invisible in the navigation OR returns a
      clear "you don't have permission" message — not a stack trace,
      not a blank screen, not a partial page.
  - n: 3
    action: |
      Sign back out. Sign back in as the original administrator.
    expected: |
      The administrator pages are visible and functional again.
expected_overall: |
  Role permissions actually restrict access. The non-admin user sees
  only what their role allows; the administrator sees everything.
pass_criteria: |
  Each restricted area was inaccessible to the non-admin user AND
  produced a clear, non-leaky error or omission.
why_this_matters: |
  Permissions checks that look right in the UI but don't actually
  enforce on the backend are a common security bug — the UI hides
  the menu but a direct URL still works. Spot-checking a few areas
  in this case catches the most common version of that bug.
modality:
  - keyboard
est_minutes: 7
negative_variants:
  - id: P1-USER-002-N1
    title: Direct URL access to a restricted page
    action: |
      While signed in as the non-admin user, try to reach an
      administrator-only page by typing its URL directly into the
      browser address bar.
    expected: |
      The page does NOT render. Either you're redirected to a
      "permission denied" screen or back to your role's home page.
    pass_criteria: |
      Restricted page does not load AND no privileged data leaks
      into the page that does load.
```

---

## P1-USER-003 — Deactivate a user

```yaml
id: P1-USER-003
title: Deactivate a system user
goal: |
  Verify a user can be deactivated (so they can no longer sign in)
  without losing their historical activity in the system.
roles:
  - IT Admin
flows:
  - foundational-records
capabilities:
  - CAP-IDEN-USERS
preconditions:
  - At least one non-admin user exists (P1-USER-001).
steps:
  - n: 1
    action: |
      Open the user record from P1-USER-001. Find and use the
      deactivate / disable action.
    expected: |
      A confirmation dialog appears. Choose to confirm.
  - n: 2
    action: |
      Sign out and try to sign in as the deactivated user.
    expected: |
      Sign-in is rejected with a clear message — not a generic
      "wrong password" error that would let an attacker enumerate
      accounts.
  - n: 3
    action: |
      Sign back in as the administrator. Search for the deactivated
      user.
    expected: |
      The user still appears, marked as deactivated. Their
      historical activity (audit log entries, anything attributed
      to them) is preserved.
expected_overall: |
  Deactivated users cannot sign in but their records and history
  remain. They can be reactivated if needed.
pass_criteria: |
  Sign-in is blocked AND the user record still exists AND
  historical activity is preserved.
why_this_matters: |
  Deletion of users would orphan audit log entries and make it
  impossible to reconstruct who did what. Deactivation preserves
  the trail while preventing further access.
est_minutes: 5
negative_variants:
  - id: P1-USER-003-N1
    title: Cannot deactivate the last administrator
    action: |
      As the only remaining administrator, try to deactivate
      yourself.
    expected: |
      The action is blocked with a clear message that at least one
      active administrator must exist.
    pass_criteria: |
      Last-admin deactivation is refused.
  - id: P1-USER-003-N2
    title: Deactivation revokes active sessions
    action: |
      While Sam Rivera is signed in (in another browser), have the
      admin deactivate Sam Rivera. Wait briefly and have Sam Rivera
      try any action.
    expected: |
      Sam Rivera's session is invalidated. Their next action returns
      a sign-in prompt or "session ended" message.
    pass_criteria: |
      Existing sessions of deactivated users do not continue to act.
```

---

## P1-CAL-001 — Configure the plant default calendar

```yaml
id: P1-CAL-001
title: Configure the plant default calendar
goal: |
  Set up the default working schedule the plant runs on (which days,
  which shifts, what's a holiday). Other capacity calculations
  reference this calendar.
roles:
  - Production Manager
  - Administrator
flows:
  - foundational-records
capabilities:
  - CAP-MD-CALENDARS
preconditions:
  - At least one location exists (P1-LOC-001).
steps:
  - n: 1
    action: |
      Find and open the calendars area. (Common labels: "Calendars,"
      "Schedules," "Shop Calendar.")
    expected: |
      A calendar configuration screen appears. There may be a
      pre-existing default calendar to edit, or a prompt to create one.
  - n: 2
    action: |
      Configure or edit the default calendar:
      - Working days: Monday through Friday
      - Shifts: one shift, 8 hours, e.g. 7:00 AM to 3:30 PM with a
        30-minute lunch
      - Mark a few US federal holidays for the upcoming year as
        non-working days (e.g., Independence Day, Thanksgiving,
        Christmas).
    expected: |
      The calendar accepts the configuration and saves. The visible
      schedule reflects the working days, shift times, and holidays.
  - n: 3
    action: |
      Open a work center detail page (from P1-WC-001) and verify it
      uses this calendar by default.
    expected: |
      The work center shows the default calendar is active.
expected_overall: |
  The plant default calendar is configured. Capacity calculations
  for any work center using the default will reflect the configured
  shift hours and holidays.
pass_criteria: |
  Calendar saved successfully AND work centers default to it AND
  configured holidays are observed in the visible schedule.
est_minutes: 8
negative_variants:
  - id: P1-CAL-001-N1
    title: Reject shift end-time before start-time
    action: |
      Try to configure a shift with start 3:00 PM and end 7:00 AM the
      same day (i.e., end-before-start, not crossing midnight).
    expected: |
      Submission is blocked with a clear "end must be after start"
      message. Cross-midnight shifts (e.g., 11:00 PM to 7:00 AM) are
      configured via an explicit "crosses midnight" flag, not implied.
    pass_criteria: |
      End-before-start blocked AND cross-midnight has explicit
      handling.
  - id: P1-CAL-001-N2
    title: Reject overlapping shifts on the same day
    action: |
      Try to add a second shift overlapping the existing first shift
      (e.g., add 12:00 PM-8:00 PM when the existing shift is 7:00 AM-
      3:30 PM).
    expected: |
      Application either blocks the overlap or warns clearly,
      requiring explicit confirmation.
    pass_criteria: |
      Overlap is blocked or flagged for explicit confirmation, not
      silently accepted.
```

---

## P1-CAL-002 — Configure a second-shift calendar

```yaml
id: P1-CAL-002
title: Configure a second-shift calendar
goal: |
  Set up an alternative calendar for areas that run a second shift,
  used by P1-WC-003 and similar overrides.
roles:
  - Production Manager
flows:
  - foundational-records
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-CALENDARS
preconditions:
  - The plant default calendar is configured with working days, shift times, and at least the upcoming-year US federal holidays marked non-working. (Established by P1-CAL-001.)
steps:
  - n: 1
    action: |
      Open the calendars area. Choose to create a new calendar.
    expected: |
      The calendar creation form appears.
  - n: 2
    action: |
      Configure:
      - Name: "Second Shift"
      - Working days: Monday through Friday
      - Shifts: one shift from 3:30 PM to 11:00 PM with a 30-minute
        meal break
      - Inherit holidays from the plant default calendar (or
        re-enter the same holidays).
    expected: |
      The calendar saves. It is selectable as an override on work
      center records.
expected_overall: |
  A second-shift calendar exists, distinguishable from the default,
  and assignable to work centers that need to run on a different
  schedule.
pass_criteria: |
  Second-shift calendar exists AND its shift times differ from the
  plant default AND it can be selected on a work center record.
est_minutes: 5
negative_variants:
  - id: P1-CAL-002-N1
    title: Reject duplicate calendar name
    action: |
      Try to save a second calendar named "Second Shift."
    expected: |
      Save is blocked with a clear "name must be unique" message.
    pass_criteria: |
      Duplicate calendar name is refused.
```

---

## P1-CAL-003 — Add a planned downtime block

```yaml
id: P1-CAL-003
title: Add a planned downtime block to a calendar
goal: |
  Reserve time on the calendar that's not a holiday but isn't
  available for production either (planned maintenance, facility
  shutdown, training day).
roles:
  - Production Manager
flows:
  - foundational-records
capabilities:
  - CAP-MD-CALENDARS
preconditions:
  - The plant default calendar is configured with working days, shift times, and at least the upcoming-year US federal holidays marked non-working. (Established by P1-CAL-001.)
steps:
  - n: 1
    action: |
      Open the plant default calendar.
    expected: |
      The calendar opens for editing.
  - n: 2
    action: |
      Add a planned downtime block:
      - Start: a Friday afternoon two weeks from now
      - End: end of day
      - Reason: "Quarterly facility maintenance"
    expected: |
      The downtime block saves and is visible on the calendar.
  - n: 3
    action: |
      Verify capacity for that day reflects the lost time. Open a
      capacity report or work center capacity view for that day.
    expected: |
      Available capacity for the affected work centers is reduced
      to reflect the lost hours.
expected_overall: |
  Planned downtime is recorded and capacity calculations subtract
  it appropriately.
pass_criteria: |
  Downtime block visible on the calendar AND capacity for the
  affected day is reduced.
why_this_matters: |
  Schedulers need to know not just "we don't run on Christmas" but
  also "the paint booth is down for maintenance Friday afternoon."
  Treating planned downtime as a first-class concept on calendars
  prevents over-promising delivery dates.
est_minutes: 5
negative_variants:
  - id: P1-CAL-003-N1
    title: Reject downtime block ending before it starts
    action: |
      Try to add a downtime block whose end is earlier than its
      start.
    expected: |
      Save is blocked with a clear "end must be after start" error.
    pass_criteria: |
      Inverted-time downtime is refused.
  - id: P1-CAL-003-N2
    title: Reject downtime block in the past with scheduled work
    action: |
      Add a downtime block in the past on a day where production was
      already scheduled. (May be deferred until a later phase has
      scheduled work.)
    expected: |
      The application warns that retroactive downtime conflicts with
      already-scheduled work and requires explicit confirmation.
    pass_criteria: |
      Retroactive downtime surfaces conflicts before applying.
```

---

## P1-ASSET-001 — Create the first asset record

```yaml
id: P1-ASSET-001
title: Create the first asset record
goal: |
  Add a piece of equipment as a fixed asset. Asset records will be
  referenced by work orders that use the equipment, by PM schedules,
  and by depreciation calculations later.
roles:
  - Maintenance Manager
  - Administrator
flows:
  - foundational-records
capabilities:
  - CAP-MD-ASSETS
preconditions:
  - At least one work center exists (P1-WC-001).
  - At least one GL account for fixed assets exists (P1-GL-001).
steps:
  - n: 1
    action: |
      Find and open the assets area. (Common labels: "Assets,"
      "Equipment," "Fixed Assets.")
    expected: |
      The assets list appears, empty by default.
  - n: 2
    action: |
      Choose to create a new asset. Enter:
      - Name: "Press 1 - 60 ton hydraulic"
      - Asset tag / serial: a plausible identifier
      - Location: {{primary_location}} - Main Plant
      - Work center: Press Shop
      - Acquisition date: a plausible past date
      - Acquisition cost: a plausible amount (e.g., $45,000)
      - Asset GL account: an asset account from P1-GL-001
      - Depreciation method: straight-line, 10-year life
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Open the asset record you just created.
    expected: |
      All entered values are visible. The asset is linked to the
      Press Shop work center. A depreciation schedule is generated
      or available to view.
expected_overall: |
  The asset exists, is linked to a work center, and has the
  financial details needed for depreciation. Work orders can now
  reference it.
pass_criteria: |
  Asset record exists AND links to the correct work center AND
  shows a depreciation schedule (or offers to generate one).
est_minutes: 8
negative_variants:
  - id: P1-ASSET-001-N1
    title: Reject negative or zero acquisition cost
    action: |
      Try to save an asset with acquisition cost of $0 or -$5,000.
    expected: |
      Save is blocked with a plain-language error explaining cost
      must be positive.
    pass_criteria: |
      Non-positive acquisition cost is refused.
  - id: P1-ASSET-001-N2
    title: Reject zero or negative useful life
    action: |
      Try to save with useful life of 0 years or -10 years.
    expected: |
      Save is blocked. Useful life must be a positive integer.
    pass_criteria: |
      Invalid useful life is refused.
  - id: P1-ASSET-001-N3
    title: Reject duplicate asset tag
    action: |
      Try to create a second asset with the same asset tag / serial
      as an existing asset.
    expected: |
      Save is blocked with a clear "asset tag already in use" message.
    pass_criteria: |
      Duplicate asset tag is refused.
```

---

## P1-ASSET-002 — Create additional assets and verify list filtering

```yaml
id: P1-ASSET-002
title: Create additional assets across multiple work centers
goal: |
  Build out a small asset list and verify filtering by location and
  work center works as expected.
roles:
  - Maintenance Manager
flows:
  - foundational-records
capabilities:
  - CAP-MD-ASSETS
  - CAP-CROSS-LIST-UX
preconditions:
  - At least one fixed asset record exists, linked to a work center, with depreciation method and useful life configured and a depreciation schedule generated. (Established by P1-ASSET-001.)
steps:
  - n: 1
    action: |
      Create the following assets:
      - "MIG Welder #2" — work center: Weld
      - "Paint Booth A" — work center: Paint
      - "CNC Mill - Haas VF-2" — work center: Cut & Saw
    expected: |
      Each asset saves successfully and links to the named work
      center.
  - n: 2
    action: |
      Open the assets list. Filter or sort by work center.
    expected: |
      All four assets appear (Press 1 plus the three new ones).
      Filtering by work center shows only the assets in that work
      center.
  - n: 3
    action: |
      Filter by location.
    expected: |
      All four assets remain (all are at the primary location).
expected_overall: |
  Four assets exist, each linked to its work center. Filters work
  predictably.
pass_criteria: |
  Four assets total AND filter by work center returns the right
  subset for each.
est_minutes: 6
negative_variants:
  - id: P1-ASSET-002-N1
    title: Cannot link asset to a deleted work center
    action: |
      Delete (or deactivate) a work center that an asset references,
      then reload the asset.
    expected: |
      The application either prevents deletion of an in-use work
      center OR clearly flags the asset as needing reassignment. No
      silent dangling reference.
    pass_criteria: |
      No asset references a non-existent work center.
```

---

## P1-ASSET-003 — Distinguish inventory from fixed assets at the PO line item level

```yaml
id: P1-ASSET-003
title: Verify inventory and fixed assets are differentiated at PO time
goal: |
  Confirm that when a purchase order is created, line items can be
  classified as either inventory (will be consumed or sold) or fixed
  asset (will be capitalized and depreciated). Get this right at PO
  entry time, not after the fact.
roles:
  - Procurement
  - Controller
flows:
  - foundational-records
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-P2P-PO
  - CAP-MD-ASSETS
preconditions:
  - |
    The chart of accounts is initialized with standard accounts: cash, accounts receivable, inventory, accounts payable, sales, cost of goods sold, and wages — at minimum. (Established by P1-GL-001.)
  - At least one vendor exists (covered in Phase 2 — for now, this
    case can be deferred or run with a placeholder vendor).
prerequisite_cases:
  - P1-GL-001
steps:
  - n: 1
    action: |
      Find the purchase order area. Choose to create a new PO.
    expected: |
      The PO creation form opens with line items available.
  - n: 2
    action: |
      Add two line items:
      - Line 1: 100 units of a part (inventory)
      - Line 2: 1 piece of equipment (fixed asset, e.g., "60-ton
        press, model XYZ")
    expected: |
      For each line, the form prompts for or distinguishes between
      inventory and fixed-asset classification. The fixed-asset line
      requires (or accepts) acquisition cost, asset class, and a
      capitalization GL account.
  - n: 3
    action: |
      Save the PO as a draft. Re-open it. Verify line classifications
      persist.
    expected: |
      Line 1 shows as inventory; Line 2 shows as a fixed asset with
      the capitalization details preserved.
expected_overall: |
  POs distinguish between inventory and fixed-asset purchases at the
  line level. Receipt against each line will eventually post to the
  correct account (inventory vs. capital asset).
pass_criteria: |
  PO can carry both line types AND the distinction persists across
  save and reload.
why_this_matters: |
  ERPs that don't enforce this at PO time end up with fixed assets
  posted to inventory accounts (or vice versa) and require manual
  journal-entry corrections. Catching the bug at PO entry is far
  cheaper than catching it at month-end close.
est_minutes: 7
notes: |
  This case may not be fully runnable until Phase 2 (master data,
  including vendors). Run as far as you can and stop at the first
  step that needs a vendor or part record that doesn't exist yet.
  Re-run after Phase 2 if needed.
negative_variants:
  - id: P1-ASSET-003-N1
    title: Fixed-asset line requires capitalization account
    action: |
      Add a fixed-asset line item to a PO with the capitalization
      account left blank. Try to save.
    expected: |
      Save is blocked with a clear "fixed-asset line requires a
      capitalization account" message.
    pass_criteria: |
      Save is refused until a valid asset account is selected.
  - id: P1-ASSET-003-N2
    title: Cannot reclassify line type after PO is approved
    action: |
      Approve the PO. Then try to switch a line from inventory to
      fixed-asset.
    expected: |
      The change is blocked or requires a documented amendment
      process; silent reclassification post-approval is not
      acceptable.
    pass_criteria: |
      Reclassification post-approval is gated.
```
