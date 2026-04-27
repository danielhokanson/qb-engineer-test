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

## Audit log

A chronological record of what happened in the system: who signed in, what records they changed, what transactions they posted. Audit logs are typically immutable — entries can be added but not edited or deleted. They are referenced when answering "who changed this and when" or for compliance reviews.

The application implements this concept as two physical surfaces, now disambiguated below: per-entity `activity_logs` and the cross-cutting system-wide `audit_log_entries`. See the next two entries for the per-surface breakdown and which case-types assert against each.

## System-wide audit log

Entity: `audit_log_entries`.

Cross-entity events captured for compliance and security review (logins, role changes, MFA, system configuration changes, deactivations). Records cross-cutting and non-entity events: authentication (sign-in / sign-out / failed-attempt), role grants and revokes, role-permission diffs, period close and reopen, system configuration changes, audit-log infrastructure itself, and bulk role assignment (one entry per affected user). Distinct from per-entity activity logs.

Implementation: Postgres table `audit_log_entries`, surfaced via the `/admin/audit-log` endpoint with cross-cutting filters.

See also: activity log.

## Activity log

Entity: `activity_logs`.

Per-entity timeline of state changes scoped to one record. UI surface for "show me this customer's history." Each entity (customer, vendor, part, BOM, PO, SO, WO, invoice, payment, employee, JE) carries its own activity log recording state changes scoped to that entity: create, field-level updates, deactivation, status transitions, line edits, version diffs.

A user opening "the audit log" on a specific entity record is reading that record's `activity_logs`. A user opening "the audit log" filtered to authentication events or role grants is reading the system-wide `audit_log_entries`.

See also: system-wide audit log.

## Calendar

A schedule that defines when work happens. Includes shift times, weekends, holidays, and planned downtime. Calendars apply to the plant by default and can be overridden per work center for areas that run on different schedules.

Capacity calculations use calendars to figure out how many hours of production are available in a given window.

## Capacity

The amount of production a work center can deliver in a given time, expressed in hours, units, or pieces depending on context. Capacity is a function of the calendar (when the work center runs) and the work center's defined throughput.

## Chart of accounts

The list of general ledger accounts the business uses to categorize financial activity. Includes asset accounts (cash, inventory, receivables), liability accounts (payables, accrued expenses), revenue accounts (sales, returns), and expense accounts (cost of goods sold, labor, overhead).

The chart is set up once during onboarding and only changed deliberately afterward — every transaction posts to one or more of these accounts.

## Depreciation

The accounting practice of spreading the cost of a fixed asset over its useful life rather than expensing the full cost when purchased. A $50,000 machine with a 10-year life depreciates $5,000 per year using straight-line depreciation. The depreciation schedule is set up when the asset is recorded and runs automatically thereafter.

## Employee

A person employed by the business. Employees are tracked separately from system users. Some employees have system access (linked to a user); others don't (a production worker who clocks in via a kiosk doesn't necessarily have a login). Employee records carry pay information, hire date, location, and other HR data that's distinct from anything a system user record needs.

## Exempt vs. non-exempt

A US labor-law classification that determines whether an employee is eligible for overtime pay. Exempt employees (typically salaried managers and professionals) are not paid overtime; non-exempt employees (typically hourly workers and many salaried supervisors) are. Misclassifying employees is a common compliance risk.

## General ledger account (GL account)

A single line item in the chart of accounts. Each transaction in the system posts a debit or credit to one or more GL accounts. The sum of all postings to all accounts forms the financial statements.

## Fixed asset vs. inventory

A fixed asset is something the business *uses* over time (a machine, a building, a vehicle) — capitalized at purchase and depreciated. Inventory is something the business *consumes* or *sells* — expensed when used or sold. The distinction matters at purchase time because the two go to different GL accounts and follow different downstream processes.

## Location

A physical site where the business operates. Examples: the main plant, a secondary plant, an off-site warehouse, an office. Records like work centers, employees, inventory, and assets are scoped to a location.

A business with one site has one location. A business with three sites has three.

## Purchase order (PO)

A document the business issues to a vendor authorizing the vendor to ship goods or perform services in exchange for payment. POs reference vendors, line items (with parts or services), quantities, prices, and tax codes. Receiving against a PO creates inventory or fixed assets; the corresponding vendor invoice is matched against the PO before payment.

## Role

A named bundle of permissions in the system. Roles control what a user can see and do. Examples: Administrator (everything), Floor Operator (production-floor screens only), Controller (financial screens only). Roles are typically defined once during onboarding and rarely changed afterward; users are assigned to one or more roles.

## Routing

The sequence of operations needed to produce a product, with each operation assigned to a work center. Example: a part might route through Cut → Weld → Paint → Inspect → Pack. Routings are referenced by work orders to know where work happens and in what order.

## Tax code

A classification applied to transactions to determine how tax is calculated. Examples: a US sales tax code by state, a VAT code in countries with value-added tax, an exempt code for tax-free transactions. Tax codes are typically configured once during onboarding (or when a new tax jurisdiction becomes relevant).

## System user (or just "user")

A person (or service) with login credentials in the application. Users are tracked separately from employees. A user may be linked to an employee, may not be (a consultant), or there may be employees with no user (production staff using shared kiosks). Users carry roles that determine their permissions; employees do not.

## Unit of measure (UoM)

How something is counted. Common units: each, kg, lb, hour, foot, square foot, gallon, liter. Every part has a primary unit of measure; some parts have multiple (a coil of steel might be tracked in feet but consumed in pounds, with a conversion factor between them).

## Work center

An area within a location where a specific kind of production work happens. Examples: a Press Shop, a Welding bay, a Paint booth, an Assembly line. Work centers carry their own capacity, labor rate, and (optionally) calendar.

Work orders are assigned to work centers; labor and overhead post against them.

## Work order

A directive to produce a specific quantity of a specific item by a specific date. Created from a sales order or from inventory replenishment, the work order references the BOM (what to make) and the routing (how to make it). As production happens, materials are issued, labor is recorded, and progress is tracked against the work order.
