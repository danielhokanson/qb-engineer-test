#!/usr/bin/env python3
"""
Rewrite vague preconditions like "P4-WO-001 has passed." into
state-describing preconditions like:

  A work order has been released from a sales order. The WO carries a stable
  number, references a BOM and routing, and is in Released status — visible
  to the floor but not yet started. (Established by P4-WO-001.)

Run from repo root.
"""

import re
from pathlib import Path

# Map case-id-prereq → the state that case establishes.
# Phrased as a brief description that a tester can verify directly.
STATE_MAP = {
    # Phase 0 / generic
    "Phase 0 is complete.": (
        "The application is bootstrapped: company identity, locale, time zone, "
        "fiscal year, currency, costing model, and integrations are configured, "
        "and the first administrator can sign in. (Phase 0 outcomes.)"
    ),
    "Phase 1 is complete.": (
        "Foundational records exist: at least one location, one work center, "
        "standard units of measure, the chart of accounts, at least one tax code, "
        "the first employee, a default calendar, and at least one fixed asset. "
        "(Phase 1 outcomes.)"
    ),

    # Phase 1 individual
    "P1-LOC-001 has passed.": (
        "The primary location exists with a complete address and is flagged as "
        "the company default. (Established by P1-LOC-001.)"
    ),
    "P1-WC-001 has passed.": (
        "At least one work center exists (e.g. Press Shop), linked to the "
        "primary location, with a default labor rate and capacity. "
        "(Established by P1-WC-001.)"
    ),
    "P1-WC-002 has passed.": (
        "Multiple work centers exist covering common operations (Press Shop, "
        "Cut & Saw, Weld, Paint, Assembly, Inspection), all linked to the "
        "primary location. (Established by P1-WC-002.)"
    ),
    "P1-UOM-001 has passed.": (
        "Standard units of measure are available (each, kilogram, pound, hour, "
        "foot, square foot, gallon, liter). (Established by P1-UOM-001.)"
    ),
    "P1-GL-001 has passed.": (
        "The chart of accounts is initialized with standard accounts: cash, "
        "accounts receivable, inventory, accounts payable, sales, cost of goods "
        "sold, and wages — at minimum. (Established by P1-GL-001.)"
    ),
    "P1-TAX-001 has passed.": (
        "At least one sales tax code exists with a defined rate, exemption flag, "
        "and posting GL account. (Established by P1-TAX-001.)"
    ),
    "P1-EMP-001 has passed.": (
        "The first employee record exists with hire date, default location, "
        "department, and pay info. (Established by P1-EMP-001.)"
    ),
    "P1-EMP-003 has passed (employees exist to potentially link to).": (
        "At least four employees exist covering varied pay classifications "
        "(hourly with overtime, salaried-exempt, salaried-non-exempt). "
        "(Established by P1-EMP-003.)"
    ),
    "P1-USER-001 has passed.": (
        "A second non-admin system user exists, assigned a Floor Operator (or "
        "equivalent) role and able to sign in. (Established by P1-USER-001.)"
    ),
    "P1-CAL-001 has passed.": (
        "The plant default calendar is configured with working days, shift times, "
        "and at least the upcoming-year US federal holidays marked non-working. "
        "(Established by P1-CAL-001.)"
    ),
    "P1-ASSET-001 has passed.": (
        "At least one fixed asset record exists, linked to a work center, with "
        "depreciation method and useful life configured and a depreciation "
        "schedule generated. (Established by P1-ASSET-001.)"
    ),

    # Phase 2 individual
    "P2-VENDOR-001 has passed.": (
        "The first vendor record exists with name, address, primary contact, "
        "payment terms, and default expense / inventory GL account. "
        "(Established by P2-VENDOR-001.)"
    ),
    "P2-CUST-001 has passed.": (
        "The first customer record exists with billing and shipping addresses, "
        "primary contact, default tax code, payment terms, and a $50,000 credit "
        "limit. (Established by P2-CUST-001.)"
    ),
    "P2-CUST-001 has passed (customer with $50,000 credit limit).": (
        "The first customer record exists with billing and shipping addresses, "
        "primary contact, default tax code, payment terms, and a $50,000 credit "
        "limit. (Established by P2-CUST-001.)"
    ),
    "P2-PART-001 has passed.": (
        "A raw material part record exists (e.g. RM-STEEL-1018-3X3) with type, "
        "unit of measure, default vendor, and inventory GL account. "
        "(Established by P2-PART-001.)"
    ),
    "P2-PART-002 has passed.": (
        "A finished-goods part exists (e.g. FG-BRACKET-A1) with type, unit of "
        "measure, sales GL account, and a list price. "
        "(Established by P2-PART-002.)"
    ),
    "P2-BOM-001 has passed.": (
        "A finished-goods part has a single-level BOM listing component parts, "
        "quantities-per-unit, and units of measure, marked effective. "
        "(Established by P2-BOM-001.)"
    ),
    "P2-ROUTE-001 has passed.": (
        "A finished-goods part has a routing with ordered operations at the "
        "right work centers, including setup and run times for each. "
        "(Established by P2-ROUTE-001.)"
    ),
    "P2-RD-001 has passed.": (
        "A prototype part exists, marked not-for-production / not-for-sale and "
        "gated from sales orders. (Established by P2-RD-001.)"
    ),
    "P2-LEAD-001 has passed.": (
        "A sales lead has been captured with company, contact info, source "
        "attribution, and estimated deal size. (Established by P2-LEAD-001.)"
    ),
    "Phase 1 is complete (chart of accounts, tax codes, locations exist).": (
        "Foundational records exist: at least one location, work center, "
        "standard UoMs, the chart of accounts, at least one tax code, employees, "
        "calendar, and asset records. (Phase 1 outcomes.)"
    ),

    # Phase 3 individual
    "P3-PO-001 has passed.": (
        "A purchase order has been issued to a vendor, has a stable PO number, "
        "and has at least one line for a part with quantity and price. "
        "(Established by P3-PO-001.)"
    ),
    "P3-PO-001 has passed (an issued PO exists).": (
        "A purchase order has been issued to a vendor, has a stable PO number, "
        "and has at least one line for a part with quantity and price. "
        "(Established by P3-PO-001.)"
    ),
    "P3-PO-002 has passed (PO with a fixed-asset line).": (
        "A purchase order has been issued that includes a fixed-asset line "
        "(capitalize-on-receipt) alongside any inventory lines, with asset "
        "class and capitalization GL account specified. "
        "(Established by P3-PO-002.)"
    ),
    "P3-RECV-001 has passed.": (
        "First inventory exists from a vendor receipt: the PO is in Received "
        "or Closed status, lot numbers have been recorded for lot-tracked "
        "items, and GR/IR is pending the vendor invoice. "
        "(Established by P3-RECV-001.)"
    ),
    "P3-AP-001 has passed.": (
        "A vendor invoice has been 3-way matched against its PO and receipt, "
        "is approved for payment, and AP is increased accordingly. "
        "(Established by P3-AP-001.)"
    ),
    "P3-AP-001 has passed (an approved AP invoice exists).": (
        "A vendor invoice has been 3-way matched against its PO and receipt, "
        "is approved for payment, and AP is increased accordingly. "
        "(Established by P3-AP-001.)"
    ),
    "P3-OB-001 has passed (opening inventory exists).": (
        "Opening inventory balances have been posted: at least five parts have "
        "starting quantities and unit costs as of a cutover date, with the "
        "offsetting equity / opening-balance GL entry. "
        "(Established by P3-OB-001.)"
    ),

    # Phase 4 individual
    "P4-QUOTE-001 has passed.": (
        "A quote has been created for a customer with the right customer-list "
        "pricing applied, validity dates set, and the quote sent. "
        "(Established by P4-QUOTE-001.)"
    ),
    "P4-QUOTE-003 has passed.": (
        "A sales order has been created from an accepted quote, in Open or "
        "Booked status, with customer PO number, requested ship date, and "
        "ship-to address all confirmed. (Established by P4-QUOTE-003.)"
    ),
    "P4-WO-001 has passed.": (
        "A work order has been released from a sales order. The WO carries a "
        "stable number, references the BOM and routing active at release, and "
        "is in Released status — visible to the floor but not yet started. "
        "(Established by P4-WO-001.)"
    ),
    "P4-INV-001 has passed.": (
        "A customer invoice has been posted from a shipped sales order, AR "
        "has increased accordingly, and the invoice has been sent to the "
        "customer. (Established by P4-INV-001.)"
    ),
    "P4-HIRE-001 has passed.": (
        "A new employee record exists with all required onboarding documents "
        "(W-4, I-9, direct deposit, background check, drug test) captured "
        "and any required digital signatures attached. "
        "(Established by P4-HIRE-001.)"
    ),
    "P4-HIRE-002 has passed.": (
        "The new employee has a system user account, the user is linked to "
        "the employee record, and a Floor Operator role is assigned. "
        "(Established by P4-HIRE-002.)"
    ),

    # Phase 5 individual
    "P5-DAMAGE-001 has passed.": (
        "A damage report exists against an asset, with description, severity, "
        "and (optionally) photos, and a maintenance ticket has been created "
        "in the maintenance queue. (Established by P5-DAMAGE-001.)"
    ),
    "P5-DAMAGE-002 has passed.": (
        "A maintenance ticket has been triaged: priority is set, a tech is "
        "assigned, and the ticket is scheduled for execution. "
        "(Established by P5-DAMAGE-002.)"
    ),
    "P5-PM-001 has passed.": (
        "A preventative maintenance schedule is configured on an asset, with "
        "interval, description, required parts, estimated labor, and a "
        "next-due date that will trigger a PM work order. "
        "(Established by P5-PM-001.)"
    ),
    "P5-RMA-001 has passed.": (
        "An RMA has been created against a shipped invoice, with returned "
        "quantity, reason, desired resolution, and customer-facing return "
        "instructions. (Established by P5-RMA-001.)"
    ),
    "P5-RMA-002 has passed.": (
        "Returned product has been physically received, inspected, and "
        "dispositioned — units routed to return-to-stock, rework, or scrap "
        "as appropriate. (Established by P5-RMA-002.)"
    ),

    # Phase 4 floor steps that other P4/P5 cases reference
    "P4-WO-START has passed.": (
        "A work-order operation is in progress: an operator scanned the WO and "
        "the start action, the operation transitioned from Released to "
        "In Progress, labor time is tracking, and the kanban card has moved "
        "accordingly. (Established by P4-WO-START.)"
    ),
    "P4-COMP-FINAL has passed.": (
        "The final routing operation is complete: WO is closed, finished goods "
        "are in inventory, WIP is cleared, and any required serial numbers have "
        "been recorded. (Established by P4-COMP-FINAL.)"
    ),
    "P4-PUTAWAY has passed.": (
        "Finished goods have been moved from the staging area to a storage bin "
        "and are visible in the available-to-pick view at the new location. "
        "(Established by P4-PUTAWAY.)"
    ),
    "P4-PICK has passed.": (
        "All sales-order lines have been picked at the bin, allocated to the "
        "SO, and staged for shipping. (Established by P4-PICK.)"
    ),
    "P4-PACK has passed.": (
        "The order is packed into shipping containers, the packing slip has "
        "been generated, and items have been verified against the SO. "
        "(Established by P4-PACK.)"
    ),
    "P4-SHIP has passed.": (
        "The order has been handed off to a carrier, a tracking number is "
        "recorded on the SO, and the customer invoice has been triggered or "
        "queued. (Established by P4-SHIP.)"
    ),

    # Phase 5 cases that reference P5-OFFSITE-SEND
    "P5-OFFSITE-SEND has passed.": (
        "A sub-assembly has been shipped out for subcontract processing: a "
        "shipper / pack list was generated and the material is flagged "
        "offsite-with-vendor (no longer in available inventory). "
        "(Established by P5-OFFSITE-SEND.)"
    ),

    # Parenthetical and combined-case variants
    "P0-INTEG-003 (tax integration choice) is complete.": (
        "Tax calculation has been configured: a tax provider has been chosen "
        "(integrated provider or manual rates) and the choice persists across "
        "tenant settings. (Established by P0-INTEG-003.)"
    ),
    "P1-GL-001 (chart of accounts) has passed.": (
        "The chart of accounts is initialized with standard accounts: cash, "
        "accounts receivable, inventory, accounts payable, sales, cost of "
        "goods sold, and wages — at minimum. (Established by P1-GL-001.)"
    ),
    "P1-UOM-001 and P1-UOM-002 have passed.": (
        "Standard units of measure exist (each, kilogram, pound, hour, foot, "
        "square foot, gallon, liter) plus at least one custom unit (e.g. "
        "\"sheet\"). (Established by P1-UOM-001 and P1-UOM-002.)"
    ),
    "P2-PART-001 (raw material) has passed.": (
        "A raw material part record exists (e.g. RM-STEEL-1018-3X3) with type, "
        "unit of measure, default vendor, and inventory GL account. "
        "(Established by P2-PART-001.)"
    ),
    "P2-PART-002 (finished goods) has passed.": (
        "A finished-goods part exists (e.g. FG-BRACKET-A1) with type, unit of "
        "measure, sales GL account, and a list price. "
        "(Established by P2-PART-002.)"
    ),

    # Phase-level vague references
    "Phase 2 master data exists.": (
        "Phase 2 master data exists: at least one vendor, one customer, raw "
        "and finished parts, a BOM, a routing, and pricing — all with their "
        "supporting fields populated. (Phase 2 outcomes.)"
    ),
    "Phase 4 has produced real inventory transactions.": (
        "Phase 4 has run at least one full quote-to-cash cycle: a work order "
        "has consumed material, finished goods went to inventory, an order "
        "was shipped, an invoice was posted, and cash was applied. "
        "(Phase 4 outcomes.)"
    ),
    "Phase 4 produced AR transactions; Phase 3 produced AP.": (
        "AR and AP both have transaction history: at least one customer "
        "invoice exists in AR (from Phase 4) and at least one vendor invoice "
        "and payment exist in AP (from Phase 3). (Phase 3 + Phase 4 outcomes.)"
    ),
    "Asset GL account exists from P1.": (
        "At least one fixed-asset GL account is present in the chart of "
        "accounts, available to assign on a fixed-asset PO line. "
        "(Established in P1-GL-001.)"
    ),
}

# Whole-line replacements: each match must be exactly the text after the
# "  - " bullet prefix in a YAML preconditions list.
def main():
    docs = Path("docs")
    files = sorted(docs.glob("*.md"))
    total_replacements = 0
    for f in files:
        content = f.read_text(encoding="utf-8")
        original = content
        for needle, replacement in STATE_MAP.items():
            # YAML list item: "  - <needle>"
            pattern = "  - " + needle
            new_pattern = "  - " + replacement
            count = content.count(pattern)
            if count:
                content = content.replace(pattern, new_pattern)
                total_replacements += count
        if content != original:
            f.write_text(content, encoding="utf-8")
            print(f"  edited {f.name}")
    print(f"Total replacements: {total_replacements}")

    # Sanity: any remaining "X has passed" that we missed?
    leftover = 0
    for f in files:
        content = f.read_text(encoding="utf-8")
        for line in content.splitlines():
            if re.search(r"^\s*-\s+P\d+-[A-Z]+-\d+ has passed\.?$", line):
                print(f"  LEFTOVER: {f.name}: {line.strip()}")
                leftover += 1
            elif re.search(r"^\s*-\s+Phase \d+ is complete\.?$", line):
                print(f"  LEFTOVER: {f.name}: {line.strip()}")
                leftover += 1
    print(f"Leftover terse preconditions: {leftover}")

if __name__ == "__main__":
    main()
