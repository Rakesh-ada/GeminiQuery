const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vercel build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the client
  console.log('Building client...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create output directory if it doesn't exist
  const outputDir = path.join(process.cwd(), '.vercel', 'output', 'static');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Copy client build output to Vercel's output directory
  console.log('Copying build output...');
  const clientBuildDir = path.join(process.cwd(), 'dist', 'client');
  if (fs.existsSync(clientBuildDir)) {
    // Copy all files from client build to Vercel output
    const { execSync } = require('child_process');
    execSync(`xcopy "${clientBuildDir}\\*" "${outputDir}\" /E /H /C /I`, { stdio: 'inherit' });
  }

  console.log('Vercel build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
