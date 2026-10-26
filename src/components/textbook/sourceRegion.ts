import type { ConstructionInteractionV2 } from '../../domain/constructionReadingV2'
export function sourceRegionLabel(i: ConstructionInteractionV2, ref: string) {
  const source = i.boundSourceTree
  return ref === source?.rootId ? '中身全体' : ref === source?.rootId + '/term-1' ? '第一項' : ref === source?.rootId + '/term-2' ? '第二項' : '元の式の範囲'
}
