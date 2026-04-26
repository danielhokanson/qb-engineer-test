# Built-in Accounting Suite

This optional suite verifies the embedded lightweight accounting module — the one designed to substitute for an external accounting system (QuickBooks, Xero, Zoho) in a small shop too small to want one. Every case in the suite is gated by `optional_module: builtin-accounting`; the runner hides these when the tester does not enable the built-in accounting module at session start.

The audience is a small-shop owner-operator with no accountant on staff. The UI must keep accounting jargon out of the user's way: the user sees "invoice paid", "bill recorded", "month closed", "manual adjustment" — never "debit / credit / journal entry / posting". These cases verify that the math behind that plain-language surface is correct: balances move where they should, balance sheets balance, AR aging ties to open invoices, year-end roll preserves equity.

## ID convention

`ACCT-{AREA}-NNN` where AREA is one of `SETUP`, `AR`, `AP`, `PAY`, `INV`, `BANK`, `JE`, `RPT`, `CLOSE`, `TAX`.

## Sequence

Cases are ordered roughly along the natural setup-and-use lifecycle: configure first, then transact (AR / AP / payroll / inventory), then reconcile (bank), then post corrections (manual adjustments), then run reports, then close, then handle tax. Many cases declare prerequisite cases for skip-ahead correctness, but the suite as a whole reads cleanly top-to-bottom for a tester running the full set.

```yaml
suite: accounting
title: Built-in lightweight accounting module — math correctness behind a plain-language UI
optional_module: builtin-accounting
description: |
  Optional suite gated on the built-in accounting module being enabled
  for the run. Verifies that AR, AP, payroll, inventory, bank, manual
  adjustments, reports, period close, and sales tax all keep correct
  books while presenting a plain-language surface to a non-accountant
  shop owner. Excludes multi-currency, multi-entity, audit-grade
  attestation, complex payroll-tax depth, and inventory costing methods
  beyond Average and Standard.
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

## What this suite does NOT cover

This suite is deliberately scoped to what a small-shop owner-operator needs from an embedded accounting module. Out-of-scope topics — handled (or not) by other suites or by external accounting integration:

- **Multi-currency / FX revaluation.** The built-in module locks the shop to a single home currency at setup (ACCT-SETUP-006). Shops needing multi-currency are expected to use an external accounting integration. FX rounding and rate-move edge cases live in `docs/suites/edge-cases/` for the broader system.
- **Multi-entity / inter-company / consolidation.** One tenant, one set of books. Inter-company eliminations and consolidated reporting are explicitly outside this module.
- **Audit-grade SOX / GAAP / IFRS attestation.** The math here is correct for a small shop's own decision-making and tax filing. It is not a substitute for audited financial statements.
- **Complex payroll-tax depth.** ACCT-PAY-001 verifies that gross / net / withholding split is correct in the books. Federal / state / local tax-rate detail, multi-state employees, garnishments, benefit deductions, and similar payroll-tax depth are out of scope for the built-in module.
- **Inventory costing methods beyond Average and Standard.** FIFO and LIFO costing methods are not exercised. Cases assume Average or Standard cost behavior.
- **Anything requiring an accountant to operate or interpret.** If a case would require the user to think in debit / credit / journal-entry terms to act on it, it does not belong here. Manual adjustments (ACCT-JE-001 through ACCT-JE-003) are the closest the module comes — and they are framed as "manual adjustments" with plain-language balanced-totals indicators, not as raw journal entries.
```
