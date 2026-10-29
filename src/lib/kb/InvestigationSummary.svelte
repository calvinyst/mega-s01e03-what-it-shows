<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import filing from '#lib/data/filing.json';
  import { uniqueById, groupByCause, causeOf, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const raw = reports as Report[];
  const unique = uniqueById(raw);
  const merged = unique.filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const conflicts = merged.filter(r => r.meta.intakeTag !== causeOf(r, tenantOf(r)));
  const unusual = merged.filter(r => notes.oneDayMove.includes(r.id));
  const backlog = merged.filter(r => r.receivedAt.slice(0,10) < '2026-07-02' && r.mergedAt?.slice(0,10) === '2026-07-02');
  const issues = filing.issues as Record<string,string>;
</script>

<p><strong>{raw.length} exported rows → {unique.length} unique report IDs → {merged.length} reports in #4471.</strong>
  Export-page overlap accounts for {raw.length - unique.length} repeated rows.
  Tenant locale and the actual form determine the groups; {conflicts.length} intake tags disagree.</p>
<table>
  <thead><tr><th>Problem</th><th>Unique reports</th><th>Work ticket</th></tr></thead>
  <tbody>
    {#each groups as g}
      <tr><td>{g.cause === 'parser' ? 'Shared parser reads month first' : g.cause === 'hint' ? 'booking-v3 hint conflicts with tenant parsing' : 'Needs investigation'}</td>
        <td>{g.reports.length}</td><td>{#if issues[g.cause]}<a href={issues[g.cause]}>{g.cause} issue</a>{:else}Prepared; awaiting publication approval{/if}</td></tr>
    {/each}
  </tbody>
</table>
<p><strong>{backlog.length}</strong> reports received before 2 July were merged on 2 July.
  Received time records the customer's problem; merged time records desk processing. A merge spike is not an onset spike.</p>

<h3>Timing reports that need follow-up</h3>
<p>The desk flags {unusual.length} reports as one-day moves. The current classifier files them under parser by tenant and channel.
  Their text does not establish a new shared cause; retain them in that count and investigate timing separately.</p>
<table>
  <thead><tr><th>ID</th><th>Reported symptom</th><th>Current cause</th></tr></thead>
  <tbody>{#each unusual as r}<tr><td><code>{r.id}</code></td><td>{r.body}</td><td>{causeOf(r,tenantOf(r))}</td></tr>{/each}</tbody>
</table>
