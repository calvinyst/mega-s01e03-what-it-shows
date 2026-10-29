<script lang="ts">
  import update from '#lib/data/engineering-update.json';
  import filing from '#lib/data/filing.json';
</script>
<p>The course's <a href={update.source}>engineering update</a>, observed {update.observedOn}, reports
  <strong>#{update.ticket} closed on {update.closedOn}</strong>.</p>
<table>
  <thead><tr><th>Work ticket</th><th>Outcome</th><th>Reason</th><th>GitHub closure</th></tr></thead>
  <tbody>
    <tr><td><a href={filing.issues.parser}>Parser</a></td><td>{update.parser.outcome}</td><td>{update.parser.detail}</td><td>{update.parser.githubReason}</td></tr>
    <tr><td><a href={filing.issues.hint}>Form hint</a></td><td>{update.hint.outcome}</td><td>{update.hint.detail}</td><td>{update.hint.githubReason}</td></tr>
  </tbody>
</table>
<p>The form-hint problem was closed because the form was retired; no correction to that form is claimed.
  Historical report counts stay unchanged. This update does not establish what caused or resolved the unusual timing reports.</p>
