## CONC-WO-START-001 — Two operators starting the same WO operation are serialized

```yaml
id: CONC-WO-START-001
title: Two operators scanning the same WO start barcode produces one started entry
goal: |
  Verify that two Floor Operators who scan the start barcode for the
  same WO operation at the same moment do not both end up with open
  labor entries against the same op. Either one is started and the
  other gets a clear "already started" message, or the system pairs
  both as collaborators on the same op (only if it explicitly
  supports multi-operator).
roles:
  - Floor Operator
preconditions:
  - Two Floor Operator users exist.
  - At least one released WO with a Released operation exists.
steps:
  - n: 1
    action: |
      Operator A and Operator B simultaneously scan the WO start
      barcode for the same operation.
    expected: |
      One of:
      (a) One scan starts the operation; the other returns a clear
          message ("operation already started by Operator A") and
          offers to join as a collaborator if applicable.
      (b) Both scans are accepted only if the system explicitly
          supports multi-operator labor on one operation.

      What is NOT acceptable: both scans appear to succeed but only
      one labor record exists, with no indication to the second
      operator that they were silently dropped.
  - n: 2
    action: |
      Open the WO operation's labor records.
    expected: |
      Either one labor record (with a clear actor) or two if the
      system supports it. No orphaned or duplicated records.
expected_overall: |
  Concurrent WO starts are serialized correctly.
pass_criteria: |
  No orphaned labor record AND no silent loss of one operator's
  start.
est_minutes: 6
```
