# Permissions Matrix Suite

Verifies that role-based access control actually enforces — both that allowed users can perform their capabilities, and that disallowed users cannot. The library spot-checks role enforcement in P1-USER-002; this suite covers the canonical (role × capability) cells that, if mis-permissioned, are real financial, security, or operational risks.

## ID convention

`PERM-{ROLE}-{CAP}-NNN` where:

- `ROLE` is the role being tested. Standard role abbreviations:
  `ADMIN` (Administrator), `ITADMIN` (IT Admin), `CONTROLLER` (Controller),
  `HR` (HR), `PRODMGR` (Production Manager), `PRODPLAN` (Production Planner),
  `FLOOR` (Floor Operator), `PROCUREMENT` (Procurement),
  `WAREHOUSE` (Warehouse / Logistics), `MAINTMGR` (Maintenance Manager),
  `MAINTTECH` (Maintenance Tech), `QC` (QC Inspector),
  `ENGINEER` (Engineer / R&D), `SALES` (Sales / Account Manager).
- `CAP` is a short capability name. Current capabilities:
  `PostJE`, `ClosePeriod`, `ReleaseWO`, `ApprovePO`, `VoidInvoice`,
  `ModifyBOM`, `ModifyTenant`, `CreateUser`, `ModifyCreditLimit`,
  `OverridePricing`, `DeleteCustomer`, `PostPayroll`, `ModifyTaxCodes`,
  `ApproveECR`, `ApproveJE`, `IssueCreditMemo`, `ConfigureRoles`,
  `ManageAPI`.
- `NNN` is a sequence within the cell (usually `001` for the canonical case; additional numbers reserved for variants like "with controller override approval").

A single case asserts whether the role *should* be able to perform the capability. Allow-cases verify the action succeeds and audit-logs correctly; deny-cases verify the action is blocked at both UI and direct-URL/API levels and produces a non-leaky error.

## What this suite is NOT

- Not a full N×M matrix. The cells included are the most consequential — those where a wrong answer is a security or financial liability. Some pairs are intentionally skipped (see "Intentionally skipped cells" below).
- Not a substitute for the spot-check in P1-USER-002. That case is the smoke test; this suite is the real audit.

## Intentionally skipped cells

The following (role × capability) pairs are **not** authored, by design:

- **Maintenance Tech** across all capabilities: bounded execution-only role with no plausible over-permission risk against financial / security / production-control capabilities. Already gated above by Maintenance Manager.
- **QC Inspector** for capabilities other than `ReleaseWO` and `ModifyBOM`: QC's adjacency only matters where production / engineering surfaces are nearby; for finance / identity / pricing / payroll, the deny is obvious and risk is low.
- **Production Planner** for capabilities other than `ReleaseWO`: Production Planner is a narrow planning role; over-permission risk into other domains is minimal.
- **Maintenance Manager** for capabilities other than `ReleaseWO`: similar — `ReleaseWO` is the case where surface overlap (asset WO vs. production WO) creates the risk worth testing.
- **Engineer / R&D** for `VoidInvoice`, `ClosePeriod`, `ModifyCreditLimit`, `IssueCreditMemo`, `ApproveJE`, `PostPayroll`, `DeleteCustomer`, `ModifyTaxCodes`, `ConfigureRoles`, `ModifyTenant`: Engineer's domain is BOMs / routings / ECRs; risk of cross-domain over-permission into finance / identity is low.

These can be added later if a deployment surfaces a real risk in one of these cells; the ID convention supports it.

## Sequence

Cases in this suite are independent. Run any in any order once the prerequisite users and roles exist.

```yaml
suite: permissions
title: Permissions matrix — every role × consequential capability
description: |
  Per-cell verification that role-based access actually allows or
  denies what it claims to. Covers the highest-stakes capabilities
  where a wrong permission grant is a real risk.
estimated_total_minutes: 540

prerequisites:
  phase_completed: P1
  required_users:
    - role: Administrator (always exists from P0)
    - role: Controller
    - role: Sales / Account Manager
    - role: Procurement
    - role: Production Manager
    - role: Production Planner
    - role: Floor Operator
    - role: Warehouse / Logistics
    - role: HR
    - role: IT Admin
    - role: Engineer / R&D
    - role: QC Inspector
    - role: Maintenance Manager

cases:
  # Capability: post a journal entry
  - id: PERM-CONTROLLER-PostJE-001
    intent: allow
  - id: PERM-ADMIN-PostJE-001
    intent: deny
  - id: PERM-ITADMIN-PostJE-001
    intent: deny
  - id: PERM-FLOOR-PostJE-001
    intent: deny
  - id: PERM-PRODMGR-PostJE-001
    intent: deny
  - id: PERM-PROCUREMENT-PostJE-001
    intent: deny
  - id: PERM-SALES-PostJE-001
    intent: deny
  - id: PERM-HR-PostJE-001
    intent: deny
  - id: PERM-ENGINEER-PostJE-001
    intent: deny

  # Capability: close (lock) a fiscal period
  - id: PERM-CONTROLLER-ClosePeriod-001
    intent: allow
  - id: PERM-ADMIN-ClosePeriod-001
    intent: deny
  - id: PERM-ITADMIN-ClosePeriod-001
    intent: deny
  - id: PERM-FLOOR-ClosePeriod-001
    intent: deny
  - id: PERM-PRODMGR-ClosePeriod-001
    intent: deny
  - id: PERM-PROCUREMENT-ClosePeriod-001
    intent: deny
  - id: PERM-SALES-ClosePeriod-001
    intent: deny
  - id: PERM-HR-ClosePeriod-001
    intent: deny

  # Capability: release a work order
  - id: PERM-PRODMGR-ReleaseWO-001
    intent: allow
  - id: PERM-PRODPLAN-ReleaseWO-001
    intent: allow
  - id: PERM-FLOOR-ReleaseWO-001
    intent: deny
  - id: PERM-PROCUREMENT-ReleaseWO-001
    intent: deny
  - id: PERM-SALES-ReleaseWO-001
    intent: deny
  - id: PERM-ENGINEER-ReleaseWO-001
    intent: deny
  - id: PERM-MAINTMGR-ReleaseWO-001
    intent: deny
  - id: PERM-QC-ReleaseWO-001
    intent: deny

  # Capability: approve a purchase order
  - id: PERM-PROCUREMENT-ApprovePO-001
    intent: allow
  - id: PERM-CONTROLLER-ApprovePO-001
    intent: allow
  - id: PERM-WAREHOUSE-ApprovePO-001
    intent: deny
  - id: PERM-PRODMGR-ApprovePO-001
    intent: deny
  - id: PERM-SALES-ApprovePO-001
    intent: deny
  - id: PERM-FLOOR-ApprovePO-001
    intent: deny
  - id: PERM-ENGINEER-ApprovePO-001
    intent: deny
  - id: PERM-HR-ApprovePO-001
    intent: deny

  # Capability: void / cancel a posted customer invoice
  - id: PERM-CONTROLLER-VoidInvoice-001
    intent: allow
  - id: PERM-ADMIN-VoidInvoice-001
    intent: deny
  - id: PERM-SALES-VoidInvoice-001
    intent: deny
  - id: PERM-PROCUREMENT-VoidInvoice-001
    intent: deny
  - id: PERM-FLOOR-VoidInvoice-001
    intent: deny
  - id: PERM-PRODMGR-VoidInvoice-001
    intent: deny
  - id: PERM-WAREHOUSE-VoidInvoice-001
    intent: deny
  - id: PERM-HR-VoidInvoice-001
    intent: deny

  # Capability: modify a released BOM
  - id: PERM-ENGINEER-ModifyBOM-001
    intent: allow
  - id: PERM-CONTROLLER-ModifyBOM-001
    intent: deny
  - id: PERM-PRODMGR-ModifyBOM-001
    intent: deny
  - id: PERM-FLOOR-ModifyBOM-001
    intent: deny
  - id: PERM-PROCUREMENT-ModifyBOM-001
    intent: deny
  - id: PERM-SALES-ModifyBOM-001
    intent: deny
  - id: PERM-QC-ModifyBOM-001
    intent: deny
  - id: PERM-WAREHOUSE-ModifyBOM-001
    intent: deny

  # Capability: modify tenant identity / company settings
  - id: PERM-ADMIN-ModifyTenant-001
    intent: allow
  - id: PERM-FLOOR-ModifyTenant-001
    intent: deny
  - id: PERM-ITADMIN-ModifyTenant-001
    intent: deny
  - id: PERM-CONTROLLER-ModifyTenant-001
    intent: deny
  - id: PERM-PRODMGR-ModifyTenant-001
    intent: deny
  - id: PERM-PROCUREMENT-ModifyTenant-001
    intent: deny
  - id: PERM-SALES-ModifyTenant-001
    intent: deny
  - id: PERM-HR-ModifyTenant-001
    intent: deny

  # Capability: create a system user
  - id: PERM-ITADMIN-CreateUser-001
    intent: allow
  - id: PERM-ADMIN-CreateUser-001
    intent: allow
  - id: PERM-PROCUREMENT-CreateUser-001
    intent: deny
  - id: PERM-CONTROLLER-CreateUser-001
    intent: deny
  - id: PERM-HR-CreateUser-001
    intent: deny
  - id: PERM-PRODMGR-CreateUser-001
    intent: deny
  - id: PERM-FLOOR-CreateUser-001
    intent: deny
  - id: PERM-SALES-CreateUser-001
    intent: deny

  # Capability: change a customer credit limit
  - id: PERM-CONTROLLER-ModifyCreditLimit-001
    intent: allow
  - id: PERM-SALES-ModifyCreditLimit-001
    intent: deny
  - id: PERM-ADMIN-ModifyCreditLimit-001
    intent: deny
  - id: PERM-ITADMIN-ModifyCreditLimit-001
    intent: deny
  - id: PERM-PROCUREMENT-ModifyCreditLimit-001
    intent: deny
  - id: PERM-PRODMGR-ModifyCreditLimit-001
    intent: deny
  - id: PERM-FLOOR-ModifyCreditLimit-001
    intent: deny
  - id: PERM-WAREHOUSE-ModifyCreditLimit-001
    intent: deny

  # Capability: override unit price on a quote / order line
  - id: PERM-SALES-OverridePricing-001
    intent: allow
  - id: PERM-FLOOR-OverridePricing-001
    intent: deny
  - id: PERM-PROCUREMENT-OverridePricing-001
    intent: deny
  - id: PERM-PRODMGR-OverridePricing-001
    intent: deny
  - id: PERM-WAREHOUSE-OverridePricing-001
    intent: deny
  - id: PERM-ENGINEER-OverridePricing-001
    intent: deny
  - id: PERM-HR-OverridePricing-001
    intent: deny

  # Capability: permanently delete a customer record
  - id: PERM-ADMIN-DeleteCustomer-001
    intent: allow
  - id: PERM-CONTROLLER-DeleteCustomer-001
    intent: deny
  - id: PERM-SALES-DeleteCustomer-001
    intent: deny
  - id: PERM-PROCUREMENT-DeleteCustomer-001
    intent: deny
  - id: PERM-PRODMGR-DeleteCustomer-001
    intent: deny
  - id: PERM-FLOOR-DeleteCustomer-001
    intent: deny
  - id: PERM-WAREHOUSE-DeleteCustomer-001
    intent: deny
  - id: PERM-HR-DeleteCustomer-001
    intent: deny

  # Capability: post a payroll run
  - id: PERM-HR-PostPayroll-001
    intent: allow
  - id: PERM-CONTROLLER-PostPayroll-001
    intent: deny
  - id: PERM-ADMIN-PostPayroll-001
    intent: deny
  - id: PERM-ITADMIN-PostPayroll-001
    intent: deny
  - id: PERM-PRODMGR-PostPayroll-001
    intent: deny
  - id: PERM-SALES-PostPayroll-001
    intent: deny
  - id: PERM-PROCUREMENT-PostPayroll-001
    intent: deny
  - id: PERM-FLOOR-PostPayroll-001
    intent: deny

  # Capability: modify tax-code rates / mappings
  - id: PERM-CONTROLLER-ModifyTaxCodes-001
    intent: allow
  - id: PERM-ADMIN-ModifyTaxCodes-001
    intent: deny
  - id: PERM-ITADMIN-ModifyTaxCodes-001
    intent: deny
  - id: PERM-SALES-ModifyTaxCodes-001
    intent: deny
  - id: PERM-PROCUREMENT-ModifyTaxCodes-001
    intent: deny
  - id: PERM-PRODMGR-ModifyTaxCodes-001
    intent: deny
  - id: PERM-HR-ModifyTaxCodes-001
    intent: deny
  - id: PERM-FLOOR-ModifyTaxCodes-001
    intent: deny

  # Capability: approve an engineering change request
  - id: PERM-ENGINEER-ApproveECR-001
    intent: allow
  - id: PERM-PRODMGR-ApproveECR-001
    intent: deny
  - id: PERM-FLOOR-ApproveECR-001
    intent: deny
  - id: PERM-PROCUREMENT-ApproveECR-001
    intent: deny
  - id: PERM-SALES-ApproveECR-001
    intent: deny
  - id: PERM-CONTROLLER-ApproveECR-001
    intent: deny
  - id: PERM-WAREHOUSE-ApproveECR-001
    intent: deny
  - id: PERM-HR-ApproveECR-001
    intent: deny

  # Capability: approve a posted JE over the approval threshold
  - id: PERM-CONTROLLER-ApproveJE-001
    intent: allow
  - id: PERM-ADMIN-ApproveJE-001
    intent: deny
  - id: PERM-ITADMIN-ApproveJE-001
    intent: deny
  - id: PERM-PRODMGR-ApproveJE-001
    intent: deny
  - id: PERM-SALES-ApproveJE-001
    intent: deny
  - id: PERM-PROCUREMENT-ApproveJE-001
    intent: deny
  - id: PERM-HR-ApproveJE-001
    intent: deny
  - id: PERM-FLOOR-ApproveJE-001
    intent: deny

  # Capability: issue a customer credit memo
  - id: PERM-CONTROLLER-IssueCreditMemo-001
    intent: allow
  - id: PERM-SALES-IssueCreditMemo-001
    intent: deny
  - id: PERM-ADMIN-IssueCreditMemo-001
    intent: deny
  - id: PERM-PROCUREMENT-IssueCreditMemo-001
    intent: deny
  - id: PERM-FLOOR-IssueCreditMemo-001
    intent: deny
  - id: PERM-WAREHOUSE-IssueCreditMemo-001
    intent: deny
  - id: PERM-PRODMGR-IssueCreditMemo-001
    intent: deny
  - id: PERM-HR-IssueCreditMemo-001
    intent: deny

  # Capability: configure role permissions
  - id: PERM-ITADMIN-ConfigureRoles-001
    intent: allow
  - id: PERM-ADMIN-ConfigureRoles-001
    intent: allow
  - id: PERM-CONTROLLER-ConfigureRoles-001
    intent: deny
  - id: PERM-HR-ConfigureRoles-001
    intent: deny
  - id: PERM-PRODMGR-ConfigureRoles-001
    intent: deny
  - id: PERM-SALES-ConfigureRoles-001
    intent: deny
  - id: PERM-PROCUREMENT-ConfigureRoles-001
    intent: deny
  - id: PERM-FLOOR-ConfigureRoles-001
    intent: deny

  # Capability: manage API keys / integrations
  - id: PERM-ITADMIN-ManageAPI-001
    intent: allow
  - id: PERM-ADMIN-ManageAPI-001
    intent: allow
  - id: PERM-CONTROLLER-ManageAPI-001
    intent: deny
  - id: PERM-PRODMGR-ManageAPI-001
    intent: deny
  - id: PERM-SALES-ManageAPI-001
    intent: deny
  - id: PERM-PROCUREMENT-ManageAPI-001
    intent: deny
  - id: PERM-ENGINEER-ManageAPI-001
    intent: deny
  - id: PERM-FLOOR-ManageAPI-001
    intent: deny

completion_criteria:
  - Every case in the suite has a recorded pass/fail.
  - For deny cases, both UI access AND direct-URL / API access were blocked.
  - For allow cases, the action succeeded AND was recorded in the audit log with user and timestamp.
```

## Authoring guidance for new cells

When adding a new `(role, capability)` cell:

1. Decide the intent (`allow` or `deny`) based on a defensible role definition for a typical mid-market manufacturer. When unsure, deny by default — over-permissioned defaults are a common security failure.
2. Write one case at the canonical ID `PERM-{ROLE}-{CAP}-001`.
3. Always test both UI and direct URL / API where applicable. UI hiding without backend enforcement is the most common version of the bug this suite catches.
4. For allow cases, always check the audit log records the action.
