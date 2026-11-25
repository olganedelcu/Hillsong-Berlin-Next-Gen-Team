import {describe,it,expect} from 'vitest';
import {groups,berlinDate,upcomingSunday,isTeamRoles,isVisibleLesson} from '@/lib/ministry';
describe('Ministry rules',()=>{
 it('defines Cubby House ages 1–3',()=>{expect(groups.find(g=>g.name==='Cubby House')).toMatchObject({min:1,max:3});});
 it('defines Fun House ages 3–7',()=>{expect(groups.find(g=>g.name==='Fun House')).toMatchObject({min:3,max:7});});
 it('defines Voltage ages 7–13',()=>{expect(groups.find(g=>g.name==='Voltage')).toMatchObject({min:7,max:13});});
 it('defines Fuel ages 13 and up',()=>{expect(groups.find(g=>g.name==='Fuel')).toMatchObject({min:13,max:null});});
 it('uses Berlin local date across midnight',()=>{expect(berlinDate(new Date('2026-11-23T23:30:00Z'))).toBe('2026-11-24');});
 it('finds the upcoming Sunday',()=>{expect(upcomingSunday('2026-11-23')).toBe('2026-11-29');expect(upcomingSunday('2026-11-29')).toBe('2026-11-29');});
 it('requires a team grant rather than login alone',()=>{expect(isTeamRoles([])).toBe(false);expect(isTeamRoles(['user'])).toBe(false);expect(isTeamRoles(['editor'])).toBe(true);});
 it('keeps drafts hidden from parents',()=>{expect(isVisibleLesson(false,[])).toBe(false);expect(isVisibleLesson(true,[])).toBe(true);expect(isVisibleLesson(false,['editor'])).toBe(true);});
});
