import {createFileRoute} from '@tanstack/react-router';
import {GroupCards} from '@/components/ministry/group-cards';
import {useLanguage} from '@/components/ministry/language';
import {pageHead} from '@/lib/ministry';
export const Route=createFileRoute('/groups/')({head:()=>pageHead('Our age groups','Find Cubby House, Fun House, Voltage and Fuel at Hillsong Berlin. A caring community for every age from toddlers to teenagers.'),component:Groups});
function Groups(){const {t}=useLanguage();return <main className="page-content"><span className="eyebrow">{t('ONE FAMILY. EVERY GENERATION.','EINE FAMILIE. JEDE GENERATION.')}</span><h1 className="page-title">{t('A place for every age.','Ein Platz für jedes Alter.')}</h1><p className="page-intro">{t('From first little steps to big teenage questions, there’s a place to discover, make friends and grow in faith.','Von ersten kleinen Schritten bis zu großen Fragen im Teenageralter: Hier ist Platz zum Entdecken, für Freundschaften und zum Wachsen im Glauben.')}</p><GroupCards/></main>}
