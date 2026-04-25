# Phase 0 — Bootstrap

This phase covers everything that has to happen before anyone can do real work in the system. It starts with no records, no users, and no configuration. By the end of Phase 0, the application is configured enough that Phase 1 (foundational records like locations, work centers, and master data) can begin.

## Who runs Phase 0

In practice, the first admin user runs almost all of Phase 0 alone. The case role-functions tag this so a custom role mapping can route work elsewhere if needed.

## Note on company name and example values

Steps reference `{{company_name}}` and similar placeholders. The runner substitutes real values from a fixture file at runtime. Default fixture: `Cascade Components, LLC`, a precision sheet metal fabricator in Eugene, Oregon.

## Note on "find and open"

Many cases say something like "find and open the company settings area." This phrasing is deliberate. Test cases should not lock to specific menu paths because menus change between releases. If the tester can't find what the step is asking for, that itself is a bug — write it up. The application should not require tribal knowledge to navigate.

---

## P0-INSTALL-001 — Reach the application for the first time

```yaml
id: P0-INSTALL-001
title: Open the application's starting page in a fresh browser
goal: |
  Confirm that someone with no account can reach a meaningful starting
  page that explains what to do next.
roles:
  - Administrator
preconditions:
  - The application is installed and reachable at its expected URL.
  - No accounts have been created yet.
  - You are using a browser with no prior cookies or sign-in state for
    this application (a new private/incognito window works).
steps:
  - n: 1
    action: |
      Open a fresh private/incognito browser window. Navigate to the
      application URL.
    expected: |
      A page loads. The page makes it clear what kind of application
      this is and what someone arriving for the first time should do
      next. There is a visible way to begin setup or create the first
      account — not just a sign-in form for users who don't exist yet.
  - n: 2
    action: |
      Read the page. Look for any text directed at a brand-new user
      (someone who has never used this application before).
    expected: |
      You can identify, within 30 seconds of looking, what the next
      step is. Either a clear "get started" or "set up your company"
      action, or instructions explaining how the first user is created.
expected_overall: |
  A first-time visitor with no account has a clear path forward and
  is not stuck staring at a sign-in form for an account that doesn't
  exist.
pass_criteria: |
  Within 30 seconds of the page loading, you knew what to do next.
why_this_matters: |
  An ERP that drops a brand-new buyer onto a sign-in page with no
  setup path is a common failure. It usually means the install
  documentation has to fill the gap, which means the application
  isn't really finished.
est_minutes: 3
negative_variants:
  - id: P0-INSTALL-001-N1
    title: Application URL with garbage path
    action: |
      Navigate to the application URL with a nonsense path appended,
      like /this-page-does-not-exist.
    expected: |
      A clear error page appears (a "not found" page, in plain
      language). It offers a way back to the main starting page. It
      does NOT show a stack trace, raw error code, or developer-only
      information.
    pass_criteria: |
      Error page is human-readable AND offers a way back AND does not
      leak internal details.
```

---

## P0-ADMIN-001 — Register the first administrator

```yaml
id: P0-ADMIN-001
title: Create the first administrator account
goal: |
  Establish the first user. This person will configure the rest of
  the company.
roles:
  - Administrator
preconditions:
  - You completed P0-INSTALL-001.
  - No user accounts exist yet.
prerequisite_cases:
  - P0-INSTALL-001
steps:
  - n: 1
    action: |
      From the starting page, follow the path that begins setup or
      creates the first account.
    expected: |
      A form appears asking for information about the person setting
      up the company. At minimum: name, email address, and a password
      (or equivalent way to secure the account).
  - n: 2
    action: |
      Fill in the form with these values:
        Name: Alex Morgan
        Email: alex.morgan@cascade-components.example
        Password: a strong password of your choice (write it down —
        you will need it)
      Submit the form.
    expected: |
      The form accepts the submission. You are either signed in
      automatically or directed to sign in with the credentials you
      just created.
  - n: 3
    action: |
      If you were not automatically signed in, sign in using the email
      and password from step 2.
    expected: |
      You are signed in as Alex Morgan. The application shows it
      recognizes you (your name, initials, or email is visible
      somewhere on the page).
expected_overall: |
  An administrator account exists and is signed in. The system
  recognizes this person as the first user.
pass_criteria: |
  After completing all steps, you are signed in to the application
  with the account you just created.
why_this_matters: |
  This is the moment the company becomes a real tenant in the
  application. Anything that goes wrong here blocks all further setup.
est_minutes: 4
negative_variants:
  - id: P0-ADMIN-001-N1
    title: Reject obviously invalid email
    action: |
      In the email field, enter "not-an-email" and try to submit.
    expected: |
      The form blocks submission. A message in plain English explains
      that the email address is not valid. The message does not say
      anything like "regex match failed" or "validation error code 7."
    pass_criteria: |
      Submission was blocked AND the message was understandable to a
      non-technical person.
  - id: P0-ADMIN-001-N2
    title: Reject empty required fields
    action: |
      Leave one of the required fields empty and try to submit.
    expected: |
      The form blocks submission. The message identifies which field
      is missing, in plain language.
    pass_criteria: |
      Submission was blocked AND the missing field was clearly
      identified.
  - id: P0-ADMIN-001-N3
    title: Reject weak password (if password rules apply)
    action: |
      Try to submit with the password "password" or "12345."
    expected: |
      Either the form blocks submission with a clear explanation of
      what's wrong with the password, OR the application accepts it
      but warns that the password is weak. Both behaviors are
      acceptable; what is NOT acceptable is silently accepting "12345"
      with no comment.
    pass_criteria: |
      Either the password was rejected with explanation, or accepted
      with a visible warning. Silent acceptance fails this case.
```

---

## P0-ADMIN-002 — Confirm administrator can change every setting that follows

```yaml
id: P0-ADMIN-002
title: Verify the first admin has the access needed to continue setup
goal: |
  Make sure the first admin's account has the permissions required to
  perform the rest of Phase 0. A first admin who can sign in but
  can't reach company settings is a critical bug.
roles:
  - Administrator
preconditions:
  - You completed P0-ADMIN-001 and are signed in as the first admin.
prerequisite_cases:
  - P0-ADMIN-001
steps:
  - n: 1
    action: |
      Look around the application's main navigation. Try to find areas
      labeled like "Settings," "Setup," "Administration," "Company,"
      "Configuration," or similar.
    expected: |
      At least one such area is visible to you and you can open it.
  - n: 2
    action: |
      Open whatever administrative area you found. Look at what's
      there.
    expected: |
      The area contains options for company-level configuration:
      things like company name, locale, currency, fiscal year, user
      management, and so on. You may not understand every option yet,
      but you can see them and they are not greyed out or marked
      "permission denied."
expected_overall: |
  As the first admin, you can reach the configuration areas you'll
  need for the rest of Phase 0.
pass_criteria: |
  You can open an administrative settings area AND the options inside
  appear available to you (not blocked by permission errors).
why_this_matters: |
  Some applications bootstrap a first admin without granting them
  full administrative permissions, leaving them unable to invite
  other users or configure anything. That's an unacceptable bug at
  this point in setup.
est_minutes: 3
```

---

## P0-TENANT-001 — Set the company identity

```yaml
id: P0-TENANT-001
title: Enter the company name, address, and basic identity
goal: |
  Put the company's real name and address into the system so it can
  appear on documents like invoices, purchase orders, and packing
  slips later.
roles:
  - Administrator
preconditions:
  - You are signed in as the first admin.
  - No company-level settings have been entered.
prerequisite_cases:
  - P0-ADMIN-002
steps:
  - n: 1
    action: |
      Open the company settings area.
    expected: |
      A form or page appears with fields for company name, address,
      phone, and similar identity information.
  - n: 2
    action: |
      Fill in:
        Company name: Cascade Components, LLC
        Address: 1820 Industrial Way, Eugene, OR 97402, USA
        Phone: (541) 555-0142
        Website: cascade-components.example
        Federal tax ID (or equivalent): 88-1234567
      Save the form.
    expected: |
      A confirmation appears that the settings were saved. The values
      you entered are still visible if you reload or revisit the page.
  - n: 3
    action: |
      Sign out completely. Sign back in.
    expected: |
      After signing back in, the company identity values you entered
      are still saved. You did not have to re-enter them.
expected_overall: |
  The company's identity is recorded and persists across sessions.
pass_criteria: |
  Company name and address persist after signing out and back in.
why_this_matters: |
  Every document the system generates — invoices, POs, shipping
  paperwork — uses this information. If it's missing or wrong,
  every document is wrong.
est_minutes: 5
negative_variants:
  - id: P0-TENANT-001-N1
    title: Save with company name missing
    action: |
      Clear the company name field and try to save.
    expected: |
      The form blocks the save. A clear message says the company name
      is required.
    pass_criteria: |
      Save was blocked AND the message was clear.
```

---

## P0-TENANT-002 — Set primary language and locale

```yaml
id: P0-TENANT-002
title: Set the company's primary language and regional formats
goal: |
  Configure the language the system displays in and the formats used
  for dates, numbers, and currency.
roles:
  - Administrator
preconditions:
  - The company identity is saved (from P0-TENANT-001).
prerequisite_cases:
  - P0-TENANT-001
steps:
  - n: 1
    action: |
      In the company settings, find the language and regional
      settings. Note what's currently selected.
    expected: |
      You can see what language the application is currently set to
      (probably English) and what regional formats it's using.
  - n: 2
    action: |
      Change the language to Spanish (US) — labeled in the
      application's own language list, however that's expressed there.
      Save.
    expected: |
      The selection is accepted. After save, the application's text
      appears in Spanish — menu labels, button text, page headings.
  - n: 3
    action: |
      Look around. Open at least three different pages or areas.
    expected: |
      Every page you visit is in Spanish. There are no pockets of
      English text mixed in (other than data you typed, like the
      company name). If you find any English text in menus, buttons,
      or labels, note where.
  - n: 4
    action: |
      Return to settings. Switch the language back to English (US).
      Save.
    expected: |
      The application is now back in English everywhere.
expected_overall: |
  The application can be switched between English and Spanish and
  the change applies completely across all pages.
pass_criteria: |
  After switching to Spanish, no English text appeared in UI labels
  on the three pages you checked. After switching back, no Spanish
  remained.
why_this_matters: |
  A bilingual workforce relies on this working completely. Stray
  untranslated strings — even just one button — cause real
  confusion in production environments.
modality:
  - keyboard
  - touch
est_minutes: 6
notes: |
  This case is intentionally a representative i18n check. The
  dedicated i18n suite goes deeper. For this case, three pages worth
  of spot-checking is enough.
```

---

## P0-TENANT-003 — Set time zone

```yaml
id: P0-TENANT-003
title: Set the primary time zone
goal: |
  Make sure timestamps displayed in the application use the company's
  local time, not the server's time.
roles:
  - Administrator
preconditions:
  - Company identity is saved.
prerequisite_cases:
  - P0-TENANT-001
steps:
  - n: 1
    action: |
      In the company settings, find the time zone selector. Set it to
      "America/Los_Angeles" or "Pacific Time (US & Canada)" (whichever
      label the application uses for the same zone). Save.
    expected: |
      The setting is accepted and saved.
  - n: 2
    action: |
      Find any place in the application that displays a timestamp —
      for example, the "last saved" or "last signed in" time on your
      own admin profile.
    expected: |
      The displayed time matches what the wall clock would show in
      Pacific time, not UTC, not server time.
  - n: 3
    action: |
      Change the time zone to "America/New_York" (Eastern). Save.
      Reload the page where you saw the timestamp in step 2.
    expected: |
      The same timestamp now displays three hours later than it did
      in step 2.
  - n: 4
    action: |
      Set the time zone back to Pacific. Save.
    expected: |
      The timestamp returns to Pacific display.
expected_overall: |
  Displayed times respect the configured time zone. The same
  underlying moment displays differently when the time zone changes.
pass_criteria: |
  The displayed timestamp shifted by exactly the correct number of
  hours when the time zone was changed.
why_this_matters: |
  Time zone bugs are notorious. A scheduled production run that says
  "2:00 PM" needs to mean 2:00 PM in the user's local time, not
  some arbitrary server time. Getting this wrong silently is one of
  the most expensive bug classes in any business application.
est_minutes: 5
```

---

## P0-TENANT-004 — Set fiscal year and currency

```yaml
id: P0-TENANT-004
title: Configure fiscal year start and primary currency
goal: |
  Set the company's accounting calendar and the currency it operates
  in. This information shapes financial reports for the rest of the
  company's life in the system.
roles:
  - Administrator
preconditions:
  - Company identity is saved.
  - No financial transactions have been recorded.
prerequisite_cases:
  - P0-TENANT-001
steps:
  - n: 1
    action: |
      In the company settings, find the area for fiscal year and
      currency settings.
    expected: |
      You can see fields for fiscal year start (a month, or month and
      day) and primary currency.
  - n: 2
    action: |
      Set fiscal year start to January 1. Set primary currency to
      US Dollars (USD). Save.
    expected: |
      Settings save. A confirmation appears.
  - n: 3
    action: |
      Find any area of the application that displays monetary values
      — even if it's a placeholder showing $0.00 somewhere.
    expected: |
      Monetary values display with the dollar sign and US-style
      formatting (e.g. $1,234.56, not 1.234,56 € or 1234.56 USD).
expected_overall: |
  Fiscal year and currency are saved. Monetary displays use the
  configured currency's symbol and formatting.
pass_criteria: |
  Currency formatting throughout the application matches the saved
  setting (USD, with $ symbol and US thousands separator).
why_this_matters: |
  Changing primary currency after transactions exist requires
  complicated data migration. Setting it correctly at the start
  matters more than it seems.
est_minutes: 4
notes: |
  Per design, the costing model setting (also fiscal/financial) is
  set later in this phase. It deserves its own case because the
  consequences of changing it later are severe.
```

---

## P0-TENANT-005 — Choose the costing model

```yaml
id: P0-TENANT-005
title: Choose how the company values its inventory and production
goal: |
  Pick the method the system uses to put a dollar value on inventory
  and finished goods. This is a one-time choice that affects every
  financial number the company produces.
roles:
  - Administrator
preconditions:
  - Fiscal year and currency are saved.
  - No inventory or production transactions exist.
prerequisite_cases:
  - P0-TENANT-004
steps:
  - n: 1
    action: |
      In the company settings, find the area for costing or inventory
      valuation settings.
    expected: |
      You can see the available costing models (common names include
      "Standard Cost," "Average Cost," "FIFO," and "Actual Cost").
      Each option has at least a short explanation in plain English
      of what it means and when a company would pick it.
    notes: |
      If the options are listed but no explanation is provided, that
      is a bug. A controller picking this setting needs to understand
      what they're picking. "Just pick one" is not acceptable for a
      decision this consequential.
  - n: 2
    action: |
      Read the explanations. Pick "Standard Cost." Save.
    expected: |
      The setting saves. A confirmation appears that includes a clear
      warning, in plain language, that this setting is hard to change
      later. The warning is not buried in fine print.
  - n: 3
    action: |
      Try to change the setting to a different option (for example,
      "Average Cost"). Attempt to save.
    expected: |
      The application either:
      (a) blocks the change with a clear explanation that the costing
          model can't be changed without a special data migration
          process, or
      (b) accepts the change but only after a strong warning that
          asks for explicit confirmation.

      What is NOT acceptable: silently changing the costing model
      with no warning.
  - n: 4
    action: |
      Cancel any change you may have just made. Confirm Standard Cost
      is still the saved setting.
    expected: |
      Standard Cost is the active setting.
expected_overall: |
  A costing model is chosen, saved, and the system protects this
  setting from being casually changed.
pass_criteria: |
  Standard Cost is saved AND attempting to change it produced either
  a block or a strong warning.
why_this_matters: |
  Every inventory transaction from this point forward gets valued
  according to this model. Quietly changing it later means every
  historical number has a different meaning before and after the
  change. This setting deserves protection.
est_minutes: 6
```

---

## P0-INTEG-001 — Decide on accounting integration mode

```yaml
id: P0-INTEG-001
title: Choose whether to connect to QuickBooks or use manual accounting
goal: |
  Decide how the system will record financial transactions: by
  pushing them automatically to a connected accounting system like
  QuickBooks, or by tracking them inside this application alone.
roles:
  - Administrator
preconditions:
  - Costing model is saved.
prerequisite_cases:
  - P0-TENANT-005
branches:
  - id: accounting-mode
    prompt: |
      How will this company handle accounting?
    options:
      - id: quickbooks
        label: Connect to QuickBooks
      - id: manual
        label: Manual entry inside this application
      - id: skip
        label: Skip for now (use a mock for testing)
steps:
  - n: 1
    action: |
      In the settings area, find the section for accounting or
      financial integrations.
    expected: |
      You see options for connecting to an external accounting
      system (such as QuickBooks) AND an option for handling
      accounting inside this application without an external
      connection. Both options are clearly labeled. The trade-offs
      between them are explained in plain English (not "ETL pipeline"
      or "OAuth handshake required").
  - n: 2
    branch_id: quickbooks
    action: |
      Select the QuickBooks option. Follow the steps the application
      gives you to connect.
    expected: |
      The application explains what's about to happen before it
      happens — for example, "you'll be sent to QuickBooks to sign
      in." After connecting, a clear confirmation shows that the
      connection is active and which QuickBooks company is connected.
  - n: 3
    branch_id: manual
    action: |
      Select the manual option. Save.
    expected: |
      The setting saves. A confirmation explains what this means in
      practice — for example, "financial transactions will be tracked
      inside this application; you will export reports to share with
      your accountant."
  - n: 4
    branch_id: skip
    action: |
      Select the option to use a mock or test mode for accounting.
      Save.
    expected: |
      The application accepts this and clearly indicates it is in a
      test mode for accounting (so the tester knows real financial
      data isn't being pushed anywhere).
expected_overall: |
  Whichever option was chosen, the application clearly communicates
  what that choice means and reflects the chosen mode in the
  settings.
pass_criteria: |
  After saving, the chosen accounting mode is visible in settings AND
  the application explained, in plain English, what was being chosen.
why_this_matters: |
  This is the case where Gemini's previous draft used jargon like
  "API handshake" and "ETL." That language is exactly what loses a
  non-technical controller during onboarding. The application is on
  the hook to explain this in normal words.
est_minutes: 8
notes: |
  If the chosen option requires entering credentials or account
  numbers, do NOT enter real ones. The runner allows you to mark this
  case as "would have done" and move on if you're testing the flow
  without real connections.
negative_variants:
  - id: P0-INTEG-001-N1
    title: Show meaningful error if QuickBooks connection fails
    action: |
      If you chose QuickBooks: deliberately interrupt the connection
      (for example, close the popup window mid-sign-in, or enter
      wrong credentials).
    expected: |
      The application explains in plain English what went wrong and
      what to do next. It does NOT show a stack trace, raw error
      code, or message like "OAuth callback failed: error 500."
    pass_criteria: |
      Failure was communicated in language a non-technical user would
      understand AND offered a way to try again.
```

---

## P0-INTEG-002 — Decide on shipping carrier integrations

```yaml
id: P0-INTEG-002
title: Choose which shipping carriers to connect
goal: |
  Decide which package carriers (UPS, FedEx, USPS, freight providers)
  the system will connect to for live rates and label printing — or
  configure for manual tracking entry.
roles:
  - Administrator
preconditions:
  - Costing model is saved.
prerequisite_cases:
  - P0-TENANT-005
steps:
  - n: 1
    action: |
      In settings, find the shipping carrier integrations area.
    expected: |
      A list of supported carriers is visible. Each carrier shows
      whether it is currently connected. There is also an option for
      "manual entry" — meaning the company will type tracking numbers
      in by hand rather than getting them from a carrier connection.
  - n: 2
    action: |
      Choose at least one carrier OR choose manual entry. If
      connecting a carrier requires credentials you don't have, choose
      manual entry for testing purposes.
    expected: |
      The choice saves. The settings page reflects which carriers (or
      manual mode) is active.
expected_overall: |
  At least one shipping option is configured. The system knows how it
  will handle outbound shipments later in the workflow.
pass_criteria: |
  Shipping configuration is saved and visible in settings.
est_minutes: 5
notes: |
  Real carrier connections are not required for testing. A tester
  who chose "manual entry" here can later test that shipping cases
  work even without a connected carrier — that is itself an
  important capability.
```

---

## P0-INTEG-003 — Decide on tax calculation

```yaml
id: P0-INTEG-003
title: Choose how sales tax will be calculated
goal: |
  Set up the way the system figures sales tax on customer invoices.
  This can be a connected service that calculates tax automatically,
  or manually entered tax rates the company maintains itself.
roles:
  - Administrator
preconditions:
  - Company identity is saved.
prerequisite_cases:
  - P0-TENANT-001
steps:
  - n: 1
    action: |
      In settings, find the tax calculation area.
    expected: |
      Options are visible: at minimum, a way to manually enter tax
      rates (by jurisdiction or as a flat rate), and ideally an
      option to connect to an automatic tax service.
  - n: 2
    action: |
      Choose manual tax rates. Add a single rate:
        Jurisdiction: Oregon
        Rate: 0%
        Effective date: today
      Save.
    expected: |
      The rate saves. The settings show one tax rate is now configured.
    notes: |
      Oregon doesn't have a state sales tax, so 0% is realistic for
      this fictional company. Picking a real-world rate makes the
      test data feel right.
expected_overall: |
  At least one tax rule is in place so future invoices have something
  to apply.
pass_criteria: |
  A tax configuration is saved and visible.
est_minutes: 4
```

---

## P0-USER-001 — Define the role taxonomy the company will use

```yaml
id: P0-USER-001
title: Set up the roles that will exist in this company
goal: |
  Define the named roles (titles like "Production Manager,"
  "Floor Operator," "Bookkeeper") that will be assigned to users
  later. A small shop may have only two or three; a large
  organization may have a dozen or more.
roles:
  - Administrator
preconditions:
  - Admin account is signed in.
  - No additional users have been created yet.
prerequisite_cases:
  - P0-ADMIN-002
steps:
  - n: 1
    action: |
      In settings, find the area for roles or permissions.
    expected: |
      A roles area is available. There may already be some default
      roles (like "Administrator"). You can see a way to create new
      roles.
  - n: 2
    action: |
      Create the following roles. For each, give it a name and a
      short description. Don't worry about specific permissions yet
      — that's the next case.
        - Production Manager
        - Floor Operator
        - Warehouse Associate
        - Bookkeeper
        - Sales Representative
    expected: |
      Each role saves successfully. The roles list now includes these
      five roles plus the default Administrator.
  - n: 3
    action: |
      Try to delete one of the roles you just created (any one).
    expected: |
      The application allows deletion of an unused role, or warns
      that the role is referenced elsewhere (it shouldn't be — no
      users have been assigned yet). What is NOT acceptable: silent
      failure to delete with no message.
  - n: 4
    action: |
      If you deleted the role, recreate it.
    expected: |
      The role can be recreated with the same name without issue.
expected_overall: |
  Five custom roles plus the default administrator role exist in
  the system.
pass_criteria: |
  All five roles are visible in the roles list AND the role
  creation/deletion behavior was clear and reversible.
why_this_matters: |
  The role taxonomy a company sets up here determines who can do
  what for the rest of the company's life in the system. Getting
  it adjustable from the start means small shops can collapse roles
  and large shops can expand them.
est_minutes: 8
notes: |
  Different test fixtures may swap this list. A small-shop fixture
  might have only "Owner" and "Worker." An enterprise fixture might
  have fifteen named roles. The principle being tested is: can the
  company define whatever roles it needs without friction?
```

---

## P0-USER-002 — Assign permissions to a role

```yaml
id: P0-USER-002
title: Configure what one role can and cannot do
goal: |
  Take one of the roles you defined and assign it a meaningful set
  of permissions. Verify that the permission system uses plain
  language a non-technical person can understand.
roles:
  - Administrator
preconditions:
  - Roles are defined (from P0-USER-001).
prerequisite_cases:
  - P0-USER-001
steps:
  - n: 1
    action: |
      Open the "Floor Operator" role for editing.
    expected: |
      A page or panel shows the permissions assigned to this role.
      Permissions are organized in a way that's understandable —
      grouped by area of work (e.g., "Production," "Inventory") and
      labeled in plain English (e.g., "Start a work order," "Report
      time on a job") rather than technical terms (e.g.,
      "WORKORDER_TRANSITION_TO_ACTIVE").
  - n: 2
    action: |
      Grant this role permissions appropriate for a floor operator:
      things like starting and completing work orders, reporting
      labor time, and consuming materials. Deny permissions that
      shouldn't apply: things like creating customers, approving
      purchase orders, or changing pricing. Save.
    expected: |
      The save succeeds. The permissions you set are reflected when
      you reopen the role.
  - n: 3
    action: |
      Look for a feature that summarizes "what can someone with this
      role actually do?" in plain language.
    expected: |
      Such a summary exists. Reading it tells you what a Floor
      Operator can accomplish without you having to interpret
      individual permission flags.
    notes: |
      If no such summary exists, that's a usability gap worth noting.
      Permission systems that only show flags-and-checkboxes are
      famously unusable for non-technical admins.
expected_overall: |
  The Floor Operator role now has a defined set of permissions in
  plain language.
pass_criteria: |
  Permissions are saved AND the permission labels are
  understandable to a non-technical person.
est_minutes: 10
```

---

## P0-USER-003 — Invite a second user

```yaml
id: P0-USER-003
title: Invite a second user and assign them a role
goal: |
  Verify that the first admin can create a second user, assign them
  a role, and that the new user can sign in successfully.
roles:
  - Administrator
preconditions:
  - Roles are defined and at least one (Floor Operator) has
    permissions configured.
prerequisite_cases:
  - P0-USER-002
steps:
  - n: 1
    action: |
      In the user management area, start the process to add a new
      user.
    expected: |
      A form appears asking for the new user's information.
  - n: 2
    action: |
      Fill in:
        Name: Sam Rivera
        Email: sam.rivera@cascade-components.example
        Role: Floor Operator
      Submit.
    expected: |
      The user is created. The application clearly indicates how the
      new user will get their access — either an invitation email is
      sent, a one-time setup link is shown, or a temporary password
      is displayed for the admin to share. Whichever method, it's
      clear what happens next.
  - n: 3
    action: |
      Sign out as Alex Morgan. Using whatever method the application
      provided in step 2 (invitation link, temporary credentials,
      etc.), sign in as Sam Rivera and complete any required first-
      time setup (like setting a password).
    expected: |
      Sam Rivera can successfully sign in. The application recognizes
      them as a Floor Operator.
  - n: 4
    action: |
      As Sam Rivera, look around the application.
    expected: |
      Sam sees only what a Floor Operator should see. They cannot
      reach areas they shouldn't have access to (like company
      settings or user management). When they try, the application
      either hides those areas entirely or explains, in plain
      English, that they don't have access.
  - n: 5
    action: |
      Sign out. Sign back in as Alex Morgan.
    expected: |
      You're back in as the admin. Sam Rivera's user record is
      still visible in the user list with their assigned role.
expected_overall: |
  A second user exists, can sign in, and is correctly limited to
  what a Floor Operator should be able to do.
pass_criteria: |
  Sam Rivera signed in successfully AND was correctly limited to
  Floor Operator capabilities.
why_this_matters: |
  This is the first real test of the permission system. If the
  newly created user can do things they shouldn't, or can't do
  things they should, the role configuration is broken.
est_minutes: 10
negative_variants:
  - id: P0-USER-003-N1
    title: Reject duplicate email
    action: |
      As Alex Morgan, try to create another user with the same
      email address as Sam Rivera.
    expected: |
      The application blocks this with a clear message that the
      email is already in use.
    pass_criteria: |
      Creation was blocked AND the message was clear.
```

---

## P0-INFRA-001 — Verify backups or data persistence

```yaml
id: P0-INFRA-001
title: Confirm that configured data survives a real restart
goal: |
  Make sure the configuration work done so far is genuinely saved,
  not just held in memory or a session. This is a sanity check
  before the company starts entering valuable data.
roles:
  - Administrator
preconditions:
  - All previous Phase 0 cases are completed.
prerequisite_cases:
  - P0-USER-003
steps:
  - n: 1
    action: |
      Make a list (on paper or in another document) of:
        - The company name
        - The fiscal year start
        - The costing model
        - The five role names you created
        - The one user you invited
    expected: |
      You have a written reference for what should be present after
      the test.
  - n: 2
    action: |
      If possible, restart the application's server or service. If
      the application is hosted and you can't restart it, instead
      sign out, clear your browser data for this site (cookies and
      local storage), and sign back in.
    expected: |
      You're back at a fresh sign-in screen, with no session
      remembered.
  - n: 3
    action: |
      Sign in as Alex Morgan. Go through the company settings and
      compare what you see to your written list from step 1.
    expected: |
      Every value matches. Nothing was lost. No data appears scrambled
      or partial.
  - n: 4
    action: |
      Open the user list. Confirm Sam Rivera is still there with the
      Floor Operator role.
    expected: |
      Sam Rivera is in the user list with the correct role.
expected_overall: |
  All Phase 0 configuration survives a service restart and/or
  browser data clear.
pass_criteria: |
  Every item on your written list was present and correct after the
  restart.
why_this_matters: |
  Data loss after restart is a category of bug that destroys trust
  in the application instantly. Catching it now, before any business
  data has been entered, prevents a much worse loss later.
est_minutes: 8
```

---

## End of Phase 0

By the end of Phase 0, the application has:

- A working administrator account
- The company's identity, locale, time zone, fiscal year, currency, and costing model
- An accounting integration mode chosen
- A shipping configuration (live or manual)
- A tax configuration
- A role taxonomy with at least one role's permissions configured
- A second user successfully created and signed in
- Verified data persistence

Phase 1 picks up by creating the foundational records — locations, work centers, units of measure, GL accounts, employee records — that master data and transactions will reference.
