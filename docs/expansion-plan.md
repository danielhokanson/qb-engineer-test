# Library Expansion Plan

The current library covers ~127 cases across Phases 0–5 plus a 6-case tutorial. That gives breadth across the canonical lifecycle but is honestly thin for an ERP at qb-engineer's intended scale. A real manufacturer-grade test library lands in the 800–1,500 case range. This document captures the categories that are underweight, with priority and rough scope estimates, so future expansion sessions don't have to re-derive the analysis.

Held aside, not in flight. Pick a category and act on it when ready.

## Status: deferred

These items are documented but not actively being authored.

## Priority 1 — highest bug-finding ROI

### Negative variants on every input case
**Estimate:** +200 to +400 cases (or variants on existing cases).
**Why:** Most real bugs hide in input validation, edge cases, and state conflicts — not in happy paths. Each existing case that takes user input or transitions state should have one to three negative variants covering: empty/invalid input, permission boundaries, state conflicts (e.g., "close a period with open transactions"), and data-integrity violations.
**How to apply:** Sweep Phases 1–5. Every case with a `steps` block that includes user input gets at least one negative variant before it's considered done. Variants live as the parent case's `negative_variants` field, not in a separate document.

### Permission matrix
**Estimate:** +100 to +200 cases.
**Why:** P1-USER-002 spot-checks one user's permission boundaries. A real audit needs every (role, capability) pair verified. Without this, a permission bug in qb-engineer could let any role do anything the UI doesn't actively hide — a common security failure mode.
**How to apply:** New suite under `docs/suites/permissions/`. ID convention `PERM-{ROLE}-{CAP}-NNN`. Organize as a matrix where each row is a role and each column is a capability (create-customer, post-journal-entry, release-work-order, etc.). One case per cell.

### Reports validation
**Estimate:** +60 to +120 cases.
**Why:** Reports are where executives live in the system. Reports that don't tie out to source data are common bugs and obvious in production. Currently the library only spot-checks AR/AP aging in P5-CLOSE-002.
**How to apply:** New suite under `docs/suites/reports/`. One case per standard report: P&L, balance sheet, cash flow, AR aging, AP aging, inventory valuation, WO variance, MRP recommendation, capacity planning, sales-by-customer, sales-by-product, vendor performance, employee labor distribution, depreciation schedule, etc. Each case takes a known transaction set and verifies the report ties out.

## Priority 2 — important, not urgent

### Search and filter UX per list view
**Estimate:** +40 to +80 cases.
**Why:** This is where everyday usage friction lives. A list view that looks fine until you have 5,000 customers becomes the most-hated screen in the app.
**How to apply:** Cases per list view (customers, vendors, parts, WOs, POs, etc.) covering: search by partial match, filter by status, filter by date range, sort by each column, page through large result sets.

### Edge cases on dates, currencies, numbers
**Estimate:** +40 to +80 cases.
**Why:** Fiscal year boundaries, FX rate moves, decimal precision, time zones, leap years, DST transitions — these are the bugs that surface only at month-end or only for international customers.
**How to apply:** Mix of dedicated suite cases (`docs/suites/edge-cases/`) and parameter variations on existing P3/P4/P5 cases.

### Audit trail verification per major action
**Estimate:** +30 to +60 cases.
**Why:** Audit trails that look right but miss certain action types are a compliance risk. Need explicit verification per major action that the audit log captured who, what, when, and the before/after state.
**How to apply:** Could be a `audit_check: true` flag on existing cases (similar to `i18n_check`), or a dedicated suite. Lean toward dedicated suite for clarity.

### Concurrency
**Estimate:** +20 to +40 cases.
**Why:** Two users editing the same record. Optimistic locking. Race conditions on inventory reservation. None of this is currently tested. These bugs are silent in development and catastrophic in production.
**How to apply:** New suite under `docs/suites/concurrency/`. Each case requires two separate sessions (two browser tabs / two testers) — the runner doesn't currently support multi-session orchestration, so these may be runnable but harder to automate.

## Priority 3 — useful, lower marginal value

### Bulk operations beyond import
**Estimate:** +30 to +60 cases.
**Why:** P2-PART-005 covers bulk import. Mass update, mass delete, mass status change, mass assign are missing. Real shops use these all the time.
**How to apply:** Per-entity bulk-action cases (bulk update vendor terms, bulk reassign WOs, bulk close maintenance tickets, etc.).

### Notifications and alerts
**Estimate:** +20 to +40 cases.
**Why:** Low-stock alerts, overdue PM, AR aging triggers, approval reminders. These are workflow accelerators that often break silently.
**How to apply:** Cases verifying each notification type fires under the right conditions and surfaces in the right channels (in-app, email, etc.).

### Detailed field-level cases
**Estimate:** +200 to +500 cases.
**Why:** One case per significant field, exercising each validation rule in isolation. High effort, lower marginal value — most of what they catch is also caught by good negative variants. Useful for regression suites where you want to know exactly which field broke.
**How to apply:** Author after Priority 1 negative variants are in place. May overlap with negative variants enough that this category gets folded in.

### Data quality
**Estimate:** +15 to +30 cases.
**Why:** Duplicate detection, fuzzy match, merge records. Important when migrating in bad data or recovering from typos. Less critical for a clean install.

### Migration scenarios beyond initial cutover
**Estimate:** +20 to +40 cases.
**Why:** P3-OB-001 and P3-OB-002 cover initial inventory and AR/AP cutover. Doesn't cover: partial migration (cut over inventory in March, AR/AP in April), data validation pre-migration, rollback after a bad cutover.

## Priority 4 — out of scope without justification

These categories require distinct testing apparatus or domain expertise. Don't author until there's a specific reason:

- **Performance / load** (need synthetic data generators, multi-user load harnesses)
- **Industry verticals** (food traceability, FDA medical, AS9100 aerospace) — author when relevant to a specific customer
- **Accessibility deep-dive** (already planned as `suites/accessibility-suite.md`)
- **Internationalization deep-dive** (already planned as `suites/i18n-suite.md`)

## Recommended sequence when expansion work resumes

1. **Negative variant sweep** of existing 127 cases. Roughly doubles bug-finding power without a whole new phase.
2. **Permission matrix** as `docs/suites/permissions/`. Most-needed missing category.
3. **Reports suite** as `docs/suites/reports/`. Highest visibility for end users.
4. **Re-evaluate.** After Priority 1 is done, look at which Priority 2 / 3 categories actually surface gaps in real testing, and prioritize from there.

Field-level cases, concurrency, and the lower-priority categories tend to be over-specced before there's evidence they catch real bugs. Defer until usage data justifies them.
