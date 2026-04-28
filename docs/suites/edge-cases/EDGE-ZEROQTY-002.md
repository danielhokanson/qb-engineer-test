## EDGE-ZEROQTY-002 — Zero-quantity work order completion is rejected or recorded as scrap-only

```yaml
id: EDGE-ZEROQTY-002
title: A work order completion of zero good units does not credit production
goal: |
  Verify that posting a work order completion with zero good units
  produced — typically because all output was scrap — does not credit
  production output, that any scrapped quantity is recorded against
  the proper scrap account, and that material issued is not
  inadvertently "returned" by the zero completion.
roles:
  - Production Manager
  - Controller
capabilities:
  - CAP-MFG-COMPLETE
  - CAP-MFG-WOVARIANCE
preconditions:
  - At least one open work order with materials issued.
steps:
  - n: 1
    action: |
      Post a completion for the work order with: good = 0, scrap = 5
      (the entire run was scrap).
    expected: |
      The application accepts the completion with explicit zero good
      and a positive scrap. OR: it rejects "zero good with positive
      scrap" requiring a separate scrap-only path. Either policy is
      documented.
  - n: 2
    action: |
      Inspect the GL postings.
    expected: |
      No credit to FG inventory or production output for the zero
      good. The scrap quantity posts to a documented scrap / variance
      account.
  - n: 3
    action: |
      Verify materials issued are NOT silently returned to raw stock
      by the zero completion.
    expected: |
      Material issuance remains; only the explicit scrap is recorded.
  - n: 4
    action: |
      Run the WO variance report.
    expected: |
      WO shows full material issuance, zero output, and a variance
      attributable to the all-scrap run.
expected_overall: |
  Zero-good completions handle scrap explicitly and never silently
  reverse material issuance.
pass_criteria: |
  No FG credit AND material issuance preserved AND scrap posts to
  documented account AND WO variance reflects the loss.
why_this_matters: |
  All-scrap runs happen in real production. The system has to handle
  them as a recognizable economic event, not as a no-op or a silent
  material reversal.
est_minutes: 10
```
