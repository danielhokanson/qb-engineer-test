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
capabilities:
  - CAP-MAINT-BREAKDOWN
  - CAP-MD-ASSETS
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
capabilities:
  - CAP-MAINT-BREAKDOWN
  - CAP-CROSS-NOTIFICATIONS
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
capabilities:
  - CAP-MAINT-BREAKDOWN
  - CAP-INV-CORE
  - CAP-MFG-LABOR
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
capabilities:
  - CAP-MAINT-PM
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
capabilities:
  - CAP-MAINT-PM
  - CAP-MFG-LABOR
  - CAP-INV-CORE
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
capabilities:
  - CAP-QC-INSPECTION
  - CAP-QC-NCR
  - CAP-MFG-MULTIOP
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
capabilities:
  - CAP-O2C-RMA
  - CAP-CROSS-DOCS
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
capabilities:
  - CAP-O2C-RMA
  - CAP-INV-CORE
  - CAP-QC-INSPECTION
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
capabilities:
  - CAP-O2C-CREDITMEMO
  - CAP-O2C-RMA
  - CAP-ACCT-BUILTIN
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
capabilities:
  - CAP-P2P-RECEIVE
  - CAP-INV-CORE
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
capabilities:
  - CAP-INV-CORE
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
capabilities:
  - CAP-MD-ECO
  - CAP-CROSS-ACTIVITY-LOG
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
capabilities:
  - CAP-MFG-STOPPAGE
  - CAP-MFG-SHOPFLOOR
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
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-RPT-INVVAL
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
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-RPT-FINANCIALS
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
capabilities:
  - CAP-ACCT-DEPRECIATION
  - CAP-ACCT-PERIOD
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
capabilities:
  - CAP-ACCT-PERIOD
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
capabilities:
  - CAP-INV-CYCLECOUNT
  - CAP-PLAN-ABC
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
capabilities:
  - CAP-INV-SERIALS
  - CAP-O2C-RMA
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
capabilities:
  - CAP-QC-RECALL
  - CAP-INV-LOTS
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
capabilities:
  - CAP-P2P-SUBCONTRACT
  - CAP-MFG-MULTIOP
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
capabilities:
  - CAP-P2P-SUBCONTRACT
  - CAP-MFG-MULTIOP
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

## P5-OFFSITE-001 — Lost subcontract shipment

```yaml
id: P5-OFFSITE-001
title: Subcontract shipment lost in transit
phase: P5
goal: |
  A sub-assembly was shipped to a subcontractor but never arrived.
  Carrier confirms loss. The system supports writing off the offsite
  inventory and reopening the WO at the right operation.
roles:
  - Warehouse / Logistics
  - Controller
flows:
  - quote-to-cash
capabilities:
  - CAP-P2P-SUBCONTRACT
  - CAP-INV-CORE
preconditions:
  - |
    A sub-assembly was shipped to a subcontractor and is currently flagged offsite-with-vendor. (Established by P5-OFFSITE-SEND.)
steps:
  - n: 1
    action: |
      Open the offsite inventory report. Locate the lost shipment.
    expected: |
      The offsite line is visible with shipper number, vendor, and
      quantity.
  - n: 2
    action: |
      Mark the offsite material as lost-in-transit with reason and
      carrier reference.
    expected: |
      A loss adjustment is created. Reason and carrier reference are
      required fields.
  - n: 3
    action: |
      Verify the WO is flagged so the subcontract operation can be
      restarted with replacement material rather than waiting forever.
    expected: |
      WO is reopened at the subcontract operation, and the original
      offsite quantity is removed from the offsite report.
expected_overall: |
  Lost subcontract shipments are reconcilable, not stuck offsite
  forever.
pass_criteria: |
  Loss recorded AND offsite report cleared AND WO flagged for restart.
est_minutes: 6
negative_variants:
  - id: P5-OFFSITE-001-N1
    title: Reject lost-in-transit without carrier reference
    action: |
      Try to mark the shipment as lost without entering a carrier
      claim or tracking reference.
    expected: |
      Save is blocked with a clear "carrier reference required"
      message.
    pass_criteria: |
      Reasonless loss claim refused.
```

---

## P5-OFFSITE-002 — Partial return from subcontractor

```yaml
id: P5-OFFSITE-002
title: Subcontractor returns only part of the shipment
phase: P5
goal: |
  Subcontractor sends back a partial quantity (some parts still in
  process, some damaged at their facility, etc.). The system accepts
  the partial receipt and keeps the remainder offsite.
roles:
  - Warehouse / Logistics
  - Floor Operator
flows:
  - quote-to-cash
capabilities:
  - CAP-P2P-SUBCONTRACT
  - CAP-INV-CORE
preconditions:
  - |
    A sub-assembly is offsite at a subcontractor. (Established by P5-OFFSITE-SEND.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At receiving, scan the inbound shipper. The expected quantity
      from the original send is 100 units; the inbound is 60 units.
    expected: |
      System detects the underage and prompts whether this is a
      partial return.
  - n: 2
    action: |
      Confirm partial receipt of 60 units. Capture a reason for the
      remaining 40 (still in process / damaged at vendor / scrapped at
      vendor).
    expected: |
      60 units progress to the next routing operation. 40 units stay
      flagged offsite with the captured reason.
  - n: 3
    action: |
      Verify the offsite report still shows 40 units against the same
      shipper and vendor.
    expected: |
      Offsite balance equals 40. The original shipper is not closed.
expected_overall: |
  Partial subcontract returns are handled cleanly with the remainder
  visibly outstanding.
pass_criteria: |
  Partial received AND remainder still offsite AND reason captured
  for the gap.
est_minutes: 7
negative_variants:
  - id: P5-OFFSITE-002-N1
    title: Reject partial receipt without remainder disposition
    action: |
      Try to confirm a partial receipt without selecting a reason for
      the missing quantity.
    expected: |
      Save is blocked with a "remainder reason required" message.
    pass_criteria: |
      Partial receipt without disposition refused.
  - id: P5-OFFSITE-002-N2
    title: Reject partial receipt exceeding original send quantity
    action: |
      Scan in 120 units against an original send of 100.
    expected: |
      Save is blocked or surfaces an explicit prompt to amend the
      original shipper before accepting the overage.
    pass_criteria: |
      Over-receipt against subcontract is gated.
```

---

## P5-OFFSITE-003 — Scrap at vendor

```yaml
id: P5-OFFSITE-003
title: Subcontractor reports parts scrapped during processing
phase: P5
goal: |
  Subcontractor damages or scraps some of the parts during their
  operation. The system records the scrap, charges the right account,
  and reflects the loss in the WO.
roles:
  - Warehouse / Logistics
  - Controller
flows:
  - quote-to-cash
capabilities:
  - CAP-P2P-SUBCONTRACT
  - CAP-INV-CORE
preconditions:
  - |
    A sub-assembly is offsite at a subcontractor and the vendor has reported scrap during processing. (Established by P5-OFFSITE-SEND.)
steps:
  - n: 1
    action: |
      Open the offsite shipper. Record vendor-reported scrap of 5
      units with reason "Plating bath contamination — vendor fault."
    expected: |
      Scrap is recorded against the shipper with reason and
      responsibility (vendor).
  - n: 2
    action: |
      Verify offsite balance reduces by 5. Verify the scrap variance
      account is debited and a vendor-charge / debit-memo is queued
      to recover cost from the subcontractor.
    expected: |
      GL postings reflect the scrap. Vendor recovery is queued.
  - n: 3
    action: |
      Receive the remaining good units back. Confirm the WO advances
      with the reduced quantity.
    expected: |
      WO continues with the surviving quantity.
expected_overall: |
  Scrap at vendor is captured with responsibility, GL postings, and
  vendor cost recovery.
pass_criteria: |
  Scrap recorded AND responsibility flagged AND vendor recovery
  queued AND WO quantity reduced.
est_minutes: 7
negative_variants:
  - id: P5-OFFSITE-003-N1
    title: Reject vendor-scrap entry without responsibility code
    action: |
      Try to record vendor-reported scrap without selecting a
      responsibility (vendor / our material defect / shared).
    expected: |
      Save is blocked with a "responsibility required" message.
    pass_criteria: |
      Scrap without responsibility refused.
  - id: P5-OFFSITE-003-N2
    title: Reject scrap quantity exceeding offsite balance
    action: |
      Try to record 200 units scrapped when only 100 are offsite.
    expected: |
      Save is blocked with a clear "exceeds offsite quantity" message.
    pass_criteria: |
      Over-scrap refused.
```

---

## P5-OFFSITE-004 — Subcontract overdue alert

```yaml
id: P5-OFFSITE-004
title: Aging alert fires on overdue subcontract shipment
phase: P5
goal: |
  When a subcontract shipment passes its expected return date, the
  system flags it so it doesn't sit forgotten offsite indefinitely.
roles:
  - Warehouse / Logistics
  - Production Manager
flows:
  - quote-to-cash
capabilities:
  - CAP-P2P-SUBCONTRACT
  - CAP-CROSS-NOTIFICATIONS
preconditions:
  - |
    A subcontract shipment has been sent with a documented expected return date that has now passed. (Established by P5-OFFSITE-SEND.)
steps:
  - n: 1
    action: |
      Run the offsite-aging report. Confirm overdue shipments are
      surfaced separately or highlighted.
    expected: |
      Overdue shipments are visible with days-overdue and vendor.
  - n: 2
    action: |
      Verify a notification or alert was raised for the production
      manager when the shipment first crossed overdue.
    expected: |
      An alert is recorded against the shipment, dated the first day
      it became overdue.
expected_overall: |
  Overdue subcontract shipments are detectable and alerted, not
  invisible.
pass_criteria: |
  Aging report flags overdue AND a one-time alert was raised when it
  first went overdue.
est_minutes: 5
```

---

## P5-OFFSITE-005 — Vendor swaps with wrong serial / lot

```yaml
id: P5-OFFSITE-005
title: Subcontractor returns wrong serial / lot
phase: P5
goal: |
  Subcontractor returns parts but the serials or lots do not match
  what was sent (mix-up at their facility). The system catches the
  mismatch on receipt rather than letting bad traceability propagate.
roles:
  - Warehouse / Logistics
  - QC Inspector
flows:
  - quote-to-cash
capabilities:
  - CAP-P2P-SUBCONTRACT
  - CAP-INV-LOTS
  - CAP-INV-SERIALS
preconditions:
  - |
    A subcontract shipment with serial- or lot-tracked parts is offsite. (Established by P5-OFFSITE-SEND.)
modality:
  - scanner
  - manual-entry
steps:
  - n: 1
    action: |
      At receiving, scan the inbound serials / lots. One or more do
      not match what was sent.
    expected: |
      System flags the mismatch and refuses to silently accept the
      wrong identifiers.
  - n: 2
    action: |
      Open a discrepancy record against the vendor with the expected
      and actual identifiers captured.
    expected: |
      Discrepancy is logged with both identifier sets. Vendor is
      notified per the documented escalation path.
expected_overall: |
  Identifier mismatches at subcontract receipt are caught, not
  rubber-stamped — protecting downstream traceability.
pass_criteria: |
  Mismatch detected AND receipt blocked or held AND discrepancy
  logged with full identifier history.
est_minutes: 6
negative_variants:
  - id: P5-OFFSITE-005-N1
    title: Cannot override mismatch without recorded justification
    action: |
      Attempt to force-accept a mismatched serial without entering a
      justification note.
    expected: |
      Override is blocked with a "justification required" message.
    pass_criteria: |
      Silent override refused.
```

---

## P5-RECALL-001 — Forward trace from raw lot to customer

```yaml
id: P5-RECALL-001
title: Forward trace — raw lot to every customer who received product
phase: P5
goal: |
  Given a suspect raw material lot, produce the complete forward
  trace: which work orders consumed it, which finished units came
  out, which serials, and which customers / shipments those went to.
roles:
  - QC Inspector
  - Controller
flows:
  - customer-return
capabilities:
  - CAP-QC-RECALL
  - CAP-INV-LOTS
preconditions:
  - |
    At least one lot-tracked raw material has been issued to one or more work orders, finished units have been produced, and at least one of those units has shipped to a customer. (Phase 4 outcomes.)
steps:
  - n: 1
    action: |
      In the trace area, search forward from the raw lot number.
    expected: |
      Trace shows: receipt(s), WO(s) that consumed it, FG units (with
      serials if applicable), and shipments / customers.
  - n: 2
    action: |
      Export the forward trace report.
    expected: |
      Report exports cleanly and includes all linkages: lot →
      receipt → WO → FG → shipment → customer.
expected_overall: |
  Forward lot trace produces a defensible "who got product made from
  this lot" answer.
pass_criteria: |
  Forward trace complete AND exportable AND covers raw → customer
  with no broken links.
est_minutes: 8
```

---

## P5-RECALL-002 — Backward trace from finished serial to raw lots

```yaml
id: P5-RECALL-002
title: Backward trace — finished serial back to all raw material lots
phase: P5
goal: |
  Given a customer-reported failure on a specific serial number,
  produce the complete backward trace to every raw material lot that
  went into that unit.
roles:
  - QC Inspector
  - Engineer / R&D
flows:
  - customer-return
capabilities:
  - CAP-QC-RECALL
  - CAP-INV-SERIALS
  - CAP-INV-LOTS
preconditions:
  - |
    At least one serial-tracked finished good has been produced from lot-tracked raw materials and shipped. (Phase 4 outcomes.)
steps:
  - n: 1
    action: |
      In the trace area, search backward from a shipped serial number.
    expected: |
      Trace shows: WO that built it, every raw material lot consumed
      on that WO with quantities, and the receipt(s) that brought
      each lot in.
  - n: 2
    action: |
      Verify BOM revision in effect at production is captured
      alongside the lot list.
    expected: |
      BOM revision is part of the trace record.
expected_overall: |
  Backward trace from a customer serial to every contributing raw lot
  is complete and includes BOM revision context.
pass_criteria: |
  Backward trace complete AND includes BOM revision AND every raw lot
  is identifiable.
est_minutes: 8
```

---

## P5-RECALL-003 — Recall report with customer notification list

```yaml
id: P5-RECALL-003
title: Generate a recall notification list from a forward trace
phase: P5
goal: |
  Once a forward trace is in hand, produce a customer notification
  list usable for outbound recall communication: who, how much, which
  serials, contact info.
roles:
  - QC Inspector
  - Sales / Account Manager
flows:
  - customer-return
capabilities:
  - CAP-QC-RECALL
  - CAP-CROSS-DOCS
preconditions:
  - |
    A forward trace from a suspect lot to customers has been produced. (Established by P5-RECALL-001.)
steps:
  - n: 1
    action: |
      From the forward trace, generate a customer notification list.
    expected: |
      List includes customer name, contact, shipped quantities,
      shipment dates, and serials / lots affected.
  - n: 2
    action: |
      Mark the recall as initiated and lock the snapshot of affected
      records so subsequent transactions cannot mutate the recall
      population.
    expected: |
      Recall is initiated. The affected-customers list is preserved
      as an immutable snapshot.
expected_overall: |
  Recall notification is actionable and immutable once initiated.
pass_criteria: |
  Notification list complete AND snapshot frozen AND each entry has
  enough detail for a real customer outreach.
est_minutes: 6
negative_variants:
  - id: P5-RECALL-003-N1
    title: Frozen recall snapshot resists later edits
    action: |
      After initiating the recall, modify the underlying shipment data
      (or run the trace again) and verify the recall population stays
      as it was at initiation.
    expected: |
      Recall snapshot is unchanged. Any later changes flow into a new
      revision of the trace, not the original snapshot.
    pass_criteria: |
      Snapshot immutability holds.
```

---

## P5-RECALL-004 — Trace across substitution / alternate parts

```yaml
id: P5-RECALL-004
title: Forward trace covers BOM substitutions
phase: P5
goal: |
  When a WO substituted an alternate part for the standard BOM
  component, the forward trace still finds every WO and FG that
  consumed the suspect lot — even via substitution.
roles:
  - QC Inspector
  - Engineer / R&D
flows:
  - customer-return
capabilities:
  - CAP-QC-RECALL
  - CAP-MD-BOM
  - CAP-INV-LOTS
preconditions:
  - |
    A work order has consumed a part as a substitution for the standard BOM component, and the substituted part is lot-tracked. (Phase 4 outcomes plus substitution.)
steps:
  - n: 1
    action: |
      Run a forward trace on the lot of the substituted part.
    expected: |
      Trace finds the WO that consumed the substitute and the FG that
      came out — substitution does not break the trace.
  - n: 2
    action: |
      Verify the trace flags the consumption as a substitution rather
      than a standard BOM line.
    expected: |
      Substitution is annotated in the trace; the standard BOM
      component for that line is also captured.
expected_overall: |
  BOM substitutions do not create traceability gaps.
pass_criteria: |
  Forward trace finds substitution-based consumption AND annotates
  the substitution.
est_minutes: 7
```

---

## P5-RECALL-005 — Trace across rework loop

```yaml
id: P5-RECALL-005
title: Trace covers rework consumption
phase: P5
goal: |
  When parts pass through a rework operation that consumes additional
  raw material, the forward and backward traces include the rework
  material — not just the original WO consumption.
roles:
  - QC Inspector
flows:
  - customer-return
capabilities:
  - CAP-QC-RECALL
  - CAP-INV-LOTS
preconditions:
  - |
    A finished unit has gone through a rework loop where additional lot-tracked material was consumed. (Phase 4 outcomes plus P5-QC-FAIL.)
steps:
  - n: 1
    action: |
      Backward-trace from a serial that went through rework.
    expected: |
      Trace lists the original raw lots AND any additional lots
      consumed at rework.
  - n: 2
    action: |
      Forward-trace from a rework-only consumed lot. Confirm only the
      reworked units appear, not the entire WO.
    expected: |
      Forward trace correctly scopes to just the reworked units.
expected_overall: |
  Rework consumption participates in lot trace correctly in both
  directions.
pass_criteria: |
  Backward trace includes rework lots AND forward trace from a
  rework-only lot scopes correctly.
est_minutes: 7
```

---

## P5-RECALL-006 — Quarantine remaining stock from a recalled lot

```yaml
id: P5-RECALL-006
title: Quarantine on-hand inventory affected by a recall
phase: P5
goal: |
  Once a lot is flagged for recall, any remaining on-hand inventory
  of that lot — raw, WIP, or FG — must be quarantined immediately so
  it cannot be issued or shipped.
roles:
  - QC Inspector
  - Warehouse / Logistics
flows:
  - customer-return
capabilities:
  - CAP-QC-RECALL
  - CAP-INV-CORE
preconditions:
  - |
    A lot has been flagged for recall and at least some on-hand inventory still carries that lot. (Established by P5-RECALL-001 / P5-RECALL-003.)
steps:
  - n: 1
    action: |
      Flag the lot as recalled.
    expected: |
      All on-hand inventory carrying that lot moves to quarantine
      automatically. Available-to-promise drops accordingly.
  - n: 2
    action: |
      Try to issue or ship a unit from the quarantined lot.
    expected: |
      Action is blocked with a clear "quarantined — recall in effect"
      message.
  - n: 3
    action: |
      Verify finished goods on open sales orders sourced from the
      recalled lot are flagged for re-allocation.
    expected: |
      Open SO allocations against the recalled lot are flagged for
      re-allocation or hold.
expected_overall: |
  Recall flag instantly stops downstream movement of affected stock.
pass_criteria: |
  On-hand quarantined AND issue / ship blocked AND open SO
  allocations flagged.
est_minutes: 7
negative_variants:
  - id: P5-RECALL-006-N1
    title: Cannot un-quarantine recalled lot without controller override
    action: |
      Try to manually return a recalled lot to available stock.
    expected: |
      Action requires controller-level override AND is audit-logged
      with reason.
    pass_criteria: |
      Un-quarantine is gated and logged.
```

---

## P5-CLOSE-006 — Block late posting into a closed period

```yaml
id: P5-CLOSE-006
title: Block a journal entry dated in a closed period
phase: P5
goal: |
  After a period is locked, a JE dated within that period is rejected
  with a clear message — not silently rolled forward.
roles:
  - Controller
flows:
  - period-close
capabilities:
  - CAP-ACCT-PERIOD
preconditions:
  - |
    A period has been closed and locked. (Established by P5-CLOSE-004.)
steps:
  - n: 1
    action: |
      Create a manual JE dated in the closed period.
    expected: |
      System blocks the entry on save with a clear "period closed"
      message that names the period.
  - n: 2
    action: |
      Verify nothing posts to GL.
    expected: |
      No GL impact. Trial balance for the closed period is unchanged.
expected_overall: |
  Closed periods are protected from late JEs.
pass_criteria: |
  JE rejected AND no GL postings AND closed-period trial balance
  unchanged.
est_minutes: 4
```

---

## P5-CLOSE-007 — Block late AP invoice dated into a closed period

```yaml
id: P5-CLOSE-007
title: Block a backdated vendor invoice into a closed period
phase: P5
goal: |
  An AP invoice with an invoice date inside the closed period must be
  rejected, redirected to the next open period, or held for explicit
  override — never silently posted into the closed period.
roles:
  - Procurement
  - Controller
flows:
  - period-close
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-ACCT-BUILTIN
preconditions:
  - |
    A period has been closed. (Established by P5-CLOSE-004.) The vendor invoice received now is dated within that closed period.
steps:
  - n: 1
    action: |
      Enter the AP invoice with the original invoice date inside the
      closed period.
    expected: |
      System surfaces the closed-period conflict and offers explicit
      paths: reject, redirect posting date to the next open period,
      or controller override.
  - n: 2
    action: |
      Choose the "post to next open period" path. Verify GL impact
      lands in the next open period.
    expected: |
      Posting date is in the next open period; invoice date stays as
      originally documented for audit.
expected_overall: |
  Backdated AP invoices cannot silently breach period close.
pass_criteria: |
  Conflict surfaced AND user makes an explicit choice AND posting
  date respects the closed period.
est_minutes: 5
```

---

## P5-CLOSE-008 — Block late inventory adjustment into closed period

```yaml
id: P5-CLOSE-008
title: Block a backdated inventory adjustment into a closed period
phase: P5
goal: |
  An inventory adjustment with a transaction date inside the closed
  period is blocked — otherwise inventory valuation in the closed
  period would change after the books were closed.
roles:
  - Warehouse / Logistics
  - Controller
flows:
  - period-close
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-INV-CORE
preconditions:
  - |
    A period has been closed. (Established by P5-CLOSE-004.)
steps:
  - n: 1
    action: |
      Try to post an inventory adjustment with an effective date
      inside the closed period.
    expected: |
      Action is blocked with a clear "period closed" message.
  - n: 2
    action: |
      Re-date the adjustment to the next open period and re-submit.
    expected: |
      Adjustment posts to the next open period. Closed-period
      inventory valuation is unchanged.
expected_overall: |
  Inventory valuation in closed periods is immutable.
pass_criteria: |
  Backdated adjustment blocked AND re-dated adjustment posts to next
  open period AND closed-period valuation unchanged.
est_minutes: 5
```

---

## P5-CLOSE-009 — Backdated cash receipt into closed period

```yaml
id: P5-CLOSE-009
title: Block a cash receipt dated into a closed period
phase: P5
goal: |
  A customer payment with a deposit / receipt date inside the closed
  period is rejected or redirected. Bank reconciliation for the
  closed period stays settled.
roles:
  - Controller
flows:
  - period-close
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-O2C-CASH
preconditions:
  - |
    A period has been closed. (Established by P5-CLOSE-004.) Bank reconciliation for that period was completed. (Established by P5-BANK-001.)
steps:
  - n: 1
    action: |
      Try to record a cash receipt with a deposit date inside the
      closed period.
    expected: |
      System blocks the action and offers either redirection to the
      next open period or controller override.
  - n: 2
    action: |
      Redirect to the next open period.
    expected: |
      Receipt posts to the next open period. Closed-period bank
      reconciliation is unchanged.
expected_overall: |
  Cash receipts cannot retroactively destabilize closed-period bank
  reconciliations.
pass_criteria: |
  Backdated receipt blocked AND posted into next open period AND
  closed-period bank rec unchanged.
est_minutes: 5
```

---

## P5-CLOSE-010 — Override late posting with audit trail

```yaml
id: P5-CLOSE-010
title: Controller-override late posting into closed period
phase: P5
goal: |
  When a true correction must hit a closed period (audit adjustment,
  legal restatement), the controller can override — but the override
  is gated, justification is captured, and an audit entry is logged.
roles:
  - Controller
flows:
  - period-close
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-IDEN-AUDIT-SYSTEM-LOG
preconditions:
  - |
    A period has been closed. (Established by P5-CLOSE-004.) A correcting JE must post into the closed period.
steps:
  - n: 1
    action: |
      As controller, attempt the JE into the closed period and select
      the override option.
    expected: |
      A justification field is required. Override requires
      controller-level permission.
  - n: 2
    action: |
      Enter justification ("audit adjustment AJE-2026-04-001").
      Confirm.
    expected: |
      JE posts into the closed period.
  - n: 3
    action: |
      Open the audit log. Verify the override is recorded with
      who / when / what / before / after / justification.
    expected: |
      Audit entry is present and complete.
expected_overall: |
  Closed-period overrides are possible for legitimate correction but
  always leave a trail.
pass_criteria: |
  Override gated by permission AND justification captured AND audit
  entry complete.
est_minutes: 6
negative_variants:
  - id: P5-CLOSE-010-N1
    title: Non-controller cannot override closed period
    action: |
      As a user without controller-level permission, attempt the same
      override.
    expected: |
      Override option is unavailable or rejected with a clear
      "insufficient permission" message.
    pass_criteria: |
      Override gated by role.
  - id: P5-CLOSE-010-N2
    title: Reject closed-period override without justification
    action: |
      As controller, attempt override with the justification field
      blank.
    expected: |
      Save is blocked with a "justification required" message.
    pass_criteria: |
      Justification cannot be skipped.
```

---

## P5-CLOSE-011 — Soft close vs hard close

```yaml
id: P5-CLOSE-011
title: Soft-close window allows reversing entries before hard close
phase: P5
goal: |
  Many businesses run a soft close where the period is provisionally
  closed but a small set of users can still post adjusting / reversing
  entries before the hard close locks it forever.
roles:
  - Controller
flows:
  - period-close
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-ACCT-PERIOD
preconditions:
  - |
    The period has been soft-closed. (Established by P5-CLOSE-004 if soft / hard close are distinguished.)
steps:
  - n: 1
    action: |
      As controller in the soft-close window, post an adjusting JE
      dated in the soft-closed period.
    expected: |
      Posting succeeds with a flag indicating it landed during the
      soft-close window.
  - n: 2
    action: |
      As a regular user, attempt the same posting.
    expected: |
      Posting is blocked.
  - n: 3
    action: |
      Hard-close the period. Attempt the same posting as controller.
    expected: |
      Posting is now blocked even for controller (per P5-CLOSE-010
      override path is the only remaining route).
expected_overall: |
  Soft / hard close distinction supports normal close workflow without
  abandoning the lock.
pass_criteria: |
  Soft-close adjusting entries gated by role AND hard close eliminates
  the soft-close path AND override path remains as last resort.
est_minutes: 7
```

---

## P5-RMA-004 — RMA disposition return-to-stock

```yaml
id: P5-RMA-004
title: Return-to-stock disposition restores sellable inventory
phase: P5
goal: |
  A returned unit passing QC is dispositioned return-to-stock. The
  unit re-enters sellable finished-goods inventory at the right
  cost basis.
roles:
  - Warehouse / Logistics
  - QC Inspector
  - Controller
flows:
  - customer-return
capabilities:
  - CAP-O2C-RMA
  - CAP-INV-CORE
preconditions:
  - |
    A returned unit has been received against an RMA and is awaiting disposition. (Established by P5-RMA-002.)
steps:
  - n: 1
    action: |
      Inspect the unit. Pass QC.
    expected: |
      QC outcome recorded as pass.
  - n: 2
    action: |
      Disposition as return-to-stock. Choose the destination location.
    expected: |
      Unit posts back into sellable FG inventory at the documented
      cost basis (original cost, not current standard, unless the
      policy says otherwise).
  - n: 3
    action: |
      Verify the unit appears in available-to-promise.
    expected: |
      ATP includes the unit; downstream sales orders can allocate
      against it.
expected_overall: |
  RTS disposition cleanly returns sellable inventory.
pass_criteria: |
  Unit in FG AND ATP updated AND cost basis correct.
est_minutes: 5
negative_variants:
  - id: P5-RMA-004-N1
    title: Reject RTS for unit that failed QC
    action: |
      Try to disposition a QC-failed unit as return-to-stock.
    expected: |
      Action is blocked with a "failed unit cannot return to stock"
      message.
    pass_criteria: |
      Failed unit RTS refused.
```

---

## P5-RMA-005 — RMA disposition rework

```yaml
id: P5-RMA-005
title: Rework disposition creates a rework work order
phase: P5
goal: |
  A returned unit needing repair is dispositioned to rework; a rework
  WO is created and the unit is tracked through repair back to FG.
roles:
  - Warehouse / Logistics
  - Floor Operator
flows:
  - customer-return
capabilities:
  - CAP-O2C-RMA
  - CAP-MFG-WO-RELEASE
preconditions:
  - |
    A returned unit has been received and inspected; QC indicates rework is appropriate. (Established by P5-RMA-002.)
steps:
  - n: 1
    action: |
      Disposition the unit as rework. Choose the rework operation
      (e.g., repaint).
    expected: |
      A rework WO is created automatically, linked to the original
      RMA and the unit's serial / lot.
  - n: 2
    action: |
      Execute the rework WO: issue parts, record labor, complete.
    expected: |
      Rework parts and labor are captured separately so true cost of
      the return is reportable.
  - n: 3
    action: |
      On rework completion, verify the unit returns to sellable FG.
    expected: |
      Unit is back in FG inventory; rework cost is tied to the RMA
      and the original sale for return-cost reporting.
expected_overall: |
  Rework disposition handles re-entry to FG with full cost capture.
pass_criteria: |
  Rework WO created AND parts / labor captured AND unit back in FG
  AND cost tied to RMA.
est_minutes: 8
```

---

## P5-RMA-006 — RMA disposition scrap

```yaml
id: P5-RMA-006
title: Scrap disposition removes the unit and posts the loss
phase: P5
goal: |
  A returned unit beyond economical repair is scrapped. Inventory is
  not increased; the cost is written off to the right account.
roles:
  - Warehouse / Logistics
  - Controller
flows:
  - customer-return
capabilities:
  - CAP-O2C-RMA
  - CAP-INV-CORE
  - CAP-ACCT-BUILTIN
preconditions:
  - |
    A returned unit has been received and inspected; QC indicates scrap is the correct disposition. (Established by P5-RMA-002.)
steps:
  - n: 1
    action: |
      Disposition the unit as scrap. Capture reason (e.g., "frame
      damage beyond repair").
    expected: |
      Scrap is recorded against the RMA. Reason and approver are
      required.
  - n: 2
    action: |
      Verify GL impact: scrap / loss expense is debited; no inventory
      is added back to FG.
    expected: |
      GL postings reflect the loss. FG inventory is unchanged from
      the scrap action.
  - n: 3
    action: |
      Verify the original sale's customer-return cost roll-up
      includes this unit's scrap cost.
    expected: |
      Return-cost report ties the scrap cost back to the originating
      sale.
expected_overall: |
  Scrap disposition is loss-recognized and traceable.
pass_criteria: |
  Scrap recorded AND no FG inventory added AND loss posted AND
  return-cost roll-up updated.
est_minutes: 6
negative_variants:
  - id: P5-RMA-006-N1
    title: Reject scrap disposition without approver
    action: |
      Try to scrap a returned unit valued above the documented
      auto-approve threshold without an approver.
    expected: |
      Save is blocked or routed for approval before posting.
    pass_criteria: |
      Above-threshold scrap is gated.
```

---

## P5-RMA-007 — Mixed disposition across one RMA

```yaml
id: P5-RMA-007
title: Single RMA dispositioned to mixed outcomes
phase: P5
goal: |
  Across a multi-unit RMA, different units receive different
  dispositions: some return-to-stock, some rework, some scrap. The
  system tracks each unit independently.
roles:
  - Warehouse / Logistics
  - QC Inspector
flows:
  - customer-return
capabilities:
  - CAP-O2C-RMA
  - CAP-INV-CORE
preconditions:
  - |
    A multi-unit RMA has been received. (Established by P5-RMA-002.)
steps:
  - n: 1
    action: |
      Across 10 received units, disposition 5 to return-to-stock,
      3 to rework, and 2 to scrap.
    expected: |
      Each unit's disposition is recorded individually.
  - n: 2
    action: |
      Verify rollups: FG inventory increased by 5, rework WOs created
      for 3, scrap loss posted for 2.
    expected: |
      Rollups match the per-unit dispositions exactly.
  - n: 3
    action: |
      View the RMA summary. Confirm it shows the mixed-disposition
      breakdown clearly.
    expected: |
      RMA summary lists disposition counts and links to the
      downstream artifacts (rework WOs, scrap entries).
expected_overall: |
  Mixed dispositions on a single RMA reconcile cleanly.
pass_criteria: |
  Per-unit dispositions correct AND rollups match AND RMA summary
  reflects the breakdown.
est_minutes: 8
```

---

## P5-RMA-008 — Disposition reversal

```yaml
id: P5-RMA-008
title: Reverse a disposition decision
phase: P5
goal: |
  A disposition decision is reversed before downstream processing
  (e.g., RTS reversed back to rework after a deeper inspection). The
  reversal is auditable and inventory / WO state stays consistent.
roles:
  - QC Inspector
  - Warehouse / Logistics
flows:
  - customer-return
capabilities:
  - CAP-O2C-RMA
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - |
    A unit has been dispositioned but downstream processing has not yet completed. (Established by P5-RMA-004 / P5-RMA-005 / P5-RMA-006.)
steps:
  - n: 1
    action: |
      Open the dispositioned unit. Choose "reverse disposition" with
      reason.
    expected: |
      Reversal requires reason. The original disposition's effects
      (inventory / WO / GL) are unwound or marked for unwind.
  - n: 2
    action: |
      Apply a new disposition (e.g., rework instead of RTS).
    expected: |
      New disposition takes effect. Audit trail shows both decisions
      with timestamps and users.
expected_overall: |
  Disposition reversals are supported and auditable.
pass_criteria: |
  Reversal recorded AND original effects unwound AND new disposition
  applied AND audit trail complete.
est_minutes: 6
negative_variants:
  - id: P5-RMA-008-N1
    title: Cannot reverse a disposition after downstream completion
    action: |
      Try to reverse a rework disposition after the rework WO is
      already closed and the unit is back in FG (or shipped).
    expected: |
      Reversal is blocked or requires a different correction path
      (new RMA / write-off), not a silent reversal.
    pass_criteria: |
      Late reversal is gated.
```

---

## P5-RMA-009 — Refurbished disposition tags unit as non-new

```yaml
id: P5-RMA-009
title: Refurbished disposition flags unit so it isn't sold as new
phase: P5
goal: |
  A unit returning to stock after rework is flagged as refurbished
  rather than new, so pricing and customer disclosure reflect that.
roles:
  - Warehouse / Logistics
  - Sales / Account Manager
flows:
  - customer-return
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-O2C-RMA
  - CAP-INV-CORE
preconditions:
  - |
    A returned unit has been reworked and is ready for re-entry to FG. (Established by P5-RMA-005.)
steps:
  - n: 1
    action: |
      Re-enter the reworked unit to FG with the refurbished flag set.
    expected: |
      Unit is in FG with a refurbished attribute or separate stock
      class.
  - n: 2
    action: |
      Quote a customer order. Verify the refurbished unit is not
      offered against an order that requires new product, or it is
      offered with a refurbished disclosure / price.
    expected: |
      Refurbished flag drives sales behavior — disclosure or price
      class — without contaminating new-unit fulfillment.
expected_overall: |
  Refurbished re-entries are distinguishable from new throughout
  fulfillment.
pass_criteria: |
  Refurbished flag set AND fulfillment respects the flag AND audit
  trail shows the unit's history.
est_minutes: 6
```

---

## P5-RMA-010 — Customer-supplied material on RMA

```yaml
id: P5-RMA-010
title: RMA where customer supplies material along with the unit
phase: P5
goal: |
  Some RMAs come with customer-supplied material (e.g., a sample of a
  failed component). The system tracks customer-owned material
  separately so it isn't accidentally absorbed into our inventory.
roles:
  - Warehouse / Logistics
  - QC Inspector
flows:
  - customer-return
scale_tags:
  - mid-market
  - enterprise
capabilities:
  - CAP-O2C-RMA
  - CAP-INV-CORE
preconditions:
  - |
    An RMA is received with customer-supplied material attached. (Established by P5-RMA-001 / P5-RMA-002.)
steps:
  - n: 1
    action: |
      At receipt, mark the inbound material as customer-supplied with
      a reference to the customer.
    expected: |
      Material is stored under customer-owned classification, not in
      our valuation.
  - n: 2
    action: |
      Verify inventory valuation does not change from receipt of
      customer-supplied material.
    expected: |
      Our inventory dollar balance is unchanged.
  - n: 3
    action: |
      On RMA close, the customer-owned material is dispositioned per
      the customer's instructions: returned, retained as evidence, or
      destroyed.
    expected: |
      Disposition is recorded; customer-owned balance is cleared.
expected_overall: |
  Customer-owned material is segregated from our inventory through
  the RMA lifecycle.
pass_criteria: |
  Customer-supplied flagged AND no valuation impact AND disposition
  on RMA close AND customer-owned balance reconciles.
est_minutes: 7
```

---

## P5-PM-003 — PM exceeds estimated labor hours

```yaml
id: P5-PM-003
title: PM execution exceeds estimated labor — variance captured
phase: P5
goal: |
  When PM execution runs over the estimated labor (e.g., 5 hours
  actual vs 2 hours estimated), the system captures the labor
  variance for reporting without blocking the work.
roles:
  - Maintenance Tech
  - Maintenance Manager
flows:
  - wear-to-repair
capabilities:
  - CAP-MAINT-PM
  - CAP-MFG-LABOR
preconditions:
  - |
    A PM work order is in progress with documented estimated labor hours. (Established by P5-PM-002.)
steps:
  - n: 1
    action: |
      Record actual labor hours that exceed the estimate by 100% or
      more (e.g., 5 actual vs 2 estimated).
    expected: |
      Labor records normally. The system flags the variance but does
      not block.
  - n: 2
    action: |
      Open the PM variance report. Confirm the over-budget PM is
      surfaced with estimated, actual, and variance fields.
    expected: |
      Report shows variance with the over-budget PM at the top or
      flagged for review.
expected_overall: |
  Labor variance on PM is captured and surfaced for review.
pass_criteria: |
  Actual hours recorded AND variance flagged AND visible in the PM
  variance report.
est_minutes: 5
negative_variants:
  - id: P5-PM-003-N1
    title: Large variance triggers manager review
    action: |
      Record actual hours that exceed estimate by more than the
      documented review threshold.
    expected: |
      The PM closure routes through a manager review step.
    pass_criteria: |
      Above-threshold variance is gated by review.
```

---

## P5-PM-004 — PM blocked because parts not available

```yaml
id: P5-PM-004
title: PM cannot start because required parts are not on hand
phase: P5
goal: |
  When a PM is due but the required parts (per the PM's parts list)
  are not on hand, the system surfaces the shortage rather than
  letting the tech begin and stall.
roles:
  - Maintenance Manager
  - Maintenance Tech
flows:
  - wear-to-repair
capabilities:
  - CAP-MAINT-PM
  - CAP-INV-CORE
preconditions:
  - |
    A PM schedule defines required parts. (Established by P5-PM-001.) On-hand inventory of at least one required part is below the PM's required quantity.
steps:
  - n: 1
    action: |
      Trigger the PM. Attempt to start work.
    expected: |
      System surfaces the parts shortage and offers options: hold the
      PM, generate a parts requisition, or proceed with override.
  - n: 2
    action: |
      Choose "generate parts requisition." Verify the requisition
      lists the missing parts and quantities.
    expected: |
      Requisition is created and tied to the PM.
  - n: 3
    action: |
      Verify the PM stays in a "waiting on parts" state until the
      parts arrive.
    expected: |
      PM state reflects the wait. Tech dashboards do not show it as
      ready to start until parts are available.
expected_overall: |
  Parts shortages on PM are surfaced before work starts, not after.
pass_criteria: |
  Shortage surfaced AND requisition optional path works AND PM held
  in waiting state.
est_minutes: 6
negative_variants:
  - id: P5-PM-004-N1
    title: Override start without parts requires approval
    action: |
      Try to override the parts shortage and start the PM anyway.
    expected: |
      Override requires manager approval and is recorded with reason.
    pass_criteria: |
      Override gated by approval and audit-logged.
```

---

## P5-PM-005 — PM consumes more parts than estimated

```yaml
id: P5-PM-005
title: PM consumes more parts than the schedule estimated
phase: P5
goal: |
  When PM execution consumes more parts than the schedule estimated
  (e.g., a second filter needed mid-job), the additional consumption
  is recorded and the variance is reportable.
roles:
  - Maintenance Tech
flows:
  - wear-to-repair
capabilities:
  - CAP-MAINT-PM
  - CAP-INV-CORE
preconditions:
  - |
    A PM work order is in progress. (Established by P5-PM-002.)
steps:
  - n: 1
    action: |
      Issue 2 filters when the PM estimate was 1 filter.
    expected: |
      Issuance is recorded. Inventory decreases for both filters.
  - n: 2
    action: |
      Verify the PM variance report flags the parts overage.
    expected: |
      Report shows estimated vs actual parts cost with variance.
expected_overall: |
  Parts overage on PM is recorded and reportable.
pass_criteria: |
  Extra parts consumed AND inventory adjusted AND variance reported.
est_minutes: 4
```

---

## P5-PM-006 — PM finds additional unscheduled work

```yaml
id: P5-PM-006
title: Tech discovers additional issue during PM
phase: P5
goal: |
  During PM, the tech discovers an unrelated issue (e.g., a worn belt
  found during a hydraulic PM). The system supports either spawning
  a new corrective WO or extending the current PM with the additional
  work captured separately.
roles:
  - Maintenance Tech
  - Maintenance Manager
flows:
  - wear-to-repair
capabilities:
  - CAP-MAINT-PM
  - CAP-MAINT-BREAKDOWN
preconditions:
  - |
    A PM work order is in progress. (Established by P5-PM-002.)
steps:
  - n: 1
    action: |
      During execution, log the additional finding ("worn drive belt")
      with severity.
    expected: |
      Finding is captured. The system offers either to add it to this
      PM or spawn a new corrective WO.
  - n: 2
    action: |
      Choose "spawn corrective WO." Verify the new WO is linked to
      the original PM and to the asset.
    expected: |
      New corrective WO exists and is traceable back to the PM that
      surfaced it.
  - n: 3
    action: |
      Close the original PM normally without the unrelated work
      contaminating its variance numbers.
    expected: |
      Original PM closes with its own scope. Corrective WO is
      independently tracked.
expected_overall: |
  Additional findings on PM execution are captured cleanly without
  distorting PM variance reporting.
pass_criteria: |
  Finding logged AND corrective WO spawned AND linkage preserved AND
  PM variance not distorted.
est_minutes: 6
```

---

## P5-PM-007 — PM aborted due to safety lockout

```yaml
id: P5-PM-007
title: PM aborted mid-execution due to safety lockout
phase: P5
goal: |
  Tech starts a PM, then must abort because a safety lockout / tagout
  condition prevents safe completion. The system handles the abort
  gracefully — recording partial work and rescheduling the PM.
roles:
  - Maintenance Tech
  - Maintenance Manager
flows:
  - wear-to-repair
capabilities:
  - CAP-MAINT-PM
preconditions:
  - |
    A PM work order is in progress. (Established by P5-PM-002.)
steps:
  - n: 1
    action: |
      As the tech, choose "abort PM" with reason "LOTO required —
      production not stopping."
    expected: |
      Abort prompts for reason. Partial labor and parts already
      consumed are recorded.
  - n: 2
    action: |
      Verify the PM's next-due date is preserved or reset per policy
      so the PM is not silently considered complete.
    expected: |
      PM is in an aborted / rescheduled state. Next-due date reflects
      that the PM still needs to be done.
  - n: 3
    action: |
      Reschedule the PM. Confirm a new PM work order is created.
    expected: |
      New PM WO references the aborted one for traceability.
expected_overall: |
  PM aborts are first-class — tracked, costed for partial work, and
  rescheduled.
pass_criteria: |
  Abort recorded with reason AND partial cost captured AND PM
  rescheduled AND traceability preserved.
est_minutes: 6
```

---

## P5-PM-008 — PM cost roll-up across asset lifetime

```yaml
id: P5-PM-008
title: PM cost roll-up to asset lifetime maintenance cost
phase: P5
goal: |
  PM costs (parts + labor) accumulate to the asset's lifetime
  maintenance cost so capital decisions (repair vs replace) have
  defensible numbers.
roles:
  - Maintenance Manager
  - Controller
flows:
  - wear-to-repair
capabilities:
  - CAP-MAINT-PM
  - CAP-MD-ASSETS
preconditions:
  - |
    Multiple PM cycles have completed against an asset. (Established by P5-PM-002 plus P5-PM-003 / P5-PM-005 if those ran.)
steps:
  - n: 1
    action: |
      Open the asset record. Find lifetime maintenance cost.
    expected: |
      A lifetime cost figure is shown, broken down by PM, corrective,
      and damage repairs.
  - n: 2
    action: |
      Drill down. Verify each completed PM contributes its parts +
      labor cost to the rollup.
    expected: |
      Drill-down ties to the individual PM WOs.
  - n: 3
    action: |
      Compare lifetime maintenance cost to the asset's net book value
      from depreciation (P5-CLOSE-003).
    expected: |
      Both numbers are visible side by side, supporting repair-vs-
      replace analysis.
expected_overall: |
  Asset lifetime maintenance cost rolls up cleanly and is comparable
  to depreciation-based book value.
pass_criteria: |
  Lifetime cost shown AND drill-down ties to PM WOs AND comparable
  to net book value.
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
