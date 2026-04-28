## BULK-PO-BUYER-001 — Mass-reassign open POs to a different buyer

```yaml
id: BULK-PO-BUYER-001
title: Reassign open POs from one buyer to another after a role change
goal: |
  Verify a procurement lead can mass-reassign open POs from one
  buyer to a replacement buyer, that the change updates the open
  approval queue and notifications, and is audit-logged per PO.
roles:
  - Procurement Lead
  - Administrator
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-BULK-OPS
preconditions:
  - Buyer A has at least 5 open POs in various states (Draft,
    Submitted, Approved-not-Received).
  - Buyer B exists and is set up to receive POs.
steps:
  - n: 1
    action: |
      Filter POs to "buyer = A AND status != Closed." Select all.
      Choose mass-reassign buyer. Set new buyer = B.
    expected: |
      Stage preview lists the affected POs.
  - n: 2
    action: |
      Confirm.
    expected: |
      All listed POs now show buyer = B. Any pending approvals
      assigned to A are reassigned to B.
  - n: 3
    action: |
      Sign in as Buyer A and as Buyer B. Check each one's open PO
      list and approval queue.
    expected: |
      A no longer sees the reassigned POs. B sees them, including
      any approvals.
expected_overall: |
  Buyer reassignment is clean across PO data and the approval queue.
pass_criteria: |
  POs reassigned AND approvals follow AND audit per PO AND no
  duplication across both buyers.
est_minutes: 7
```
