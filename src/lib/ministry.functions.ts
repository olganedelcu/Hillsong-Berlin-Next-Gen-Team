import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { berlinDate, upcomingSunday } from './ministry';
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type MinistryEvent = Database['public']['Tables']['events']['Row'];
export const getPublicContent = createServerFn({method:'GET'}).handler(async () => {
 const url=process.env['SUPABASE_URL']; const key=process.env['SUPABASE_PUBLISHABLE_KEY'];
 if(!url || !key) throw new Error('Content unavailable');
 const client=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_') && h.get('Authorization')===`Bearer ${key}`) h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const [lessons,events]=await Promise.all([client.from('lessons').select('*').eq('published',true).order('lesson_date',{ascending:false}).limit(500),client.from('events').select('*').order('event_date').limit(500)]);
 if(lessons.error || events.error) throw new Error('Unable to load ministry content');
 const rows=lessons.data ?? [];
 const hydrated=await Promise.all(rows.map(async row=>{
  if(!row.images.length) return {...row,image_urls:[] as string[]};
  // Only paths returned by the published-only RLS query may be signed for public visitors.
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const signed=await supabaseAdmin.storage.from('lesson-images').createSignedUrls(row.images,3600);
  return {...row,image_urls:(signed.data ?? []).flatMap(item=>item.signedUrl ? [item.signedUrl.replace(url,import.meta.env['VITE_SUPABASE_URL'])] : [])};
 }));
 const today=berlinDate();return {lessons:hydrated,events:events.data ?? [],today,sunday:upcomingSunday(today)};
});
export const publicContentOptions=queryOptions({queryKey:['public-content'],queryFn:()=>getPublicContent(),staleTime:60_000});
export const getTeamContent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async ({context})=>{
 const allowed=await context.supabase.rpc('is_team');if(!allowed.data) return {authorized:false,lessons:[] as Lesson[],events:[] as MinistryEvent[]};
 const [lessons,events]=await Promise.all([context.supabase.from('lessons').select('*').order('lesson_date',{ascending:false}),context.supabase.from('events').select('*').order('event_date')]);
 if(lessons.error || events.error) throw new Error('Unable to load team content');return {authorized:true,lessons:lessons.data ?? [],events:events.data ?? []};
});
export const teamContentOptions=queryOptions({queryKey:['team-content'],queryFn:()=>getTeamContent()});
const lessonSchema=z.object({id:z.string().uuid().optional(),group_slug:z.enum(['cubby-house','fun-house','voltage','fuel']),lesson_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),title_en:z.string().min(1),title_de:z.string(),verses_en:z.string(),verses_de:z.string(),idea_en:z.string(),idea_de:z.string(),story_en:z.string(),story_de:z.string(),questions_en:z.array(z.string()),questions_de:z.array(z.string()),images:z.array(z.string()),published:z.boolean()});
export const saveLesson=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).validator(input=>lessonSchema.parse(input)).handler(async ({context,data})=>{
 const permission=await context.supabase.rpc('is_team');if(!permission.data) throw new Error('Team access required');
 const {id,...row}=data;const result=id ? await context.supabase.from('lessons').update(row).eq('id',id).select().single() : await context.supabase.from('lessons').insert(row).select().single();if(result.error) throw new Error('Could not save. A lesson may already exist for this group and date.');return result.data;
});
const eventSchema=z.object({id:z.string().uuid().optional(),event_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),event_time:z.string(),title_en:z.string().min(1),title_de:z.string(),description_en:z.string(),description_de:z.string(),location:z.string(),groups:z.array(z.enum(['cubby-house','fun-house','voltage','fuel']))});
export const saveEvent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).validator(input=>eventSchema.parse(input)).handler(async({context,data})=>{const p=await context.supabase.rpc('is_team');if(!p.data) throw new Error('Team access required');const {id,...row}=data;const result=id ? await context.supabase.from('events').update(row).eq('id',id) : await context.supabase.from('events').insert(row);if(result.error) throw new Error('Could not save event');return {ok:true};});
export const deleteContent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).validator(input=>z.object({table:z.enum(['lessons','events']),id:z.string().uuid()}).parse(input)).handler(async({context,data})=>{const p=await context.supabase.rpc('is_team');if(!p.data) throw new Error('Team access required');const result=await context.supabase.from(data.table).delete().eq('id',data.id);if(result.error) throw new Error('Could not delete');return {ok:true};});
