import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import pkg from './package.json';

const externalPackages = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];

export default defineConfig({
  publicDir: false,
  plugins: [
    react({
      jsxRuntime: 'classic',
      babel: {
        configFile: resolve(__dirname, '../../babel.config.json'),
        envName: 'production',
        ignore: [/node_modules/],
      },
    }),
    cssInjectedByJsPlugin({ styleId: 'filerobot-image-editor-styles' }),
  ],
  css: {
    modules: {
      generateScopedName: 'FIE_[name]__[local]__[hash:base64:5]',
      localsConvention: 'camelCase',
    },
  },
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    minify: false,
    target: 'esnext',
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: (id) =>
        externalPackages.some((name) => id === name || id.startsWith(name + '/')),
    },
  },
});
