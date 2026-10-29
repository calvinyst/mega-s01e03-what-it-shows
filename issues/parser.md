# Shared parser reads day-first tenant dates as month-first

Reports: 379 unique reports in #4471.

## Problem

The shared date parser reads month first while the affected tenants write day first. This work item covers only that cause.

## Affected scope

Day-first tenants using app or email, plus booking-v2 form submissions. The app and email paths for booking-v3 tenants are included. The supplied classifier assigns 379 reports across 11 tenants, received from 2026-04-01 through 2026-10-04.

## Evidence

- R-41200: Harbour Dental (en-GB, app) reports 7 April becoming 4 July.
- R-41203: Lantern Row (cs-CZ, app) reports 2 December becoming 12 February.
- `src/lib/kb/causes.ts` defines this cause from tenant locale and input channel.
- `evidence/analysis.json` contains every member ID. Run `npm run analyze` to reproduce the count after deduplicating IDs and filtering to #4471.

## Proposed reproduction

For a day-first tenant, send 07/04/2026 through this path. The reported failure interprets it as 4 July; expected behavior preserves 7 April in the stored booking and invite. The product implementation is absent from the KB export, so engineering must confirm this in the product.

## Acceptance criteria

Use the tenant's date order consistently. Check ambiguous dates, days above 12, invalid input, and month-first tenants as controls. Verify all input paths included in the scope above.

The five timing anomalies remain in this count under the supplied classifier. Their evidence and follow-up questions are preserved in the KB; this issue does not claim the proposed fix will resolve those unusual symptoms.

[KB analysis and caveats](https://github.com/calvinyst/mega-s01e03-what-it-shows/blob/main/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx).

## Resolution

The [course engineering update](https://hq.mega.dev/challenges/what-it-shows#engineering-update) reports #4471 closed on 5 October 2026 and this problem FIXED: `fix(dates): parse dd/mm for eu locales`. Observed on 29 October 2026. Close this issue as completed. The historical report count remains 379.
