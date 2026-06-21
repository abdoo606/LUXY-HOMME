import { useStore } from '../store/useStore';
import { translations } from '../i18n/translations';

export function useTranslation() {
  const language = useStore((s) => s.language);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return { t, language };
}
