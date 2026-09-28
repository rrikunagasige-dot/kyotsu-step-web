import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const repairs = [
  {
    source: 'source_archives/textbook_figures_repaired/average-instantaneous-velocity.webp.b64',
    target: 'public/assets/physics/textbook/ch01/1a/average-instantaneous-velocity.webp',
    sha256: '3787f07435f682fa27ebad69dffc1d9c8f629d6dddbc0d587e8bcb26ea86aa48',
  },
  {
    source: 'source_archives/textbook_figures_repaired/curve-velocity-directions.webp.b64',
    target: 'public/assets/physics/textbook/ch01/1a/curve-velocity-directions.webp',
    sha256: '71c671de2b0ded8d66c9ea40e32d718a8c844d7939c5750851c58cc67139263c',
  },
  {
    source: 'source_archives/textbook_figures_repaired/velocity-composition.webp.b64',
    target: 'public/assets/physics/textbook/ch01/1b/velocity-composition.webp',
    sha256: 'e15f06f89c0186b8fd70099635c840e8e657b68aacd32237c57ab79cf3cd9874',
  },
  {
    source: 'source_archives/textbook_figures_repaired/horizontal-projectile-strobe.webp.b64',
    target: 'public/assets/physics/textbook/ch01/1e/horizontal-projectile-strobe.webp',
    sha256: '956d98a2b9bf2b89849c922a84bfc7b3a7c4ff1e19f4a513578350f4eec2be0c',
  },
  {
    source: 'source_archives/textbook_figures_repaired/horizontal-projectile-velocity.webp.b64',
    target: 'public/assets/physics/textbook/ch01/1e/horizontal-projectile-velocity.webp',
    sha256: 'befd3ecb6b3121e6d2c61f0977bc897b791c847ff7d21ec758c89146f535d56d',
  },
  {
    source: 'source_archives/textbook_figures_repaired/oblique-projectile-trajectory.webp.b64',
    target: 'public/assets/physics/textbook/ch01/1f/oblique-projectile-trajectory.webp',
    sha256: 'f6210793bea0eaeaf672572eec073063c56be8f642573be02325589164b8d923',
  },
  {
    source: 'source_archives/textbook_figures_repaired/oblique-projectile-components.webp.b64',
    target: 'public/assets/physics/textbook/ch01/1f/oblique-projectile-components.webp',
    sha256: 'ca2f7bdb7cdc159c57bd7a6297bcf143a282b5a419387a19bdb5a63d9acc8be1',
  },
]

function assertWebp(buffer, name) {
  if (buffer.length < 12 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`${name}: not a RIFF/WEBP file`)
  }
  const declared = buffer.readUInt32LE(4) + 8
  if (declared !== buffer.length) {
    throw new Error(`${name}: truncated WebP (RIFF declares ${declared}, actual ${buffer.length})`)
  }
}

for (const repair of repairs) {
  const sourcePath = resolve(repair.source)
  const targetPath = resolve(repair.target)
  const encoded = (await readFile(sourcePath, 'utf8')).replace(/\s+/g, '')
  const buffer = Buffer.from(encoded, 'base64')
  assertWebp(buffer, repair.target)

  const digest = createHash('sha256').update(buffer).digest('hex')
  if (digest !== repair.sha256) {
    throw new Error(`${repair.target}: SHA256 mismatch (${digest})`)
  }

  await mkdir(dirname(targetPath), { recursive: true })
  await writeFile(targetPath, buffer)
  process.stdout.write(`restored ${repair.target} (${buffer.length} bytes)\n`)
}
