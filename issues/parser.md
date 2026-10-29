# Shared parser reads day-first tenant dates as month-first — 379 reports

## Scope and count

379 unique reports from ticket #4471, spanning 11 tenants, received 2026-04-01 through 2026-10-04.
This is one cause group in the 2026-10-04 export, not a count from intake tags.

Reproduce the count with `npm run analyze`: deduplicate the 427 export rows by report ID (412 unique reports),
filter `mergedInto === 4471`, join each tenant's locale and form, and use the unchanged `causeOf` function.
The parser group includes day-first tenants except the form channel on booking-v3. App and email reports
from booking-v3 tenants still belong here. Its intake tags are parser 356 and hint 23.

## Problem and evidence

The shared parser reads month first while the tenant writes day first. R-41200 (Harbour Dental, en-GB,
app) reports 7 April becoming 4 July. R-41203 (Lantern Row, cs-CZ, app) reports 2 December becoming 12 February.
See `src/lib/kb/causes.ts`, `src/lib/kb/locales.ts`, the tenant records, and the complete membership in
`evidence/analysis.json`. The KB has classification logic, not the product parser; these are reported
examples and a proposed reproduction, not a claim that the product was run here.

## Proposed reproduction and expected behavior

For a day-first tenant, submit an ambiguous date such as 07/04/2026 through the shared parser path.
The reported behavior swaps day and month; expected behavior preserves 7 April in the invite and stored booking.
Confirm on app, email, and booking-v2 paths, including app/email for booking-v3 tenants.

## Acceptance checks

- Use tenant date order consistently through parsing, storage, and invite rendering.
- Verify ambiguous dates and dates with a day above 12 without swapping or silently accepting invalid dates.
- Check month-first tenants as controls.
- Keep the booking-v3 hint issue separate; a parser fix alone does not change its displayed instruction.

## Timing caveat

The five desk-noted timing reports R-41202, R-41209, R-41236, R-41344, and R-41620 remain within these 379
under the supplied classifier. Their symptoms include one-day differences, June-only shifts, an invite
said to arrive before booking, and Lisbon/Toronto differences. They do not prove a common third cause.
Follow them up separately and do not assume a parser fix resolves them.

The received-versus-merged timeline reflects reporting and desk work separately. July merges include
older reports; they do not establish a July product regression.

KB correction: `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx` and its rendered page.
