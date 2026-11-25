import {createFileRoute,Link,notFound} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import {BookOpen,CheckCircle2} from 'lucide-react';
import {groups,advent,defaultAdventDate,ageLabel,formatDate,pageHead} from '@/lib/ministry';
import {publicContentOptions} from '@/lib/ministry.functions';
import {useLanguage} from '@/components/ministry/language';
import {RoomTile} from '@/components/ministry/group-icon';
import {RoomMenu} from '@/components/ministry/room-menu';
export const Route=createFileRoute('/groups/$group')({validateSearch:(search:Record<string,unknown>):{week?:string}=>typeof search['week']==='string'?{week:search['week']}:{},loader:({context,params})=>{if(!groups.some(g=>g.slug===params.group))throw notFound();return context.queryClient.ensureQueryData(publicContentOptions)},head:({params})=>pageHead(`${groups.find(g=>g.slug===params.group)?.name ?? 'Room'} — Sunday lessons`,'Discover this Sunday’s Bible story, big idea and family conversation prompts at Hillsong Berlin Next Generation.'),component:GroupPage});
function GroupPage(){const {group:slug}=Route.useParams();const {week}=Route.useSearch();const {data}=useSuspenseQuery(publicContentOptions);const {lang,t}=useLanguage();const group=groups.find(g=>g.slug===slug);if(!group)return null;
const selected=week??defaultAdventDate(data.sunday);
const slot=advent.find(a=>a.date===selected);
const lesson=data.lessons.find(l=>l.group_slug===slug&&l.lesson_date===selected);
const pick=(en:string,de:string)=>lang==='en'?en:(de||en);
const questions=lesson?(lang==='en'||!lesson.questions_de.length?lesson.questions_en:lesson.questions_de):[];
const story=lesson?pick(lesson.story_en,lesson.story_de).split('\n\n').filter(Boolean):[];
return <main className={`room-page tone-${group.tone}`}><div className="room-top"><RoomMenu current={slug} variant="inline"/></div><div className="room-layout">
<aside className="room-side"><div className="room-photo"><img src={group.photo.src} alt={lang==='en'?group.photo.en:group.photo.de} style={{objectPosition:group.photo.pos}}/><RoomTile group={group}/></div><div className="room-info"><p className="room-age">{ageLabel(group,lang)}</p><h1>{group.name}</h1><p className="room-tagline">{group[lang]}</p></div></aside><div className="room-main">
<nav className="sunday-tabs" aria-label={t('Advent Sundays','Adventssonntage')}>{advent.map(a=><Link key={a.date} to="/groups/$group" params={{group:slug}} search={a.date===defaultAdventDate(data.sunday)?{}:{week:a.date}} replace resetScroll={false} className={'sunday-tab'+(a.date===selected?' is-active':'')} aria-current={a.date===selected?'page':undefined}><strong>{lang==='en'?a.en:a.de}</strong><small>{formatDate(a.date,lang,true)}</small></Link>)}</nav>
{lesson?<article className="lesson-card"><p className="l-eyebrow">{lesson.lesson_date===data.sunday?t('This Sunday','Diesen Sonntag'):t('Advent Sunday','Adventssonntag')} · {formatDate(lesson.lesson_date,lang)}</p><h2 className="l-title">{pick(lesson.title_en,lesson.title_de)}</h2>{pick(lesson.verses_en,lesson.verses_de)&&<p className="l-verse"><BookOpen size={15}/>{pick(lesson.verses_en,lesson.verses_de)}</p>}
{pick(lesson.idea_en,lesson.idea_de)&&<section className="l-section"><h3>{t('The big idea','Die wichtigste Botschaft')}</h3><p className="l-lead">{pick(lesson.idea_en,lesson.idea_de)}</p></section>}
{story.length>0&&<section className="l-section"><h3>{t('The Bible story','Die Bibelgeschichte')}</h3>{story.map((p,i)=><p key={i}>{p}</p>)}</section>}
{questions.length>0&&<section className="l-section"><h3>{t('Let’s talk about it at home','Darüber sprechen wir zu Hause')}</h3><ul className="l-list">{questions.map((q,i)=><li key={i}><CheckCircle2 size={18}/><span>{q}</span></li>)}</ul></section>}
{lesson.image_urls.length>0&&<section className="l-section l-photos">{lesson.image_urls.map((url,i)=><img key={url} src={url} loading="lazy" alt={`${pick(lesson.title_en,lesson.title_de)} — ${t('lesson image','Unterrichtsbild')} ${i+1}`}/>)}</section>}</article>
:<div className="lesson-card room-empty"><BookOpen size={28}/><h2>{slot?`${lang==='en'?slot.en:slot.de} · ${formatDate(slot.date,lang)}`:t('A new adventure is on its way.','Ein neues Abenteuer wartet.')}</h2><p>{t('Our team is getting this Sunday ready. Check back soon!','Unser Team bereitet diesen Sonntag vor. Schau bald wieder vorbei!')}</p></div>}</div></div></main>}
