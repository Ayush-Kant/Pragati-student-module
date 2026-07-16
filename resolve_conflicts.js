const { execSync } = require('child_process');

try {
  const output = execSync('git diff --name-only --diff-filter=U').toString();
  const files = output.trim().split('\n').map(f => f.trim()).filter(Boolean);
  
  for (const file of files) {
    if (!file.includes('package')) {
      console.log(`Checking out HEAD for ${file}`);
      execSync(`git checkout --ours "${file}"`);
    }
  }
  
  execSync('git add .');
  console.log('All conflicts resolved and added to staging.');
} catch (e) {
  console.error(e);
}
