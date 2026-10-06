/* =============================================================================
 *  SITE CONFIG — العميل/الطقم: عدّل هذا الملف فقط لإعادة تصميم الموقع لكل عميل
 *  SITE CONFIG — Per-client branding: edit ONLY this file to rebrand the site
 * ========================================================================== */

export type Lang = 'en' | 'ar';

export interface SiteConfig {
  brand: {
    /** Short monogram inside the logo badge */
    logoText: string;
    /** Hospital / clinic name shown across the site */
    name: string;
    fullName: string;
    tagline: Record<Lang, string>;
  };

  /** Colors are injected as CSS variables — change them here, the whole site follows */
  theme: {
    primary: string;      // main brand color (teal/emerald, blue...)
    primaryDeep: string;  // dark sections
    accent: string;       // gold / highlights
    cream: string;        // light section background
  };

  contact: {
    phone: string;
    emergency: string;
    whatsapp: string;   // digits only, international format
    email: string;
    address: Record<Lang, string>;
    /** Search query used for the embedded map */
    mapQuery: string;
  };

  hours: { days: Record<Lang, string>; time: string }[];

  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    x: string;
    youtube: string;
  };

  /** Replace these URLs with the client's own photos */
  photos: {
    hero: string;
    about: string;
    appointment: string;
    gallery: string[];
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    logoText: 'A',
    name: 'Aurelia Medical Center',
    fullName: 'Aurelia International Hospital & Clinics',
    tagline: {
      en: 'Where world-class medicine meets human warmth',
      ar: 'حيث تلتقي الطب العالمية بالدفء الإنساني',
    },
  },

  theme: {
    primary: '#0E6B5C',
    primaryDeep: '#0A2B26',
    accent: '#C9A227',
    cream: '#F6F3EC',
  },

  contact: {
    phone: '+1 (800) 555-0142',
    emergency: '+1 (800) 555-0199',
    whatsapp: '+18005550142',
    email: 'care@aureliamedical.com',
    address: {
      en: '24 Harbor View Drive, Boston, MA 02110',
      ar: '24 هاربور فيو درايف، بوسطن، ماساتشوستس',
    },
    mapQuery: 'Boston MA',
  },

  hours: [
    { days: { en: 'Monday – Friday', ar: 'الاثنين – الجمعة' }, time: '08:00 – 20:00' },
    { days: { en: 'Saturday', ar: 'السبت' }, time: '09:00 – 17:00' },
    { days: { en: 'Sunday', ar: 'الأحد' }, time: '10:00 – 14:00' },
    { days: { en: 'Emergency', ar: 'الطوارئ' }, time: '24 / 7' },
  ],

  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    x: 'https://x.com',
    youtube: 'https://youtube.com',
  },

  photos: {
    hero: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1920',
    about: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1200',
    appointment: 'https://images.pexels.com/photos/6129681/pexels-photo-6129681.jpeg?auto=compress&cs=tinysrgb&w=1600',
    gallery: [
      'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
  },
};
