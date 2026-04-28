# Phase 2 — Master Data

This phase populates the records that transactions will reference: vendors, customers, parts, bills of materials, routings, and pricing. By the end of Phase 2, the system has enough master data to support actual purchase orders and sales orders in Phase 3 and 4.

## Scope

- **Vendors** — suppliers the business buys from.
- **Customers** — accounts the business sells to.
- **Parts** — every distinct item that's purchased, made, or sold (raw materials, work-in-progress, finished goods).
- **Bills of materials** — what goes into making each manufactured part.
- **Routings** — how each part is made, in what sequence, at which work centers.
- **Pricing** — list prices, customer-specific pricing, vendor cost terms.
- **R&D / engineering changes** — prototypes, revisions, release-to-production.

## Roles introduced or used heavily

- `Procurement` — vendors, vendor pricing, vendor terms.
- `Sales / Account Manager` — customers, customer pricing, credit limits.
- `Engineer / R&D` — parts, BOMs, routings, revisions.
- `Production Manager` — routing review, work-center assignment.
- `Controller` — pricing approval, credit limit approval.

---

## P2-VENDOR-001 — Create the first vendor

```yaml
id: P2-VENDOR-001
title: Create the first vendor record
phase: P2
goal: |
  Add the first supplier so purchase orders can later be issued
  against them.
roles:
  - Procurement
  - Administrator
flows:
  - vendor-to-asset
  - part-to-inventory
capabilities:
  - CAP-MD-VENDORS
preconditions:
  - |
    Foundational records exist: at least one location, work center, standard UoMs, the chart of accounts, at least one tax code, employees, calendar, and asset records. (Phase 1 outcomes.)
  - You are signed in as a user with permission to manage vendors.
steps:
  - n: 1
    action: |
      Find and open the vendors area. (Common labels: "Vendors,"
      "Suppliers," "Payees.")
    expected: |
      The vendors list appears, empty by default.
  - n: 2
    action: |
      Choose to create a new vendor. Enter:
      - Name: "Pacific Steel Supply"
      - Address: a plausible address in the US
      - Primary contact name and email
      - Payment terms: Net 30
      - Default expense / inventory GL account
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Open the vendor record you just created.
    expected: |
      All entered values are visible. The vendor has a stable ID
      visible in the URL or on the record.
expected_overall: |
  The first vendor exists and is selectable on POs and other
  vendor-referencing records.
pass_criteria: |
  Vendor exists AND has a unique ID AND saved values match what was entered.
est_minutes: 6
negative_variants:
  - id: P2-VENDOR-001-N1
    title: Reject vendor without required address fields
    action: |
      Try to save a vendor with name only (no address, no contact).
    expected: |
      Save is blocked with a list of missing required fields in plain
      language.
    pass_criteria: |
      Save blocked AND missing fields are named.
  - id: P2-VENDOR-001-N2
    title: Reject invalid email on contact
    action: |
      Enter "not-an-email" in the contact email field. Try to save.
    expected: |
      Save is blocked or warns with a clear "valid email required"
      message.
    pass_criteria: |
      Save blocked or warned AND error message is plain.
```

---

## P2-VENDOR-002 — Add multiple vendor contacts

```yaml
id: P2-VENDOR-002
title: Add multiple contacts to a vendor
phase: P2
goal: |
  Verify a vendor record supports more than one contact (a sales rep,
  an AP contact, a technical contact) — common for any non-trivial
  supplier relationship.
roles:
  - Procurement
flows:
  - vendor-to-asset
capabilities:
  - CAP-MD-VENDORS
preconditions:
  - The first vendor record exists with name, address, primary contact, payment terms, and default expense / inventory GL account. (Established by P2-VENDOR-001.)
steps:
  - n: 1
    action: |
      Open the Pacific Steel Supply vendor record. Find the contacts
      section.
    expected: |
      A way to view and add contacts is visible.
  - n: 2
    action: |
      Add a second contact:
      - Name, email, phone
      - Role / type: "Accounts Receivable" or similar
    expected: |
      The second contact saves and appears alongside the primary.
  - n: 3
    action: |
      Mark the original contact as the default for purchasing
      communications and the AR contact as the default for invoicing.
    expected: |
      Each contact's role is recorded. Future emails can be routed
      to the right person.
expected_overall: |
  The vendor has multiple contacts with distinct roles, each
  addressable separately for different kinds of communication.
pass_criteria: |
  Two or more contacts exist AND each has a distinct role AND the
  defaults can be set per-purpose.
est_minutes: 4
negative_variants:
  - id: P2-VENDOR-002-N1
    title: Cannot demote the only default contact for a purpose
    action: |
      Remove the "AR contact" flag from the only contact carrying
      it, leaving no AR default.
    expected: |
      The change is blocked or warns; an explicit reassignment is
      required to leave a vendor without an AR contact.
    pass_criteria: |
      Vendor never silently ends up with no default for a required
      contact role.
  - id: P2-VENDOR-002-N2
    title: Reject duplicate contact email on same vendor
    action: |
      Add a second contact with the same email as an existing one.
    expected: |
      Save is blocked or warns; duplicate emails are surfaced before
      they confuse routing.
    pass_criteria: |
      Duplicate contact email refused or flagged.
```

---

## P2-VENDOR-003 — Configure vendor payment terms

```yaml
id: P2-VENDOR-003
title: Set per-vendor payment terms and currency
phase: P2
goal: |
  Confirm payment terms (Net 30, 2/10 Net 30, etc.) and currency are
  configurable per vendor and override company defaults.
roles:
  - Procurement
  - Controller
flows:
  - vendor-to-asset
capabilities:
  - CAP-MD-VENDORS
  - CAP-MD-CURRENCIES
preconditions:
  - The first vendor record exists with name, address, primary contact, payment terms, and default expense / inventory GL account. (Established by P2-VENDOR-001.)
steps:
  - n: 1
    action: |
      Open the Pacific Steel Supply vendor. Find payment terms and
      currency.
    expected: |
      Both fields are present and editable.
  - n: 2
    action: |
      Change terms to "2/10 Net 30" (2% discount if paid within 10
      days, full payment due in 30).
    expected: |
      Terms accept the format and save.
  - n: 3
    action: |
      Create a second vendor "Tokyo Bearings Co." with currency JPY
      and terms Net 60.
    expected: |
      The vendor saves with non-USD currency. POs against this vendor
      will be in JPY by default.
expected_overall: |
  Payment terms and currency are per-vendor, not a single
  company-wide value.
pass_criteria: |
  Each vendor has independent terms AND currency AND the values
  drive defaults on subsequent POs.
why_this_matters: |
  Real businesses have different terms with different vendors and
  often deal with multi-currency. ERPs that hard-code a single
  currency or single terms break this from day one.
est_minutes: 6
negative_variants:
  - id: P2-VENDOR-003-N1
    title: Reject malformed payment terms
    action: |
      Try to enter terms in an unparseable format ("pay whenever",
      "Net negative-30").
    expected: |
      Save is blocked with a clear error explaining the expected
      format options.
    pass_criteria: |
      Bad terms refused AND format guidance is given.
  - id: P2-VENDOR-003-N2
    title: Cannot change vendor currency once a PO exists
    action: |
      After at least one PO references this vendor (in a later
      phase), return and try to change the vendor's currency.
    expected: |
      The change is blocked or requires explicit migration of open
      transactions. Silent currency change must not affect existing
      records.
    pass_criteria: |
      Currency change post-transactions is gated.
  - id: P2-VENDOR-003-N3
    title: Reject discount percent above 100
    action: |
      Try to save terms "150/10 Net 30" (150% discount).
    expected: |
      Save is blocked with a clear out-of-range error.
    pass_criteria: |
      Discount above 100% refused.
```

---

## P2-VENDOR-004 — Vendor 1099/W-9 tracking

```yaml
id: P2-VENDOR-004
title: Track 1099 / W-9 status on vendors (US)
phase: P2
goal: |
  Confirm the system tracks tax-form status (W-9 received, 1099-eligible)
  per vendor so year-end 1099 reporting is possible.
roles:
  - Procurement
  - Controller
flows:
  - vendor-to-asset
scale_tags:
  - small-shop
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-VENDORS
preconditions:
  - The first vendor record exists with name, address, primary contact, payment terms, and default expense / inventory GL account. (Established by P2-VENDOR-001.)
steps:
  - n: 1
    action: |
      Open a vendor record. Find tax-form fields.
    expected: |
      A way to record W-9 status, EIN/SSN, and 1099 eligibility
      is present.
  - n: 2
    action: |
      For Pacific Steel Supply, mark W-9 received with today's date
      and EIN visible. Set 1099-eligible: No (corporation).
    expected: |
      Values save.
  - n: 3
    action: |
      Create a third vendor "Jane Doe Welding" (sole proprietor),
      mark W-9 received, 1099-eligible: Yes.
    expected: |
      Vendor saves. The 1099-eligible flag is visible on a vendor list
      filter or report.
expected_overall: |
  Each vendor's tax-form status and 1099 eligibility are tracked.
pass_criteria: |
  Both vendors have W-9 dates AND eligibility flags AND can be
  filtered by 1099 status.
est_minutes: 5
notes: |
  This case is US-specific. International deployments may track
  equivalent per-jurisdiction info (W-8BEN for foreign vendors,
  GST/VAT registration, etc.).
negative_variants:
  - id: P2-VENDOR-004-N1
    title: Reject malformed EIN
    action: |
      Enter an EIN with the wrong digit count (e.g., "12-345" or
      "1234567890").
    expected: |
      Save is blocked with a clear "EIN must be 9 digits" message.
    pass_criteria: |
      Malformed EIN refused.
  - id: P2-VENDOR-004-N2
    title: 1099-eligible vendor cannot save without TIN
    action: |
      Mark a vendor 1099-eligible but leave the EIN/SSN blank. Save.
    expected: |
      Save is blocked or warns that 1099 reporting requires a TIN
      on file.
    pass_criteria: |
      1099-eligible without TIN is refused or surfaces an explicit
      warning.
```

---

## P2-VENDOR-005 — Deactivate a vendor

```yaml
id: P2-VENDOR-005
title: Deactivate a vendor without deleting historical activity
phase: P2
goal: |
  Verify vendors can be deactivated to prevent new POs while
  preserving historical transactions.
roles:
  - Procurement
flows:
  - vendor-to-asset
capabilities:
  - CAP-MD-VENDORS
preconditions:
  - At least two vendors exist.
steps:
  - n: 1
    action: |
      Open a vendor. Use the deactivate or disable action.
    expected: |
      Confirmation dialog appears. Confirm.
  - n: 2
    action: |
      Try to create a new PO and select the deactivated vendor.
    expected: |
      The deactivated vendor either does not appear in the dropdown
      OR appears with a clear "Inactive" indicator and the system
      blocks selecting them.
  - n: 3
    action: |
      Open the historical activity for the deactivated vendor.
    expected: |
      Past POs, payments, and other records are intact.
expected_overall: |
  Deactivated vendors are unusable for new transactions but their
  history remains.
pass_criteria: |
  New POs blocked AND historical records preserved.
est_minutes: 4
negative_variants:
  - id: P2-VENDOR-005-N1
    title: Cannot deactivate vendor with open POs
    action: |
      Once an open PO exists for the vendor, try to deactivate them.
    expected: |
      Deactivation is blocked or warns, naming the open POs that
      must be closed or reassigned first.
    pass_criteria: |
      Deactivation gated by open transactions.
  - id: P2-VENDOR-005-N2
    title: Reactivation restores selectability
    action: |
      Reactivate the deactivated vendor. Try to create a new PO.
    expected: |
      Vendor is selectable again. No phantom "deactivated" flag
      remains on the record.
    pass_criteria: |
      Reactivation is clean and complete.
```

---

## P2-CUST-001 — Create the first customer

```yaml
id: P2-CUST-001
title: Create the first customer record
phase: P2
goal: |
  Add the first customer so sales orders, quotes, and invoices can
  reference them.
roles:
  - Sales / Account Manager
  - Administrator
flows:
  - lead-to-customer
  - quote-to-cash
capabilities:
  - CAP-MD-CUSTOMERS
preconditions:
  - |
    Foundational records exist: at least one location, one work center, standard units of measure, the chart of accounts, at least one tax code, the first employee, a default calendar, and at least one fixed asset. (Phase 1 outcomes.)
  - Tax codes from P1-TAX-001 exist.
steps:
  - n: 1
    action: |
      Find and open the customers area. Choose to create a new
      customer.
    expected: |
      The customer creation form appears.
  - n: 2
    action: |
      Enter:
      - Name: "ACME Industrial"
      - Billing address and shipping address (can be the same)
      - Primary contact and email
      - Default tax code
      - Payment terms: Net 30
      - Credit limit: $50,000
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Open the new customer record.
    expected: |
      All entered values are visible. The customer has a stable ID.
expected_overall: |
  The first customer exists and is selectable on quotes and sales
  orders.
pass_criteria: |
  Customer exists AND saved values match AND credit limit is set.
est_minutes: 5
negative_variants:
  - id: P2-CUST-001-N1
    title: Reject negative credit limit
    action: |
      Try to save a customer with credit limit = -$5,000.
    expected: |
      Submission is blocked with a clear error.
    pass_criteria: |
      Negative credit limit rejected.
  - id: P2-CUST-001-N2
    title: Reject duplicate customer name without confirmation
    action: |
      Try to create a second customer with the same name as the first.
    expected: |
      Either the application blocks (if names are unique by rule), or
      surfaces a duplicate-detection warning that lists the existing
      match and requires explicit confirmation. Silent creation of a
      duplicate is the failure mode.
    pass_criteria: |
      No silent duplicate AND user gets a chance to merge or cancel.
```

---

## P2-CUST-002 — Customer with separate ship-to addresses

```yaml
id: P2-CUST-002
title: Configure a customer with multiple ship-to addresses
phase: P2
goal: |
  Verify a single customer record can carry multiple ship-to
  addresses (warehouses, branch offices) selectable per order.
roles:
  - Sales / Account Manager
flows:
  - lead-to-customer
  - quote-to-cash
capabilities:
  - CAP-MD-CUSTOMERS
preconditions:
  - The first customer record exists with billing and shipping addresses, primary contact, default tax code, payment terms, and a $50,000 credit limit. (Established by P2-CUST-001.)
steps:
  - n: 1
    action: |
      Open the ACME Industrial customer record. Find the addresses
      section.
    expected: |
      A way to add additional addresses is visible.
  - n: 2
    action: |
      Add two more ship-to addresses:
      - "ACME Industrial - East Plant" with a different state
      - "ACME Industrial - West DC" with a different state
    expected: |
      Both addresses save.
  - n: 3
    action: |
      Mark one as the default ship-to.
    expected: |
      The default flag is recorded; future orders default to this
      address but can be changed per order.
expected_overall: |
  Customer carries one billing address and three ship-to addresses,
  one marked as default.
pass_criteria: |
  Multiple addresses exist AND default is selectable.
est_minutes: 4
negative_variants:
  - id: P2-CUST-002-N1
    title: Reject ship-to address with missing required fields
    action: |
      Try to add a ship-to address with no street or postal code.
    expected: |
      Save is blocked with a per-field error listing the missing
      required parts.
    pass_criteria: |
      Missing required address fields are individually identified.
  - id: P2-CUST-002-N2
    title: Cannot delete a ship-to referenced by an open order
    action: |
      Once an open sales order ships to a given address, try to
      delete that address.
    expected: |
      Deletion is blocked or warns, naming the order that depends
      on the address.
    pass_criteria: |
      Address deletion gated by open references.
```

---

## P2-CUST-003 — Credit limit and approval workflow

```yaml
id: P2-CUST-003
title: Set a credit limit and verify enforcement
phase: P2
goal: |
  Confirm that credit limits configured on customers actually block
  (or warn on) sales orders that would exceed them, and that there's
  a controller-override path.
roles:
  - Sales / Account Manager
  - Controller
flows:
  - lead-to-customer
  - quote-to-cash
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-O2C-SO
preconditions:
  - The first customer record exists with billing and shipping addresses, primary contact, default tax code, payment terms, and a $50,000 credit limit. (Established by P2-CUST-001.)
steps:
  - n: 1
    action: |
      Open ACME Industrial. Note the $50,000 credit limit. Open or
      create a sales-order draft for this customer worth $20,000.
    expected: |
      The order saves without warning. Credit utilization shows
      $20,000 of $50,000 used (or similar).
  - n: 2
    action: |
      Create a second draft order for $40,000 (would exceed the
      limit when combined with the first).
    expected: |
      The system warns the user that credit limit will be exceeded.
      Either: (a) blocks submission, OR (b) routes for credit
      manager approval, OR (c) allows with a visible flag for
      controller review.
  - n: 3
    action: |
      As a Controller user (or with override permission), approve
      the over-limit order.
    expected: |
      Override is recorded with the user, timestamp, and reason.
      Order proceeds.
expected_overall: |
  Credit limits are enforced (warned, blocked, or flagged) and
  controller override is recorded with an audit trail.
pass_criteria: |
  Over-limit was flagged AND override required action AND override
  is auditable.
why_this_matters: |
  ERPs that hard-block credit limits with no override mechanism are
  unusable in real businesses where exceptions are routine. ERPs
  with no enforcement at all expose the business to bad debt.
  Both extremes are bugs.
est_minutes: 8
negative_variants:
  - id: P2-CUST-003-N1
    title: Sales rep cannot self-approve own over-limit order
    action: |
      As the same Sales / Account Manager who created the over-limit
      order, attempt to apply the controller override.
    expected: |
      The override is unavailable to the same user who created the
      order. A Controller (or other authorized user) must apply it.
    pass_criteria: |
      Self-approval of own over-limit orders is refused.
  - id: P2-CUST-003-N2
    title: Override requires a documented reason
    action: |
      As the Controller, attempt to override without entering a
      reason in the comments / justification field.
    expected: |
      Save is blocked or warns; the override requires a recorded
      justification for audit.
    pass_criteria: |
      Override without reason is refused.
```

---

## P2-CUST-004 — International customer with foreign currency

```yaml
id: P2-CUST-004
title: Create an international customer with foreign currency
phase: P2
goal: |
  Verify the system handles a non-USD customer correctly: invoices
  and statements in their currency, FX gain/loss accounting on payment.
roles:
  - Sales / Account Manager
  - Controller
flows:
  - lead-to-customer
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-MD-CURRENCIES
preconditions:
  - The first customer record exists with billing and shipping addresses, primary contact, default tax code, payment terms, and a $50,000 credit limit. (Established by P2-CUST-001.)
  - Multi-currency is enabled in tenant settings (P0).
steps:
  - n: 1
    action: |
      Create a customer "Munich Manufacturing GmbH" with:
      - Address in Germany
      - Currency: EUR
      - VAT ID
      - Tax code: appropriate for EU export
    expected: |
      Customer saves.
  - n: 2
    action: |
      On a draft sales order for this customer, verify amounts are in EUR.
    expected: |
      Pricing displays in EUR. Order total is in EUR.
expected_overall: |
  Non-USD customer is fully supported, with correct currency
  defaults on derived records.
pass_criteria: |
  Customer carries EUR currency AND derived order amounts respect it.
est_minutes: 5
negative_variants:
  - id: P2-CUST-004-N1
    title: Reject malformed VAT ID
    action: |
      Enter a VAT ID that does not match the country's published
      format (e.g., a German VAT ID without the "DE" prefix).
    expected: |
      Save is blocked or warns; the VAT ID format is validated per
      country.
    pass_criteria: |
      Malformed VAT ID is refused or flagged with country-specific
      guidance.
  - id: P2-CUST-004-N2
    title: Cannot mix currencies on a single sales order
    action: |
      On a draft sales order for the EUR customer, try to add a line
      priced in USD.
    expected: |
      The application either converts to the order currency at the
      configured rate or blocks the mix with a clear error.
    pass_criteria: |
      Currency consistency is enforced on the order.
```

---

## P2-PART-001 — Create a raw material part

```yaml
id: P2-PART-001
title: Create a raw material part
phase: P2
goal: |
  Add the first raw-material part to inventory. Will be referenced
  by BOMs and POs.
roles:
  - Engineer / R&D
  - Procurement
flows:
  - part-to-inventory
capabilities:
  - CAP-MD-PARTS
preconditions:
  - At least one unit of measure exists (P1-UOM-001).
  - Default inventory GL account exists (P1-GL-001).
steps:
  - n: 1
    action: |
      Find and open the parts / items area. Choose to create a new
      part.
    expected: |
      The part creation form appears.
  - n: 2
    action: |
      Enter:
      - Part number: "RM-STEEL-1018-3X3"
      - Description: "Cold-rolled steel bar, 1018, 3in x 3in x 12ft"
      - Type: Raw material
      - Unit of measure: foot
      - Default vendor: Pacific Steel Supply
      - Inventory GL account: from P1-GL-001
    expected: |
      The form accepts the values and saves.
  - n: 3
    action: |
      Open the part. Verify all values are visible.
    expected: |
      Part exists with stable ID. Type, UoM, and default vendor are
      visible.
expected_overall: |
  Raw material part exists, ready to be referenced on BOMs and POs.
pass_criteria: |
  Part record exists AND default vendor links correctly AND UoM
  is what was entered.
est_minutes: 5
negative_variants:
  - id: P2-PART-001-N1
    title: Reject duplicate part number
    action: |
      Try to create a second part with part number
      "RM-STEEL-1018-3X3".
    expected: |
      Save is blocked with a clear "part number already exists"
      message identifying the existing record.
    pass_criteria: |
      Duplicate part number refused.
  - id: P2-PART-001-N2
    title: Reject part with no unit of measure
    action: |
      Try to save a part with the UoM field cleared.
    expected: |
      Save is blocked with a clear "unit of measure is required"
      error.
    pass_criteria: |
      Save refused without UoM.
  - id: P2-PART-001-N3
    title: Reject part pointing at deactivated vendor
    action: |
      Deactivate Pacific Steel Supply, then try to save a new part
      using it as the default vendor.
    expected: |
      The vendor is filtered out of the dropdown OR the save is
      blocked with a clear "vendor is inactive" message.
    pass_criteria: |
      No part references an inactive vendor as its default.
```

---

## P2-PART-002 — Create a finished-goods part

```yaml
id: P2-PART-002
title: Create a finished-goods part
phase: P2
goal: |
  Add a finished-goods part the business sells. This part will get
  a BOM and a routing in subsequent cases.
roles:
  - Engineer / R&D
  - Sales / Account Manager
flows:
  - part-to-inventory
  - quote-to-cash
capabilities:
  - CAP-MD-PARTS
preconditions:
  - A raw material part record exists (e.g. RM-STEEL-1018-3X3) with type, unit of measure, default vendor, and inventory GL account. (Established by P2-PART-001.)
steps:
  - n: 1
    action: |
      Create a new part:
      - Part number: "FG-BRACKET-A1"
      - Description: "Mounting bracket, model A1"
      - Type: Finished goods
      - Unit of measure: each
      - Default sales GL account
    expected: |
      Part saves.
  - n: 2
    action: |
      Set a list price on the part (e.g., $45.00).
    expected: |
      Price field accepts value. Sales orders will default to this
      price unless overridden.
expected_overall: |
  Finished-goods part exists with a list price.
pass_criteria: |
  Part exists AND has a list price AND is classified as finished
  goods (not raw material).
est_minutes: 4
negative_variants:
  - id: P2-PART-002-N1
    title: Reject negative list price
    action: |
      Try to set the list price to -$45.00.
    expected: |
      Save is blocked with a "price must be non-negative" message.
    pass_criteria: |
      Negative price refused.
  - id: P2-PART-002-N2
    title: Reject finished goods with no sales GL account
    action: |
      Try to save a finished goods part with the sales GL account
      blank.
    expected: |
      Save is blocked or warns that finished goods require a sales
      account.
    pass_criteria: |
      FG without sales account refused.
```

---

## P2-PART-003 — Configure lot tracking on a raw material

```yaml
id: P2-PART-003
title: Enable lot tracking on a part
phase: P2
goal: |
  Configure a raw material to be lot-tracked, so receipts record
  lot numbers and consumption can be traced back to a specific lot
  for recall purposes.
roles:
  - Engineer / R&D
  - Production Manager
flows:
  - part-to-inventory
capabilities:
  - CAP-MD-PARTS
  - CAP-INV-LOTS
preconditions:
  - A raw material part record exists (e.g. RM-STEEL-1018-3X3) with type, unit of measure, default vendor, and inventory GL account. (Established by P2-PART-001.)
steps:
  - n: 1
    action: |
      Open RM-STEEL-1018-3X3. Find lot-tracking settings.
    expected: |
      A toggle or option to enable lot tracking is present.
  - n: 2
    action: |
      Enable lot tracking. Save.
    expected: |
      Setting persists. Future receipts of this part will require
      a lot number; future issues will track which lot was consumed.
expected_overall: |
  The part is lot-tracked. Subsequent transactions enforce lot
  number entry.
pass_criteria: |
  Lot tracking is enabled on the part AND the setting survives reload.
why_this_matters: |
  Recall traceability is the killer feature for lot tracking.
  Without it, a quality issue with a steel lot means recalling
  every product that might have used that material rather than
  the specific products that did.
est_minutes: 4
negative_variants:
  - id: P2-PART-003-N1
    title: Cannot disable lot tracking once on-hand inventory exists
    action: |
      Once any lot-tracked inventory has been received for the part,
      try to disable lot tracking.
    expected: |
      The change is blocked with a clear message that historical
      inventory still requires lot context, or requires explicit
      acknowledgment of breaking traceability.
    pass_criteria: |
      Lot tracking cannot be silently disabled with on-hand stock.
```

---

## P2-PART-004 — Configure serial tracking on a finished good

```yaml
id: P2-PART-004
title: Enable serial tracking on a finished part
phase: P2
goal: |
  Configure a finished good to be serial-tracked, useful for
  warranty claims and field returns.
roles:
  - Engineer / R&D
flows:
  - part-to-inventory
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-PARTS
  - CAP-INV-SERIALS
preconditions:
  - A finished-goods part exists (e.g. FG-BRACKET-A1) with type, unit of measure, sales GL account, and a list price. (Established by P2-PART-002.)
steps:
  - n: 1
    action: |
      Open FG-BRACKET-A1. Find serial-tracking settings.
    expected: |
      A toggle or option for serial tracking is present, distinct
      from lot tracking.
  - n: 2
    action: |
      Enable serial tracking. Configure serial format if available
      (e.g., "BRA-{YYYY}-{nnnnn}").
    expected: |
      Setting saves. Future production completions of this part
      will require a serial number.
expected_overall: |
  Part is serial-tracked. Each finished unit will get a unique
  serial number traceable through ship and warranty.
pass_criteria: |
  Serial tracking is enabled AND the format (if configured) is
  applied on the next completion.
est_minutes: 4
negative_variants:
  - id: P2-PART-004-N1
    title: Reject malformed serial format pattern
    action: |
      Enter a serial format pattern with mismatched braces or
      unsupported tokens (e.g., "BRA-{ZZZZ}-{nnnn").
    expected: |
      Save is blocked with a clear message identifying the bad
      token / unmatched delimiter.
    pass_criteria: |
      Malformed format pattern is refused with actionable detail.
  - id: P2-PART-004-N2
    title: Reject duplicate serial number on completion
    action: |
      In a later phase, try to complete two units with the same
      serial number.
    expected: |
      The second completion is blocked with a clear "serial number
      already in use" message.
    pass_criteria: |
      Duplicate serial refused at completion.
```

---

## P2-PART-005 — Bulk import parts

```yaml
id: P2-PART-005
title: Import a batch of parts from a spreadsheet
phase: P2
goal: |
  Verify the system supports bulk import of parts so a customer
  migrating from another ERP doesn't have to type 500 parts by hand.
roles:
  - Administrator
  - Engineer / R&D
flows:
  - part-to-inventory
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least one UoM and one GL account exist.
steps:
  - n: 1
    action: |
      Find and open the parts import area. (Common labels: "Import,"
      "Bulk Upload," "Data Import.")
    expected: |
      An import flow exists with a downloadable template.
  - n: 2
    action: |
      Download the template. Fill in 5 plausible parts (mix of raw
      and finished). Upload the file.
    expected: |
      The system shows a preview of what will be imported, with any
      errors flagged. If errors, they reference specific row and column.
  - n: 3
    action: |
      Confirm the import.
    expected: |
      Parts are created. The list view shows the new entries.
expected_overall: |
  Bulk import works end-to-end with clear error reporting on bad rows.
pass_criteria: |
  All 5 valid parts imported successfully AND any rejected rows
  have actionable error messages.
why_this_matters: |
  Manual data entry for migration is the #1 reason ERP rollouts run
  long. Working bulk import saves weeks.
est_minutes: 10
negative_variants:
  - id: P2-PART-005-N1
    title: Import file with malformed row
    action: |
      Add a row with an invalid UoM ("xyz") to the import file.
      Re-upload.
    expected: |
      The system flags row N as having an invalid UoM. Other rows
      are still importable. The user can fix and re-upload, or
      proceed without the bad row.
    pass_criteria: |
      Bad row is flagged AND good rows are not blocked AND error
      message names the field and the bad value.
```

---

## P2-BOM-001 — Create the first bill of materials

```yaml
id: P2-BOM-001
title: Create a single-level BOM for a finished part
phase: P2
goal: |
  Define what goes into making FG-BRACKET-A1. The BOM will be
  consumed by work orders to issue material.
roles:
  - Engineer / R&D
flows:
  - part-to-inventory
  - rd-to-product
capabilities:
  - CAP-MD-BOM
preconditions:
  - A raw material part record exists (e.g. RM-STEEL-1018-3X3) with type, unit of measure, default vendor, and inventory GL account. (Established by P2-PART-001.)
  - A finished-goods part exists (e.g. FG-BRACKET-A1) with type, unit of measure, sales GL account, and a list price. (Established by P2-PART-002.)
steps:
  - n: 1
    action: |
      Open FG-BRACKET-A1. Find the BOM section. Choose to add a BOM.
    expected: |
      A BOM editor opens with rows for components.
  - n: 2
    action: |
      Add components:
      - 0.5 ft of RM-STEEL-1018-3X3 per finished unit
      - 4 each of "Hardware-Bolt-M8" (create this part if it doesn't
        exist)
      - 1 each of "Hardware-Washer-M8"
    expected: |
      Each component row accepts the values. UoMs match the parts.
  - n: 3
    action: |
      Save the BOM. Set the BOM as effective today.
    expected: |
      BOM saves. It is now the active BOM for the part.
expected_overall: |
  FG-BRACKET-A1 has a BOM defining material consumption per unit
  produced.
pass_criteria: |
  BOM exists AND lists all three components AND quantities are
  per-finished-unit.
est_minutes: 8
negative_variants:
  - id: P2-BOM-001-N1
    title: Reject BOM line with same component twice
    action: |
      Try to add the same component (e.g., RM-STEEL-1018-3X3) on two
      separate BOM lines without an explicit "alternate" relationship.
    expected: |
      Application blocks the duplicate with a clear message OR merges
      the lines automatically. Silent acceptance of two independent
      lines for the same component is the failure mode.
    pass_criteria: |
      Duplicate handled cleanly with no silent acceptance.
  - id: P2-BOM-001-N2
    title: Reject BOM with circular reference
    action: |
      Try to set up a sub-assembly where BOM(A) contains B, and BOM(B)
      contains A.
    expected: |
      Application detects the cycle and blocks the save with a clear
      error.
    pass_criteria: |
      Cycle detected AND save blocked.
```

---

## P2-BOM-002 — Multi-level BOM with sub-assembly

```yaml
id: P2-BOM-002
title: Create a multi-level BOM with a sub-assembly
phase: P2
goal: |
  Verify hierarchical BOMs work — a finished good that contains a
  sub-assembly which has its own BOM.
roles:
  - Engineer / R&D
flows:
  - part-to-inventory
  - rd-to-product
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-BOM
preconditions:
  - A finished-goods part has a single-level BOM listing component parts, quantities-per-unit, and units of measure, marked effective. (Established by P2-BOM-001.)
steps:
  - n: 1
    action: |
      Create a sub-assembly part "SA-FRAME-A1" (type: WIP / sub-assembly).
      Give it its own BOM with raw materials.
    expected: |
      Sub-assembly part exists with its own BOM.
  - n: 2
    action: |
      Create a new finished good "FG-CART-A1" that uses 1 SA-FRAME-A1
      as a component.
    expected: |
      Finished good has a BOM that references the sub-assembly.
  - n: 3
    action: |
      View the exploded BOM for FG-CART-A1.
    expected: |
      The full hierarchy is visible: FG-CART-A1 → SA-FRAME-A1 → its raw
      materials.
expected_overall: |
  Multi-level BOMs are supported and visible end-to-end.
pass_criteria: |
  Exploded view shows all levels AND raw material totals are correct
  (rolled up across the hierarchy).
est_minutes: 10
negative_variants:
  - id: P2-BOM-002-N1
    title: Reject sub-assembly with no BOM of its own
    action: |
      Try to add SA-FRAME-A1 as a component before its own BOM has
      been defined.
    expected: |
      Save is blocked or warns; sub-assemblies cannot be referenced
      until they are built.
    pass_criteria: |
      Empty-BOM sub-assembly cannot be referenced as a component.
  - id: P2-BOM-002-N2
    title: Cycle detection across multiple levels
    action: |
      Configure FG-CART-A1 → SA-FRAME-A1 → FG-CART-A1 (a 3-level
      cycle).
    expected: |
      The application detects the cycle even across multiple levels
      and blocks the save with a clear error.
    pass_criteria: |
      Multi-level cycles are caught.
```

---

## P2-BOM-003 — BOM revision

```yaml
id: P2-BOM-003
title: Revise a BOM and track the revision
phase: P2
goal: |
  Verify BOM changes are versioned — the previous version is preserved
  and the change is auditable.
roles:
  - Engineer / R&D
flows:
  - part-to-inventory
  - rd-to-product
capabilities:
  - CAP-MD-BOM
preconditions:
  - A finished-goods part has a single-level BOM listing component parts, quantities-per-unit, and units of measure, marked effective. (Established by P2-BOM-001.)
steps:
  - n: 1
    action: |
      Open the BOM for FG-BRACKET-A1. Make a change: increase the
      bolt quantity from 4 to 6.
    expected: |
      The system either prompts for a change reason / revision letter,
      or auto-creates a new revision visible alongside the old.
  - n: 2
    action: |
      Save the change. Note the new revision identifier.
    expected: |
      Old BOM revision is preserved. New revision is now active.
  - n: 3
    action: |
      View BOM history.
    expected: |
      Both revisions are visible with their effective dates and
      changes.
expected_overall: |
  BOM revisions are fully tracked. The previous BOM can be referenced
  for any work orders that started under it.
pass_criteria: |
  Old revision preserved AND new revision active AND history viewable.
why_this_matters: |
  In-process work orders should consume materials per the BOM that
  was active when the work order was released — not the latest. Without
  revision tracking, this is impossible to enforce.
est_minutes: 6
negative_variants:
  - id: P2-BOM-003-N1
    title: Cannot edit a released BOM revision in place
    action: |
      Open the previously active BOM revision and try to edit it
      directly.
    expected: |
      Edits are blocked; the user must create a new revision.
      Released history is immutable.
    pass_criteria: |
      Old revisions cannot be retroactively modified.
  - id: P2-BOM-003-N2
    title: Reject revision with future effective date that overlaps current
    action: |
      Save a revision effective today while the prior revision was
      effective from yesterday with no end date.
    expected: |
      Application either auto-closes the prior revision at today, or
      blocks the save with a clear "overlapping effective dates"
      error.
    pass_criteria: |
      No two revisions are simultaneously effective.
```

---

## P2-BOM-004 — Component substitution

```yaml
id: P2-BOM-004
title: Configure an approved alternate component
phase: P2
goal: |
  Verify a BOM line can carry one or more approved alternate parts
  to use when the primary is unavailable.
roles:
  - Engineer / R&D
flows:
  - part-to-inventory
capabilities:
  - CAP-MD-BOM
preconditions:
  - A finished-goods part has a single-level BOM listing component parts, quantities-per-unit, and units of measure, marked effective. (Established by P2-BOM-001.)
steps:
  - n: 1
    action: |
      Open FG-BRACKET-A1's BOM. On the bolt line, find an "alternates"
      or "substitute" option.
    expected: |
      An option to add alternates exists.
  - n: 2
    action: |
      Add "Hardware-Bolt-M8-Alt" as an alternate (create it as a part
      if it doesn't exist).
    expected: |
      Alternate is recorded. A future material issue against this BOM
      can substitute the alternate without breaking the work order.
expected_overall: |
  BOM allows alternates. Production can swap when needed.
pass_criteria: |
  Alternate is recorded AND can be selected at issue time.
est_minutes: 5
negative_variants:
  - id: P2-BOM-004-N1
    title: Reject alternate with mismatched UoM
    action: |
      Try to add an alternate component whose UoM differs from the
      primary's.
    expected: |
      Save is blocked or warns; alternates must share the BOM line's
      UoM (or the system must explicitly handle conversion).
    pass_criteria: |
      UoM mismatch is surfaced before issue time.
```

---

## P2-ROUTE-001 — Create a routing for a finished part

```yaml
id: P2-ROUTE-001
title: Create a routing for FG-BRACKET-A1
phase: P2
goal: |
  Define the operation sequence required to produce a finished part —
  which work centers, in what order, with what setup and run times.
roles:
  - Engineer / R&D
  - Production Manager
flows:
  - part-to-inventory
  - rd-to-product
capabilities:
  - CAP-MD-ROUTING
preconditions:
  - A finished-goods part has a single-level BOM listing component parts, quantities-per-unit, and units of measure, marked effective. (Established by P2-BOM-001.)
  - Work centers from P1-WC-001/002 exist.
steps:
  - n: 1
    action: |
      Open FG-BRACKET-A1. Find the routing section. Add a new routing.
    expected: |
      A routing editor opens with rows for operations.
  - n: 2
    action: |
      Add operations in order:
      1. "Cut" at Cut & Saw (setup 10 min, run 2 min/each)
      2. "Weld" at Weld (setup 5 min, run 5 min/each)
      3. "Paint" at Paint (setup 30 min, run 1 min/each)
      4. "Inspect" at Inspection (setup 0 min, run 1 min/each)
    expected: |
      Each operation accepts work center, setup, and run-time values.
  - n: 3
    action: |
      Save the routing. Mark it as effective.
    expected: |
      Routing is active. Work orders for this part will use this
      routing by default.
expected_overall: |
  Routing exists. A work order generates 4 ordered operations at the
  named work centers with the configured times.
pass_criteria: |
  All 4 operations exist in correct order AND each links to its work
  center AND time values match what was entered.
est_minutes: 10
negative_variants:
  - id: P2-ROUTE-001-N1
    title: Reject negative setup or run time
    action: |
      Try to save an operation with setup of -10 minutes or run of
      -2 minutes.
    expected: |
      Save is blocked with a "times must be non-negative" message.
    pass_criteria: |
      Negative time values refused.
  - id: P2-ROUTE-001-N2
    title: Reject operation pointing at deleted work center
    action: |
      Try to save a routing operation referencing a work center that
      has been deactivated.
    expected: |
      The dropdown excludes inactive work centers, or the save is
      blocked with a clear message.
    pass_criteria: |
      Routing cannot point at an inactive work center.
  - id: P2-ROUTE-001-N3
    title: Reject routing with no operations
    action: |
      Try to save a routing with zero operations.
    expected: |
      Save is blocked with a clear "at least one operation is
      required" message.
    pass_criteria: |
      Empty routing refused.
```

---

## P2-ROUTE-002 — Routing with subcontracted operation

```yaml
id: P2-ROUTE-002
title: Create a routing that includes a subcontracted operation
phase: P2
goal: |
  Verify a routing can include an operation performed by an outside
  vendor (heat treatment, plating). Material is shipped out and
  comes back to continue.
roles:
  - Engineer / R&D
  - Production Manager
  - Procurement
flows:
  - part-to-inventory
  - rd-to-product
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-ROUTING
  - CAP-P2P-SUBCONTRACT
preconditions:
  - A finished-goods part has a routing with ordered operations at the right work centers, including setup and run times for each. (Established by P2-ROUTE-001.)
  - At least one vendor that does subcontract work exists (or can be
    added).
steps:
  - n: 1
    action: |
      Create a part "FG-SHAFT-X1" with a BOM. Open its routing.
      Add operations:
      1. Cut at Cut & Saw
      2. Heat Treat (subcontracted) — vendor: a vendor of your choice
         (or create one), turn-time: 5 days
      3. Final inspection at Inspection
    expected: |
      The subcontracted operation accepts a vendor, turn-time, and
      cost. The system understands the operation involves shipping out
      and receiving back.
  - n: 2
    action: |
      Save the routing.
    expected: |
      Routing saves. Work orders against this part will include
      automatic shipping-to-vendor and receiving-from-vendor steps
      around the subcontracted operation.
expected_overall: |
  Routing supports subcontracted operations end-to-end with vendor,
  turn-time, and cost.
pass_criteria: |
  Subcontract operation exists AND links to a vendor AND has a
  turn-time AND has a defined cost or pricing.
why_this_matters: |
  Many shops can't do every operation in-house. Routing must
  natively understand "this part leaves the building, comes back,
  and continues" or every subcontract becomes a manual one-off.
est_minutes: 10
negative_variants:
  - id: P2-ROUTE-002-N1
    title: Reject subcontract op without vendor
    action: |
      Try to save a subcontract operation with no vendor selected.
    expected: |
      Save is blocked with a clear "vendor is required for
      subcontract operations" message.
    pass_criteria: |
      Subcontract op without vendor refused.
  - id: P2-ROUTE-002-N2
    title: Reject subcontract turn-time of zero
    action: |
      Set the subcontract operation's turn-time to 0 days.
    expected: |
      Save is blocked or warns; subcontracts that take no time are
      almost always a misconfiguration.
    pass_criteria: |
      Zero turn-time refused or flagged.
```

---

## P2-ROUTE-003 — Routing with parallel operations

```yaml
id: P2-ROUTE-003
title: Configure parallel operations in a routing
phase: P2
goal: |
  Verify a routing supports operations that can happen at the same
  time (parts that get split into two parallel paths and rejoin).
roles:
  - Engineer / R&D
  - Production Manager
flows:
  - part-to-inventory
scale_tags:
  - enterprise
capabilities:
  - CAP-MD-ROUTING
preconditions:
  - A finished-goods part has a routing with ordered operations at the right work centers, including setup and run times for each. (Established by P2-ROUTE-001.)
steps:
  - n: 1
    action: |
      In a complex routing, configure two operations as parallel
      (e.g., "Machine Side A" and "Machine Side B" can run
      concurrently after "Cut" and before "Assembly").
    expected: |
      The routing editor accepts parallel sequencing — visualizes
      the branch and merge.
  - n: 2
    action: |
      Save the routing. Generate a work order from it.
    expected: |
      Work order shows both parallel operations as available
      simultaneously.
expected_overall: |
  Parallel operations are supported and visualized correctly.
pass_criteria: |
  Both parallel operations are released for work simultaneously
  AND the routing diagram shows the branch.
est_minutes: 8
notes: |
  Some ERPs implement only sequential routings. If parallel routing
  doesn't work, that's a real limitation worth documenting; flag it
  as a bug rather than working around it.
negative_variants:
  - id: P2-ROUTE-003-N1
    title: Parallel branches must merge before downstream operations
    action: |
      Try to save a routing where one branch has a downstream
      operation that does not wait for the other branch to complete.
    expected: |
      Save is blocked or warns; downstream operations must explicitly
      depend on the merge of all parallel branches.
    pass_criteria: |
      Branches merge cleanly before downstream operations are
      released.
```

---

## P2-PRICE-001 — Configure a price list

```yaml
id: P2-PRICE-001
title: Create a price list and apply it to selected customers
phase: P2
goal: |
  Verify multi-tier pricing — different list prices for different
  customer segments (distribution, government, retail).
roles:
  - Sales / Account Manager
  - Controller
flows:
  - quote-to-cash
capabilities:
  - CAP-MD-PRICELIST
preconditions:
  - At least one customer and one finished part exist.
steps:
  - n: 1
    action: |
      Find and open the price lists area. Create a new list:
      - Name: "Distributor Pricing"
      - Currency: USD
      - Effective date: today
    expected: |
      Price list saves.
  - n: 2
    action: |
      Add a line: FG-BRACKET-A1 at $35.00 (a 22% discount from list).
    expected: |
      Line saves under the Distributor Pricing list.
  - n: 3
    action: |
      Open the ACME Industrial customer. Assign the Distributor
      Pricing list as their default.
    expected: |
      Customer record now shows Distributor Pricing as their default
      list.
  - n: 4
    action: |
      Create a draft sales order for ACME for FG-BRACKET-A1.
    expected: |
      Default unit price is $35.00 (from the list), not $45.00 (the
      part's list price).
expected_overall: |
  Customer-specific pricing overrides default list prices on derived
  records.
pass_criteria: |
  Order line shows $35.00, not $45.00.
est_minutes: 8
negative_variants:
  - id: P2-PRICE-001-N1
    title: Reject price list with effective date in the past requiring re-pricing
    action: |
      Save a price list with an effective date earlier than today
      while open quotes exist.
    expected: |
      The application surfaces affected open quotes and asks how to
      handle them (re-price, leave as-is) rather than silently
      changing pricing.
    pass_criteria: |
      Backdated price list cannot silently retroactively change open
      quotes.
  - id: P2-PRICE-001-N2
    title: Customer assigned to multiple price lists picks one deterministically
    action: |
      Assign two price lists to the same customer with conflicting
      lines for the same part.
    expected: |
      The application either rejects the dual assignment or applies
      a documented precedence (e.g., most-recent effective date)
      visible to the user.
    pass_criteria: |
      Conflict resolution is explicit and documented.
```

---

## P2-PRICE-002 — Volume break pricing

```yaml
id: P2-PRICE-002
title: Configure quantity-break pricing
phase: P2
goal: |
  Verify price tiers based on quantity (e.g., 1–9 units at $45,
  10–49 at $40, 50+ at $35).
roles:
  - Sales / Account Manager
flows:
  - quote-to-cash
capabilities:
  - CAP-MD-PRICELIST
preconditions:
  - A finished-goods part exists (e.g. FG-BRACKET-A1) with type, unit of measure, sales GL account, and a list price. (Established by P2-PART-002.)
steps:
  - n: 1
    action: |
      Open FG-BRACKET-A1's pricing. Add quantity breaks:
      - 1–9 each: $45.00
      - 10–49 each: $40.00
      - 50+ each: $35.00
    expected: |
      Tiers save with their quantity ranges.
  - n: 2
    action: |
      Create draft order lines for 5, 25, and 100 units of the part.
    expected: |
      Each line uses the right tier price based on quantity.
expected_overall: |
  Quantity breaks resolve to the correct price tier based on order
  quantity.
pass_criteria: |
  All three lines show the expected price per their quantity tier.
est_minutes: 5
negative_variants:
  - id: P2-PRICE-002-N1
    title: Reject overlapping quantity break tiers
    action: |
      Try to save tiers "1-10 at $45" and "5-25 at $40" (overlapping
      ranges).
    expected: |
      Save is blocked with a clear "ranges must not overlap" error.
    pass_criteria: |
      Overlapping tiers refused.
  - id: P2-PRICE-002-N2
    title: Reject ascending price across ascending quantity
    action: |
      Try to save tiers where higher quantity costs more per unit
      (e.g., 1-9 at $35, 50+ at $45).
    expected: |
      Save is blocked or surfaces an explicit warning that quantity
      breaks are typically descending. The user must confirm the
      unusual configuration.
    pass_criteria: |
      Inverted price-per-quantity surfaces an explicit warning.
```

---

## P2-PRICE-003 — Vendor cost terms

```yaml
id: P2-PRICE-003
title: Configure vendor-specific cost terms for a part
phase: P2
goal: |
  Set per-vendor cost on a purchased part, including quantity breaks
  if applicable. POs default to these costs.
roles:
  - Procurement
flows:
  - vendor-to-asset
  - part-to-inventory
capabilities:
  - CAP-MD-PARTS
  - CAP-P2P-PO
preconditions:
  - The first vendor record exists with name, address, primary contact, payment terms, and default expense / inventory GL account. (Established by P2-VENDOR-001.)
  - A raw material part record exists (e.g. RM-STEEL-1018-3X3) with type, unit of measure, default vendor, and inventory GL account. (Established by P2-PART-001.)
steps:
  - n: 1
    action: |
      Open RM-STEEL-1018-3X3. Find vendor pricing.
    expected: |
      A way to add vendor-specific costs is visible.
  - n: 2
    action: |
      Add Pacific Steel Supply as a vendor with cost $4.50/foot,
      lead time 14 days, MOQ 100 feet.
    expected: |
      Vendor pricing record saves.
  - n: 3
    action: |
      Create a draft PO line for this part to Pacific Steel.
    expected: |
      PO line defaults to $4.50/foot.
expected_overall: |
  Per-vendor costs override generic part costs on POs.
pass_criteria: |
  PO line cost matches the vendor pricing record AND lead time and MOQ
  are visible.
est_minutes: 5
negative_variants:
  - id: P2-PRICE-003-N1
    title: Reject negative lead time or MOQ
    action: |
      Try to save vendor pricing with lead time of -7 days or MOQ
      of -50.
    expected: |
      Save is blocked with a "must be non-negative" error per field.
    pass_criteria: |
      Negative lead time and MOQ refused.
  - id: P2-PRICE-003-N2
    title: PO below MOQ is flagged
    action: |
      Create a draft PO line for 50 feet (below MOQ of 100).
    expected: |
      The application warns or blocks at submission, naming the MOQ
      requirement.
    pass_criteria: |
      Below-MOQ order surfaces a clear warning before submission.
```

---

## P2-RD-001 — Create a prototype part

```yaml
id: P2-RD-001
title: Create a prototype part marked as not-for-sale
phase: P2
goal: |
  Verify R&D can create parts marked as prototype (or pre-release) so
  they don't accidentally appear on quotes or production schedules.
roles:
  - Engineer / R&D
flows:
  - rd-to-product
capabilities:
  - CAP-MD-PARTS
  - CAP-MD-ECO
preconditions:
  - At least one UoM and GL account exist.
steps:
  - n: 1
    action: |
      Create a part "PROTO-WIDGET-V1" with type: prototype (or a flag
      indicating not-for-production / not-for-sale).
    expected: |
      Part saves with the prototype indicator.
  - n: 2
    action: |
      Try to add this part as a line on a sales order.
    expected: |
      The system either blocks selection OR warns the user that this
      is a prototype not approved for sale.
expected_overall: |
  Prototype parts are visibly distinct and gated from sales /
  production transactions.
pass_criteria: |
  Prototype indicator visible AND sale of prototype is gated.
est_minutes: 4
why_this_matters: |
  Real bugs in this area: a salesperson finds a part in search and
  quotes it without realizing it's pre-release. The deal closes,
  the customer expects shipment, and there's no production-ready BOM.
negative_variants:
  - id: P2-RD-001-N1
    title: Prototype cannot be added to a customer-facing quote
    action: |
      Open a quote for ACME Industrial and try to add the prototype
      part as a quote line.
    expected: |
      The application either filters out prototype parts from quote
      search OR rejects the line with a clear "not approved for sale"
      message.
    pass_criteria: |
      Prototype part cannot be quoted to a customer.
```

---

## P2-RD-002 — Engineering change request

```yaml
id: P2-RD-002
title: Submit an engineering change request (ECR) and route for approval
phase: P2
goal: |
  Verify engineering changes go through a formal request, review, and
  approval workflow before changing production BOMs/routings.
roles:
  - Engineer / R&D
  - Production Manager
flows:
  - rd-to-product
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-MD-ECO
preconditions:
  - A finished-goods part has a single-level BOM listing component parts, quantities-per-unit, and units of measure, marked effective. (Established by P2-BOM-001.)
steps:
  - n: 1
    action: |
      Find the engineering change request area. Submit a new ECR
      against FG-BRACKET-A1 — proposed change: change the bolt size
      from M8 to M10. Provide a reason.
    expected: |
      ECR saves in "Pending review" status.
  - n: 2
    action: |
      Sign in as a different user with approval authority. Open the
      ECR queue.
    expected: |
      The pending ECR is visible.
  - n: 3
    action: |
      Approve the ECR.
    expected: |
      ECR status changes to "Approved." A new BOM revision is either
      auto-created or a follow-up task is generated.
expected_overall: |
  ECR workflow exists: submit → review → approve → BOM revision.
pass_criteria: |
  ECR was submitted AND went through approval AND resulted in a
  trackable BOM change.
est_minutes: 10
negative_variants:
  - id: P2-RD-002-N1
    title: ECR submitter cannot self-approve
    action: |
      As the same user who submitted the ECR, attempt to approve it.
    expected: |
      The approve action is unavailable to the submitter. A
      separate authorized user must approve.
    pass_criteria: |
      Self-approval of own ECR is refused.
  - id: P2-RD-002-N2
    title: Reject ECR with no proposed change description
    action: |
      Try to submit an ECR with the description / change field
      blank.
    expected: |
      Submission is blocked with a clear "description is required"
      error.
    pass_criteria: |
      Empty ECR refused.
```

---

## P2-RD-003 — Customer-driven prototyping

```yaml
id: P2-RD-003
title: Create a prototype tied to a customer feedback record
phase: P2
goal: |
  When a customer requests a custom variant, the prototype work
  should be traceable back to the customer / opportunity that drove it.
roles:
  - Engineer / R&D
  - Sales / Account Manager
flows:
  - rd-to-product
  - lead-to-customer
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-MD-PARTS
preconditions:
  - At least one customer exists (P2-CUST-001).
  - Prototype part type exists (P2-RD-001).
steps:
  - n: 1
    action: |
      Open ACME Industrial's customer record. Find a way to record a
      feature request or feedback note.
    expected: |
      A field or sub-record for feedback exists.
  - n: 2
    action: |
      Add a note: "Wants taller bracket variant for new product line."
    expected: |
      Note saves with date and originator.
  - n: 3
    action: |
      Create prototype part "PROTO-BRACKET-TALL" and link it to the
      ACME feedback record.
    expected: |
      Prototype carries a back-link to the originating customer
      feedback.
expected_overall: |
  Customer-driven prototypes are traceable from the customer record
  forward to the prototype, and from the prototype back to the customer.
pass_criteria: |
  Bi-directional link exists AND is visible from both ends.
est_minutes: 6
notes: |
  Customer-feedback-to-prototype traceability is the foundation for
  reporting on R&D ROI by customer / segment. Without it, leadership
  can't answer "which customers are driving our product roadmap?"
negative_variants:
  - id: P2-RD-003-N1
    title: Cannot link prototype to deactivated customer
    action: |
      Deactivate ACME Industrial and try to create a prototype
      linked to its feedback.
    expected: |
      The link is blocked or warns that the customer is inactive.
    pass_criteria: |
      Inactive customer cannot be referenced.
```

---

## P2-RD-004 — Release prototype to production

```yaml
id: P2-RD-004
title: Promote a prototype to a production-ready part
phase: P2
goal: |
  Once a prototype is validated, formally promote it to a production
  part. The prototype's BOM and routing become the released versions.
roles:
  - Engineer / R&D
  - Production Manager
flows:
  - rd-to-product
capabilities:
  - CAP-MD-PARTS
  - CAP-MD-ECO
preconditions:
  - A prototype part exists, marked not-for-production / not-for-sale and gated from sales orders. (Established by P2-RD-001.)
  - The prototype has a BOM and routing.
steps:
  - n: 1
    action: |
      Open the prototype part. Find the "promote to production" action
      (or equivalent — "release," "approve," "graduate").
    expected: |
      The action is available; system prompts for any release info
      (revision, effective date, approval signoff).
  - n: 2
    action: |
      Confirm the promotion.
    expected: |
      Part type changes from prototype to standard. The part is now
      sellable and orderable. Original prototype history is preserved.
expected_overall: |
  Prototype is promoted; sellable and orderable as a standard part.
pass_criteria: |
  Type changed AND sellable AND prototype history retained.
est_minutes: 5
negative_variants:
  - id: P2-RD-004-N1
    title: Reject promotion of prototype without released BOM and routing
    action: |
      Try to promote a prototype that has either no BOM or no
      routing.
    expected: |
      Promotion is blocked with a clear list of missing prerequisites.
    pass_criteria: |
      Promotion gated by complete BOM and routing.
  - id: P2-RD-004-N2
    title: Promotion requires approver signoff
    action: |
      Attempt to promote without an approval signature recorded.
    expected: |
      Promotion is blocked or warns that approval is required.
    pass_criteria: |
      Promotion without signoff refused.
```

---

## P2-LEAD-001 — Capture a sales lead

```yaml
id: P2-LEAD-001
title: Capture a sales lead
phase: P2
goal: |
  Record a new sales opportunity from a webform, trade show, or
  inbound call. The lead is not yet a customer.
roles:
  - Sales / Account Manager
flows:
  - lead-to-customer
capabilities:
  - CAP-O2C-LEAD
preconditions:
  - |
    Foundational records exist: at least one location, one work center, standard units of measure, the chart of accounts, at least one tax code, the first employee, a default calendar, and at least one fixed asset. (Phase 1 outcomes.)
steps:
  - n: 1
    action: |
      Find and open the leads area. (Common labels: "Leads,"
      "Opportunities," "Prospects.")
    expected: |
      The leads list appears.
  - n: 2
    action: |
      Create a new lead:
      - Company: "Northwest Conveyors Inc."
      - Contact: name, email, phone
      - Source: "Trade show — IMTS 2026"
      - Estimated deal size
      - Status: New
    expected: |
      Lead saves and appears in the list.
expected_overall: |
  The lead is captured with source attribution.
pass_criteria: |
  Lead exists AND has a source AND has a contact.
est_minutes: 4
negative_variants:
  - id: P2-LEAD-001-N1
    title: Reject lead with no contact information
    action: |
      Try to save a lead with no email and no phone number.
    expected: |
      Save is blocked with a clear "at least one contact method is
      required" error.
    pass_criteria: |
      Lead without contact info refused.
  - id: P2-LEAD-001-N2
    title: Reject negative estimated deal size
    action: |
      Try to save a lead with estimated deal size of -$10,000.
    expected: |
      Save is blocked with a "must be non-negative" error.
    pass_criteria: |
      Negative deal size refused.
```

---

## P2-LEAD-002 — Qualify and convert a lead to customer

```yaml
id: P2-LEAD-002
title: Qualify a lead and convert it to a customer
phase: P2
goal: |
  Move a qualified lead through to a real customer record without
  losing the contact, source, or activity history.
roles:
  - Sales / Account Manager
flows:
  - lead-to-customer
capabilities:
  - CAP-O2C-LEAD
  - CAP-MD-CUSTOMERS
preconditions:
  - A sales lead has been captured with company, contact info, source attribution, and estimated deal size. (Established by P2-LEAD-001.)
steps:
  - n: 1
    action: |
      Open the Northwest Conveyors lead. Use the convert action.
    expected: |
      A conversion form appears asking for any extra info needed for
      a real customer record (billing terms, credit limit, default tax,
      etc.).
  - n: 2
    action: |
      Fill in the customer-side fields and confirm.
    expected: |
      A new customer record is created. The lead's contact, source,
      and notes are carried into the customer record. The lead is
      marked converted.
  - n: 3
    action: |
      Open the new customer. Verify the lead's history is preserved
      and visible.
    expected: |
      Activity from the lead phase (source, notes, dates) is on the
      customer record.
expected_overall: |
  Lead-to-customer conversion preserves history.
pass_criteria: |
  Customer exists AND original lead source visible AND lead notes
  preserved.
est_minutes: 6
negative_variants:
  - id: P2-LEAD-002-N1
    title: Cannot convert an already-converted lead twice
    action: |
      After converting Northwest Conveyors, try to convert the same
      lead again.
    expected: |
      The action is unavailable or surfaces a clear "already
      converted" message linking to the resulting customer.
    pass_criteria: |
      Double-conversion is refused.
  - id: P2-LEAD-002-N2
    title: Conversion requires the customer-side required fields
    action: |
      Attempt to confirm conversion with the new customer's billing
      address blank.
    expected: |
      Save is blocked with a per-field error naming each missing
      required value.
    pass_criteria: |
      Conversion without required customer fields is refused.
```

---

## End of Phase 2

Phase 2 produces enough master data to support Phase 3 transactions:

- At least 3 vendors (domestic, international, sole-proprietor for 1099)
- At least 3 customers (domestic, multi-ship-to, international)
- ~6 parts (raw, finished, sub-assembly, lot-tracked, serial-tracked, prototype-promoted)
- Multi-level BOM with revision history
- At least one routing including a subcontracted operation
- Tiered and customer-specific pricing
- One converted lead and one in-flight prototype
