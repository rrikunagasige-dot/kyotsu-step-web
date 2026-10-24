import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
export const stable = value => JSON.stringify(value,(_key,v)=>typeof v==='bigint'?v.toString():v,2)+'\n';
export const hash = value => createHash('sha256').update(typeof value==='string'?value:stable(value)).digest('hex');
export const readJSON = path => JSON.parse(readFileSync(path,'utf8'));
export function writeJSON(path,value){mkdirSync(dirname(path),{recursive:true});const temp=path+'.tmp';writeFileSync(temp,stable(value));renameSync(temp,path);}
export function invariant(condition,message){if(!condition)throw Error(message);}
