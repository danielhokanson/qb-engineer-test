# Phase 3 — First Transactions

This phase moves from describing things (master data) to *doing* things: issuing the first purchase orders, receiving the first inventory, commissioning the first fixed asset purchase, recording opening balances, and running the first cycle counts. By the end of Phase 3, the company has real inventory, real fixed assets on the books, and the financial system reflects what's on the floor.

## Scope

- **Purchase requisitions** (optional pre-PO step at larger scales)
- **Purchase orders** to vendors
- **Vendor receipts** that create the first real inventory
- **Asset commissioning** when a PO line is a fixed asset
- **Opening balances** — initial inventory, AR, AP, cash, equity from a prior system
- **Cycle counting** of opening inventory

## Roles introduced or used heavily

- `Procurement` — owns POs and receipts
- `Warehouse / Logistics` — physical receipt at the dock
- `Controller` — opening balances, GL impact of receipts
- `Maintenance Manager` — final commissioning of received fixed assets

---

## P3-REQ-001 — Submit a purchase requisition

```yaml
id: P3-REQ-001
title: Submit a purchase requisition
phase: P3
goal: |
  Verify users can request purchases without having direct PO authority.
  Requisitions go through approval before becoming a PO.
roles:
  - Production Manager
  - Maintenance Manager
flows:
  - vendor-to-asset
  - part-to-inventory
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - Phase 2 master data exists.
  - At least one part and one vendor exist.
steps:
  - n: 1
    action: |
      Find and open the requisitions area. Submit a new requisition:
      - Part: RM-STEEL-1018-3X3
      - Quantity: 500 ft
      - Needed by: 2 weeks from today
      - Justification: short text
    expected: |
      Requisition saves in "Pending approval" status.
  - n: 2
    action: |
      Sign in as a user with PO approval authority. Open the
      requisitions queue.
    expected: |
      The pending requisition is visible.
  - n: 3
    action: |
      Approve the requisition.
    expected: |
      Requisition status changes to "Approved." Either auto-creates
      a PO or surfaces a "Convert to PO" action.
expected_overall: |
  Requisition workflow exists end-to-end.
pass_criteria: |
  Requisition was submitted AND approved AND linked to a downstream PO.
est_minutes: 6
```

---

## P3-PO-001 — Issue the first purchase order

```yaml
id: P3-PO-001
title: Issue the first purchase order
phase: P3
goal: |
  Create the first real PO against a vendor and submit it.
roles:
  - Procurement
flows:
  - vendor-to-asset
  - part-to-inventory
preconditions:
  - At least one vendor exists.
  - At least one part with vendor pricing exists.
steps:
  - n: 1
    action: |
      Find and open the purchase orders area. Choose to create a new PO.
    expected: |
      The PO creation form opens. Required fields are clear.
  - n: 2
    action: |
      Select Pacific Steel Supply. Add a line for 500 ft of
      RM-STEEL-1018-3X3. Verify default cost ($4.50/ft) and lead time
      (14 days) populated automatically from vendor pricing.
    expected: |
      Defaults populate correctly. Total amount displays.
  - n: 3
    action: |
      Add a second line: 100 each of "Hardware-Bolt-M8" at a plausible
      cost. Set ship-to: primary location.
    expected: |
      Both lines visible. Order subtotal, tax, and total are calculated.
  - n: 4
    action: |
      Submit the PO.
    expected: |
      PO transitions to "Issued" or "Sent." It carries a stable PO
      number. Status is visible to the vendor (if vendor portal exists)
      or via printable PDF.
expected_overall: |
  First PO issued, with multiple lines, correct defaults, and
  available downstream for receipt.
pass_criteria: |
  PO issued with stable number AND lines reflect entered values
  AND it appears in the open-PO list.
est_minutes: 8
```

---

## P3-PO-002 — PO with mixed inventory and fixed-asset lines

```yaml
id: P3-PO-002
title: PO with both inventory and fixed-asset lines
phase: P3
goal: |
  Verify a single PO can carry both inventory parts (consumed/sold)
  and fixed-asset items (capitalized) — and that the GL impact at
  receipt is correct for each line type.
roles:
  - Procurement
  - Controller
flows:
  - vendor-to-asset
preconditions:
  - At least one vendor exists.
  - Asset GL account exists from P1.
steps:
  - n: 1
    action: |
      Create a new PO to a vendor that supplies both. Add:
      - Line 1: Inventory — 100 ft of RM-STEEL-1018-3X3
      - Line 2: Fixed asset — 1 each of "Hydraulic Press 60-ton" at
        $35,000 (asset class, capitalize)
    expected: |
      Form differentiates the two. Fixed-asset line requires asset
      class, capitalization GL account, and an estimated useful life.
  - n: 2
    action: |
      Submit the PO.
    expected: |
      PO issued. Both line types visible.
expected_overall: |
  PO supports mixed line types. Distinction persists for downstream
  receipt processing.
pass_criteria: |
  Both lines submitted on one PO AND each line carries its own
  account/class designation.
why_this_matters: |
  ERPs that don't support mixed POs force buyers to issue separate
  POs to the same vendor for the same delivery — that's friction
  that real shops don't accept.
est_minutes: 8
```

---

## P3-PO-003 — Amend a PO before receipt

```yaml
id: P3-PO-003
title: Amend a PO after issuance, before receipt
phase: P3
goal: |
  Verify POs can be revised (quantity change, price update) and the
  vendor is notified, with a clear amendment trail.
roles:
  - Procurement
flows:
  - vendor-to-asset
  - part-to-inventory
preconditions:
  - P3-PO-001 has passed (an issued PO exists).
steps:
  - n: 1
    action: |
      Open the issued PO. Use the amend or revise action.
    expected: |
      The PO becomes editable in revision mode. The original is
      preserved.
  - n: 2
    action: |
      Increase line 1 quantity from 500 to 750 ft. Save.
    expected: |
      Amendment saves. PO version increments. Revision history
      visible.
  - n: 3
    action: |
      Re-send to vendor (if there's a "send" action).
    expected: |
      Vendor receives the amended PO; original is superseded but
      preserved for audit.
expected_overall: |
  PO amendments are tracked. Vendors can see what changed.
pass_criteria: |
  Old version preserved AND new version active AND change history
  visible.
est_minutes: 6
```

---

## P3-RECV-001 — Receive the first inventory

```yaml
id: P3-RECV-001
title: Receive against a PO at the dock
phase: P3
goal: |
  Record a vendor receipt — material physically arrived. Inventory
  comes into the system; the PO line moves to received status.
roles:
  - Warehouse / Logistics
  - Procurement
flows:
  - part-to-inventory
preconditions:
  - P3-PO-001 has passed.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Find and open the receiving area. Either scan the PO barcode
      or search by PO number.
    expected: |
      The PO opens. Receivable lines are visible with their
      ordered/received/remaining quantities.
  - n: 2
    action: |
      Receive line 1: 500 ft of RM-STEEL-1018-3X3. Enter lot number
      "PSS-2026-04-001" (since the part is lot-tracked from P2-PART-003).
    expected: |
      Lot prompt appears (because the part is lot-tracked). Lot is
      recorded.
  - n: 3
    action: |
      Receive line 2: 100 each of Hardware-Bolt-M8.
    expected: |
      No lot prompt for non-lot-tracked part. Quantity received.
  - n: 4
    action: |
      Confirm and post the receipt.
    expected: |
      Inventory increases. PO status changes to "Received" or
      "Closed." A receipt document is created and printable.
expected_overall: |
  First inventory exists. PO is closed. GL impact: inventory account
  debited, GR/IR (goods received / invoice received) account credited.
pass_criteria: |
  Inventory increased by received quantity AND lot recorded for
  lot-tracked items AND PO marked received.
est_minutes: 8
negative_variants:
  - id: P3-RECV-001-N1
    title: Try to receive more than ordered
    action: |
      On the same PO, try to enter receipt quantity 600 (greater
      than 500 ordered).
    expected: |
      The system warns or blocks the over-receipt. If allowed (with
      tolerance), it must be flagged for review.
    pass_criteria: |
      Over-receipt was either blocked OR flagged AND not silently accepted.
  - id: P3-RECV-001-N2
    title: Try to receive without lot number on lot-tracked part
    action: |
      Try to receive line 1 without entering a lot number.
    expected: |
      The system blocks submission and explains that a lot is required.
    pass_criteria: |
      Submission blocked AND error names the lot field.
```

---

## P3-RECV-002 — Partial receipt

```yaml
id: P3-RECV-002
title: Receive a partial shipment
phase: P3
goal: |
  Verify the system correctly handles a partial receipt — line stays
  open, PO stays open, vendor expected to ship the balance.
roles:
  - Warehouse / Logistics
flows:
  - part-to-inventory
preconditions:
  - An issued PO exists with at least one line.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Open a PO with an unreceived line for 100 each of a part.
      Receive only 60 of them.
    expected: |
      Line accepts partial receipt. Remaining quantity (40) is visible.
  - n: 2
    action: |
      Save / post the receipt.
    expected: |
      Inventory increased by 60. PO line shows 60 received, 40 on order.
      PO is still open.
expected_overall: |
  Partial receipts are supported. PO stays open until fully received
  or short-closed.
pass_criteria: |
  Inventory matches partial quantity AND PO line still open AND
  remaining quantity correct.
est_minutes: 5
```

---

## P3-RECV-003 — Receive with damage / quality reject

```yaml
id: P3-RECV-003
title: Receive partially with quality rejection
phase: P3
goal: |
  Verify that received material can be split between accepted and
  rejected at the dock, with the rejected quantity returned or
  isolated for quality review.
roles:
  - Warehouse / Logistics
  - QC Inspector
flows:
  - part-to-inventory
preconditions:
  - An issued PO with a line for 500 ft of steel.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At receipt, mark 50 ft as "damaged on arrival" while accepting
      the remaining 450 ft.
    expected: |
      The system supports splitting the receipt — accepted vs.
      rejected. Rejected goes to a quarantine bin / status, NOT into
      regular inventory.
  - n: 2
    action: |
      Initiate a return-to-vendor for the rejected 50 ft.
    expected: |
      A return-to-vendor (RTV) document is created. The rejected
      material is isolated until the RTV ships.
expected_overall: |
  Receipt-time quality issues are handled in-line, not as a
  follow-up workflow.
pass_criteria: |
  Accepted quantity in regular inventory AND rejected quantity
  isolated AND RTV document created.
est_minutes: 8
```

---

## P3-ASSET-COMM-001 — Commission a received fixed asset

```yaml
id: P3-ASSET-COMM-001
title: Commission a fixed asset received on a PO
phase: P3
goal: |
  When a fixed-asset PO line is received, the asset record is either
  auto-created or surfaces for an authoritative final commissioning
  step (asset tag, location, in-service date).
roles:
  - Maintenance Manager
  - Controller
flows:
  - vendor-to-asset
preconditions:
  - P3-PO-002 has passed (PO with a fixed-asset line).
  - P3-RECV-001 or equivalent has received the asset line.
steps:
  - n: 1
    action: |
      Open the asset commissioning queue (or the fixed-asset side of
      the receipt). The "Hydraulic Press 60-ton" should be visible
      pending commissioning.
    expected: |
      A commissioning task or draft asset record exists.
  - n: 2
    action: |
      Complete commissioning: assign asset tag, location: primary
      location, work center: Press Shop, in-service date: today,
      depreciation method: straight-line, useful life: 10 years.
    expected: |
      Asset record finalizes. Depreciation schedule is generated.
  - n: 3
    action: |
      Verify GL impact: $35,000 debit to fixed-asset capitalization
      account, credit to GR/IR. A vendor invoice received later will
      clear GR/IR.
    expected: |
      GL postings reflect the capitalization (no expense hit).
expected_overall: |
  Fixed asset is on the books with depreciation running. GL impact
  is correct (capitalization, not expense).
pass_criteria: |
  Asset record exists AND depreciation schedule visible AND GL
  postings reflect capitalization.
why_this_matters: |
  This is where many ERPs leak the inventory-vs-asset distinction.
  If the receipt posts to inventory by mistake, the controller is
  doing journal-entry corrections at month-end. Catching this at
  commissioning time saves real time.
est_minutes: 10
```

---

## P3-AP-001 — Match a vendor invoice to a PO and receipt

```yaml
id: P3-AP-001
title: 3-way match a vendor invoice to PO and receipt
phase: P3
goal: |
  Verify the standard 3-way match — invoice from vendor matches the
  PO (price) and the receipt (quantity) before payment is approved.
roles:
  - Controller
  - Procurement
flows:
  - vendor-to-asset
  - part-to-inventory
preconditions:
  - P3-PO-001 has passed.
  - P3-RECV-001 has passed.
steps:
  - n: 1
    action: |
      Find the AP invoice entry area. Enter a vendor invoice from
      Pacific Steel Supply: 500 ft at $4.50/ft, total $2,250.
    expected: |
      Form prompts for PO/receipt matching.
  - n: 2
    action: |
      Match against the PO and receipt from earlier.
    expected: |
      The system shows that price ($4.50/ft = PO), quantity
      (500 ft = receipt), and total ($2,250) all match. Invoice
      is ready for approval.
  - n: 3
    action: |
      Approve the invoice for payment. Verify GL impact: GR/IR
      cleared, AP credited.
    expected: |
      AP increases. GR/IR clears. Invoice scheduled per terms.
expected_overall: |
  3-way match works correctly. GR/IR clears at invoice receipt.
pass_criteria: |
  Match passed AND AP entry posted AND GR/IR account cleared.
est_minutes: 8
negative_variants:
  - id: P3-AP-001-N1
    title: Invoice with price mismatch
    action: |
      Enter a vendor invoice with a price of $5.00/ft (PO had $4.50).
    expected: |
      System flags the price mismatch. Either blocks approval or
      routes to controller for tolerance approval.
    pass_criteria: |
      Mismatch flagged AND requires extra approval to proceed.
```

---

## P3-OB-001 — Enter opening inventory balances

```yaml
id: P3-OB-001
title: Enter opening inventory balances from a prior system
phase: P3
goal: |
  When migrating from another system (or from spreadsheets), enter
  starting inventory quantities and unit costs. The system creates
  the opening GL postings to balance.
roles:
  - Controller
  - Warehouse / Logistics
flows:
  - foundational-records
preconditions:
  - Parts exist for at least 5 items.
  - Inventory and equity GL accounts exist.
steps:
  - n: 1
    action: |
      Find the opening balances area or "physical count entry" /
      "starting inventory."
    expected: |
      A way to enter opening balances exists, distinct from regular
      inventory adjustments.
  - n: 2
    action: |
      Enter quantities and unit costs for 5 parts. Set the as-of date
      to today (or the migration cutover date).
    expected: |
      Each entry accepts quantity, unit cost, and lot number where
      applicable. Total inventory value is calculated.
  - n: 3
    action: |
      Post the opening balances.
    expected: |
      Inventory exists for each part. Equivalent equity / opening-balance
      GL entry is auto-created so the books balance.
expected_overall: |
  Opening balances are posted. Inventory matches expectations. Books
  are in balance.
pass_criteria: |
  All 5 parts have correct opening quantity AND a corresponding
  equity GL entry exists.
est_minutes: 12
```

---

## P3-OB-002 — Enter opening AR and AP

```yaml
id: P3-OB-002
title: Enter opening AR and AP balances
phase: P3
goal: |
  Bring open invoices and open vendor invoices over from a prior
  system as opening balances, properly aged.
roles:
  - Controller
flows:
  - foundational-records
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one customer and one vendor exist.
steps:
  - n: 1
    action: |
      Open the AR opening balance area. Enter:
      - Customer: ACME Industrial
      - Original invoice date: 30 days ago
      - Amount: $15,000
      - Due date: today
    expected: |
      AR entry is created with correct aging.
  - n: 2
    action: |
      Open the AP opening balance area. Enter a similar prior-period
      open vendor invoice for $5,000.
    expected: |
      AP entry is created with correct aging.
  - n: 3
    action: |
      Run an AR aging report and AP aging report.
    expected: |
      Both opening balances appear in the correct aging buckets.
expected_overall: |
  Opening AR and AP balances are entered with correct aging and
  appear in standard reports.
pass_criteria: |
  AR and AP totals match what was entered AND aging is correct.
est_minutes: 10
```

---

## P3-COUNT-001 — First cycle count

```yaml
id: P3-COUNT-001
title: Run a cycle count on opening inventory
phase: P3
goal: |
  Verify the cycle count workflow: generate a count list, count
  physically, enter results, reconcile any variance.
roles:
  - Warehouse / Logistics
flows:
  - cycle-count
preconditions:
  - P3-OB-001 has passed (opening inventory exists).
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Find and open the cycle count area. Generate a count for 5
      randomly selected parts (or a specific bin / location).
    expected: |
      Count list created with expected quantities hidden (so the
      counter doesn't bias toward the system value).
  - n: 2
    action: |
      Enter physical count quantities. For 4 parts, enter the system
      quantity. For 1 part, enter a quantity 5 less than system
      (simulating a variance).
    expected: |
      Counts are recorded. Variance for the 5th part is flagged.
  - n: 3
    action: |
      Review the variance. Approve the adjustment.
    expected: |
      Inventory adjustment posts. GL impact: inventory account
      adjusted by variance value, offset to inventory variance /
      shrinkage account.
expected_overall: |
  Cycle count complete with variance properly recorded and GL impact
  correct.
pass_criteria: |
  Counts entered AND variance flagged AND adjustment posted.
est_minutes: 12
```

---

## P3-COUNT-002 — Cycle count with bin transfer

```yaml
id: P3-COUNT-002
title: Move inventory between bins after count
phase: P3
goal: |
  Verify bin-level inventory movement records correctly without
  changing total quantity on hand.
roles:
  - Warehouse / Logistics
flows:
  - cycle-count
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one bin exists.
  - Inventory in at least one bin.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Find the bin transfer area. Move 50 ft of RM-STEEL-1018-3X3
      from bin A to bin B.
    expected: |
      Transfer accepts source bin, destination bin, quantity.
  - n: 2
    action: |
      Confirm the transfer.
    expected: |
      Bin A quantity decreases by 50; bin B quantity increases by 50.
      Total on-hand is unchanged. No GL impact.
expected_overall: |
  Bin transfers move inventory location without changing valuation.
pass_criteria: |
  Source quantity decreased AND dest quantity increased AND total
  unchanged AND no GL postings.
est_minutes: 4
```

---

## P3-PAY-001 — Pay a vendor invoice

```yaml
id: P3-PAY-001
title: Pay an approved vendor invoice
phase: P3
goal: |
  Verify the payment workflow — issue a check or ACH for an
  approved invoice, post the payment, and clear the AP entry.
roles:
  - Controller
flows:
  - vendor-to-asset
  - part-to-inventory
preconditions:
  - P3-AP-001 has passed (an approved AP invoice exists).
steps:
  - n: 1
    action: |
      Open the AP payments area. Select the approved Pacific Steel
      Supply invoice.
    expected: |
      The invoice appears with full amount due.
  - n: 2
    action: |
      Issue payment by check (or ACH if integrated). Confirm.
    expected: |
      Payment is recorded. Check number / ACH ref is captured.
      Invoice is marked paid.
  - n: 3
    action: |
      Verify GL impact: cash credited, AP debited (cleared).
    expected: |
      GL postings are correct. AP balance for this vendor decreases
      by the payment amount.
expected_overall: |
  Vendor payment processed end-to-end. AP cleared.
pass_criteria: |
  Invoice marked paid AND cash and AP postings are correct.
est_minutes: 6
```

---

## End of Phase 3

By the end of Phase 3, the company has:

- At least one PO issued, received, and paid
- At least one fixed asset commissioned and depreciating
- Opening inventory and AR/AP balances posted from prior systems
- A first successful cycle count and bin transfer
- All transactions posted with correct GL impact

Phase 4 begins by exercising the sales side: lead → quote → SO → WO → ship → invoice → cash.
