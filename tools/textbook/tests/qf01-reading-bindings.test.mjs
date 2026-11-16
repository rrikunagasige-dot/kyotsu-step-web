import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url);
const bytes=name=>readFileSync(new URL(name,root));
const read=name=>JSON.parse(bytes(name));
const hash=value=>createHash('sha256').update(value).digest('hex');
const sorted=value=>Array.isArray(value)?value.map(sorted):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,sorted(value[key])])):value;
const compact=value=>hash(JSON.stringify(sorted(value)));
const pretty=value=>hash(JSON.stringify(value,null,2)+'\n');
const folder='src/data/textbook/math/quadratic/';
const unit=read(folder+'qf01Unit.json'),metadata=read(folder+'qf01ReadingPresentation.json'),presentation=read(folder+'qf01Presentation.json'),archive=read(folder+'qf01Revision2Archive.json');

test('QF01 runtime pins match the actual materialization and canonical metadata',()=>{
 assert.equal(metadata.unitFileRawSHA256,hash(bytes(folder+'qf01Unit.json')));
 assert.equal(presentation.readingPresentationRawSHA256,hash(bytes(folder+'qf01ReadingPresentation.json')));
 const runtime=bytes('src/domain/transformationReading.ts').toString('utf8');
 const metadataPin=/QF01_R3_METADATA_CANONICAL_SHA256\s*=\s*'([a-f0-9]{64})'/.exec(runtime)?.[1];
 assert.equal(metadataPin,compact(metadata),'R3_METADATA_CANONICAL_PIN');
 for(const key of ['irHash','baseIRHash','planHash','constructionDesignHash','layoutDesignHash','learnerCopyHash','compiledPresentationHash'])assert.ok(runtime.includes(key+": '"+metadata.generatedPlanBinding[key]+"'"),'R3_GENERATED_BINDING_'+key);
});

test('QF01 keeps the canonical lesson separate from registration blocks and preserves old grading',()=>{
 assert.equal(unit.revision,3);assert.equal(archive.unit.revision,2);
 const flow=unit.sections.flatMap(section=>section.readingFlow),blocks=new Map(flow.map(block=>[block.id,block]));
 assert.equal(flow.length,169);assert.equal(blocks.size,169);assert.equal(metadata.sourceMap.length,134);
 assert.deepEqual(metadata.sourceMap.map(row=>row.unitBlockId),metadata.canonicalBlockIds);
 for(const row of metadata.sourceMap)assert.equal(compact(blocks.get(row.unitBlockId)),row.unitBlockSHA256,row.unitBlockId);
 assert.equal(metadata.interactionRegistryBlocks.length,35);
 for(const row of metadata.interactionRegistryBlocks){assert.equal(row.render,false);assert.equal(row.channel,'interaction-registry-only');assert.equal(metadata.canonicalBlockIds.includes(row.blockId),false);assert.equal(compact(blocks.get(row.blockId)),row.blockSHA256);}
 assert.deepEqual(unit.requiredInteractionRefs,metadata.interactions.map(row=>row.id));assert.equal(unit.requiredInteractionRefs.length,35);
 assert.equal(unit.requiredInteractionRefs.includes('qf01-n20-answer'),false);
 const current=new Map(unit.sections.flatMap(section=>section.items).map(item=>[item.id,item]));
 const fields=['id','answerType','answer','acceptedAnswers','choices'];
 const grading=item=>Object.fromEntries(fields.map(key=>[key,item[key]]));
 const active=archive.unit.requiredInteractionRefs.map(id=>archive.unit.sections.flatMap(section=>section.items).find(item=>item.id===id));
 assert.equal(active.length,24);for(const item of active)assert.deepEqual(grading(current.get(item.id)),grading(item));
});

test('QF01 math targets belong to actual typed owners, including mathematical prose blanks',()=>{
 const math=metadata.interactions.filter(row=>row.answerDomain==='math');assert.equal(math.length,27);
 assert.deepEqual(metadata.ownerASTBindings.map(row=>row.interactionId),math.map(row=>row.id));
 for(const row of metadata.ownerASTBindings){let target=row.ownerAST;for(const key of row.targetPath.split('.')){assert.ok(target!==null&&typeof target==='object'&&Object.hasOwn(target,key));target=target[key];}assert.equal(pretty(row.ownerAST),row.ownerASTHash);assert.equal(pretty(row.targetAST),row.targetASTHash);assert.deepEqual(target,row.targetAST);}
 for(const id of ['qf01-r3-n14-perimeter-expression-answer','qf01-r3-n16-target-answer']){const row=math.find(row=>row.id===id);assert.equal(row.layoutKind,'paragraph');assert.equal(metadata.ownerASTBindings.some(owner=>owner.interactionId===id),true);}
});

test('QF01 archive retains all three original UTF8 sources and matches the actual old unit',()=>{
 for(const [name,source]of Object.entries(archive.sources)){assert.equal(hash(Buffer.from(source.utf8)),source.rawSHA256,name);assert.equal(source.rawSHA256,archive.hashes[name]);assert.equal(Buffer.byteLength(source.utf8),source.bytes);}
 assert.deepEqual(JSON.parse(archive.sources['qf01Unit.json'].utf8),archive.unit);
 assert.deepEqual(JSON.parse(archive.sources['qf01Presentation.json'].utf8),archive.presentation);
});
