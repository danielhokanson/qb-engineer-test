# Phase 4 — First Production Cycle

This phase exercises the sales-side lifecycle end-to-end for the first time: quote → sales order → work order → material issue → labor → completion → ship → invoice → cash. By the end of Phase 4, the system has run a real cycle from a customer asking for a quote to the cash being applied against the invoice.

## Scope

- **Quotes** — pricing a customer inquiry, sending the quote, accepting it.
- **Sales orders** — converting a quote to an SO, configuring delivery and tax.
- **Work orders** — releasing manufacturing for the SO, tracking progress.
- **Material issue and labor** — consuming parts and recording time on the floor.
- **Completion and put-away** — moving finished goods into available inventory.
- **Shipping** — picking, packing, shipping documentation.
- **Customer invoice** — billing the customer, posting to AR.
- **Cash application** — receiving payment, applying to invoice.
- **Hire-to-first-assignment** — onboarding a new employee through to their first task.

## Roles introduced or used heavily

- `Sales / Account Manager` — quotes, SOs.
- `Production Manager` — releases work orders.
- `Production Planner` — schedules and assigns to operators.
- `Floor Operator` — runs the work, scanner-driven.
- `Warehouse / Logistics` — picks, packs, ships, manages inbound returns.
- `Controller` — invoice review, cash application.
- `HR` — new hire onboarding.

---

## P4-QUOTE-001 — Create the first quote

```yaml
id: P4-QUOTE-001
title: Create a quote for a customer
phase: P4
goal: |
  Build a quote for a customer — pricing, lead time, terms — that
  can be accepted and converted to a sales order.
roles:
  - Sales / Account Manager
flows:
  - quote-to-cash
preconditions:
  - At least one customer (P2-CUST-001).
  - At least one finished part with pricing (P2-PART-002, P2-PRICE-001).
steps:
  - n: 1
    action: |
      Find and open the quotes area. Choose to create a new quote.
    expected: |
      Quote creation form opens.
  - n: 2
    action: |
      Select ACME Industrial as the customer. Add a line: 100 each of
      FG-BRACKET-A1.
    expected: |
      Default unit price is $35.00 (Distributor Pricing list from
      P2-PRICE-001), not the part's $45 list.
  - n: 3
    action: |
      Verify lead time defaults from the part's master data. Add a
      validity period (e.g., quote good for 30 days). Save.
    expected: |
      Quote saves with a stable quote number, all calculated totals
      visible, and validity dates set.
  - n: 4
    action: |
      Send the quote to the customer (email, PDF download, or whatever
      the system supports).
    expected: |
      Quote is delivered. Status changes to "Sent."
expected_overall: |
  First quote exists, with correct customer pricing applied, and is
  in the customer's hands.
pass_criteria: |
  Quote saved AND priced from the right list AND sent to the customer.
est_minutes: 8
```

---

## P4-QUOTE-002 — Quote with custom pricing override

```yaml
id: P4-QUOTE-002
title: Override default pricing on a quote line
phase: P4
goal: |
  Verify a salesperson can override default pricing for a one-off
  deal, with the override flagged for visibility.
roles:
  - Sales / Account Manager
flows:
  - quote-to-cash
preconditions:
  - A quote has been created for a customer with the right customer-list pricing applied, validity dates set, and the quote sent. (Established by P4-QUOTE-001.)
steps:
  - n: 1
    action: |
      Create a new quote for ACME with a line for 200 units of
      FG-BRACKET-A1. Override the unit price from $35 to $30 (deeper
      discount).
    expected: |
      Override is accepted with a clear visual indicator showing
      the price was overridden.
  - n: 2
    action: |
      Save and view the quote.
    expected: |
      Override is visible. Margin or markup analysis (if available)
      shows the impact.
expected_overall: |
  Pricing overrides are supported and surfaced clearly.
pass_criteria: |
  Override visible AND price reflected on the quote AND override
  flag visible to reviewers.
est_minutes: 4
```

---

## P4-QUOTE-003 — Customer accepts the quote → SO

```yaml
id: P4-QUOTE-003
title: Convert an accepted quote to a sales order
phase: P4
goal: |
  Move from quote to sales order — the customer agreed, now we
  commit production and delivery.
roles:
  - Sales / Account Manager
flows:
  - quote-to-cash
preconditions:
  - A quote has been created for a customer with the right customer-list pricing applied, validity dates set, and the quote sent. (Established by P4-QUOTE-001.)
steps:
  - n: 1
    action: |
      Open the quote. Use the convert-to-SO action.
    expected: |
      A new sales order is created with all quote lines, prices, and
      terms carried over.
  - n: 2
    action: |
      Add or confirm the customer PO number, requested ship date,
      and ship-to address.
    expected: |
      All values save.
  - n: 3
    action: |
      Submit / confirm the SO.
    expected: |
      SO transitions to "Open" or "Booked." Quote is marked as
      converted.
expected_overall: |
  SO exists and references the original quote for traceability.
pass_criteria: |
  SO is open AND links to the original quote AND carries all the
  quote's pricing.
est_minutes: 6
```

---

## P4-WO-001 — Release the first work order

```yaml
id: P4-WO-001
title: Release a work order from a sales order
phase: P4
goal: |
  Generate and release a work order to fulfill the SO. The WO carries
  the BOM and routing from the part's master data and is assigned to
  the appropriate work centers.
roles:
  - Production Manager
  - Production Planner
flows:
  - quote-to-cash
preconditions:
  - A sales order has been created from an accepted quote, in Open or Booked status, with customer PO number, requested ship date, and ship-to address all confirmed. (Established by P4-QUOTE-003.)
  - The part on the SO has a BOM and routing.
steps:
  - n: 1
    action: |
      Open the sales order. Use the "release to production" or
      "create work order" action.
    expected: |
      Work order is generated. WO number, target quantity, BOM
      revision, and routing are all populated.
  - n: 2
    action: |
      Verify the operations match the part's routing — Cut, Weld,
      Paint, Inspect at the right work centers.
    expected: |
      All operations are present in the right order with the work
      centers from P2-ROUTE-001.
  - n: 3
    action: |
      Release the WO to production.
    expected: |
      WO status changes from "Planned" to "Released" (or equivalent).
      It now appears on the floor's work-to-do list.
expected_overall: |
  Work order is on the floor, with BOM and routing locked at the
  revision active when released.
pass_criteria: |
  WO released AND links to its source SO AND its BOM/routing
  revisions match what was active at release.
est_minutes: 8
```

---

## P4-WO-002 — Work order on the kanban board

```yaml
id: P4-WO-002
title: Verify the work order appears on the kanban / sprint board
phase: P4
goal: |
  When a WO is released, it should show up as a card on the
  kanban-style task board so the production team can see and pick
  it up.
roles:
  - Production Manager
  - Floor Operator
flows:
  - quote-to-cash
preconditions:
  - A work order has been released from a sales order. The WO carries a stable number, references the BOM and routing active at release, and is in Released status — visible to the floor but not yet started. (Established by P4-WO-001.)
steps:
  - n: 1
    action: |
      Open the kanban / task board for the production area.
    expected: |
      The newly released WO appears as a card in the appropriate
      "Ready" or "Released" column.
  - n: 2
    action: |
      Open the card.
    expected: |
      Card shows: WO number, part, target quantity, due date, current
      operation, work center.
expected_overall: |
  Released WOs are surfaced as kanban cards for the floor to pick up.
pass_criteria: |
  WO is visible on the board AND card has identifying details AND
  state matches the WO's released status.
est_minutes: 3
```

---

## P4-WO-START — Start work at the floor

```yaml
id: P4-WO-START
title: Start the first operation on a released work order
phase: P4
goal: |
  Begin work at the floor: scan or pick the WO, identify the work
  center, and transition the operation from Released to In Progress.
roles:
  - Floor Operator
flows:
  - quote-to-cash
preconditions:
  - A work order has been released from a sales order. The WO carries a stable number, references the BOM and routing active at release, and is in Released status — visible to the floor but not yet started. (Established by P4-WO-001.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At the work center's station (paired scanner workstation, or
      mobile device). Sign in or scan badge. Scan the WO ID. Scan
      the start barcode (or tap the start action).
    expected: |
      The combination of barcodes resolves: this WO, this work
      center, this operator, start. Operation transitions to
      "In Progress."
  - n: 2
    action: |
      Verify the kanban card has moved from "Ready" to "In Progress."
    expected: |
      The card moved automatically without anyone touching the kanban
      UI.
  - n: 3
    action: |
      Verify labor time is now being tracked against the WO and
      operator.
    expected: |
      A labor entry is open and accumulating against the operator.
expected_overall: |
  Operation is in progress. Labor is tracking. Kanban reflects status.
pass_criteria: |
  Status changed AND operator recorded AND labor time accumulating
  AND kanban moved.
est_minutes: 5
```

---

## P4-MATL-ISSUE — Issue material to the work order

```yaml
id: P4-MATL-ISSUE
title: Issue material from inventory to the work order
phase: P4
goal: |
  Consume the BOM components from inventory and post them against the
  WO so material variance can be tracked.
roles:
  - Floor Operator
  - Warehouse / Logistics
flows:
  - quote-to-cash
preconditions:
  - A work-order operation is in progress: an operator scanned the WO and the start action, the operation transitioned from Released to In Progress, labor time is tracking, and the kanban card has moved accordingly. (Established by P4-WO-START.)
  - Inventory exists for the BOM components (from P3 receipt).
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At the floor station, scan the WO. Choose to issue material.
      The system shows the BOM and required quantities.
    expected: |
      For each BOM line, expected quantity is shown. Where lots are
      required, a lot prompt appears.
  - n: 2
    action: |
      Issue the steel: scan the lot "PSS-2026-04-001" and confirm
      the required quantity (50 ft for 100 units).
    expected: |
      Lot is recorded against the WO. Inventory decreases by the
      issued quantity.
  - n: 3
    action: |
      Issue the bolts and washers (no lots required).
    expected: |
      Inventory decreases. WO material consumption is updated.
expected_overall: |
  Material is consumed from inventory and traced against the WO,
  including lot traceability for lot-tracked parts.
pass_criteria: |
  Inventory decreased correctly AND lot trace recorded AND WO shows
  material issued matches BOM.
est_minutes: 8
negative_variants:
  - id: P4-MATL-ISSUE-N1
    title: Insufficient inventory to issue
    action: |
      Try to issue a quantity greater than what's available in stock.
    expected: |
      System blocks the issue or warns. Either offers an alternate
      lot, requires a backorder, or refuses to consume more than
      on-hand.
    pass_criteria: |
      Issue blocked or warned AND inventory not over-issued.
```

---

## P4-LABOR — Record labor against the work order

```yaml
id: P4-LABOR
title: Record labor time against the operation
phase: P4
goal: |
  Record actual labor time against the work order operation, so
  labor cost variance can be calculated against the routing's
  standard.
roles:
  - Floor Operator
flows:
  - quote-to-cash
preconditions:
  - A work-order operation is in progress: an operator scanned the WO and the start action, the operation transitioned from Released to In Progress, labor time is tracking, and the kanban card has moved accordingly. (Established by P4-WO-START.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At the operation's completion (or at break / end of shift), use
      the scanner or manual entry to clock out of this operation.
    expected: |
      Labor entry closes with start and end timestamps. Total time
      is calculated.
  - n: 2
    action: |
      Verify the labor cost is calculated using the work center's
      default labor rate (from P1-WC-001).
    expected: |
      Labor cost shows the rate × time. WO actual labor cost increases.
expected_overall: |
  Labor time and cost are tracked against the WO and operation.
pass_criteria: |
  Labor entry closed AND cost calculated AND WO labor cost increased
  by the entry.
est_minutes: 4
```

---

## P4-COMP — Complete production at an operation

```yaml
id: P4-COMP
title: Complete the operation and move to the next
phase: P4
goal: |
  Mark the operation done — produce the expected quantity of good
  pieces, optionally record scrap, and trigger the next operation.
roles:
  - Floor Operator
flows:
  - quote-to-cash
preconditions:
  - A work-order operation is in progress: an operator scanned the WO and the start action, the operation transitioned from Released to In Progress, labor time is tracking, and the kanban card has moved accordingly. (Established by P4-WO-START.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Scan the WO and the complete-operation action. Enter:
      - Good quantity: 98 (out of target 100)
      - Scrap quantity: 2
      - Scrap reason: "Setup miscut" (or similar)
    expected: |
      System accepts. Operation transitions to "Complete." Next
      operation in routing transitions to "Ready."
  - n: 2
    action: |
      Verify the kanban card moves from "In Progress" to "Ready"
      for the next work center.
    expected: |
      Card moved. The work center shown on the card is the next in
      routing.
expected_overall: |
  Operation is complete with good and scrap recorded. Next operation
  is ready.
pass_criteria: |
  Quantities recorded AND scrap reason captured AND next operation
  ready.
est_minutes: 5
```

---

## P4-COMP-FINAL — Final completion to inventory

```yaml
id: P4-COMP-FINAL
title: Complete the final operation and move WO to inventory
phase: P4
goal: |
  When the last routing operation completes, finished goods enter
  available inventory. If the part is serial-tracked, serial numbers
  are generated.
roles:
  - Floor Operator
flows:
  - quote-to-cash
preconditions:
  - All preceding operations on the WO have completed.
  - WO is on the final inspection or final operation.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Complete the final operation (Inspection). Enter good quantity:
      98.
    expected: |
      WO is closed. Finished goods inventory increases by 98 units.
      If part is serial-tracked, prompt for serial numbers.
  - n: 2
    action: |
      Verify the GL impact: WIP credited, finished goods inventory
      debited, with cost based on standard or actual depending on
      costing model.
    expected: |
      GL postings are correct.
expected_overall: |
  Finished goods are on the shelf. WO is closed. WIP is cleared.
pass_criteria: |
  FG inventory increased AND WIP cleared AND any serials recorded.
est_minutes: 6
```

---

## P4-PUTAWAY — Put-away of finished goods to a bin

```yaml
id: P4-PUTAWAY
title: Move finished goods from the staging area to a bin
phase: P4
goal: |
  After WO completion, physically move the goods to a storage bin
  and record the move.
roles:
  - Warehouse / Logistics
flows:
  - quote-to-cash
preconditions:
  - The final routing operation is complete: WO is closed, finished goods are in inventory, WIP is cleared, and any required serial numbers have been recorded. (Established by P4-COMP-FINAL.)
modality:
  - scanner
  - manual-entry
scale_tags:
  - mid-market
  - enterprise
steps:
  - n: 1
    action: |
      In the put-away area, scan the part / WO label. Scan or select
      the destination bin (e.g., "FG-BIN-A1").
    expected: |
      System records the move. Inventory location updates.
  - n: 2
    action: |
      Verify the part is now allocatable from that bin.
    expected: |
      Available-to-pick view shows the goods in the new bin.
expected_overall: |
  Finished goods are at their storage location and available for
  pick.
pass_criteria: |
  Goods at correct bin AND available for downstream allocation.
est_minutes: 4
```

---

## P4-PICK — Pick the sales order

```yaml
id: P4-PICK
title: Pick inventory for the sales order
phase: P4
goal: |
  Allocate finished goods to the SO and pick them physically — the
  start of the shipping side of the cycle.
roles:
  - Warehouse / Logistics
flows:
  - quote-to-cash
preconditions:
  - Finished goods have been moved from the staging area to a storage bin and are visible in the available-to-pick view at the new location. (Established by P4-PUTAWAY.)
  - Finished goods are available.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Open the pick queue or the SO. Generate a pick list.
    expected: |
      Pick list shows: SO number, customer, items, quantities, bin
      locations. If serials are required, the list includes serials
      to scan during pick.
  - n: 2
    action: |
      Pick at the bin: scan the part, confirm quantity (and serials
      if applicable).
    expected: |
      Each pick scan reduces bin quantity. Pick list updates.
  - n: 3
    action: |
      Mark the pick complete.
    expected: |
      Goods are staged for shipping. SO line is allocated and ready
      to ship.
expected_overall: |
  Pick is complete. Goods are at the staging area, ready to ship.
pass_criteria: |
  All pick lines complete AND inventory location updated AND SO
  allocated.
est_minutes: 8
```

---

## P4-PACK — Pack the order

```yaml
id: P4-PACK
title: Pack the order with proper documentation
phase: P4
goal: |
  Pack picked goods into shipping containers with packing slip and
  any customer-specific labeling requirements.
roles:
  - Warehouse / Logistics
flows:
  - quote-to-cash
preconditions:
  - All sales-order lines have been picked at the bin, allocated to the SO, and staged for shipping. (Established by P4-PICK.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Open the pack area. Pull up the staged SO. Scan items into a
      shipping container.
    expected: |
      Each item is verified against the SO line. Mismatches are
      flagged.
  - n: 2
    action: |
      Generate a packing slip and any required labels.
    expected: |
      Documents print or download. They include SO number, customer
      PO, line items, and any special instructions.
expected_overall: |
  Order is packed and documented, ready to hand off to the carrier.
pass_criteria: |
  Packing complete AND packing slip generated AND items match the SO.
est_minutes: 6
```

---

## P4-SHIP — Ship the order

```yaml
id: P4-SHIP
title: Ship the order
phase: P4
goal: |
  Hand off the packed order to a carrier — domestic or international —
  capturing tracking information and triggering the customer invoice.
roles:
  - Warehouse / Logistics
flows:
  - quote-to-cash
preconditions:
  - The order is packed into shipping containers, the packing slip has been generated, and items have been verified against the SO. (Established by P4-PACK.)
  - A shipping integration is configured (P0-INTEG-002) — or manual
    shipment entry.
steps:
  - n: 1
    action: |
      Open the ship area. Select the packed order. Choose a carrier
      and service level (or use the default).
    expected: |
      System produces a shipping label and tracking number — either
      via carrier integration or manual entry.
  - n: 2
    action: |
      Confirm the ship.
    expected: |
      SO marks as shipped. Tracking number is recorded on the SO.
      Inventory clears the staging area. The customer is (optionally)
      notified.
  - n: 3
    action: |
      Verify the next step: an invoice is either auto-generated or
      surfaces in the AR queue.
    expected: |
      Invoice is created from the shipped SO.
expected_overall: |
  Shipment is on its way. SO is shipped. Customer invoice is queued
  or created.
pass_criteria: |
  Shipment created AND tracking number recorded AND invoice triggered.
est_minutes: 8
```

---

## P4-SHIP-INTL — International shipment

```yaml
id: P4-SHIP-INTL
title: Ship internationally with customs documentation
phase: P4
goal: |
  Verify international shipments produce the right customs paperwork
  (commercial invoice, harmonized codes, country-of-origin).
roles:
  - Warehouse / Logistics
flows:
  - quote-to-cash
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one international customer (P2-CUST-004).
  - That customer has an SO ready to ship.
steps:
  - n: 1
    action: |
      In the ship workflow for the Munich Manufacturing GmbH order,
      verify the customs documentation prompts appear.
    expected: |
      Form requests harmonized tariff codes, country of origin,
      commercial-invoice value, and incoterm.
  - n: 2
    action: |
      Fill in the required fields and confirm.
    expected: |
      Commercial invoice and any other required documents (e.g.,
      certificate of origin) are generated.
expected_overall: |
  International shipments produce complete customs paperwork.
pass_criteria: |
  Commercial invoice generated AND harmonized codes captured AND
  incoterm recorded.
est_minutes: 7
```

---

## P4-INV-001 — Generate the customer invoice

```yaml
id: P4-INV-001
title: Generate the customer invoice
phase: P4
goal: |
  Bill the customer for the shipped goods, with correct line items,
  taxes, and terms.
roles:
  - Controller
  - Sales / Account Manager
flows:
  - quote-to-cash
preconditions:
  - The order has been handed off to a carrier, a tracking number is recorded on the SO, and the customer invoice has been triggered or queued. (Established by P4-SHIP.)
steps:
  - n: 1
    action: |
      Open the AR / invoicing queue. The shipped SO appears as
      ready to invoice.
    expected: |
      Invoice draft pre-populated with SO data: lines, prices, tax,
      terms, ship-to.
  - n: 2
    action: |
      Review the draft. Confirm the customer PO number is on the
      invoice. Verify tax calculation matches expectations for the
      ship-to jurisdiction.
    expected: |
      Tax is calculated correctly based on customer's tax code.
  - n: 3
    action: |
      Post the invoice.
    expected: |
      AR balance for ACME increases. GL impact: AR debited, revenue
      credited, sales tax payable credited.
  - n: 4
    action: |
      Send the invoice to the customer (email, PDF, EDI).
    expected: |
      Invoice is delivered. Status changes to "Sent."
expected_overall: |
  Customer invoice is in the customer's hands and on the AR ledger.
pass_criteria: |
  Invoice posted AND AR increased AND invoice sent AND GL postings
  correct.
est_minutes: 8
```

---

## P4-CASH — Apply customer payment

```yaml
id: P4-CASH
title: Apply customer payment to the invoice
phase: P4
goal: |
  Receive payment from the customer and apply it to the open
  invoice — closing out the cycle.
roles:
  - Controller
flows:
  - quote-to-cash
preconditions:
  - A customer invoice has been posted from a shipped sales order, AR has increased accordingly, and the invoice has been sent to the customer. (Established by P4-INV-001.)
steps:
  - n: 1
    action: |
      Find the cash receipts area. Enter:
      - Customer: ACME Industrial
      - Payment amount: full invoice total
      - Method: check, ACH, or wire
      - Check / reference number
    expected: |
      Form accepts the values.
  - n: 2
    action: |
      Apply the payment to the open invoice from P4-INV-001.
    expected: |
      System matches the payment to the invoice. Invoice status
      changes to "Paid."
  - n: 3
    action: |
      Verify GL impact: cash debited, AR credited.
    expected: |
      GL postings are correct.
expected_overall: |
  Quote-to-cash cycle complete. Invoice paid. Cycle profitability
  can now be analyzed.
pass_criteria: |
  Payment applied AND invoice marked paid AND GL postings correct
  AND AR balance for customer reduced.
est_minutes: 6
```

---

## P4-CASH-PARTIAL — Partial payment

```yaml
id: P4-CASH-PARTIAL
title: Apply a partial payment
phase: P4
goal: |
  Verify partial payments are supported — invoice stays open with
  reduced balance.
roles:
  - Controller
flows:
  - quote-to-cash
preconditions:
  - An open invoice exists.
steps:
  - n: 1
    action: |
      Receive a partial payment (e.g., 50% of an invoice). Apply.
    expected: |
      Invoice balance reduces. Invoice stays open with remainder.
  - n: 2
    action: |
      Verify aging is preserved (if invoice was 25 days old, it's
      still 25 days old, not reset to 0).
    expected: |
      Aging is correct. Customer statement shows the partial.
expected_overall: |
  Partial payments work. Aging is preserved.
pass_criteria: |
  Balance reduced by payment AND invoice still open AND aging unchanged.
est_minutes: 4
```

---

## P4-OVERPAY — Overpayment / credit on file

```yaml
id: P4-OVERPAY
title: Apply an overpayment as customer credit
phase: P4
goal: |
  Handle when a customer pays more than the invoice — the difference
  becomes credit on file, applicable to future invoices.
roles:
  - Controller
flows:
  - quote-to-cash
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - An open invoice exists.
steps:
  - n: 1
    action: |
      Receive a payment greater than the invoice total. Apply.
    expected: |
      Invoice closes. Excess shows as customer credit / unapplied cash.
  - n: 2
    action: |
      Open the customer record.
    expected: |
      Available credit is visible.
expected_overall: |
  Overpayments produce customer credit, not refunds (unless
  explicitly chosen).
pass_criteria: |
  Invoice closed AND credit recorded AND visible on customer record.
est_minutes: 4
```

---

## P4-HIRE-001 — Onboard a new employee

```yaml
id: P4-HIRE-001
title: Onboard a new employee end-to-end
phase: P4
goal: |
  Hire a new floor operator: complete employment paperwork (W-4,
  I-9, direct deposit, background check, drug test status), assign
  pay info, location, and trigger the rest.
roles:
  - HR
flows:
  - hire-to-first-assignment
preconditions:
  - At least one location and pay structure exist (P1).
steps:
  - n: 1
    action: |
      Find the new-hire workflow. Start onboarding for a new
      employee:
      - Name, address, contact info
      - Hire date: today
      - Pay: hourly, $22/hr, non-exempt, eligible for OT
      - Location: primary
      - Department: Production
    expected: |
      Onboarding form accepts all values.
  - n: 2
    action: |
      Capture or upload required documents:
      - W-4 (federal withholding)
      - I-9 (work authorization)
      - Direct deposit info
      - Background check cleared
      - Drug test cleared
    expected: |
      Each document is recorded with date, status, and an audit
      trail. Required documents are gated — onboarding can't complete
      without them.
  - n: 3
    action: |
      Capture digital signatures where required.
    expected: |
      Signatures are captured and stored with the document.
expected_overall: |
  New employee record is complete. Required compliance documentation
  is in place. Employee is ready for system access and first
  assignment.
pass_criteria: |
  Employee record exists AND all required documents present with
  signatures AND no compliance gates open.
est_minutes: 15
why_this_matters: |
  Missing I-9 paperwork on day-1 is a real fineable offense. The
  system needs to be the source of truth for this, not a folder of
  scanned PDFs.
```

---

## P4-HIRE-002 — Grant system access and role to new hire

```yaml
id: P4-HIRE-002
title: Grant system access to the new hire
phase: P4
goal: |
  Create a system user for the new employee, link them, and assign
  the appropriate role.
roles:
  - HR
  - IT Admin
flows:
  - hire-to-first-assignment
preconditions:
  - A new employee record exists with all required onboarding documents (W-4, I-9, direct deposit, background check, drug test) captured and any required digital signatures attached. (Established by P4-HIRE-001.)
steps:
  - n: 1
    action: |
      Open the new employee record. Initiate user creation.
    expected: |
      A new user is created or invited via email.
  - n: 2
    action: |
      Assign the Floor Operator role.
    expected: |
      Role is assigned. User has the right permissions for floor
      work.
  - n: 3
    action: |
      Have the new hire sign in. Verify they see the floor app and
      not administrative areas.
    expected: |
      Role-appropriate UI is visible. Restricted areas are not.
expected_overall: |
  New hire has system access. Their first sign-in shows the right UI.
pass_criteria: |
  User created AND linked to employee AND role assigned AND access
  appropriately scoped.
est_minutes: 6
```

---

## P4-HIRE-003 — First assignment for the new hire

```yaml
id: P4-HIRE-003
title: Assign a work order operation to the new hire
phase: P4
goal: |
  Put the new hire on their first task — a real WO operation at a
  work center where they're trained.
roles:
  - Production Planner
  - Floor Operator
flows:
  - hire-to-first-assignment
  - quote-to-cash
preconditions:
  - The new employee has a system user account, the user is linked to the employee record, and a Floor Operator role is assigned. (Established by P4-HIRE-002.)
  - At least one open WO operation exists.
steps:
  - n: 1
    action: |
      As a planner, open the kanban board. Drag (or assign) a
      released operation to the new hire.
    expected: |
      Assignment saves. The card is now tagged to the new hire.
  - n: 2
    action: |
      Sign in as the new hire. Open their assigned work list.
    expected: |
      The assignment is visible. They can scan the WO and start work.
  - n: 3
    action: |
      Verify their training records (if tracked) match the work
      center / operation. If not trained, the system should warn.
    expected: |
      Either: they're trained and start; or: a training warning is
      surfaced.
expected_overall: |
  New hire is on their first task, with training validation if applicable.
pass_criteria: |
  Assignment visible to the operator AND any required training is
  validated or flagged.
est_minutes: 6
```

---

## End of Phase 4

By the end of Phase 4, the company has:

- Run a full quote-to-cash cycle: quote → SO → WO → ship → invoice → cash
- Hired and put a new operator on their first task
- Verified scanner-driven floor workflows end-to-end
- Generated correct GL impact through the whole lifecycle

Phase 5 covers exception handling: damage, PM, RMA, period close, the rest.
