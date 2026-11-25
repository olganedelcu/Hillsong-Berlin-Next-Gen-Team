import {House,Sprout,Zap,Flame} from 'lucide-react';
import type {Group} from '@/lib/ministry';
export function RoomTile({group}:{group:Group}) { const Icon=group.icon==='house'?House:group.icon==='sprout'?Sprout:group.icon==='bolt'?Zap:Flame;return <span className={`room-tile tile-${group.tone}`}><Icon aria-hidden="true" strokeWidth={2}/></span>; }
