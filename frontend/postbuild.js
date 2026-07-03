import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('dist/index.html', 'utf-8');

const cssMatch = html.match(/<link rel="stylesheet"([^>]+)>/);
if (cssMatch) {
  const cssHref = cssMatch[1].match(/href="([^"]+)"/)?.[1] || '/assets/index.css';
  html = html.replace(
    /<link rel="stylesheet"([^>]+)>/,
    (match, attrs) =>
      `<link rel="preload" as="style" href="${cssHref}" />\n    <link rel="stylesheet" media="print" onload="this.media='all';this.onload=null"${attrs}>`
  );
  html = html.replace(
    '</head>',
    `<noscript><link rel="stylesheet" crossorigin href="${cssHref}"></noscript></head>`
  );
  writeFileSync('dist/index.html', html);
  console.log(`CSS async: ${cssHref}`);
}
