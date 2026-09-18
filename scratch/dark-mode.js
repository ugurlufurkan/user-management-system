const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-white/g, replace: 'bg-white dark:bg-zinc-900' },
  { regex: /bg-zinc-50/g, replace: 'bg-zinc-50 dark:bg-zinc-950' },
  { regex: /bg-zinc-100/g, replace: 'bg-zinc-100 dark:bg-zinc-800' },
  { regex: /border-zinc-200/g, replace: 'border-zinc-200 dark:border-zinc-800' },
  { regex: /border-zinc-100/g, replace: 'border-zinc-100 dark:border-zinc-800/50' },
  { regex: /text-zinc-900/g, replace: 'text-zinc-900 dark:text-zinc-100' },
  { regex: /text-zinc-700/g, replace: 'text-zinc-700 dark:text-zinc-300' },
  { regex: /text-zinc-600/g, replace: 'text-zinc-600 dark:text-zinc-400' },
  { regex: /text-zinc-500/g, replace: 'text-zinc-500 dark:text-zinc-400' },
  { regex: /hover:bg-zinc-50/g, replace: 'hover:bg-zinc-50 dark:hover:bg-zinc-800' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      // Avoid double-replacing if already contains dark:
      for (const rule of replacements) {
        content = content.replace(rule.regex, (match) => {
           // Basic safeguard to not duplicate dark: classes if the script is run twice
           return match;
        });
      }
      // Actually, since the regex finds exact matches, if we replace "bg-white" with "bg-white dark:bg-zinc-900", running it again will find "bg-white" and replace it again, resulting in "bg-white dark:bg-zinc-900 dark:bg-zinc-900".
      // Better strategy: split by space, add dark class if missing.
    }
  }
}
