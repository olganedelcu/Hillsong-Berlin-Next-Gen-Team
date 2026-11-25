import * as Menu from '@radix-ui/react-dropdown-menu';
import {useNavigate} from '@tanstack/react-router';
import {Check,ChevronsUpDown} from 'lucide-react';
import {groups,ageLabel} from '@/lib/ministry';
import {useLanguage} from './language';
export function RoomMenu({current,variant='hero'}:{current?:string;variant?:'hero'|'inline'}){const {lang,t}=useLanguage();const navigate=useNavigate();const active=groups.find(g=>g.slug===current);
return <Menu.Root modal={false}><Menu.Trigger className={`room-trigger room-trigger-${variant}`} aria-label={t('Choose a room','Raum wählen')}><span>{active?active.name:t('Choose your child’s room','Raum deines Kindes wählen')}</span><span className="room-chevron"><ChevronsUpDown size={15} aria-hidden="true"/></span></Menu.Trigger>
<Menu.Portal><Menu.Content className="room-menu" sideOffset={8} align="start" collisionPadding={16}>{groups.map(g=><Menu.Item key={g.slug} className="room-item" onSelect={()=>{void navigate({to:'/groups/$group',params:{group:g.slug}});}}><img className="room-thumb" src={g.photo.src} alt="" style={{objectPosition:g.photo.pos}}/><span className="room-item-text"><strong>{g.name}</strong><small>{ageLabel(g,lang)}</small></span>{g.slug===current&&<Check size={16} className="room-check" aria-hidden="true"/>}</Menu.Item>)}</Menu.Content></Menu.Portal></Menu.Root>}
