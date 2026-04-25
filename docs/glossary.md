# Glossary

Plain-English definitions of manufacturing and ERP terms used in the test scenario library. Every term is defined once here; cases reference rather than redefine.

A new term is added when its first case is authored. When a term is hard to define without using another term, the dependency is also defined here.

---

## Asset

A piece of equipment or other resource the business owns and uses to produce goods. Examples: a CNC machine, a press, a forklift, a paint booth. Assets are tracked separately from inventory because they're used over time rather than consumed.

In financial terms, assets depreciate. In production terms, they have capacity, schedules, and maintenance needs.

## Bill of materials (BOM)

A list of the components that go into making a product. For each component, the BOM specifies how many are needed, the unit of measure, and any substitutes. BOMs are referenced by work orders to know what materials to issue.

A BOM can be hierarchical: the BOM for a finished assembly may include sub-assemblies, each of which has its own BOM.

## Calendar

A schedule that defines when work happens. Includes shift times, weekends, holidays, and planned downtime. Calendars apply to the plant by default and can be overridden per work center for areas that run on different schedules.

Capacity calculations use calendars to figure out how many hours of production are available in a given window.

## Capacity

The amount of production a work center can deliver in a given time, expressed in hours, units, or pieces depending on context. Capacity is a function of the calendar (when the work center runs) and the work center's defined throughput.

## Chart of accounts

The list of general ledger accounts the business uses to categorize financial activity. Includes asset accounts (cash, inventory, receivables), liability accounts (payables, accrued expenses), revenue accounts (sales, returns), and expense accounts (cost of goods sold, labor, overhead).

The chart is set up once during onboarding and only changed deliberately afterward — every transaction posts to one or more of these accounts.

## General ledger account (GL account)

A single line item in the chart of accounts. Each transaction in the system posts a debit or credit to one or more GL accounts. The sum of all postings to all accounts forms the financial statements.

## Location

A physical site where the business operates. Examples: the main plant, a secondary plant, an off-site warehouse, an office. Records like work centers, employees, inventory, and assets are scoped to a location.

A business with one site has one location. A business with three sites has three.

## Routing

The sequence of operations needed to produce a product, with each operation assigned to a work center. Example: a part might route through Cut → Weld → Paint → Inspect → Pack. Routings are referenced by work orders to know where work happens and in what order.

## Tax code

A classification applied to transactions to determine how tax is calculated. Examples: a US sales tax code by state, a VAT code in countries with value-added tax, an exempt code for tax-free transactions. Tax codes are typically configured once during onboarding (or when a new tax jurisdiction becomes relevant).

## Unit of measure (UoM)

How something is counted. Common units: each, kg, lb, hour, foot, square foot, gallon, liter. Every part has a primary unit of measure; some parts have multiple (a coil of steel might be tracked in feet but consumed in pounds, with a conversion factor between them).

## Work center

An area within a location where a specific kind of production work happens. Examples: a Press Shop, a Welding bay, a Paint booth, an Assembly line. Work centers carry their own capacity, labor rate, and (optionally) calendar.

Work orders are assigned to work centers; labor and overhead post against them.

## Work order

A directive to produce a specific quantity of a specific item by a specific date. Created from a sales order or from inventory replenishment, the work order references the BOM (what to make) and the routing (how to make it). As production happens, materials are issued, labor is recorded, and progress is tracked against the work order.
