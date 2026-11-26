import * as Menu from '@radix-ui/react-dropdown-menu';
import {useNavigate} from '@tanstack/react-router';
import {Check,ChevronDown} from 'lucide-react';
import type {CSSProperties} from 'react';
import {groups,ageLabel} from '@/lib/ministry';
import {useLanguage} from './language';
export function RoomMenu({current,variant='hero'}:{current?:string;variant?:'hero'|'inline'}){const {lang,t}=useLanguage();const navigate=useNavigate();const active=groups.find(g=>g.slug===current);
return <Menu.Root modal={false}><Menu.Trigger className={`room-trigger room-trigger-${variant}`} aria-label={t('Choose a room','Raum wählen')}>{variant==='hero'&&<span className="room-faces" aria-hidden="true">{groups.map((g,i)=><img key={g.slug} src={g.photo.src} alt="" style={{objectPosition:g.photo.pos,'--n':i} as CSSProperties}/>)}</span>}<span className="room-label"><strong>{active?active.name:t('Choose your child’s room','Raum deines Kindes wählen')}</strong>{variant==='hero'&&<small>{t(`${groups.length} rooms · Ages 1–13+`,`${groups.length} Räume · 1–13+ Jahre`)}</small>}</span><span className="room-chevron"><ChevronDown size={15} aria-hidden="true"/></span></Menu.Trigger>
<Menu.Portal><Menu.Content className="room-menu" sideOffset={8} align="start" collisionPadding={16}>{groups.map(g=><Menu.Item key={g.slug} className="room-item" onSelect={()=>{void navigate({to:'/groups/$group',params:{group:g.slug}});}}><img className="room-thumb" src={g.photo.src} alt="" style={{objectPosition:g.photo.pos}}/><span className="room-item-text"><strong>{g.name}</strong><small>{ageLabel(g,lang)}</small></span>{g.slug===current&&<Check size={16} className="room-check" aria-hidden="true"/>}</Menu.Item>)}</Menu.Content></Menu.Portal></Menu.Root>}
