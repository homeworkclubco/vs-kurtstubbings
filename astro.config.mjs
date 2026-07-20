// @ts-check
import alpinejs from '@astrojs/alpinejs';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';

import { SITE } from './src/config';
import rehypeYoutubePlyr from './src/plugins/rehype-youtube-plyr.mjs';

import cloudflare from '@astrojs/cloudflare';
import redirectsData from './src/content/redirects.json';

import pagesCMS from 'astro-pagescms';


const redirects = Object.fromEntries(
  redirectsData.map(({ from, to, status }) => [
    from,
    { destination: to, status: Number(status ?? 301) },
  ])
);

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  redirects,
  // TODO: update SITE.website in src/config.ts

  vite: {
    plugins: []
  },

  markdown: {
    processor: unified({
      rehypePlugins: [rehypeYoutubePlyr],
    }),
  },

  integrations: [UnoCSS(), sitemap(), alpinejs() , pagesCMS()],
  adapter: cloudflare({
      imageService: 'compile'
  })
});