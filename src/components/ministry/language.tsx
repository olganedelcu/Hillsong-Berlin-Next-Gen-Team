import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {Language} from '@/lib/ministry';
const Context=createContext<{lang:Language;setLang:(lang:Language)=>void;t:(en:string,de:string)=>string}>({lang:'en',setLang:()=>{},t:en=>en});
export function LanguageProvider({children}:{children:ReactNode}){const [lang,setLang]=useState<Language>('en');useEffect(()=>{document.documentElement.lang=lang;},[lang]);return <Context.Provider value={{lang,setLang,t:(en,de)=>lang==='en'?en:de}}>{children}</Context.Provider>}
export function useLanguage(){return useContext(Context)}
