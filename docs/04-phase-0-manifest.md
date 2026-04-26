# Phase 0 Scenario Manifest

This file is the index the runner uses to present Phase 0 to a tester. It declares the order, the branch points, the scale tags, and the expected duration. The runner reads this and the case files to render the test session.

```yaml
phase: P0
title: Bootstrap — from empty database to a configured tenant
description: |
  Take the application from a freshly installed state, with no
  records and no users, to a state where foundational records can
  be added in Phase 1. This phase is run by a single administrator
  in most cases.
estimated_total_minutes: 80

# The default fixture controls things like the company name and
# example values used inside cases. Other fixtures can be swapped in
# without changing the cases themselves.
default_fixture: cascade-components-mid

# Sequence: cases run in this order by default. The runner allows
# skip-ahead, but warns the tester about preconditions.
sequence:
  - id: P0-INSTALL-001
    required: true
  - id: P0-ADMIN-001
    required: true
    note: |
      Blocking. Without an admin account, nothing else in the phase
      can be tested.
  - id: P0-ADMIN-002
    required: true
  - id: P0-TENANT-001
    required: true
  - id: P0-TENANT-002
    required: true
    scale_tags: [small-shop, mid-market, enterprise]
    note: |
      Required everywhere. Even single-language shops should test
      that switching works.
  - id: P0-TENANT-003
    required: true
  - id: P0-TENANT-004
    required: true
  - id: P0-TENANT-005
    required: true
    note: |
      Decision point. The chosen costing model influences how some
      Phase 1 and Phase 4 cases read, but does not branch this phase.
  - id: P0-INTEG-001
    required: true
    branches:
      - branch: accounting-mode
        downstream_effect: |
          Affects Phase 4 financial cases. The runner records the
          choice and serves the matching variants there.
  - id: P0-INTEG-002
    required: true
    branches:
      - branch: shipping-mode
        downstream_effect: |
          Affects Phase 4 shipping cases.
  - id: P0-INTEG-003
    required: true
  - id: P0-USER-001
    required: true
    scale_variants:
      small-shop:
        note: |
          Small shops may collapse this to two roles (Owner, Worker).
          The default fixture uses five. The tester can override the
          fixture before the case starts.
      enterprise:
        note: |
          Enterprise fixtures may add more roles. The tester is
          expected to use whatever fixture matches their scenario.
  - id: P0-USER-002
    required: true
  - id: P0-USER-003
    required: true
  - id: P0-USER-004
    required: false
    scale_tags: [mid-market, enterprise]
    note: |
      Bulk user provisioning. Skip in single-admin small-shop runs.

  # Authentication hardening (added during expansion sweep)
  - id: P0-AUTH-001
    required: true
    note: |
      MFA on the first admin. Required everywhere — high-privilege
      accounts without MFA are a default no-go for any serious
      security review.
    prerequisite_cases:
      - P0-ADMIN-001
  - id: P0-AUTH-002
    required: true
    note: |
      Self-service password reset. Required to verify the canonical
      account-recovery path is safe.
    prerequisite_cases:
      - P0-USER-003
  - id: P0-AUTH-003
    required: true
    note: |
      Account lockout after failed attempts. Required to verify
      brute-force defenses exist.
    prerequisite_cases:
      - P0-USER-003
  - id: P0-AUTH-004
    required: false
    scale_tags: [mid-market, enterprise]
    note: |
      API tokens. Skip if the application has no documented API.
  - id: P0-AUTH-005
    required: false
    scale_tags: [mid-market, enterprise]
    note: |
      SSO. Run when an external IdP test tenant is available.
  - id: P0-AUDIT-001
    required: true
    note: |
      Verify the admin audit log captures Phase 0 actions. Required
      before continuing — an unaudited tenant configuration is a
      compliance liability.
    prerequisite_cases:
      - P0-USER-003

  - id: P0-INFRA-001
    required: true
    note: |
      Final sanity check. Should always be the last case in the
      phase.

# Skip-ahead checkpoints: places where a tester can jump in mid-phase
# if they're testing something specific and don't want to run the
# preceding cases. The runner asks them to confirm the listed state.
checkpoints:
  - after: P0-ADMIN-002
    state_summary: |
      Admin account exists and is signed in. No tenant configuration
      yet.
  - after: P0-TENANT-005
    state_summary: |
      Company identity, locale, time zone, fiscal year, currency,
      and costing model are all saved. No integrations configured.
      No users beyond the first admin.
  - after: P0-INTEG-003
    state_summary: |
      All tenant configuration and all integration choices are saved.
      No additional users, no roles defined.
  - after: P0-USER-003
    state_summary: |
      Full Phase 0 complete except final persistence check. Two users
      exist (admin + Floor Operator). All settings saved.

# Branch declarations referenced by cases. The runner shows these
# to the tester at the appropriate case and records the choice for
# downstream phases.
branches:
  - id: accounting-mode
    declared_in: P0-INTEG-001
    affects_phases: [P4]
    options:
      - id: quickbooks
      - id: manual
      - id: skip
  - id: shipping-mode
    declared_in: P0-INTEG-002
    affects_phases: [P4]
    options:
      - id: connected-carrier
      - id: manual

# i18n and 508 are covered by dedicated suites that run separately.
# Phase 0 includes one representative i18n check (P0-TENANT-002) but
# does not exhaustively check accessibility or translation on every
# case.
dedicated_suites_referenced:
  - i18n-suite
  - accessibility-suite

# What "complete" means for this phase. The runner uses this to
# show progress and to gate Phase 1.
completion_criteria:
  - All required cases in sequence are marked passed.
  - Branch choices are recorded for accounting-mode and shipping-mode.
  - P0-INFRA-001 passed (data persistence verified).

# What's deliberately not in this phase
out_of_scope:
  - Master data (parts, BOMs, customers, vendors). Begins in Phase 1.
  - Inventory transactions. Begins in Phase 3.
  - Production. Begins in Phase 4.
  - Periodic close and reporting. Begins in Phase 5.
```

## Notes for the runner implementer

A few things worth calling out for whoever builds the runner:

**On `required: true`:** Every case in Phase 0 is required because a missed configuration step makes the whole tenant unusable. Future phases will have optional cases (e.g., subcontracting only matters to companies that use it). The runner should support both.

**On scale tags:** The intent is that the runner reads the tester's chosen fixture (small-shop, mid-market, enterprise) at the start of the phase and filters or annotates cases accordingly. Phase 0 is mostly scale-agnostic; later phases will use this more.

**On checkpoints:** When a tester chooses to skip ahead to a checkpoint, the runner displays the `state_summary` and asks them to confirm. There are three legitimate ways for them to confirm:

1. They've already run the prior cases and the state is real.
2. They have access to a seeded test environment where the state was established by an admin script.
3. They acknowledge that they're starting from this point and any failures from missing state are theirs to interpret.

Eventually the application may grow a "seed test data to checkpoint X" admin function the runner can call. For now, manual setup or admission-of-skip is fine.

**On branches:** A branch declared in Phase 0 affects which case variants are served in later phases. The runner stores the choice in IndexedDB. When the tester reaches a phase that branches on `accounting-mode = quickbooks`, only the QuickBooks-flavored cases appear; the manual cases are filtered out. If the tester wants to test the other branch, they can either reset their session or run a parallel session with the other choice.

**On out-of-scope items:** This list is here partly to make scope discussions easier later. If someone reviewing Phase 0 says "where's the part about creating the first BOM?" — the answer is in the manifest: that's Phase 1.
