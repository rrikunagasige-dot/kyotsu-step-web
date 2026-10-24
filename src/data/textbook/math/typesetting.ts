import configuration from './typesetting.json'

export function typesettingEnabled(unitId: string): boolean {
  return unitId.startsWith('math-numbers-expressions-') && configuration.enabledUnits.includes(unitId.replace('math-numbers-expressions-', ''))
}
export function typesettingGroup(unitId: string, sourceId: string): string | undefined {
  const key = unitId.replace('math-numbers-expressions-', '') as keyof typeof configuration.groups
  const id = sourceId.replace(/^s5-record-/, '')
  const index = configuration.groups[key]?.findIndex(group => (group as string[]).includes(id)) ?? -1
  return index < 0 ? undefined : key + '-g' + index
}
