# Concurrency Suite

Two users editing the same record. Two pickers reserving the same inventory. A late posting racing the period close. Concurrency bugs are silent in single-user testing and catastrophic in production. This suite covers the canonical multi-user races against shared state.

## Runner support note

These cases require two separate sessions running side-by-side: two browser tabs, two devices, or two testers. The runner does not currently support multi-session orchestration, so the tester drives the timing manually. That's acceptable — the cases describe what to do at each session in order.

## ID convention

`CONC-{SCENARIO}-NNN`.

## Sequence

Independent. Run any case once two test users with appropriate roles are configured.

```yaml
suite: concurrency
title: Concurrency — two-user races and optimistic locking
description: |
  Verify that the application detects and handles concurrent edits,
  reservation races, and period-close vs. late-posting races without
  silent data loss or double-spend.
estimated_total_minutes: 50

cases:
  - id: CONC-EDIT-CUSTOMER-001
  - id: CONC-RESERVE-INV-001
  - id: CONC-PERIOD-CLOSE-RACE-001
  - id: CONC-WO-START-001
  - id: CONC-OPTIMISTIC-LOCK-001

completion_criteria:
  - No silent overwrites in any case.
  - Every conflict produces a clear, recoverable user-facing error.
```
