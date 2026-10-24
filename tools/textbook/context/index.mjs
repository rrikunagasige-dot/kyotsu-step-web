export { selectContext } from '../source/coverage.mjs';
export { visibleSnapshot } from '../ir/index.mjs';
export function compactNode(node){return {id:node.id,goal:node.goal,conclusions:node.produces,expandRef:node.id,originalAfter:node.after};}
