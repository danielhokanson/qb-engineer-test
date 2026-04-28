## EDGE-NEGQTY-001 — A return / negative-quantity sales line posts as a refund, not a sale

```yaml
id: EDGE-NEGQTY-001
title: A sales order line with a negative quantity is treated as a return and posts to the correct accounts
goal: |
  Verify that a sales line with a negative quantity (representing a
  return on a mixed sale-and-return order) posts a credit to revenue
  and a debit to AR, not the inverse, and that it correctly increases
  on-hand inventory rather than depleting it further.
roles:
  - Order Entry
  - Controller
capabilities:
  - CAP-O2C-SO
  - CAP-O2C-RMA
preconditions:
  - At least one customer.
  - At least one stocked finished good with on-hand inventory.
steps:
  - n: 1
    action: |
      Create a sales order with two lines: line 1 = 10 units of part X
      at $50, line 2 = -2 units of part X at $50 (return).
    expected: |
      Form accepts the negative quantity. Net order value = (10 - 2) ×
      $50 = $400.
  - n: 2
    action: |
      Ship and invoice the order.
    expected: |
      Invoice posts. AR ledger debit = $400 net.
  - n: 3
    action: |
      Inspect the GL postings.
    expected: |
      Revenue is credited net (or grossed up with a corresponding
      contra-revenue line for the return — the application's rule
      should be documented). AR is debited $400 net.
  - n: 4
    action: |
      Confirm inventory: the 10 units shipped depleted on-hand by 10,
      and the 2 returned units increased on-hand by 2 (net: -8).
    expected: |
      Net inventory change is -8, not -12.
expected_overall: |
  Negative-quantity lines are accounted for as returns in both the
  ledger and inventory.
pass_criteria: |
  Net AR = $400 AND inventory change = -8 AND GL postings honor the
  return semantics, not double depletion.
why_this_matters: |
  Mixed orders with returns happen in distribution and field service
  routinely. A system that silently treats negative quantities as
  additional sales corrupts both revenue and stock — and the bug is
  hard to spot until the physical count fails.
est_minutes: 10
moot:
  decision: moot-by-design
  determined_at: 2026-04-28
  determined_by: Phase 3 closeout / orchestrator-approved
  reason: |
    Mixed sale + return on a single sales order is rejected by design.
    The application uses the RMA flow for returns rather than allowing
    negative-quantity lines on a sale order. The case wording assumes
    a single-document mixed-line architecture this app intentionally
    does not implement.
  consultant_guidance: |
    Use the RMA workflow for returns instead of negative line quantities
    on a sales order. The application validates SalesOrderLine.Quantity > 0
    on POST /orders.
  alternative_behavior: |
    Returns are processed via the RMA (return-merchandise-authorization)
    flow — a separate document type that posts the credit to revenue and
    increases on-hand inventory.
```
