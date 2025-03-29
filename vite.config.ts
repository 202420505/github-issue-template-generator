import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import devtools from 'solid-devtools/vite'
import { join } from 'path';
import { partytownVite } from '@qwik.dev/partytown/utils';

export default defineConfig({
  plugins: [
    solid(),
    devtools(),
    partytownVite({
      dest: join(__dirname, 'dist', '~partytown'),
    }),
  ],
  base: "/github-issue-template-generator"
})
