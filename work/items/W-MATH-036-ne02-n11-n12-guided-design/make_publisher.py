import sys
from pathlib import Path
B=Path(__file__).resolve().parent;sha=sys.argv[1];codes=sys.argv[2]
text='''name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  publish:
    runs-on: ubuntu-latest
    timeout-minutes: 25
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    env:
      CANDIDATE_SHA: SOURCE_SHA
      CODES: UNIT_CODES
      VITE_PREVIEW_COMMIT: SOURCE_SHA
      VITE_STORAGE_NAMESPACE: kyotsu-step-gate3-math-20261023
      VITE_BASE_PATH: /kyotsu-step-web/
    steps:
      - uses: actions/checkout@v4
        with:
          ref: SOURCE_SHA
          fetch-depth: 0
          persist-credentials: false
      - uses: pnpm/action-setup@v4
        with:
          version: 11.9.0
          run_install: false
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile --ignore-scripts
      - run: node work/items/W-MATH-036-ne02-n11-n12-guided-design/release_manifest.mjs --check
      - run: pnpm exec vitest run --config work/items/W-MATH-036-ne02-n11-n12-guided-design/vitest.config.mjs
      - run: pnpm exec vitest run --exclude src/data/physicsTaxonomy.test.ts --exclude src/domain/questionSchema.test.ts
      - run: pnpm run test:textbook-authoring
      - run: pnpm run build
      - run: node work/items/W-MATH-003-numbers-expressions-creation/NE01_NE02/export-runtime.mjs
      - run: node work/items/W-MATH-036-ne02-n11-n12-guided-design/release_manifest.mjs
      - run: pnpm exec playwright install --with-deps chromium
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - name: Publish approved lesson to the existing app
        id: deployment
        uses: actions/deploy-pages@v4
      - name: Exact public source and complete public learner plays
        env:
          APP_URL: ${{ steps.deployment.outputs.page_url }}
        run: |
          node --input-type=module <<'NODE'
          let matched=false
          for(let i=0;i<60;i++){
            try{const r=await fetch(process.env.APP_URL+'release.json?sha='+process.env.CANDIDATE_SHA,{cache:'no-store'});const m=await r.json();if(m.sourceSHA===process.env.CANDIDATE_SHA&&m.storageKey===process.env.VITE_STORAGE_NAMESPACE){matched=true;console.log(JSON.stringify(m));break}}catch{}
            await new Promise(r=>setTimeout(r,2000))
          }
          if(!matched)throw Error('public source not verified')
          NODE
          EVIDENCE_DIR=/tmp/w36-hosted node work/items/W-MATH-036-ne02-n11-n12-guided-design/verify_app.mjs
          EVIDENCE_DIR=/tmp/w36-hosted-protected node work/items/W-MATH-035-choice-order-factor-audit/verify_display.mjs
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: w36-publication-evidence
          path: |
            /tmp/w36-hosted
            /tmp/w36-hosted-protected
'''.replace('SOURCE_SHA',sha).replace('UNIT_CODES',codes)
script=(B/'release_manifest.mjs').read_text()
for check in [True,False]:
 command='      - run: node work/items/W-MATH-036-ne02-n11-n12-guided-design/release_manifest.mjs'+(' --check' if check else '')
 body=('process.argv.push(\'--check\');\n' if check else '')+script
 inline='      - name: '+('Verify approved source and protected scope' if check else 'Write exact-source release manifest')+'\n        run: |\n          node --input-type=module <<\'NODE\'\n'+'\n'.join('          '+line for line in body.splitlines())+'\n          NODE'
 text=text.replace(command,inline)
(B/'PUBLICATION_WORKFLOW.yml').write_text(text);print('prepared existing Pages workflow for '+codes+' at '+sha)
