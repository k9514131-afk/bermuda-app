import { customerArabic } from './customer/ar';
import { staffArabic } from './staff/ar';
import { customerEnglish } from './customer/en';
import { customerFrench } from './customer/fr';
import { staffEnglish } from './staff/en';
import { staffFrench } from './staff/fr';

export const allTranslations = {
  ar: {
    customer: customerArabic,
    staff: staffArabic
  },
  en: {
    customer: customerEnglish,
    staff: staffEnglish
  },
  fr: {
    customer: customerFrench,
    staff: staffFrench
  }
};

export const languageNames = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français'
};
