export const appRoute = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/kyotsu-step-web/#${normalized}`
}
