## P4-SHIP-SPLIT-001 — Ship a sales order in two partial shipments

```yaml
id: P4-SHIP-SPLIT-001
title: An SO ships in two partial shipments, each with its own invoice
goal: |
  Verify a sales order can ship in multiple deliveries, each with
  its own packing slip and invoice, with the SO remaining open until
  fully shipped.
roles:
  - Warehouse / Logistics
  - Controller
flows:
  - quote-to-cash
preconditions:
  - A confirmed SO with a quantity that can be split exists.
  - Inventory is partially available (e.g., 60 of 100 on hand).
prerequisite_cases:
  - P4-QUOTE-003
steps:
  - n: 1
    action: |
      Pick, pack, and ship 60 of the 100 ordered units. Generate
      shipment 1.
    expected: |
      First packing slip and tracking are produced. SO remains open
      with 40 units on backorder.
  - n: 2
    action: |
      Generate the partial invoice for the 60 shipped.
    expected: |
      Invoice 1 posts for the 60 units. AR increases.
  - n: 3
    action: |
      Once 40 more units become available, pick / pack / ship them
      as shipment 2.
    expected: |
      Second packing slip generated. SO closes after this shipment.
  - n: 4
    action: |
      Generate invoice 2 for the remaining 40.
    expected: |
      Invoice 2 posts. SO is fully invoiced.
expected_overall: |
  Split shipments produce separate invoices and close the SO when
  fully fulfilled.
pass_criteria: |
  Two shipments AND two invoices AND SO closes only after second
  shipment.
est_minutes: 10
```
