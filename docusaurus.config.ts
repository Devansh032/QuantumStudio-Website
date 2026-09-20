import {themes as prismThemes} from 'prism-react-renderer';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Quantum Studio',
  tagline: 'Atomistic and electronic-structure research',
  favicon: 'img/brand/favicon.svg',
  url: 'https://kalapatapubhargava.github.io',
  baseUrl: '/QuantumStudio-Website/',
  organizationName: 'kalapatapubhargava',
  projectName: 'QuantumStudio-Website',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {mermaid: true, hooks: {onBrokenMarkdownLinks: 'warn'}},
  stylesheets: ['https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css'],
  themes: ['@docusaurus/theme-mermaid'],
  presets: [['classic', {docs: {sidebarPath: './sidebars.ts', routeBasePath: 'docs', showLastUpdateAuthor: false, showLastUpdateTime: false, remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex]}, blog: false, theme: {customCss: './src/css/custom.css'}} satisfies Preset.Options]],
  themeConfig: {
    image: 'img/brand/social-card.svg',
    colorMode: {defaultMode: 'dark', disableSwitch: true, respectPrefersColorScheme: false},
    navbar: {title: 'Quantum Studio', logo: {alt: 'Quantum Studio', src: 'img/brand/favicon.svg'}, items: [
      {to: '/', label: 'Home', position: 'left'}, {to: '/capabilities', label: 'Capabilities', position: 'left'}, {to: '/calculations', label: 'Calculation Catalogue', position: 'left'}, {to: '/applications', label: 'Applications', position: 'left'}, {to: '/resources', label: 'Resources', position: 'left'}, {to: '/documentation', label: 'Documentation', position: 'left'}, {to: '/technical-preview', label: 'Technical Preview', position: 'right'}, {to: '/beta-access', label: 'Request Beta Access', position: 'right'},
    ]},
    footer: {style: 'dark', links: [
      {title: 'Explore', items: [{label: 'Capabilities', to: '/capabilities'}, {label: 'Calculation Catalogue', to: '/calculations'}, {label: 'Applications', to: '/applications'}, {label: 'Technical Preview', to: '/technical-preview'}]},
      {title: 'Documentation', items: [{label: 'Overview', to: '/documentation'}, {label: 'Installation', to: '/docs/getting-started/installation'}, {label: 'Tutorial', to: '/docs/tutorials/silicon-scf'}, {label: 'Troubleshooting', to: '/docs/troubleshooting'}]},
      {title: 'Beta access', items: [{label: 'Request access', to: '/beta-access'}, {label: 'Temporary licences', to: '/temporary-licence'}, {label: 'Privacy notice', to: '/privacy'}, {label: 'Beta terms', to: '/beta-terms'}, {label: 'Research collaboration', to: '/contact'}]},
    ], copyright: `Copyright © ${new Date().getFullYear()} Quantum Studio. Controlled technical beta materials.`},
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula, additionalLanguages: ['bash', 'python', 'json']},
  } satisfies Preset.ThemeConfig,
};

export default config;
