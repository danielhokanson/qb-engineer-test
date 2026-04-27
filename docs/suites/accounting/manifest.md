# Built-in Accounting Suite

This optional suite verifies the embedded lightweight accounting module — the one designed to substitute for an external accounting system (QuickBooks, Xero, Zoho) in a small shop too small to want one. Cases in the suite are gated by either `optional_module: builtin-accounting` (minimal CRUD scope) or `optional_module: builtin-accounting-full-gl` (full general-ledger machinery). The runner hides each case when the corresponding module is not enabled at session start. See "Module split (Phase 2 L1 reconciliation)" below for the per-case mapping.

The audience is a small-shop owner-operator with no accountant on staff. The UI must keep accounting jargon out of the user's way: the user sees "invoice paid", "bill recorded", "month closed", "manual adjustment" — never "debit / credit / journal entry / posting". These cases verify that the math behind that plain-language surface is correct: balances move where they should, balance sheets balance, AR aging ties to open invoices, year-end roll preserves equity.

## ID convention

`ACCT-{AREA}-NNN` where AREA is one of `SETUP`, `AR`, `AP`, `PAY`, `INV`, `BANK`, `JE`, `RPT`, `CLOSE`, `TAX`.

## Sequence

Cases are ordered roughly along the natural setup-and-use lifecycle: configure first, then transact (AR / AP / payroll / inventory), then reconcile (bank), then post corrections (manual adjustments), then run reports, then close, then handle tax. Many cases declare prerequisite cases for skip-ahead correctness, but the suite as a whole reads cleanly top-to-bottom for a tester running the full set.

```yaml
suite: accounting
title: Built-in lightweight accounting module — math correctness behind a plain-language UI
# Suite-level module tag removed in Phase 2: cases are split between
# `builtin-accounting` (minimal CRUD) and `builtin-accounting-full-gl`
# (full GL machinery). Each case carries its own `optional_module:` tag.
optional_modules:
  - builtin-accounting
  - builtin-accounting-full-gl
description: |
  Optional suite gated per-case on either the built-in accounting
  module (minimal CRUD: invoices, payments, expenses, customers,
  items, sales-tax rates) or the built-in full-GL module (chart of
  accounts, journal entries, period close, bank reconciliation,
  year-end roll, sales-tax remittance, inventory value flow). Verifies
  that AR, AP, payroll, inventory, bank, manual adjustments, reports,
  period close, and sales tax all keep correct books while presenting
  a plain-language surface to a non-accountant shop owner. Excludes
  multi-currency, multi-entity, audit-grade attestation, complex
  payroll-tax depth, and inventory costing methods beyond Average and
  Standard.
estimated_total_minutes: 270

cases:
  - id: ACCT-SETUP-001
  - id: ACCT-SETUP-002
  - id: ACCT-SETUP-003
  - id: ACCT-SETUP-004
  - id: ACCT-SETUP-005
  - id: ACCT-SETUP-006
  - id: ACCT-AR-001
  - id: ACCT-AR-002
  - id: ACCT-AR-003
  - id: ACCT-AR-004
  - id: ACCT-AR-005
  - id: ACCT-AP-001
  - id: ACCT-AP-002
  - id: ACCT-AP-003
  - id: ACCT-AP-004
  - id: ACCT-AP-005
  - id: ACCT-PAY-001
  - id: ACCT-PAY-002
  - id: ACCT-PAY-003
  - id: ACCT-PAY-004
  - id: ACCT-INV-001
  - id: ACCT-INV-002
  - id: ACCT-INV-003
  - id: ACCT-INV-004
  - id: ACCT-INV-005
  - id: ACCT-BANK-001
  - id: ACCT-BANK-002
  - id: ACCT-BANK-003
  - id: ACCT-BANK-004
  - id: ACCT-JE-001
  - id: ACCT-JE-002
  - id: ACCT-JE-003
  - id: ACCT-RPT-001
  - id: ACCT-RPT-002
  - id: ACCT-RPT-003
  - id: ACCT-RPT-004
  - id: ACCT-RPT-005
  - id: ACCT-RPT-006
  - id: ACCT-CLOSE-001
  - id: ACCT-CLOSE-002
  - id: ACCT-CLOSE-003
  - id: ACCT-CLOSE-004
  - id: ACCT-TAX-001
  - id: ACCT-TAX-002
  - id: ACCT-TAX-003

completion_criteria:
  - Every case in the suite has a recorded pass / fail.
  - Every report tied out to its underlying transactions to the cent.
  - Year-end roll preserved total equity exactly.
  - No silent posting into a closed period was observed.
```

## Module split (Phase 2 L1 reconciliation)

The application's built-in accounting module is intentionally a minimal CRUD interface (invoices, payments, expenses, customers, items, sales-tax rates) and does NOT include full GL machinery (chart of accounts hierarchy, journal entries, period close, bank reconciliation, year-end roll, depreciation, multi-currency revaluation). To let the runner filter cases cleanly against an application that implements only the minimal scope, the original single `optional_module: builtin-accounting` tag has been split per case.

Cases tagged `builtin-accounting` (minimal CRUD scope, 15 cases):

- ACCT-SETUP-004 — Set the primary tax jurisdiction (rate config)
- ACCT-SETUP-005 — Default payment terms (invoice/bill defaults)
- ACCT-SETUP-006 — Lock currency to a single home currency
- ACCT-AR-001 — Posting an invoice increases what the customer owes
- ACCT-AR-002 — Marking an invoice paid clears it from AR
- ACCT-AR-003 — Partial payment leaves the remaining balance open
- ACCT-AR-004 — Overpayment becomes a credit on the customer's account
- ACCT-AR-005 — Voiding an invoice reverses cleanly
- ACCT-AP-001 — Recording a vendor bill increases what the shop owes
- ACCT-AP-002 — Paying a vendor bill clears it from AP
- ACCT-AP-004 — Vendor bill for a non-inventory expense
- ACCT-AP-005 — Voiding a vendor bill reverses cleanly
- ACCT-PAY-002 — Expense reimbursement to an employee
- ACCT-TAX-001 — Sales tax collected on a customer invoice (rate applied)
- ACCT-TAX-003 — Tax-exempt customer is skipped from tax collection

Cases tagged `builtin-accounting-full-gl` (full GL machinery scope, 30 cases):

- ACCT-SETUP-001 — Initialize the chart of accounts (CoA hierarchy)
- ACCT-SETUP-002 — Set the fiscal year start (period mechanics)
- ACCT-SETUP-003 — Cash vs accrual basis (P&L behavior)
- ACCT-AP-003 — Inventory receipt + bill match (GRNI accrual)
- ACCT-PAY-001 — Pay run records wages and withholding liabilities
- ACCT-PAY-003 — Owner draw recorded against owner's equity
- ACCT-PAY-004 — Year-end W-2 / 1099 summaries (GL tie-out)
- ACCT-INV-001 — Receipt creates inventory and GRNI pending liability
- ACCT-INV-002 — Issuing material moves value from inventory to WIP
- ACCT-INV-003 — Completing a work order moves WIP to finished goods
- ACCT-INV-004 — Scrap writes off inventory value
- ACCT-INV-005 — Cycle-count variance posts to inventory adjustment
- ACCT-BANK-001 — Recording a deposit moves undeposited funds to cash
- ACCT-BANK-002 — Bank reconciliation tick-and-tie
- ACCT-BANK-003 — Cleared transactions update the cash register view
- ACCT-BANK-004 — Outstanding-items list visible after reconciliation
- ACCT-CLOSE-001 — Closing a month locks new postings
- ACCT-CLOSE-002 — Attempted post into a closed month is rejected
- ACCT-CLOSE-003 — Admin re-opens a closed month with audit trail
- ACCT-CLOSE-004 — Year-end roll moves balances to retained earnings
- ACCT-JE-001 — Manual adjustment posts when both sides balance
- ACCT-JE-002 — Reversing a manual adjustment undoes its effect
- ACCT-JE-003 — Correcting entry into a prior open period
- ACCT-RPT-001 — Profit and loss for a period
- ACCT-RPT-002 — Balance sheet as-of date balances
- ACCT-RPT-003 — Account detail (general ledger by account)
- ACCT-RPT-004 — AR aging matches open invoices
- ACCT-RPT-005 — AP aging matches open bills
- ACCT-RPT-006 — Sales tax summary reconciles to invoiced tax
- ACCT-TAX-002 — Remitting collected sales tax to the authority

## What this suite does NOT cover

This suite is deliberately scoped to what a small-shop owner-operator needs from an embedded accounting module. Out-of-scope topics — handled (or not) by other suites or by external accounting integration:

- **Multi-currency / FX revaluation.** The built-in module locks the shop to a single home currency at setup (ACCT-SETUP-006). Shops needing multi-currency are expected to use an external accounting integration. FX rounding and rate-move edge cases live in `docs/suites/edge-cases/` for the broader system.
- **Multi-entity / inter-company / consolidation.** One tenant, one set of books. Inter-company eliminations and consolidated reporting are explicitly outside this module.
- **Audit-grade SOX / GAAP / IFRS attestation.** The math here is correct for a small shop's own decision-making and tax filing. It is not a substitute for audited financial statements.
- **Complex payroll-tax depth.** ACCT-PAY-001 verifies that gross / net / withholding split is correct in the books. Federal / state / local tax-rate detail, multi-state employees, garnishments, benefit deductions, and similar payroll-tax depth are out of scope for the built-in module.
- **Inventory costing methods beyond Average and Standard.** FIFO and LIFO costing methods are not exercised. Cases assume Average or Standard cost behavior.
- **Anything requiring an accountant to operate or interpret.** If a case would require the user to think in debit / credit / journal-entry terms to act on it, it does not belong here. Manual adjustments (ACCT-JE-001 through ACCT-JE-003) are the closest the module comes — and they are framed as "manual adjustments" with plain-language balanced-totals indicators, not as raw journal entries.
```
