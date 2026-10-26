import {useState} from 'react'
import {createRoot} from 'react-dom/client'
import 'katex/dist/katex.min.css'
import '../../../src/styles/global.css'
import '../../../src/components/textbook/guided-math-reading.css'
import {TransformationReadingGroup} from '../../../src/components/textbook/TransformationReadingGroup'
import {TransformationReadingSchema,projectTransformationView} from '../../../src/domain/transformationReading'
import fixtures from './FIXTURE_RESULTS.json'
const selected=new URLSearchParams(location.search).get('id')??'F01'
const source=fixtures.find(f=>f.id===selected)!
function Fixture(){
 const p=TransformationReadingSchema.parse(source.compiled),[solved,setSolved]=useState<string[]>([]),[active,setActive]=useState<string|null>(null),[attempts,setAttempts]=useState(0)
 const visible=projectTransformationView(p,solved)
 return <main style={{padding:'16px',boxSizing:'border-box',width:'100%'}}><h1>{selected}</h1><output data-testid="attempts">{attempts}</output>{visible.groups.map(g=><TransformationReadingGroup key={g.id} group={g} renderSlot={id=><button className="reading-inline-blank" data-testid={'slot-'+id} onClick={()=>setActive(id)}>選択</button>} renderPanel={id=>active===id?<div role="group" data-testid={'panel-'+id}>{p.interactions.find(c=>c.id===id)!.choices.map(value=><button key={value} onClick={()=>{setAttempts(n=>n+1);if(value===p.interactions.find(c=>c.id===id)!.correctValue){setSolved(s=>[...s,id]);setActive(null)}}}>{value}</button>)}</div>:null}/>)}</main>
}
createRoot(document.getElementById('root')!).render(source.status==='PASS'?<Fixture/>:<p role="alert">{source.status}: excluded or unsupported</p>)
