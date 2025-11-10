import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Plugin to copy static files
function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      const copyDir = (src, dest) => {
        mkdirSync(dest, { recursive: true });
        const entries = readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
          const srcPath = join(src, entry.name);
          const destPath = join(dest, entry.name);
          
          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            copyFileSync(srcPath, destPath);
          }
        }
      };
      
      // Copy all necessary directories
      const dirsToCopy = [
        { src: 'components', dest: 'dist/components' },
        { src: 'pages', dest: 'dist/pages' },
        { src: 'js', dest: 'dist/js' },
        { src: 'css', dest: 'dist/css' },
        { src: 'assets', dest: 'dist/assets' },
        { src: 'pwa', dest: 'dist/pwa' },
        { src: 'data', dest: 'dist/data' },
        { src: 'admin', dest: 'dist/admin' },
        { src: 'functions', dest: 'dist/functions' }
      ];
      
      dirsToCopy.forEach(({ src, dest }) => {
        try {
          copyDir(src, dest);
          console.log(`✓ Copied ${src} to ${dest}`);
        } catch (err) {
          console.log(`⚠ Could not copy ${src}:`, err.message);
        }
      });
      
      // Copy root files
      const filesToCopy = ['404.html', 'download.html', 'robots.txt', 'sitemap.xml', '_headers', '_redirects'];
      filesToCopy.forEach(file => {
        try {
          copyFileSync(file, `dist/${file}`);
          console.log(`✓ Copied ${file}`);
        } catch (err) {
          console.log(`⚠ Could not copy ${file}:`, err.message);
        }
      });
      
      // Copy public/_redirects if exists
      try {
        copyFileSync('public/_redirects', 'dist/_redirects');
        console.log('✓ Copied public/_redirects');
      } catch (err) {
        console.log('⚠ Could not copy public/_redirects:', err.message);
      }
    }
  };
}

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: false, // Disable minification to preserve file structure
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    },
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    assetsInlineLimit: 0 // Don't inline any assets
  },
  plugins: [
    copyStaticFiles(),
    createHtmlPlugin({
      minify: false // Disable HTML minification
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false
    })
  ],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer
      ]
    }
  }
});
