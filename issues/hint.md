# booking-v3 displays MM/DD/YYYY for a day-first form

Reports: 33 unique reports in #4471.

## Problem

booking-v3 prints the hint MM/DD/YYYY, while the form interprets the entered date in the tenant's day-first order. A person following the displayed instruction can therefore book the wrong date. This work item covers only that cause.

## Affected scope

Form-channel submissions for Alder Physio (de-DE), Copper Studio (es-ES), and Pale Harbour (pt-PT), all on booking-v3. The 33 reports were received from 2026-04-17 through 2026-09-22.

## Evidence

- R-41230: Copper Studio reports 1 June instead of 6 January.
- R-41241: Alder Physio reports 8 June instead of 6 August.
- `DATE_HINT` in `src/lib/kb/causes.ts` and the tenant directory establish the displayed instruction and affected configuration.
- `evidence/analysis.json` lists every member ID. Run `npm run analyze` to reproduce the count using unique IDs, #4471 membership, tenant configuration, and input channel.

## Proposed reproduction

Open booking-v3 for one of these tenants and follow the MM/DD/YYYY hint: enter 01/06/2026 intending 6 January. The described form behavior produces 1 June. Expected behavior: the instruction and date interpretation agree, preserving the intended date. Engineering must confirm the reproduction in the product; its implementation was not part of the KB export.

## Acceptance criteria

Derive the displayed instruction and date interpretation from the same configuration. Verify all three affected tenants with ambiguous dates and days above 12. Check booking-v2 and month-first tenants as controls. App and email submissions are outside this work item's scope.

[KB analysis and caveats](../blob/main/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx).
