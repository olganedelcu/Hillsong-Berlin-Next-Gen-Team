import {Link} from '@tanstack/react-router';
import {ArrowRight} from 'lucide-react';
import {groups,ageLabel} from '@/lib/ministry';
import {GroupIcon} from './group-icon';
import {useLanguage} from './language';
export function GroupCards(){const {lang}=useLanguage();return <div className="group-grid">{groups.map(group=><Link key={group.slug} to="/groups/$group" params={{group:group.slug}} className={`group-card tone-${group.tone}`}><div className="group-card-top"><GroupIcon group={group}/><span className="age-label">{ageLabel(group,lang)}</span></div><h3>{group.name}</h3><p>{group[lang]}</p><span className="card-arrow"><ArrowRight size={20}/></span></Link>)}</div>}
