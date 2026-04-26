# Stories

Each block below is a single story — an ordered, role-aware narrative through the case library. The runner surfaces stories as a third entry point alongside test runs and the tutorial.

See [`01-schema.md`](01-schema.md#stories) for the field reference.

---

## Lead to cash from an empty system

```yaml
id: lead-to-cash
name: Lead to cash from an empty system
description: |
  The canonical end-to-end test of qb-engineer. Start with a brand-new
  empty tenant and walk through every role's contribution to taking a
  customer from initial inquiry to cash applied. Each chapter marks a
  role handoff — sign out and back in as the named role to verify the
  system routes work correctly across users.
estimated_total_minutes: 240

chapters:
  - title: Bootstrap
    intro: |
      You are the company's first administrator. The system is brand
      new — nobody has signed in, no records exist. Your job for this
      chapter is to get the tenant configured to the point where other
      roles can join you.
    scenes:
      - case: P0-INSTALL-001
        role: Administrator
      - case: P0-ADMIN-001
        role: Administrator
      - case: P0-ADMIN-002
        role: Administrator
      - case: P0-TENANT-001
        role: Administrator
      - case: P0-TENANT-002
        role: Administrator
      - case: P0-TENANT-005
        role: Administrator
      - case: P0-INTEG-001
        role: Administrator
      - case: P0-INTEG-002
        role: Administrator
      - case: P0-INTEG-003
        role: Administrator

  - title: User and role setup
    intro: |
      Still as the administrator, create the role taxonomy and invite
      the first non-admin user — the person you'll hand off to next.
    scenes:
      - case: P0-USER-001
        role: Administrator
      - case: P0-USER-002
        role: Administrator
      - case: P0-USER-003
        role: Administrator

  - title: Foundational records (admin)
    intro: |
      Configure the records that the rest of the lifecycle will
      reference: locations, work centers, units, accounts, taxes,
      employees, calendar, asset.
    scenes:
      - case: P1-LOC-001
        role: Administrator
      - case: P1-WC-001
        role: Administrator
      - case: P1-UOM-001
        role: Administrator
      - case: P1-CAL-001
        role: Administrator

  - title: Foundational records (Controller hands off)
    intro: |
      Hand off from Administrator to Controller. Sign out, then sign
      in as the Controller. (In a small shop the admin and controller
      may be the same person — the case still applies.)
    scenes:
      - case: P1-GL-001
        role: Controller
      - case: P1-TAX-001
        role: Controller

  - title: Foundational records (HR hands off)
    intro: |
      Hand off to HR. The HR user creates the first employee, links
      them to a system user, and sets up additional employees so the
      production floor isn't a one-person show.
    scenes:
      - case: P1-EMP-001
        role: HR
      - case: P1-EMP-002
        role: HR
      - case: P1-EMP-003
        role: HR

  - title: Foundational records (Maintenance hands off)
    intro: |
      Hand off to Maintenance Manager. They register the first piece
      of equipment as a fixed asset.
    scenes:
      - case: P1-ASSET-001
        role: Maintenance Manager

  - title: Master data — Procurement
    intro: |
      Hand off to Procurement. Set up the first vendor and the
      foundation of the parts catalog.
    scenes:
      - case: P2-VENDOR-001
        role: Procurement
      - case: P2-VENDOR-003
        role: Procurement

  - title: Master data — Engineering
    intro: |
      Hand off to Engineer / R&D. Define the parts, BOM, and routing
      that production will execute against.
    scenes:
      - case: P2-PART-001
        role: Engineer / R&D
      - case: P2-PART-002
        role: Engineer / R&D
      - case: P2-PART-003
        role: Engineer / R&D
      - case: P2-BOM-001
        role: Engineer / R&D
      - case: P2-ROUTE-001
        role: Engineer / R&D

  - title: Master data — Sales
    intro: |
      Hand off to Sales / Account Manager. Capture the customer that
      will drive the entire production cycle.
    scenes:
      - case: P2-CUST-001
        role: Sales / Account Manager
      - case: P2-PRICE-001
        role: Sales / Account Manager

  - title: First inbound — Procurement and warehouse
    intro: |
      Hand back to Procurement. Issue the first purchase order so
      raw material is on the way. The warehouse will receive it.
    scenes:
      - case: P3-PO-001
        role: Procurement
      - case: P3-RECV-001
        role: Warehouse / Logistics
      - case: P3-AP-001
        role: Controller
      - case: P3-PAY-001
        role: Controller

  - title: Sales — capture and qualify the lead
    intro: |
      Hand off to Sales / Account Manager. A lead has come in. Capture,
      qualify, and turn it into an active opportunity tied to the
      customer you set up earlier.
    scenes:
      - case: P2-LEAD-001
        role: Sales / Account Manager
      - case: P2-LEAD-002
        role: Sales / Account Manager

  - title: Quote to sales order
    intro: |
      Still Sales. Build a quote, get acceptance, convert to a sales
      order.
    scenes:
      - case: P4-QUOTE-001
        role: Sales / Account Manager
      - case: P4-QUOTE-003
        role: Sales / Account Manager

  - title: Production — release and execute
    intro: |
      Hand off to Production Manager (release) and Floor Operator
      (execute). The work order is generated from the SO, released to
      the floor, and worked through every operation.
    scenes:
      - case: P4-WO-001
        role: Production Manager
      - case: P4-WO-002
        role: Production Manager
      - case: P4-WO-START
        role: Floor Operator
      - case: P4-MATL-ISSUE
        role: Floor Operator
      - case: P4-LABOR
        role: Floor Operator
      - case: P4-COMP
        role: Floor Operator
      - case: P4-COMP-FINAL
        role: Floor Operator

  - title: Fulfillment — pick, pack, ship
    intro: |
      Hand off to Warehouse / Logistics. Goods come off the floor,
      get put away, picked for the order, packed, and shipped.
    scenes:
      - case: P4-PUTAWAY
        role: Warehouse / Logistics
      - case: P4-PICK
        role: Warehouse / Logistics
      - case: P4-PACK
        role: Warehouse / Logistics
      - case: P4-SHIP
        role: Warehouse / Logistics

  - title: Cash cycle close — Controller
    intro: |
      Hand back to Controller. The shipped order generates a customer
      invoice, the customer pays, cash is applied, AR clears.
    scenes:
      - case: P4-INV-001
        role: Controller
      - case: P4-CASH
        role: Controller

  - title: New hire pickup
    intro: |
      Optional but realistic: while the production cycle was running,
      HR onboarded a new floor operator. Run through their day-1
      experience to verify the user-creation, role-assignment, and
      first-assignment flow work end-to-end.
    scenes:
      - case: P4-HIRE-001
        role: HR
      - case: P4-HIRE-002
        role: IT Admin
      - case: P4-HIRE-003
        role: Production Planner
```
