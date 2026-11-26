import {Fragment,type CSSProperties} from 'react';
import {createFileRoute} from '@tanstack/react-router';
import {useLanguage} from '@/components/ministry/language';
import {RoomMenu} from '@/components/ministry/room-menu';
import {pageHead} from '@/lib/ministry';
function FunWords({text}:{text:string}){let i=0;return <span aria-label={text}>{text.split(' ').map((word,w)=><Fragment key={w}>{w>0&&' '}<span aria-hidden="true" className="fun-word">{[...word].map(ch=><span key={i} className="fun-letter" style={{'--i':i++} as CSSProperties}>{ch}</span>)}</span></Fragment>)}</span>}
export const Route=createFileRoute('/')({head:()=>pageHead('Hillsong Berlin Next Generation Team','Choose your child’s room at Hillsong Berlin Next Generation Team to see this Sunday’s Bible story and message.'),component:Home});
function Home(){const {t}=useLanguage();
return <main><section className="hero hero-landing"><img src="/photos/songs-and-dance.jpg" className="hero-image" alt={t('Children dancing and worshipping together on a Sunday morning','Kinder tanzen und feiern gemeinsam an einem Sonntagmorgen')}/><div className="hero-inner"><div className="hero-copy"><h1><FunWords text="Next Generation"/><br/><em>Team</em></h1><RoomMenu/></div></div></section></main>}
