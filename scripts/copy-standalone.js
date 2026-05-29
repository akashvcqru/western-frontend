const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const buildDir = path.join(rootDir, 'build');
  const nextDir = path.join(rootDir, '.next');
  const standaloneDir = path.join(nextDir, 'standalone');

  console.log('\n--- Packaging standalone Next.js server ---');

  // 1. Clean existing build folder
  if (fs.existsSync(buildDir)) {
    console.log('Cleaning existing build directory...');
    fs.rmSync(buildDir, { recursive: true, force: true });
  }

  // 2. Check if standalone build was generated
  if (!fs.existsSync(standaloneDir)) {
    console.error('Error: Standalone build not found at .next/standalone. Please ensure next.config.ts has "output: \'standalone\'" and "npm run build" completed successfully.');
    process.exit(1);
  }

  // 3. Copy standalone directory contents to build
  console.log('Copying standalone server files to "build"...');
  copyFolderSync(standaloneDir, buildDir);

  // 4. Copy public directory to build/public
  const publicDir = path.join(rootDir, 'public');
  if (fs.existsSync(publicDir)) {
    console.log('Copying public assets to "build/public"...');
    copyFolderSync(publicDir, path.join(buildDir, 'public'));
  }

  // 5. Copy .next/static directory to build/.next/static
  const nextStaticDir = path.join(nextDir, 'static');
  if (fs.existsSync(nextStaticDir)) {
    console.log('Copying Next.js static files to "build/.next/static"...');
    copyFolderSync(nextStaticDir, path.join(buildDir, '.next', 'static'));
  }

  console.log('Success: Packaged standalone build in the "build" folder!\n');
}

main();
