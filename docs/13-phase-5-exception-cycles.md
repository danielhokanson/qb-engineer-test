# Phase 5 — First Exception Cycles

This phase exercises the "grey path" — the things that happen when production goes off the happy path. Damage reports, preventative maintenance, customer returns, period close, scrap reporting, R&D feedback loops. By the end of Phase 5, the system has been through realistic edge cases.

## Scope

- **Damage reporting** — damaged equipment, in-process scrap, work stoppage.
- **Preventative maintenance (PM)** — scheduled maintenance, PM triggers, repair WOs.
- **Customer returns / RMA** — receive a returned product, decide on repair / replace / refund.
- **Period close** — month-end / quarter-end financial close.
- **R&D feedback** — capture floor feedback against engineering revisions.
- **Inventory adjustments** — write-offs, found inventory, scrap.
- **Vendor returns** — the other side of receiving with a defect.

## Roles introduced or used heavily

- `Maintenance Manager`, `Maintenance Tech` — own PM and repair WOs.
- `QC Inspector` — fail/rework loops.
- `Controller` — period close, write-offs.
- `Floor Operator` — reports damage, scrap, work stoppages.

---

## P5-DAMAGE-001 — Report damage to equipment

```yaml
id: P5-DAMAGE-001
title: Report damage to a piece of equipment
phase: P5
goal: |
  Floor operator notices damage on equipment (a press hydraulic leak,
  a worn fixture) and logs it. A maintenance ticket is created.
roles:
  - Floor Operator
  - Maintenance Manager
flows:
  - damage-to-completion
preconditions:
  - At least one fixed asset record (P1-ASSET-001).
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At the press, scan the asset tag. Choose "Report damage" from
      the asset's actions.
    expected: |
      A damage report form opens, pre-filled with the asset.
  - n: 2
    action: |
      Enter:
      - Description: "Hydraulic fluid leak from main cylinder"
      - Severity: Medium (operable but degraded)
      - Photos (if supported): one or two
    expected: |
      Form accepts. Severity drives downstream priority.
  - n: 3
    action: |
      Submit. Verify a maintenance ticket / work order is created.
    expected: |
      A maintenance WO appears in the maintenance queue, linked to
      the asset.
expected_overall: |
  Damage is logged, photographed, and dispatched to maintenance.
pass_criteria: |
  Maintenance WO created AND linked to the asset AND visible in the
  maintenance queue.
est_minutes: 5
negative_variants:
  - id: P5-DAMAGE-001-N1
    title: Reject damage report on a retired asset
    action: |
      Retire an asset (per P5-ASSET-RETIRE-001). Try to file a damage
      report against it.
    expected: |
      Report is blocked with a clear "asset is retired" message.
    pass_criteria: |
      No report created against retired asset.
```

---

## P5-DAMAGE-002 — Maintenance triages and assigns

```yaml
id: P5-DAMAGE-002
title: Maintenance triages a damage report and assigns a tech
phase: P5
goal: |
  The maintenance manager reviews the damage report, sets priority,
  and assigns a tech. The kanban / scheduling board reflects this.
roles:
  - Maintenance Manager
flows:
  - damage-to-completion
preconditions:
  - A damage report exists against an asset, with description, severity, and (optionally) photos, and a maintenance ticket has been created in the maintenance queue. (Established by P5-DAMAGE-001.)
steps:
  - n: 1
    action: |
      Open the maintenance queue. Find the new ticket.
    expected: |
      Ticket visible with severity, asset, description, and
      reporter.
  - n: 2
    action: |
      Set priority: High (blocks production). Assign to a tech.
      Schedule for today.
    expected: |
      Ticket updates with assignment. The tech sees it on their
      dashboard.
expected_overall: |
  Ticket triaged and dispatched.
pass_criteria: |
  Priority set AND tech assigned AND tech sees the ticket.
est_minutes: 4
negative_variants:
  - id: P5-DAMAGE-002-N1
    title: Cannot assign ticket to a deactivated tech
    action: |
      Try to assign the ticket to a maintenance tech who has been
      deactivated.
    expected: |
      The user is filtered out or the assignment is blocked with a
      "user inactive" message.
    pass_criteria: |
      Inactive tech cannot be assigned.
```

---

## P5-DAMAGE-003 — Maintenance executes the repair

```yaml
id: P5-DAMAGE-003
title: Maintenance tech executes the repair
phase: P5
goal: |
  Tech does the work, consumes any parts, records time, and closes
  the ticket.
roles:
  - Maintenance Tech
flows:
  - damage-to-completion
preconditions:
  - |
    A maintenance ticket has been triaged: priority is set, a tech is assigned, and the ticket is scheduled for execution. (Established by P5-DAMAGE-002.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Open the assigned ticket. Scan or click "Start work."
    expected: |
      Time tracking begins.
  - n: 2
    action: |
      Issue any required parts (from inventory, e.g., a hydraulic
      fitting and a quart of fluid). Record consumed quantities.
    expected: |
      Inventory decreases. Parts cost is recorded against the ticket.
  - n: 3
    action: |
      Add a completion note: what was done, root cause if known,
      recommended preventative action.
    expected: |
      Note saves with timestamp.
  - n: 4
    action: |
      Close the ticket.
    expected: |
      Ticket closed. Asset returned to operable status. Total cost
      (labor + parts) recorded against the asset's lifetime cost.
expected_overall: |
  Repair is complete and costed. Asset is back to operable.
pass_criteria: |
  Ticket closed AND parts and labor recorded AND asset back online.
est_minutes: 10
negative_variants:
  - id: P5-DAMAGE-003-N1
    title: Cannot close ticket without recording any labor or parts
    action: |
      Try to close the maintenance ticket with no labor entries and
      no parts consumed.
    expected: |
      Save is blocked or warns; closure with empty work record is
      almost always a data-entry omission.
    pass_criteria: |
      Empty closure refused or surfaces an explicit warning.
  - id: P5-DAMAGE-003-N2
    title: Cannot consume parts not on hand
    action: |
      Try to issue 5 hydraulic fittings when only 2 are on hand.
    expected: |
      Save is blocked with a clear "insufficient on-hand" message.
    pass_criteria: |
      Over-issue refused.
```

---

## P5-PM-001 — Schedule a PM cycle on an asset

```yaml
id: P5-PM-001
title: Configure a preventative maintenance schedule
phase: P5
goal: |
  Define a PM schedule on a critical asset — every N hours of run
  time, or every N days, or both — so the system can trigger
  preventative work before damage happens.
roles:
  - Maintenance Manager
flows:
  - wear-to-repair
preconditions:
  - At least one asset (P1-ASSET-001).
steps:
  - n: 1
    action: |
      Open the press asset. Find the PM section.
    expected: |
      A way to define PM schedules is present.
  - n: 2
    action: |
      Add a schedule:
      - Type: Quarterly (every 90 days)
      - Description: "Hydraulic fluid change + filter inspection"
      - Required parts: hydraulic fluid, filter
      - Estimated labor: 2 hours
    expected: |
      Schedule saves.
  - n: 3
    action: |
      Set the next due date and verify the system will create a PM WO
      automatically when due.
    expected: |
      Next-due date is visible. A scheduled job will create the WO
      when the date arrives.
expected_overall: |
  PM schedule is configured. The system will trigger work before
  damage occurs.
pass_criteria: |
  Schedule exists AND next-due is visible AND scheduled trigger
  is in place.
est_minutes: 8
negative_variants:
  - id: P5-PM-001-N1
    title: Reject PM schedule with zero or negative interval
    action: |
      Try to configure a PM schedule with interval = 0 days or
      runtime hours = -100.
    expected: |
      Submission is blocked with a clear error.
    pass_criteria: |
      Zero / negative intervals rejected.
```

---

## P5-PM-002 — Manually trigger a PM and execute it

```yaml
id: P5-PM-002
title: Trigger a PM work order manually and complete it
phase: P5
goal: |
  Verify the manual trigger path for PMs (e.g., advancing schedule
  for a planned shutdown) and that execution mirrors damage repair.
roles:
  - Maintenance Manager
  - Maintenance Tech
flows:
  - wear-to-repair
preconditions:
  - A preventative maintenance schedule is configured on an asset, with interval, description, required parts, estimated labor, and a next-due date that will trigger a PM work order. (Established by P5-PM-001.)
steps:
  - n: 1
    action: |
      From the press's PM section, manually trigger the next PM.
    expected: |
      A PM work order is created and assigned (or queued for
      assignment).
  - n: 2
    action: |
      As the assigned tech, execute the PM: parts, labor, completion
      note.
    expected: |
      PM completes. Schedule advances — next due date moves forward
      by the configured interval.
expected_overall: |
  PM cycle is closed. Schedule advances automatically.
pass_criteria: |
  PM WO closed AND parts/labor recorded AND next-due date advanced.
est_minutes: 8
negative_variants:
  - id: P5-PM-002-N1
    title: Cannot trigger duplicate PM while one is open
    action: |
      Trigger a PM. Before it is closed, try to trigger the same PM
      again.
    expected: |
      The action is blocked or warns; only one open PM per schedule
      should be active.
    pass_criteria: |
      Duplicate active PM refused.
```

---

## P5-QC-FAIL — Quality fail and rework

```yaml
id: P5-QC-FAIL
title: A QC inspection fails — initiate rework
phase: P5
goal: |
  At a QC step in a production routing, parts fail inspection. They
  loop back through the routing for rework rather than going to
  finished goods.
roles:
  - QC Inspector
  - Floor Operator
flows:
  - quote-to-cash
preconditions:
  - A WO is at an inspection operation.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At inspection, scan the parts. Mark 3 of the 100 as failed.
      Reason: "Weld porosity."
    expected: |
      Failure is recorded. The 3 parts move to a rework status, not
      to finished goods.
  - n: 2
    action: |
      Choose the rework path: send back to Weld for repair.
    expected: |
      System creates a rework operation back at Weld for the 3 units.
      The original WO continues with 97 units still moving forward.
  - n: 3
    action: |
      Verify the rework operation is visible to the Weld work center.
    expected: |
      Rework is on Weld's queue.
expected_overall: |
  QC failures route to rework with full traceability of which units
  were reworked at which operations.
pass_criteria: |
  Failed units flagged AND routed to rework AND traceable AND main
  WO continues for the good units.
est_minutes: 8
negative_variants:
  - id: P5-QC-FAIL-N1
    title: Reject QC fail without reason code
    action: |
      Mark units failed with the reason code blank.
    expected: |
      Save is blocked with a clear "QC fail reason is required"
      message.
    pass_criteria: |
      Failure without reason refused.
  - id: P5-QC-FAIL-N2
    title: Failed units cannot move to finished goods
    action: |
      After marking units failed, try to manually move them into
      finished goods inventory.
    expected: |
      The action is blocked with a "failed units cannot enter FG"
      message.
    pass_criteria: |
      Failed units stay isolated from sellable inventory.
```

---

## P5-RMA-001 — Customer initiates a return

```yaml
id: P5-RMA-001
title: Customer initiates a return (RMA)
phase: P5
goal: |
  Customer reports a problem with a shipped product. RMA is created
  and the customer is told how to ship it back.
roles:
  - Sales / Account Manager
flows:
  - customer-return
preconditions:
  - At least one shipped invoice exists (P4-SHIP / P4-INV-001).
steps:
  - n: 1
    action: |
      Find the RMAs area. Create a new RMA referencing the original
      invoice / order.
    expected: |
      RMA form opens. Lines and prices pre-fill from the original
      shipment.
  - n: 2
    action: |
      Fill in: returned quantity, reason ("dimensional out-of-spec"),
      desired resolution (replace / repair / refund).
    expected: |
      RMA saves with a stable number.
  - n: 3
    action: |
      Generate an RMA confirmation for the customer with shipping
      instructions.
    expected: |
      Confirmation includes the RMA number, return address, and any
      shipping label or instructions.
expected_overall: |
  RMA is created and the customer has return instructions.
pass_criteria: |
  RMA exists AND has a stable number AND the customer document
  includes return shipping instructions.
est_minutes: 6
negative_variants:
  - id: P5-RMA-001-N1
    title: Reject RMA quantity exceeding shipped quantity
    action: |
      Try to RMA 200 units when the original shipment was 100.
    expected: |
      Save is blocked with a clear "exceeds shipped quantity"
      message.
    pass_criteria: |
      Over-RMA refused.
  - id: P5-RMA-001-N2
    title: RMA outside warranty / return window requires override
    action: |
      Reference an invoice older than the documented return window.
    expected: |
      The save is blocked or warns and requires explicit override.
    pass_criteria: |
      Out-of-window RMA is gated.
```

---

## P5-RMA-002 — Receive the return at the warehouse

```yaml
id: P5-RMA-002
title: Receive returned product
phase: P5
goal: |
  Physically receive the returned product, inspect, and route it.
roles:
  - Warehouse / Logistics
  - QC Inspector
flows:
  - customer-return
preconditions:
  - An RMA has been created against a shipped invoice, with returned quantity, reason, desired resolution, and customer-facing return instructions. (Established by P5-RMA-001.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At receiving, scan the RMA number on the inbound package.
    expected: |
      The expected RMA opens.
  - n: 2
    action: |
      Receive the returned units. Inspect them.
    expected: |
      Each unit is recorded as received. QC outcome can be set per
      unit (return-to-stock, rework, scrap).
  - n: 3
    action: |
      Route 5 units to scrap (unsalvageable), 5 to rework.
    expected: |
      Scrap and rework destinations are set. Inventory updates
      accordingly (no scrap units back to FG inventory).
expected_overall: |
  Returned product is in the right disposition: scrap, rework, or
  return-to-stock based on inspection.
pass_criteria: |
  All units accounted for AND each routed to its disposition AND
  inventory not contaminated with bad stock.
est_minutes: 8
negative_variants:
  - id: P5-RMA-002-N1
    title: Reject return quantity exceeding RMA quantity
    action: |
      Receive 15 units against an RMA authorizing 10.
    expected: |
      Save is blocked or surfaces an explicit prompt to amend the
      RMA before accepting the overage.
    pass_criteria: |
      Over-return is gated.
  - id: P5-RMA-002-N2
    title: Return-to-stock disposition requires QC pass
    action: |
      Try to route units to return-to-stock without recording any
      QC outcome.
    expected: |
      Save is blocked with a clear "QC outcome required" message.
    pass_criteria: |
      RTS without QC refused.
```

---

## P5-RMA-003 — Issue a credit memo

```yaml
id: P5-RMA-003
title: Issue a credit memo against the returned invoice
phase: P5
goal: |
  Settle the financial side of the RMA — credit the customer for the
  returned units, reducing AR.
roles:
  - Controller
flows:
  - customer-return
preconditions:
  - Returned product has been physically received, inspected, and dispositioned — units routed to return-to-stock, rework, or scrap as appropriate. (Established by P5-RMA-002.)
steps:
  - n: 1
    action: |
      Create a credit memo from the RMA. It pre-fills with the
      returned quantities and prices.
    expected: |
      Credit memo draft appears.
  - n: 2
    action: |
      Confirm and post.
    expected: |
      Credit memo posts. AR decreases. GL impact: revenue reduced,
      AR credited.
  - n: 3
    action: |
      Apply the credit memo to the original invoice (or, if invoice
      is paid, leave as customer credit).
    expected: |
      Credit memo applied appropriately.
expected_overall: |
  Customer's account is settled.
pass_criteria: |
  Credit memo posted AND applied or held as credit AND AR/revenue
  postings correct.
est_minutes: 6
negative_variants:
  - id: P5-RMA-003-N1
    title: Reject credit memo exceeding original invoice amount
    action: |
      Try to post a credit memo for $10,000 against an invoice with
      a $5,000 total.
    expected: |
      Save is blocked or warns; over-credit must be explicit.
    pass_criteria: |
      Over-credit gated.
  - id: P5-RMA-003-N2
    title: Cannot apply credit memo to a different customer
    action: |
      Try to apply ACME's credit memo against another customer's
      invoice.
    expected: |
      Save is blocked with a clear "credit applies only to the
      issuing customer" message.
    pass_criteria: |
      Cross-customer credit refused.
```

---

## P5-VENDOR-RETURN — Return material to a vendor

```yaml
id: P5-VENDOR-RETURN
title: Return defective material to a vendor
phase: P5
goal: |
  Process a return-to-vendor (RTV) for material rejected on receipt
  or discovered defective in production.
roles:
  - Procurement
  - Warehouse / Logistics
flows:
  - vendor-to-asset
  - part-to-inventory
preconditions:
  - Some quarantined or defective material exists from P3-RECV-003 or
    similar.
steps:
  - n: 1
    action: |
      Find the RTV area. Create an RTV against Pacific Steel Supply
      for 50 ft of defective steel.
    expected: |
      RTV draft is created.
  - n: 2
    action: |
      Enter reason and submit. Generate vendor-facing documentation
      (RMA-equivalent for the vendor).
    expected: |
      RTV document is ready to attach to the shipment back.
  - n: 3
    action: |
      Once shipped, mark the RTV as shipped. Quarantined inventory
      decreases.
    expected: |
      Inventory updates. Vendor credit is expected on the next AP
      cycle.
expected_overall: |
  Defective material flows back to the vendor with proper paperwork.
pass_criteria: |
  RTV created AND quarantine cleared AND vendor expected to issue credit.
est_minutes: 6
negative_variants:
  - id: P5-VENDOR-RETURN-N1
    title: Reject RTV quantity exceeding quarantined inventory
    action: |
      Try to RTV 100 ft when only 50 ft is quarantined.
    expected: |
      Save is blocked with a clear "exceeds quarantined quantity"
      message.
    pass_criteria: |
      Over-RTV refused.
  - id: P5-VENDOR-RETURN-N2
    title: Cannot ship RTV without vendor authorization number
    action: |
      Try to ship the RTV without entering the vendor-issued RMA /
      authorization number.
    expected: |
      Save is blocked or warns; vendors typically require an
      authorization number to accept the return.
    pass_criteria: |
      RTV without vendor authorization is gated.
```

---

## P5-INV-ADJ — Inventory adjustment for shrinkage / writeoff

```yaml
id: P5-INV-ADJ
title: Manual inventory adjustment with a reason code
phase: P5
goal: |
  When inventory needs adjustment outside a cycle count (damage,
  shrinkage, found stock), a manual adjustment with a reason code
  posts to the right variance account.
roles:
  - Warehouse / Logistics
  - Controller
flows:
  - cycle-count
preconditions:
  - Inventory exists for at least one part.
steps:
  - n: 1
    action: |
      Open the inventory adjustment area. Adjust 5 ft of steel out
      of stock with reason: "Damaged in handling."
    expected: |
      Adjustment is accepted. Reason is required.
  - n: 2
    action: |
      Verify GL impact: inventory account decreased, scrap / handling
      variance account increased.
    expected: |
      Postings target the right variance account based on the reason.
expected_overall: |
  Inventory adjustments are reason-coded and post to the right
  variance account.
pass_criteria: |
  Inventory adjusted AND reason captured AND GL postings reflect the
  reason.
est_minutes: 5
negative_variants:
  - id: P5-INV-ADJ-N1
    title: Reject adjustment that would drive on-hand negative
    action: |
      Try to adjust out 200 units when only 50 are on hand.
    expected: |
      Save is blocked with a clear "would drive on-hand negative"
      message.
    pass_criteria: |
      Negative on-hand prevention.
  - id: P5-INV-ADJ-N2
    title: Reject adjustment without reason code
    action: |
      Try to save an adjustment with the reason field blank.
    expected: |
      Save is blocked with a clear "reason is required" message.
    pass_criteria: |
      Adjustment without reason refused.
  - id: P5-INV-ADJ-N3
    title: Large adjustments require controller approval
    action: |
      Try to adjust out a value above the documented self-approval
      threshold.
    expected: |
      Save is blocked or routes for controller approval.
    pass_criteria: |
      Large adjustments are gated by an approval workflow.
```

---

## P5-RD-FEEDBACK — Floor feedback to engineering

```yaml
id: P5-RD-FEEDBACK
title: Floor operator records feedback against an engineering revision
phase: P5
goal: |
  Floor operator notices an issue with a part or assembly during
  production. They log feedback against the engineering revision so
  R&D sees it.
roles:
  - Floor Operator
  - Engineer / R&D
flows:
  - rd-to-product
preconditions:
  - At least one BOM with a revision (P2-BOM-003).
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At the work center, while running a WO, open the part being
      produced. Find a "feedback to engineering" or "redline" action.
    expected: |
      Action is available, visible to the floor.
  - n: 2
    action: |
      Submit feedback: "Tab on bracket interferes with assembly when
      bolt heads are oversized — recommend chamfer the inside corner."
      Optionally attach a photo.
    expected: |
      Feedback saves and routes to engineering.
  - n: 3
    action: |
      As engineering, see the feedback in their queue, linked to the
      part / revision.
    expected: |
      Feedback is visible. Engineering can acknowledge, escalate to
      ECR, or close.
expected_overall: |
  Floor-to-engineering feedback loop works. R&D has visibility into
  what's failing on the production floor.
pass_criteria: |
  Feedback saved AND linked to the right part / revision AND visible
  to engineering.
est_minutes: 5
```

---

## P5-STOPPAGE — Floor reports a work stoppage

```yaml
id: P5-STOPPAGE
title: Floor reports a work stoppage with reason
phase: P5
goal: |
  When work stops at a station for any reason — material shortage,
  asset down, no work — the operator records why so reporting can
  identify common stoppage causes.
roles:
  - Floor Operator
  - Production Manager
flows:
  - quote-to-cash
preconditions:
  - A WO is in progress.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At the station, choose "Report stoppage" or scan the stoppage
      barcode.
    expected: |
      A reason picker appears.
  - n: 2
    action: |
      Choose: "Material shortage — RM-STEEL-1018-3X3 ran out."
    expected: |
      Stoppage starts. Time tracking changes from labor to stoppage.
  - n: 3
    action: |
      Once material arrives, end the stoppage and resume work.
    expected: |
      Time-on-stoppage is recorded against the WO and the reason
      code. Labor resumes.
expected_overall: |
  Stoppages are tracked with reason codes. Reports can identify the
  most common stoppage causes.
pass_criteria: |
  Stoppage time captured AND reason coded AND labor / stoppage time
  separable in reports.
est_minutes: 5
negative_variants:
  - id: P5-STOPPAGE-N1
    title: Reject stoppage with no reason chosen
    action: |
      Try to start a stoppage without selecting a reason code.
    expected: |
      Save is blocked with a clear "reason required" message.
    pass_criteria: |
      Reason-less stoppage refused.
  - id: P5-STOPPAGE-N2
    title: Cannot end a stoppage that was never started
    action: |
      Try to end a stoppage on an operation with no open stoppage.
    expected: |
      The action is unavailable or surfaces a clear "no active
      stoppage" message.
    pass_criteria: |
      End-without-start refused.
```

---

## P5-CLOSE-001 — Reconcile inventory at month-end

```yaml
id: P5-CLOSE-001
title: Inventory reconciliation as part of period close
phase: P5
goal: |
  Run an inventory reconciliation report comparing system-on-hand
  to GL inventory. Investigate any variance.
roles:
  - Controller
  - Warehouse / Logistics
flows:
  - period-close
preconditions:
  - |
    Phase 4 has run at least one full quote-to-cash cycle: a work order has consumed material, finished goods went to inventory, an order was shipped, an invoice was posted, and cash was applied. (Phase 4 outcomes.)
steps:
  - n: 1
    action: |
      Find the inventory reconciliation report. Run as of the last
      day of the period.
    expected: |
      Report shows total inventory value (system) vs. GL inventory
      account balance.
  - n: 2
    action: |
      Investigate any discrepancy. (If none — the case still passes;
      that's the goal.)
    expected: |
      Discrepancy explained or absent.
expected_overall: |
  Inventory ties to GL. Any variance is identified and explainable.
pass_criteria: |
  Reconciliation runs AND variance (if any) is explainable.
est_minutes: 8
negative_variants:
  - id: P5-CLOSE-001-N1
    title: Reject reconciliation report run as of a future date
    action: |
      Try to run the reconciliation as of a date in the future.
    expected: |
      The action is blocked or warns; the report only meaningfully
      runs at past or current period end.
    pass_criteria: |
      Future-dated reconciliation refused.
```

---

## P5-CLOSE-002 — AR / AP aging snapshot

```yaml
id: P5-CLOSE-002
title: Take AR and AP aging snapshots at period close
phase: P5
goal: |
  Snapshot AR and AP aging at the period boundary so the historical
  position is recoverable later.
roles:
  - Controller
flows:
  - period-close
preconditions:
  - |
    AR and AP both have transaction history: at least one customer invoice exists in AR (from Phase 4) and at least one vendor invoice and payment exist in AP (from Phase 3). (Phase 3 + Phase 4 outcomes.)
steps:
  - n: 1
    action: |
      Run AR aging report as of the last day of the period.
    expected: |
      Report displays buckets (current, 1-30, 31-60, 61-90, 90+) and
      totals per customer.
  - n: 2
    action: |
      Run AP aging report similarly.
    expected: |
      AP aging displays per vendor.
  - n: 3
    action: |
      Save / archive both reports for audit purposes.
    expected: |
      Both reports are stored or downloadable.
expected_overall: |
  Period-end aging is captured.
pass_criteria: |
  Both reports run AND saved AND totals tie to AR and AP control
  accounts on the GL.
est_minutes: 6
```

---

## P5-CLOSE-003 — Run depreciation for the period

```yaml
id: P5-CLOSE-003
title: Run period depreciation on fixed assets
phase: P5
goal: |
  Calculate and post the period's depreciation across all fixed
  assets.
roles:
  - Controller
flows:
  - period-close
preconditions:
  - Fixed assets exist with depreciation schedules (P3-ASSET-COMM-001).
steps:
  - n: 1
    action: |
      Open the depreciation run area. Select the period.
    expected: |
      System calculates depreciation per asset based on each asset's
      schedule.
  - n: 2
    action: |
      Review the calculation. Post.
    expected: |
      Depreciation entries post: depreciation expense debited,
      accumulated depreciation credited, per asset and rolled up.
expected_overall: |
  Period depreciation is posted. Fixed asset book values reduce.
pass_criteria: |
  Depreciation posted AND amounts match expected straight-line
  calculations AND book values updated.
est_minutes: 6
negative_variants:
  - id: P5-CLOSE-003-N1
    title: Cannot run depreciation twice for same period
    action: |
      After posting depreciation for the period, attempt to run it
      again for the same period.
    expected: |
      The action is blocked or surfaces a clear "already run for
      this period" warning.
    pass_criteria: |
      Double-run depreciation refused.
  - id: P5-CLOSE-003-N2
    title: Reject depreciation for an asset retired before the period
    action: |
      Run depreciation for a period that begins after an asset's
      retirement date.
    expected: |
      The retired asset is excluded from the run; depreciation does
      not continue past retirement.
    pass_criteria: |
      Retired assets do not depreciate.
```

---

## P5-CLOSE-004 — Close the period

```yaml
id: P5-CLOSE-004
title: Lock the period and prevent further postings
phase: P5
goal: |
  Once close is complete, lock the period to prevent backdated entries
  that would invalidate already-published reports.
roles:
  - Controller
flows:
  - period-close
preconditions:
  - All period adjustments and depreciation have posted.
steps:
  - n: 1
    action: |
      Find the period close action. Confirm closing.
    expected: |
      A confirmation requests the period close. After confirmation,
      the period is locked.
  - n: 2
    action: |
      Try to post a journal entry dated within the closed period.
    expected: |
      System blocks the entry. The error explains the period is
      closed and offers either an override (with permission) or a
      route to the next open period.
  - n: 3
    action: |
      Verify financial reports for the closed period are now
      "snapshot" — running them produces the same numbers always.
    expected: |
      Reports are stable.
expected_overall: |
  Period is closed. Reports are stable. Backdated postings are blocked.
pass_criteria: |
  Period locked AND backdated post blocked AND reports stable.
why_this_matters: |
  Without period close, every "month-end report" can change next time
  it's run because someone backdated an entry. That destroys
  accountability.
est_minutes: 6
negative_variants:
  - id: P5-CLOSE-004-N1
    title: Reopen a closed period as controller
    action: |
      As controller (with override authority), reopen the closed
      period.
    expected: |
      Reopen requires confirmation and is logged in an audit trail
      (who reopened, when, why).
    pass_criteria: |
      Reopen is gated AND audit-logged.
```

---

## P5-CYCLE-001 — Routine cycle count

```yaml
id: P5-CYCLE-001
title: Run a routine cycle count
phase: P5
goal: |
  Perform a routine cycle count (e.g., ABC-classified parts) as part
  of normal operations rather than year-end physical inventory.
roles:
  - Warehouse / Logistics
flows:
  - cycle-count
preconditions:
  - Inventory exists across multiple parts.
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      Generate a cycle count for parts due to be counted (system
      should know which based on ABC class and last count).
    expected: |
      Count list is generated automatically.
  - n: 2
    action: |
      Count physically. Enter results.
    expected: |
      Quantities recorded. Variances flagged.
  - n: 3
    action: |
      Approve and post adjustments for variance.
    expected: |
      Inventory adjusted. Last-count date updates per part.
expected_overall: |
  Routine cycle count runs end-to-end. ABC schedule advances.
pass_criteria: |
  Counts captured AND adjustments posted AND last-count dates updated.
est_minutes: 10
```

---

## P5-WARRANTY — Warranty claim against a serial number

```yaml
id: P5-WARRANTY
title: Process a warranty claim using a serialized product
phase: P5
goal: |
  Customer reports a warranty issue on a serialized product. The
  system finds the serial, identifies the original sale and BOM
  revision, and processes the claim.
roles:
  - Sales / Account Manager
  - QC Inspector
flows:
  - customer-return
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one serial-tracked part has been shipped (P2-PART-004,
    P4-SHIP).
steps:
  - n: 1
    action: |
      In the warranty / RMA area, search for a serial number that
      was shipped to a customer.
    expected: |
      System finds the serial, displays the original SO, ship date,
      customer, and BOM revision in effect at production.
  - n: 2
    action: |
      Initiate a warranty claim. Capture the issue description.
    expected: |
      Claim is created and linked to the serial. The original BOM
      revision is preserved as part of the claim record.
expected_overall: |
  Serial-traceable warranty support works end-to-end with original
  production data preserved.
pass_criteria: |
  Serial found AND original SO linked AND BOM revision captured.
why_this_matters: |
  Without BOM revision traceability, a warranty claim against a unit
  produced 2 years ago is impossible to investigate — you don't
  know which version of the design that unit was.
est_minutes: 6
```

---

## P5-RECALL — Trace a lot for a recall

```yaml
id: P5-RECALL
title: Trace all finished products built from a specific raw material lot
phase: P5
goal: |
  When a raw material lot is suspect (vendor-issued recall, internal
  quality issue), find every finished good built using that lot.
roles:
  - QC Inspector
  - Engineer / R&D
  - Controller
flows:
  - customer-return
preconditions:
  - At least one lot-tracked raw material has been issued to a WO
    (P4-MATL-ISSUE).
steps:
  - n: 1
    action: |
      Search by the lot number "PSS-2026-04-001."
    expected: |
      System shows: original receipt, work orders that consumed it,
      finished units produced, customers shipped to.
  - n: 2
    action: |
      Generate a recall report for that lot.
    expected: |
      Report lists all customers and shipped quantities affected.
expected_overall: |
  Lot traceability holds end-to-end: raw material → WO → FG →
  customer.
pass_criteria: |
  Lot trace produces all impacted customers AND quantities AND
  serial numbers (if applicable).
why_this_matters: |
  This is the single most expensive thing to get wrong. A failed lot
  trace turns a targeted recall into a "recall everything we shipped
  in a window" — orders of magnitude more cost.
est_minutes: 8
```

---

## P5-OFFSITE-SEND — Send to subcontractor

```yaml
id: P5-OFFSITE-SEND
title: Ship a sub-assembly out for subcontract processing
phase: P5
goal: |
  When a routing has a subcontracted operation, the system handles
  shipping out, holding while off-site, and receiving back.
roles:
  - Floor Operator
  - Warehouse / Logistics
flows:
  - quote-to-cash
preconditions:
  - A WO is at a subcontract operation (from P2-ROUTE-002).
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At the operation, scan to ship to the subcontractor. System
      generates a shipper / pack list.
    expected: |
      Pack list and shipper are created. Material is marked as
      offsite-with-vendor.
  - n: 2
    action: |
      Verify that the material is no longer counted in available
      inventory but appears in an "in-transit / offsite" report.
    expected: |
      Material shows as offsite, not on-hand.
expected_overall: |
  Subcontracted material is properly tracked while away from the
  facility.
pass_criteria: |
  Material flagged offsite AND shipper generated AND inventory
  visibility maintained.
est_minutes: 6
```

---

## P5-OFFSITE-RECV — Receive back from subcontractor

```yaml
id: P5-OFFSITE-RECV
title: Receive material back from the subcontractor
phase: P5
goal: |
  Material returns from the subcontractor; the routing resumes from
  the operation after the subcontract.
roles:
  - Warehouse / Logistics
  - Floor Operator
flows:
  - quote-to-cash
preconditions:
  - |
    A sub-assembly has been shipped out for subcontract processing: a shipper / pack list was generated and the material is flagged offsite-with-vendor (no longer in available inventory). (Established by P5-OFFSITE-SEND.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At receiving, scan the inbound shipper from the subcontractor.
    expected: |
      System matches against the offsite WO. Material is reconciled.
  - n: 2
    action: |
      Confirm receipt. Verify the WO automatically advances past the
      subcontract operation.
    expected: |
      WO continues at the next routing operation.
  - n: 3
    action: |
      The subcontract cost is recorded against the WO (per the
      routing's cost from P2-ROUTE-002).
    expected: |
      WO actual cost increases by the subcontract cost.
expected_overall: |
  Subcontract round-trip is closed. WO continues with no manual
  intervention beyond the receipt.
pass_criteria: |
  Material received AND WO advanced AND subcontract cost recorded.
est_minutes: 6
```

---

## End of Phase 5

By the end of Phase 5, the company has exercised:

- Damage and PM cycles end-to-end
- A complete RMA flow with credit memo
- A vendor return for defective receipt
- Period close with depreciation, aging snapshots, and lockout
- Lot trace for recall and serial trace for warranty
- Subcontract send-and-receive
- Floor-to-engineering feedback
- Cycle counts and inventory adjustments

This completes the canonical lifecycle. Phases beyond this (P6+, if needed) would address advanced exception modes, multi-entity transactions, advanced reporting suites.
