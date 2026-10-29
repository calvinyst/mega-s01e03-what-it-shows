import { readFile, readdir, writeFile } from 'node:fs/promises';
import { uniqueById, groupByCause, readAs, causeOf } from '../src/lib/kb/causes.ts';
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const raw = await json('src/lib/data/reports-4471.json');
const notes = await json('src/lib/data/desk-notes.json');
const tenantFiles = await readdir('src/lib/data/tenants');
const tenants = await Promise.all(tenantFiles.map(f=>json(`src/lib/data/tenants/${f}`)));
const tenantMap = new Map(tenants.map(t=>[t.handle,t]));
const all = uniqueById(raw);
const merged = all.filter(r=>r.mergedInto===4471);
const groups = groupByCause(merged,r=>tenantMap.get(r.tenant));
const counts = arr => arr.reduce((acc,x)=>(acc[x]=(acc[x]??0)+1,acc),{});
const summary = {
  rawRows: raw.length, uniqueIds: all.length, duplicateRows: raw.length-all.length,
  merged: merged.length, excluded: all.filter(r=>r.mergedInto!==4471),
  groups: groups.map(g=>({...g, oneDayMove: readAs(g,notes.oneDayMove),reports:g.reports.map(r=>r.id)})),
  intakeTags: counts(merged.map(r=>r.meta.intakeTag)),
  receivedMonths: counts(merged.map(r=>r.receivedAt.slice(0,7))),
  mergedMonths: counts(merged.map(r=>r.mergedAt?.slice(0,7))),
  anomalies: merged.filter(r=>notes.oneDayMove.includes(r.id)),
  tagDisagreements: merged.filter(r=>r.meta.intakeTag!==causeOf(r,tenantMap.get(r.tenant))).map(r=>r.id)
};
await writeFile('evidence/analysis.json', JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({...summary,groups:summary.groups.map(({reports,...g})=>({...g,count:reports.length}))},null,2));
