## P5-WHTAX-001 — Withholding tax on a vendor payment

```yaml
id: P5-WHTAX-001
title: Withhold tax on a vendor payment and remit to the authority
goal: |
  Verify the application supports withholding tax: a vendor payment
  has a portion withheld and posted to a withholding-payable account,
  the vendor sees only the net payment, and the withheld amount is
  trackable for remittance to the tax authority.
roles:
  - Controller
flows:
  - period-close
scale_tags:
  - mid-market
  - enterprise
preconditions:
  - At least one vendor is flagged for withholding (e.g., a foreign
    contractor).
  - An open invoice from that vendor exists.
prerequisite_cases:
  - P3-AP-001
steps:
  - n: 1
    action: |
      Open the vendor record. Configure withholding: e.g., 30% on
      services.
    expected: |
      Withholding setting saves.
  - n: 2
    action: |
      Pay the vendor's open invoice.
    expected: |
      Payment posts net of withholding (e.g., $1,000 invoice ->
      $700 to vendor, $300 to withholding payable).
  - n: 3
    action: |
      Run the withholding-payable balance.
    expected: |
      Balance equals withheld amounts pending remittance.
expected_overall: |
  Withholding posts correctly and is trackable for remittance.
pass_criteria: |
  Net payment to vendor AND withholding payable balance correct AND
  remittance can be reported.
est_minutes: 8
```
