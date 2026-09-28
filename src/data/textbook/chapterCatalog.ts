export type PhysicsTextbookChapterCatalogEntry = {
  chapterId: string
  chapterNumber: string
  chapterTitle: string
  unitCodes: readonly string[]
}

export type PhysicsTextbookPartCatalogEntry = {
  partId: string
  partNumber: string
  partTitle: string
  chapters: readonly PhysicsTextbookChapterCatalogEntry[]
}

export const physicsTextbookParts: readonly PhysicsTextbookPartCatalogEntry[] = [
  {
    partId: 'physics-part-1-motion',
    partNumber: '1',
    partTitle: '様々な運動',
    chapters: [
      {
        chapterId: 'physics-ch01-motion',
        chapterNumber: '1',
        chapterTitle: '物体の運動',
        unitCodes: ['1A', '1B', '1C', '1D', '1E', '1F', '1G'],
      },
      {
        chapterId: 'physics-p1-ch02-rigid-body',
        chapterNumber: '2',
        chapterTitle: '剛体のつり合い',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p1-ch03-momentum',
        chapterNumber: '3',
        chapterTitle: '運動量と力積',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p1-ch04-circular-oscillation',
        chapterNumber: '4',
        chapterTitle: '円運動と単振動',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p1-ch05-gravitation',
        chapterNumber: '5',
        chapterTitle: '万有引力',
        unitCodes: [],
      },
    ],
  },
  {
    partId: 'physics-part-2-thermal',
    partNumber: '2',
    partTitle: '熱',
    chapters: [
      {
        chapterId: 'physics-p2-ch01-gas-molecules',
        chapterNumber: '1',
        chapterTitle: '気体分子の運動',
        unitCodes: [],
      },
    ],
  },
  {
    partId: 'physics-part-3-waves',
    partNumber: '3',
    partTitle: '波',
    chapters: [
      {
        chapterId: 'physics-p3-ch01-wave-properties',
        chapterNumber: '1',
        chapterTitle: '波の性質',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p3-ch02-sound',
        chapterNumber: '2',
        chapterTitle: '音',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p3-ch03-light',
        chapterNumber: '3',
        chapterTitle: '光',
        unitCodes: [],
      },
    ],
  },
  {
    partId: 'physics-part-4-electromagnetism',
    partNumber: '4',
    partTitle: '電気と磁気',
    chapters: [
      {
        chapterId: 'physics-p4-ch01-electric-field-potential',
        chapterNumber: '1',
        chapterTitle: '電界と電位',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p4-ch02-current',
        chapterNumber: '2',
        chapterTitle: '電流',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p4-ch03-current-magnetic-field',
        chapterNumber: '3',
        chapterTitle: '電流と磁界',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p4-ch04-induction-em-wave',
        chapterNumber: '4',
        chapterTitle: '電磁誘導と電磁波',
        unitCodes: [],
      },
    ],
  },
  {
    partId: 'physics-part-5-atomic',
    partNumber: '5',
    partTitle: '原子・分子の世界',
    chapters: [
      {
        chapterId: 'physics-p5-ch01-electron-light',
        chapterNumber: '1',
        chapterTitle: '電子と光',
        unitCodes: [],
      },
      {
        chapterId: 'physics-p5-ch02-atom-nucleus-particle',
        chapterNumber: '2',
        chapterTitle: '原子・原子核・素粒子',
        unitCodes: [],
      },
    ],
  },
] as const

export const physicsTextbookChapters = physicsTextbookParts.flatMap((part) =>
  part.chapters.map((chapter) => ({
    ...chapter,
    partId: part.partId,
    partNumber: part.partNumber,
    partTitle: part.partTitle,
  })),
)
