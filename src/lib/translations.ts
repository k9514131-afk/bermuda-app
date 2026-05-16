import { allTranslations, languageNames } from './translations/index';
import { Translations, Language } from './translations/types';

/**
 * @fileOverview ملف التصدير المركزي للترجمات
 * تم توحيد التصديرات لحل أخطاء NextJS وضمان عمل النظام بالعربية فقط.
 */

export type { Language, Translations };
export { languageNames, allTranslations };
