## EDGE-PERMZERO-003 — Discount limit of zero prevents any discount, including zero-percent

```yaml
id: EDGE-PERMZERO-003
title: A salesperson with a discount limit of zero cannot apply any discount, even a 0% one
goal: |
  Verify that a salesperson role configured with a maximum discount
  of 0% cannot apply a discount line of any percentage to a sales
  order — and that attempting a 0% discount is also blocked
  (preventing the "I just want to add the discount line" workaround
  that could later be edited).
roles:
  - Administrator
  - Sales / Order Entry
capabilities:
  - CAP-IDEN-ROLES
  - CAP-CROSS-PERMS-MATRIX
  - CAP-O2C-SO
preconditions:
  - A salesperson role with max discount = 0%.
  - A user in that role.
  - At least one customer and one part.
steps:
  - n: 1
    action: |
      As the zero-discount user, create a sales order. Attempt to
      apply a 5% discount.
    expected: |
      Discount is blocked with a clear "exceeds your discount
      authority" message.
  - n: 2
    action: |
      Attempt to apply a 0% discount.
    expected: |
      Discount is blocked. Zero is not a back door for adding a
      discount line that someone else can edit later.
  - n: 3
    action: |
      Confirm that the order can be saved without any discount
      applied.
    expected: |
      Order saves cleanly at full price.
  - n: 4
    action: |
      Have an administrator raise the user's max discount to 10%.
      Re-attempt the 5% discount.
    expected: |
      Discount applies. Authority change is auditable.
expected_overall: |
  Zero discount limit blocks all discount lines.
pass_criteria: |
  No discount possible at zero limit AND zero-percent attempt also
  blocked AND raised limit unblocks expected percentages.
why_this_matters: |
  A 0% discount line accepted today and edited to 50% tomorrow by a
  privileged user is a real audit failure mode. The right rule is:
  if the user has no authority to discount, they cannot place the
  line at all.
est_minutes: 8
```
