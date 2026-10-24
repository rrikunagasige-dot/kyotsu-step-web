import {readdirSync,readFileSync} from 'node:fs';import {resolve} from 'node:path';
import {hash} from './util.mjs';
export function implementationFingerprint(dir){const entries=readdirSync(dir,{withFileTypes:true}).filter(e=>!e.name.startsWith('.')&&e.name!=='__pycache__'&&(e.isDirectory()||/\.(mjs|json|py|md|ts|txt|lock)$/.test(e.name))).sort((a,b)=>a.name.localeCompare(b.name));return hash(entries.map(e=>[e.name,e.isDirectory()?implementationFingerprint(resolve(dir,e.name)):hash(readFileSync(resolve(dir,e.name),'utf8'))]));}
