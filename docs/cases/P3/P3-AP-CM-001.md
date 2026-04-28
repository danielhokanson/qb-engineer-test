## P3-AP-CM-001 — Vendor credit memo

```yaml
id: P3-AP-CM-001
title: Apply a vendor credit memo against an open invoice or as credit on file
goal: |
  Verify a vendor credit memo (issued for a return-to-vendor or
  pricing dispute) reduces AP and applies cleanly against either an
  open invoice or as future credit.
roles:
  - Procurement
  - Controller
flows:
  - vendor-to-asset
  - part-to-inventory
capabilities:
  - CAP-ACCT-BUILTIN
preconditions:
  - At least one open vendor invoice exists.
  - A vendor return or pricing dispute justifies a credit.
prerequisite_cases:
  - P3-AP-001
  - P5-VENDOR-RETURN
steps:
  - n: 1
    action: |
      Find the vendor credit memo entry area. Enter a credit memo
      from the vendor for $250 referencing the original PO / RTV.
    expected: |
      Credit memo saves.
  - n: 2
    action: |
      Apply it against an open vendor invoice for that vendor.
    expected: |
      Invoice balance reduces by $250. AP is reduced. GL impact: AP
      debited, vendor expense or inventory credited (whichever the
      original posting hit).
  - n: 3
    action: |
      Open the AP aging. Verify the vendor's net AP reflects the
      credit.
    expected: |
      AP aging reduced for the vendor.
expected_overall: |
  Vendor credit memos reduce AP and apply correctly.
pass_criteria: |
  Credit memo posted AND applied AND AP reduced AND GL postings tie.
est_minutes: 6
negative_variants:
  - id: P3-AP-CM-001-N1
    title: Reject credit memo exceeding source invoice balance
    action: |
      Try to apply a credit memo for $5,000 against an invoice with
      a $1,200 remaining balance.
    expected: |
      Save is blocked or the credit is split: $1,200 to the invoice
      with the remainder held as a vendor credit on account.
    pass_criteria: |
      Over-application is gated and explicit.
  - id: P3-AP-CM-001-N2
    title: Cannot apply credit memo to a different vendor's invoice
    action: |
      Try to apply Pacific Steel Supply's credit memo to a Tokyo
      Bearings invoice.
    expected: |
      Save is blocked with a clear "credit applies only to the
      issuing vendor" message.
    pass_criteria: |
      Cross-vendor application refused.
```
