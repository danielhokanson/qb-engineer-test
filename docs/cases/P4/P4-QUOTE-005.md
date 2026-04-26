## P4-QUOTE-005 — Quote expiration handling

```yaml
id: P4-QUOTE-005
title: A quote past its validity date cannot be converted without re-acceptance
goal: |
  Verify that a quote whose validity date has passed cannot be
  converted to an SO without explicit re-acceptance / re-issue, and
  is visually flagged as expired in the quote list.
roles:
  - Sales / Account Manager
flows:
  - quote-to-cash
preconditions:
  - At least one quote with a validity period exists.
prerequisite_cases:
  - P4-QUOTE-001
steps:
  - n: 1
    action: |
      Find or create a quote with validity ending yesterday (or
      backdate the quote so its window has lapsed).
    expected: |
      Quote saves.
  - n: 2
    action: |
      Open the quote list.
    expected: |
      The expired quote is visibly marked (e.g., "Expired" badge or
      strikethrough date).
  - n: 3
    action: |
      Try to convert the expired quote to an SO.
    expected: |
      Conversion is blocked or warned, with an option to re-issue
      the quote (extend validity) before converting.
  - n: 4
    action: |
      Re-issue the quote with a new validity. Convert to SO.
    expected: |
      New conversion succeeds.
expected_overall: |
  Expiration is enforced; re-issue is the proper path forward.
pass_criteria: |
  Expired conversion blocked AND re-issue path works AND list flags
  expired status.
est_minutes: 5
```
