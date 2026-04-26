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
negative_variants:
  - id: P4-QUOTE-001-N1
    title: Reject zero-quantity line on a quote
    action: |
      Try to add a quote line with quantity = 0.
    expected: |
      Save is blocked or the line is removed automatically with a
      clear message.
    pass_criteria: |
      Zero-quantity line not silently saved.
  - id: P4-QUOTE-001-N2
    title: Reject quote referencing a deactivated customer
    action: |
      Deactivate ACME Industrial. Try to create a quote referencing
      them.
    expected: |
      Customer is filtered out, or selection is blocked with a clear
      "customer inactive" message.
    pass_criteria: |
      No quote created against inactive customer.
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
negative_variants:
  - id: P4-QUOTE-002-N1
    title: Override below cost requires controller approval
    action: |
      Override the price to a value below the part's standard cost.
    expected: |
      Save is blocked or routes for controller approval. The
      below-cost condition is named explicitly.
    pass_criteria: |
      Below-cost override is gated.
  - id: P4-QUOTE-002-N2
    title: Reject override with no documented reason
    action: |
      Override the price without entering an override reason.
    expected: |
      Save is blocked or warns that overrides require a reason.
    pass_criteria: |
      Reason-less override refused.
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
negative_variants:
  - id: P4-QUOTE-003-N1
    title: Cannot convert an expired quote
    action: |
      Set the quote's validity to a date in the past, then try to
      convert.
    expected: |
      The convert action is blocked or warns; expired quotes require
      explicit re-issue or extension.
    pass_criteria: |
      Expired quote conversion is gated.
  - id: P4-QUOTE-003-N2
    title: Cannot convert the same quote twice
    action: |
      Convert the quote, then attempt to convert it again.
    expected: |
      The action is unavailable or surfaces a clear "already
      converted" message linking to the SO.
    pass_criteria: |
      Double conversion refused.
  - id: P4-QUOTE-003-N3
    title: Reject SO without a customer PO number when required
    action: |
      Confirm the SO without entering the customer's PO number on a
      customer that requires PO references.
    expected: |
      Save is blocked or warns; PO reference is enforced per
      customer setting.
    pass_criteria: |
      Missing required PO is surfaced before SO confirmation.
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
negative_variants:
  - id: P4-WO-001-N1
    title: Warn on insufficient material at release
    action: |
      Reduce on-hand of a BOM component below what the WO would need.
      Attempt to release the WO.
    expected: |
      Application warns about projected material shortage, and either
      blocks release until material is on order, or releases with a
      clear "shortage" flag visible to the floor and planner.
    pass_criteria: |
      Shortage was surfaced AND release outcome is explicit (blocked
      or flagged), not silent.
  - id: P4-WO-001-N2
    title: Reject release without an active routing
    action: |
      Mark the part's routing as draft / inactive (or pick a part
      without a routing). Try to release.
    expected: |
      Release is blocked with a clear "no active routing" message.
    pass_criteria: |
      Release blocked AND error names missing routing.
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
negative_variants:
  - id: P4-WO-002-N1
    title: Closed WOs do not appear on the active kanban board
    action: |
      Close (or cancel) a WO. Open the kanban board for that
      production area.
    expected: |
      The closed WO is not shown on the active board; it appears
      only in a "completed" or filtered view.
    pass_criteria: |
      Active board does not show closed WOs.
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
negative_variants:
  - id: P4-WO-START-N1
    title: Cannot start an operation already in progress on another operator
    action: |
      As a second operator, scan the same operation that another
      operator has already started.
    expected: |
      The action is blocked or warns; the operation cannot have two
      simultaneous owners (or requires explicit handoff).
    pass_criteria: |
      Duplicate start is refused or routed through a handoff flow.
  - id: P4-WO-START-N2
    title: Cannot start an operation out of routing order
    action: |
      Try to start the second routing operation while the first is
      still released.
    expected: |
      The action is blocked with a clear "previous operation must
      complete first" message.
    pass_criteria: |
      Out-of-order start refused.
  - id: P4-WO-START-N3
    title: Cannot start without scanning operator badge
    action: |
      Try to scan the WO and start without first identifying the
      operator.
    expected: |
      The start action is blocked until an operator is identified.
    pass_criteria: |
      Anonymous start refused.
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
  - |
    A work-order operation is in progress: an operator scanned the WO and the start action, the operation transitioned from Released to In Progress, labor time is tracking, and the kanban card has moved accordingly. (Established by P4-WO-START.)
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
  - |
    A work-order operation is in progress: an operator scanned the WO and the start action, the operation transitioned from Released to In Progress, labor time is tracking, and the kanban card has moved accordingly. (Established by P4-WO-START.)
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
negative_variants:
  - id: P4-LABOR-N1
    title: Reject overlapping labor entries for same operator
    action: |
      Try to clock the same operator into a second operation while
      they are still clocked in to the first.
    expected: |
      Save is blocked or surfaces a clear "operator already clocked
      in" prompt requiring explicit reassignment.
    pass_criteria: |
      Operator cannot be in two operations simultaneously.
  - id: P4-LABOR-N2
    title: Reject negative or zero labor duration
    action: |
      Manually edit a closed labor entry so the end time precedes
      the start.
    expected: |
      Save is blocked with a clear "end must be after start" error.
    pass_criteria: |
      Inverted labor times refused.
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
  - |
    A work-order operation is in progress: an operator scanned the WO and the start action, the operation transitioned from Released to In Progress, labor time is tracking, and the kanban card has moved accordingly. (Established by P4-WO-START.)
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
negative_variants:
  - id: P4-COMP-N1
    title: Reject completion exceeding remaining target
    action: |
      Try to record good quantity 200 on a WO with target 100 and
      no prior completions.
    expected: |
      Save is blocked or warns; over-completion requires explicit
      override.
    pass_criteria: |
      Over-completion gated.
  - id: P4-COMP-N2
    title: Reject scrap entry without reason
    action: |
      Try to record any scrap quantity with the reason field blank.
    expected: |
      Save is blocked with a clear "scrap reason is required"
      message.
    pass_criteria: |
      Scrap without reason refused.
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
negative_variants:
  - id: P4-COMP-FINAL-N1
    title: Cannot final-complete with serials skipped on serial-tracked part
    action: |
      Skip serial entry on a serial-tracked finished good and try
      to confirm completion.
    expected: |
      Completion is blocked with a clear "serial numbers required"
      message naming each missing unit.
    pass_criteria: |
      Final completion gated by serial entry.
  - id: P4-COMP-FINAL-N2
    title: Reject duplicate serial across this and prior runs
    action: |
      Enter a serial number that already exists on a previously
      shipped unit of the same part.
    expected: |
      Save is blocked with a clear "serial already used" message.
    pass_criteria: |
      Duplicate serial refused.
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
  - |
    The final routing operation is complete: WO is closed, finished goods are in inventory, WIP is cleared, and any required serial numbers have been recorded. (Established by P4-COMP-FINAL.)
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
negative_variants:
  - id: P4-PUTAWAY-N1
    title: Reject put-away to bin restricted to a different part
    action: |
      Try to put away FG-BRACKET-A1 to a bin restricted to raw
      material storage.
    expected: |
      Save is blocked with a clear "bin restriction" message.
    pass_criteria: |
      Restricted bin assignment refused.
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
negative_variants:
  - id: P4-PICK-N1
    title: Reject pick of wrong serial when serials are required
    action: |
      Scan a serial number not on the SO's allocation list.
    expected: |
      Pick is blocked with a clear "this serial is not allocated to
      the order" message.
    pass_criteria: |
      Wrong serial refused.
  - id: P4-PICK-N2
    title: Reject pick exceeding allocated quantity
    action: |
      Try to pick 110 when the SO line allocates 100.
    expected: |
      Save is blocked or warns; over-pick must be explicit.
    pass_criteria: |
      Over-pick gated.
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
negative_variants:
  - id: P4-PACK-N1
    title: Reject pack scan of item not on the SO
    action: |
      Scan a part not present on the SO into the shipping container.
    expected: |
      The scan is rejected with a clear "item not on order" message.
    pass_criteria: |
      Out-of-order item refused at pack.
  - id: P4-PACK-N2
    title: Reject completion of packing with missing items
    action: |
      Try to mark the order packed while one SO line still has items
      unscanned.
    expected: |
      Save is blocked with a list of remaining lines.
    pass_criteria: |
      Pack incomplete refused until short-ship is documented.
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
negative_variants:
  - id: P4-SHIP-N1
    title: Reject ship without packing complete
    action: |
      Try to ship before the order has been packed.
    expected: |
      The ship action is unavailable or blocked with a "pack first"
      message.
    pass_criteria: |
      Ship-before-pack refused.
  - id: P4-SHIP-N2
    title: Reject ship to address with no postal validation
    action: |
      Try to ship to an address missing postal code or with a
      malformed one.
    expected: |
      Save is blocked or warns; the carrier cannot accept the
      shipment without a valid postal code.
    pass_criteria: |
      Bad ship-to address surfaces a clear validation error.
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
negative_variants:
  - id: P4-SHIP-INTL-N1
    title: Reject international shipment without harmonized code
    action: |
      Try to confirm the shipment leaving the harmonized tariff code
      blank on at least one line.
    expected: |
      Save is blocked with a clear list of lines missing the code.
    pass_criteria: |
      Missing tariff codes refused at ship.
  - id: P4-SHIP-INTL-N2
    title: Reject incoterm not in the supported list
    action: |
      Try to free-text an incoterm value (e.g., "DDPish") rather
      than picking from the controlled list.
    expected: |
      Save is blocked or restricts input to the supported set
      (EXW, FOB, DAP, DDP, etc.).
    pass_criteria: |
      Invalid incoterm refused.
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
negative_variants:
  - id: P4-INV-001-N1
    title: Reject invoice with no ship-to address resolved
    action: |
      Clear or break the ship-to on the SO (e.g., the address is
      flagged invalid). Try to generate the invoice.
    expected: |
      Invoice generation is blocked with a clear "ship-to required for
      taxation" message. Or, if a default ship-to fallback is used,
      the fallback is named explicitly to the user — not silent.
    pass_criteria: |
      Missing ship-to is surfaced AND invoice does not silently use a
      wrong default.
  - id: P4-INV-001-N2
    title: Reject invoice in a closed period
    action: |
      Close the period, then try to post an invoice dated in that
      closed period.
    expected: |
      Posting is blocked with a clear "period closed" message.
    pass_criteria: |
      Posting blocked AND message is plain.
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
negative_variants:
  - id: P4-CASH-N1
    title: Reject duplicate check / reference number for same customer
    action: |
      Apply a payment, then try to apply a second payment with the
      same check number for the same customer.
    expected: |
      Save is blocked or warns; duplicate check numbers are typically
      data-entry errors.
    pass_criteria: |
      Duplicate reference refused or surfaces an explicit warning.
  - id: P4-CASH-N2
    title: Reject payment to a different customer's invoice
    action: |
      Try to apply ACME's payment against an invoice issued to
      another customer.
    expected: |
      Save is blocked with a clear "payer does not match invoice
      customer" message.
    pass_criteria: |
      Cross-customer application refused.
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
negative_variants:
  - id: P4-CASH-PARTIAL-N1
    title: Reject partial payment exceeding invoice balance
    action: |
      Try to apply a partial payment that exceeds the remaining
      invoice balance.
    expected: |
      Save is blocked or surfaces overpayment-handling options;
      silent over-application is refused.
    pass_criteria: |
      Over-application is gated.
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
negative_variants:
  - id: P4-OVERPAY-N1
    title: Cannot refund overpayment without controller approval
    action: |
      As a Sales user, try to convert the customer credit to a
      cash refund.
    expected: |
      The action is unavailable to the role; refunds require
      controller approval.
    pass_criteria: |
      Self-service refund refused for non-authorized roles.
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
negative_variants:
  - id: P4-HIRE-001-N1
    title: Cannot complete onboarding with I-9 unsigned
    action: |
      Skip the I-9 signature and try to mark onboarding complete.
    expected: |
      Save is blocked with a clear "I-9 signature required" message
      naming each missing compliance gate.
    pass_criteria: |
      Onboarding completion gated by I-9 signoff.
  - id: P4-HIRE-001-N2
    title: Reject hire date before person's earliest valid work date
    action: |
      Set the hire date to a date earlier than the I-9 work-
      authorization start date.
    expected: |
      Save is blocked or warns; hire cannot precede authorization.
    pass_criteria: |
      Pre-authorization hire date refused.
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
negative_variants:
  - id: P4-HIRE-002-N1
    title: Cannot grant access before onboarding compliance complete
    action: |
      For an employee with incomplete I-9 / W-4, try to issue a
      system user account.
    expected: |
      The action is blocked with a clear list of missing compliance
      items.
    pass_criteria: |
      Access provisioning gated by compliance.
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
negative_variants:
  - id: P4-HIRE-003-N1
    title: Cannot assign operation requiring missing certification
    action: |
      Assign the new hire to a work center that requires a forklift
      cert they do not have on file.
    expected: |
      Assignment is blocked or warns; certification gating must be
      explicit.
    pass_criteria: |
      Uncertified assignment refused or surfaces an explicit warning.
```

---

## End of Phase 4

By the end of Phase 4, the company has:

- Run a full quote-to-cash cycle: quote → SO → WO → ship → invoice → cash
- Hired and put a new operator on their first task
- Verified scanner-driven floor workflows end-to-end
- Generated correct GL impact through the whole lifecycle

Phase 5 covers exception handling: damage, PM, RMA, period close, the rest.
