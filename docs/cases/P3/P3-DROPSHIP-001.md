## P3-DROPSHIP-001 — Drop-ship from vendor direct to customer

```yaml
id: P3-DROPSHIP-001
title: Configure and execute a drop-ship from a vendor to a customer
goal: |
  Verify the drop-ship workflow: SO line is flagged drop-ship, system
  generates a PO to the vendor with ship-to = customer, vendor ships
  direct, customer receives, invoice posts to AR / vendor invoice
  posts to AP — but no inventory ever lands at the company.
roles:
  - Sales / Account Manager
  - Procurement
  - Controller
flows:
  - quote-to-cash
  - vendor-to-asset
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one customer and one vendor exist.
  - At least one part is configured for drop-ship.
prerequisite_cases:
  - P2-CUST-001
  - P2-VENDOR-001
steps:
  - n: 1
    action: |
      Create an SO line for a drop-ship-eligible part to a customer.
      Mark the line as drop-ship.
    expected: |
      System prompts to either generate or link a vendor PO. The PO's
      ship-to is the customer's address.
  - n: 2
    action: |
      Issue the PO. Mark the vendor as having shipped (per their
      tracking / confirmation).
    expected: |
      The SO line is marked shipped without inventory ever appearing
      on hand at the company.
  - n: 3
    action: |
      Generate the customer invoice and the vendor invoice. Verify
      GL impact.
    expected: |
      Customer revenue posts and vendor cost posts. No inventory GL
      movement.
expected_overall: |
  Drop-ship flows revenue and cost without inventory movement.
pass_criteria: |
  No inventory movement AND both invoices post AND GL reflects
  expected revenue / COGS.
est_minutes: 12
negative_variants:
  - id: P3-DROPSHIP-001-N1
    title: Drop-ship line cannot be picked from on-hand
    action: |
      After marking the SO line drop-ship, try to pick the part from
      warehouse stock.
    expected: |
      Pick is blocked with a clear "drop-ship line; vendor ships
      direct" message.
    pass_criteria: |
      Drop-ship line cannot be picked from inventory.
  - id: P3-DROPSHIP-001-N2
    title: Cannot mark drop-ship without a vendor for the part
    action: |
      Try to mark a line drop-ship for a part with no default vendor.
    expected: |
      Save is blocked with a clear "vendor required for drop-ship"
      message.
    pass_criteria: |
      Drop-ship without vendor refused.
```
