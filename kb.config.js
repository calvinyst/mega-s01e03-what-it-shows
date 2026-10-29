import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { resolve } from 'node:path';

export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'], layout: { runbook: resolve('src/lib/layouts/runbook.svelte') } })],
  adapter: adapter({ pages: 'rendered', assets: 'rendered' }),
  alias: { '#lib': resolve('src/lib') },
  prerender: { entries: ['/kb', '/kb/triage/dedupe', '/kb/incidents/4471', '/kb/decisions/0001-dedupe-by-subject', '/kb/decisions/0002-dedupe-by-cause'] }
};
