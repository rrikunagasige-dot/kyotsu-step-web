import type { ReactNode } from 'react'

/** Shared ordering only. The caller retains the original outer frame, state and DOM identities. */
export function ReadingStageFrame({ contextHeader, header, prelude, references, children, conclusion, navigation }: {
  contextHeader?: ReactNode; header: ReactNode; prelude?: ReactNode; references?: ReactNode
  children: ReactNode; conclusion?: ReactNode; navigation?: ReactNode
}) {
  return <>{contextHeader}{header}{prelude}{references}{children}{conclusion}{navigation}</>
}
