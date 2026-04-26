## RPT-VENDSTMT-001 — Vendor statement (or self-billing summary) ties to AP ledger

```yaml
id: RPT-VENDSTMT-001
title: Vendor statement reconciliation matches our AP ledger to the vendor's view
goal: |
  Generate the per-vendor statement (or vendor reconciliation
  worksheet). Verify the listed invoices, credit memos, and
  payments equal the AP ledger for that vendor and the ending
  balance matches the vendor's row on AP aging.
roles:
  - Controller
preconditions:
  - At least one vendor has period activity — an invoice, a
    payment, and a credit memo (P3-AP-CM-001).
prerequisite_cases:
  - P3-AP-001
  - P3-PAY-001
  - P3-AP-CM-001
steps:
  - n: 1
    action: |
      Generate the vendor statement / reconciliation for one
      vendor for the period.
    expected: |
      Statement lists invoices, payments, and credit memos in date
      order with running balance.
  - n: 2
    action: |
      Compare each line to the vendor's entries in the AP ledger.
    expected: |
      Every entry matches; no missing or extra.
  - n: 3
    action: |
      Verify ending balance = opening + (invoices - payments -
      credit memos applied).
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Compare ending balance to the vendor's row on AP aging
      (RPT-APAGE-001).
    expected: |
      Match within $0.01.
expected_overall: |
  Vendor statement equals AP ledger and ties to AP aging.
pass_criteria: |
  Every transaction in the period appears on the statement AND
  ending balance ties to AP aging within $0.01.
why_this_matters: |
  Vendor reconciliation prevents double payments and missed
  credit memos. A statement that doesn't tie to AP makes the
  reconciliation untrustworthy.
est_minutes: 10
```
