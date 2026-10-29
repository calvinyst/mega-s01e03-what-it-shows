# booking-v3 displays MM/DD/YYYY for a day-first form — 33 reports

## Scope and count

33 unique reports from ticket #4471, across Alder Physio (de-DE), Copper Studio (es-ES), and Pale Harbour (pt-PT),
received 2026-04-17 through 2026-09-22. All are form-channel reports for booking-v3 tenants with day-first locales.

Reproduce the count with `npm run analyze`: deduplicate by report ID, filter `mergedInto === 4471`, join
tenant locale/form, and run the unchanged `causeOf` function. Intake tagged 15 of these parser and 18 hint;
the cause count is 33, not the 41 hint-tagged rows among all unique reports. The other 379 reports belong
to the separate parser group.

## Problem and evidence

`DATE_HINT['booking-v3']` is `MM/DD/YYYY`; the form reads the entered date in the tenant's day-first order.
People following the hint can therefore get a month/day swap. R-41230 (Copper Studio, form) describes
1 June instead of 6 January despite an intake parser tag. R-41241 (Alder Physio, form) describes 8 June
instead of 6 August. Sources: `src/lib/kb/causes.ts`, the tenant directory, original reports, and
`evidence/analysis.json` for full membership.

## Proposed reproduction and expected behavior

Open booking-v3 for one of these day-first tenants. Following its MM/DD/YYYY hint, enter 01/06/2026
for 6 January. The described form behavior reads this as 1 June. Expected: the hint and date interpretation
agree, preserving the intended booking date. The exported KB does not include the product form, so
engineering must verify this reproduction in the product.

## Acceptance checks

- Derive the hint and parsing order from the same tenant/form configuration.
- Verify all three affected tenants with ambiguous dates and days above 12.
- Confirm app/email reports from the same tenants still route to the shared-parser issue.
- Verify booking-v2 and month-first tenants as controls.
- Keep one issue per demonstrated cause even when report subjects match.

The incident prose's “one issue, one fix” does not represent the rendered cause table. This issue needs
its own fix and count; it must not disappear into #4471's parser thread.

KB correction: `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx` and its rendered page.
