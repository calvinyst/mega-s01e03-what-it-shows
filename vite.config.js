import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import config from './kb.config.js';
export default defineConfig({ plugins: [sveltekit(config)] });
