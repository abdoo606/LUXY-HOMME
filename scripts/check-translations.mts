import { translations, languages } from '../src/i18n/translations.ts';
import { readFileSync } from 'fs';

const langs = Object.keys(translations);
console.log('languages:', langs.join(', '));
const enKeys = new Set(Object.keys(translations.en));
console.log('en keys:', enKeys.size);

for (const lang of langs) {
  const keys = new Set(Object.keys(translations[lang]));
  const missing = [...enKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !enKeys.has(k));
  console.log(lang, 'total:', keys.size, 'missing:', missing.length, 'extra:', extra.length);
  if (missing.length) console.log('  missing:', missing.join(', '));
  if (extra.length) console.log('  extra:', extra.join(', '));
}

// Keys used in source but not defined in en
const used = readFileSync('/tmp/used_keys.txt', 'utf8').trim().split('\n');
const missingUsed = used.filter((k) => !(k in translations.en));
console.log('\nused keys not defined in en:', missingUsed.length);
for (const k of missingUsed) console.log(' -', k);

// languages export
console.log('\nlanguages export:', JSON.stringify(languages, null, 2));
