import React from 'react'
import {afterEach,expect,it}from'vitest'
import{render,screen,cleanup}from'@testing-library/react'
import{MemoryRouter,Routes,Route}from'react-router-dom'
import{TextbookUnitPage}from'../../../src/pages/TextbookUnitPage'
import{useAppStore}from'../../../src/stores/useAppStore'
import old from'../../../src/data/textbook/math/numbers/n08Revision5.json'
afterEach(()=>{cleanup();localStorage.clear();useAppStore.setState({textbookProgress:{}})})
for(const query of['?version=5','?version=5&layout=original','?layout=original','?version=4'])it('comparison '+query+' is isolated from active progress',async()=>{
 const answers=Object.fromEntries(old.unit.sections[0].items.map(i=>[i.id,{itemId:i.id,value:i.answer,firstValue:'old-first',attemptCount:2,resolved:true,isFirstCorrect:false,firstAnsweredAt:1,lastAnsweredAt:2}]))
 const p={unitId:old.unit.unitId,unitRevision:6,startedAt:1,updatedAt:3,answers:{},archivedRevisions:{'5':{unitRevision:5,startedAt:1,updatedAt:2,completedAt:2,answers}}}
 useAppStore.setState({textbookProgress:{[old.unit.unitId]:p}});const before=JSON.stringify(useAppStore.getState().textbookProgress)
 render(<MemoryRouter initialEntries={['/learning/textbook/'+old.unit.unitId+query]}><Routes><Route path="/learning/textbook/:unitId" element={<TextbookUnitPage/>}/></Routes></MemoryRouter>)
 await screen.findByTestId(query==='?version=4'?'n08-archive-page':'n08-revision5-page')
 expect(JSON.stringify(useAppStore.getState().textbookProgress)).toBe(before)
 expect(document.querySelector('[data-n08-revision="6"]')).toBeNull()
 if(query!=='?version=4')expect(document.querySelector('[data-n08-layout]')?.getAttribute('data-n08-layout')).toBe(query.includes('original')?'original':'grouped')
})
