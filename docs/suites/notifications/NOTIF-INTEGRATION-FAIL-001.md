## NOTIF-INTEGRATION-FAIL-001 — Failed accounting sync notifies integrations owner

```yaml
id: NOTIF-INTEGRATION-FAIL-001
title: Accounting sync failure fires alert with error details to integrations owner
goal: |
  Verify that when a scheduled accounting / GL sync run fails (auth
  error, transport error, payload reject), an alert fires to the
  integrations owner and to the controller, with enough detail to
  triage (run id, timestamp, error code or message, affected record
  count if available).
roles:
  - Integrations Owner
  - Controller
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-ACCT-EXTERNAL
preconditions:
  - An accounting integration is configured and scheduled.
  - A failure can be induced (invalid credential, malformed payload,
    or destination unreachable).
prerequisite_cases:
  - P4-INTEG-001
steps:
  - n: 1
    action: |
      Induce a sync failure (invalid credential or simulated
      destination outage). Trigger or wait for the next sync run.
    expected: |
      An integration-failure notification fires to the integrations
      owner and controller with run id, timestamp, and error detail.
  - n: 2
    action: |
      Restore credentials / connectivity. Re-run the sync.
    expected: |
      Sync succeeds. A "recovered" notification (or silent clear of
      the prior alert) fires per policy.
  - n: 3
    action: |
      Open the integration log.
    expected: |
      Both the failure and the recovery are recorded with full detail.
expected_overall: |
  Sync failures surface immediately to the right people with enough
  detail to act.
pass_criteria: |
  Failure alert fires with actionable detail AND recovery is
  acknowledged AND log captures both events.
est_minutes: 9
```
