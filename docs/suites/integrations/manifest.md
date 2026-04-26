# Integrations Suite

Accounting sync to a generic external accounting system, file-based
import / export, and EDI document classes (850 / 855 / 856 / 810).
The suite is intentionally generic — it doesn't name a specific
provider. Real deployments swap in actual provider names per
configuration.

## ID convention

`INTEG-{KIND}-NNN`.

```yaml
suite: integrations
title: Accounting sync, file-based import/export, EDI document classes
description: |
  Verify outbound accounting sync, file-based round-trips, and EDI
  inbound / outbound flows for the four canonical EDI document
  classes used in B2B manufacturing.
estimated_total_minutes: 50

cases:
  - id: INTEG-ACCT-001
  - id: INTEG-FILE-IMP-001
  - id: INTEG-FILE-EXP-001
  - id: INTEG-EDI-850-001
  - id: INTEG-EDI-855-001
  - id: INTEG-EDI-856-001
  - id: INTEG-EDI-810-001

completion_criteria:
  - Each integration push / pull completes without unhandled error.
  - Failures surface clearly to the user, not silently dropped.
```
