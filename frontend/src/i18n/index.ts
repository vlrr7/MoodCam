import en from './en.json'
import fr from './fr.json'


export type Locale = 'en' | 'fr'


const strings = { en, fr } as const


export const t = (key: keyof typeof en, locale: Locale) => {
const dict = strings[locale] as Record<string, string>
return dict[key] ?? String(key)
}