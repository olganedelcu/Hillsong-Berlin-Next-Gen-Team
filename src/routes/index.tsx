import {createFileRoute} from '@tanstack/react-router';
import {useLanguage} from '@/components/ministry/language';
import {RoomMenu} from '@/components/ministry/room-menu';
import {pageHead} from '@/lib/ministry';
export const Route=createFileRoute('/')({head:()=>pageHead('Hillsong Berlin Next Generation Team','Choose your child’s room at Hillsong Berlin Next Generation Team to see this Sunday’s Bible story and message.'),component:Home});
function Home(){const {t}=useLanguage();
return <main><section className="hero hero-landing"><img src="/photos/songs-and-dance.jpg" className="hero-image" alt={t('Children dancing and worshipping together on a Sunday morning','Kinder tanzen und feiern gemeinsam an einem Sonntagmorgen')}/><div className="hero-inner"><div className="hero-copy"><h1>Next Generation<br/><em>Team</em></h1><RoomMenu/></div></div></section></main>}
