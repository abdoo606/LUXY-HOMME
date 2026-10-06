import type { Lang } from './site.config';

export interface Department {
  id: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  icon: string; // lucide icon name — mapped in DepartmentCard
  image: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: Record<Lang, string>;
  department: string; // Department id
  experience: number;
  languages: string[];
  rating: number;
  reviews: number;
  photo: string;
  bio: Record<Lang, string>;
  education: Record<Lang, string>;
  /** Working days (0=Sun … 6=Sat) and daily hours [start,end) in 24h */
  workingDays: number[];
  hours: { start: string; end: string };
}

export interface Testimonial {
  name: string;
  country: string;
  text: Record<Lang, string>;
  rating: number;
  avatar: string;
}

export interface FaqItem {
  question: Record<Lang, string>;
  answer: Record<Lang, string>;
}

export const departments: Department[] = [
  {
    id: 'cardiology',
    name: { en: 'Cardiology', ar: 'أمراض القلب' },
    description: {
      en: 'Advanced cardiac care with cath labs, non-invasive imaging, and a dedicated heart-failure unit.',
      ar: 'رعاية قلبية متقدمة مع قسطرة قلبية وتصوير غير جاري ووحدة متخصصة لقصور القلب.',
    },
    icon: 'heart-pulse',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'neurology',
    name: { en: 'Neurology & Neurosurgery', ar: 'المخ والأعصاب والجراحة العصبية' },
    description: {
      en: 'Comprehensive stroke, epilepsy, and spine programs with intraoperative neuromonitoring.',
      ar: 'برامج شاملة للسكتات الدماغية والصرع والعمود الفقري مع مراقبة عصبية أثناء الجراحة.',
    },
    icon: 'brain',
    image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'orthopedics',
    name: { en: 'Orthopedics & Sports Medicine', ar: 'العظام والطب الرياضي' },
    description: {
      en: 'Joint replacement, arthroscopy, and sports-injury rehabilitation with robotic-assisted surgery.',
      ar: 'استبدال المفاصل والتنظير الجراحي وإصابات الرياضة مع جراحة بمساعدة الروبوت.',
    },
    icon: 'bone',
    image: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'oncology',
    name: { en: 'Oncology & Hematology', ar: 'الأورام وأمراض الدم' },
    description: {
      en: 'Personalized cancer care — immunotherapy, targeted therapy, and multidisciplinary tumor boards.',
      ar: 'رعاية مخصصة للسرطان — مناعة حيوية وعلاج موجه وغرف أورام متعددة التخصصات.',
    },
    icon: 'ribbon',
    image: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'pediatrics',
    name: { en: 'Pediatrics & Neonatology', ar: 'الأطفال وحديثي الولادة' },
    description: {
      en: 'Level-III NICU, pediatric surgery, and child-development clinics in a family-centered environment.',
      ar: 'وحدة عناية مركزة لحديثي الولادة وجراحة الأطفال وعيادات نمو الطفل في بيئة تركز على الأسرة.',
    },
    icon: 'baby',
    image: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'obgyn',
    name: { en: 'Obstetrics & Gynecology', ar: 'النساء والتوليد' },
    description: {
      en: 'Maternity suites, high-risk pregnancy care, fertility services, and minimally invasive gynecology.',
      ar: 'غرف ولادة فاخرة ورعاية الحمل عالي الخطر وخدمات الخصوبة وجراحة نسائية قليلة التوغل.',
    },
    icon: 'flower-2',
    image: 'https://images.pexels.com/photos/7088524/pexels-photo-7088524.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'ophthalmology',
    name: { en: 'Ophthalmology', ar: 'طب العيون' },
    description: {
      en: 'LASIK, cataract, and retina centers with femtosecond laser technology and 3D surgical imaging.',
      ar: 'مراكز الليزك و الساد و الشبكية بتقنية الفيمتو ليزر والتصوير الجراحي ثلاثي الأبعاد.',
    },
    icon: 'eye',
    image: 'https://images.pexels.com/photos/5752264/pexels-photo-5752264.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'dental',
    name: { en: 'Dental & Oral Surgery', ar: 'الأسنان وجراحة الفم' },
    description: {
      en: 'Digital smile design, implants, and full-mouth rehabilitation in a spa-grade dental center.',
      ar: 'تصميم ابتسامة رقمي وزراعة أسنان وترميم شامل في مركز أسنان بمستوى المنتجعات.',
    },
    icon: 'sparkles',
    image: 'https://images.pexels.com/photos/3845983/pexels-photo-3845983.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const doctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Adrian Keller',
    title: { en: 'Chief of Cardiology', ar: 'رئيس قسم القلب' },
    department: 'cardiology',
    experience: 21,
    languages: ['English', 'German', 'French'],
    rating: 4.9,
    reviews: 312,
    photo: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: {
      en: 'Interventional cardiologist specializing in complex coronary interventions and structural heart disease, with over 2,500 procedures.',
      ar: 'أخصائي قسطرة قلبية متخصص في التدخلات التاجية المعقدة وأمراض القلب الهيكلية، بأكثر من 2500 إجراء طبي.',
    },
    education: {
      en: 'MD, Johns Hopkins — Fellowship, Cleveland Clinic',
      ar: 'دكتوراه في الطب، جونز هوبكنز — زمالة، كليفلاند كلينك',
    },
    workingDays: [1, 2, 3, 4],
    hours: { start: '09:00', end: '15:00' },
  },
  {
    id: 'd2',
    name: 'Dr. Sofia Marchetti',
    title: { en: 'Consultant Neurologist', ar: 'استشارية أعصاب' },
    department: 'neurology',
    experience: 15,
    languages: ['English', 'Italian', 'Spanish'],
    rating: 4.8,
    reviews: 228,
    photo: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: {
      en: 'Stroke and epilepsy specialist, founder of our rapid-response stroke protocol that cut treatment time by 40%.',
      ar: 'أخصائية في السكتات الدماغية والصرع، ومبتكرة بروتوكول الجلطة السريع الذي قلل زمن العلاج بنسبة 40%.',
    },
    education: {
      en: 'MD, University of Milan — Fellowship, Charité Berlin',
      ar: 'دكتوراه في الطب، جامعة ميلانو — زمالة، شاريتيه برلين',
    },
    workingDays: [0, 2, 4],
    hours: { start: '10:00', end: '16:00' },
  },
  {
    id: 'd3',
    name: 'Dr. Marcus Chen',
    title: { en: 'Orthopedic Surgeon', ar: 'جراح عظام' },
    department: 'orthopedics',
    experience: 18,
    languages: ['English', 'Mandarin'],
    rating: 4.9,
    reviews: 276,
    photo: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: {
      en: 'Robotic joint replacement expert and sports-medicine consultant for national athletic federations.',
      ar: 'خبير استبدال مفاصل بالروبوت ومستشار طب رياضي للاتحادات الرياضية الوطنية.',
    },
    education: {
      en: 'MD, NUS Singapore — Fellowship, Hospital for Special Surgery NY',
      ar: 'دكتوراه في الطب، جامعة سنغافورة الوطنية — زمالة، مستشفى الجراحة التخصصية نيويورك',
    },
    workingDays: [1, 3, 5],
    hours: { start: '08:00', end: '14:00' },
  },
  {
    id: 'd4',
    name: 'Dr. Amira Haddad',
    title: { en: 'Senior Oncologist', ar: 'استشارية أورام أولى' },
    department: 'oncology',
    experience: 16,
    languages: ['English', 'Arabic', 'French'],
    rating: 5.0,
    reviews: 341,
    photo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: {
      en: 'Breast and GI oncology lead; immunotherapy researcher with publications in The Lancet Oncology.',
      ar: 'رئيسة أورام الثدي والجهاز الهضمي؛ باحثة في العلاج المناعي بأوراق منشورة في ذا لانسيت.',
    },
    education: {
      en: 'MD, AUB Beirut — Fellowship, MD Anderson',
      ar: 'دكتوراه في الطب، الجامعة الأميركية في بيروت — زمالة، إم دي أندرسون',
    },
    workingDays: [0, 1, 2, 3],
    hours: { start: '09:00', end: '15:00' },
  },
  {
    id: 'd5',
    name: 'Dr. Emily Robertson',
    title: { en: 'Consultant Pediatrician', ar: 'استشارية أطفال' },
    department: 'pediatrics',
    experience: 12,
    languages: ['English', 'French'],
    rating: 4.9,
    reviews: 198,
    photo: 'https://images.pexels.com/photos/3768126/pexels-photo-3768126.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: {
      en: 'Neonatology and child-development specialist, champion of family-centered neonatal care.',
      ar: 'أخصائية في حديثي الولادة ونمو الطفل، ومناصرة لرعاية حديثي الولادة المتمركزة حول الأسرة.',
    },
    education: {
      en: 'MD, University of Toronto — Fellowship, Great Ormond Street',
      ar: 'دكتوراه في الطب، جامعة تورنتو — زمالة، مستشفى غريت أورموند ستريت',
    },
    workingDays: [0, 2, 4, 6],
    hours: { start: '10:00', end: '16:00' },
  },
  {
    id: 'd6',
    name: 'Dr. Ingrid Berg',
    title: { en: 'Head of Obstetrics', ar: 'رئيسة قسم التوليد' },
    department: 'obgyn',
    experience: 19,
    languages: ['English', 'Swedish', 'German'],
    rating: 4.8,
    reviews: 263,
    photo: 'https://images.pexels.com/photos/5207102/pexels-photo-5207102.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: {
      en: 'High-risk pregnancy and minimally invasive gynecologic surgery specialist, 4,000+ deliveries.',
      ar: 'أخصائية في الحمل عالي الخطر والجراحة النسائية قليلة التوغل، بأكثر من 4000 ولادة.',
    },
    education: {
      en: 'MD, Karolinska Institute — Fellowship, King’s College London',
      ar: 'دكتوراه في الطب، معهد كارولينسكا — زمالة، كينجز كوليدج لندن',
    },
    workingDays: [1, 2, 4, 5],
    hours: { start: '09:00', end: '15:00' },
  },
  {
    id: 'd7',
    name: 'Dr. James Okafor',
    title: { en: 'Ophthalmic Surgeon', ar: 'جراح عيون' },
    department: 'ophthalmology',
    experience: 14,
    languages: ['English', 'Spanish'],
    rating: 4.9,
    reviews: 187,
    photo: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: {
      en: 'Refractive-surgery and retina specialist performing over 800 laser procedures yearly.',
      ar: 'أخصائي جراحة تصحيح الإبصار وشبكية يقوم بأكثر من 800 عملية ليزر سنويًا.',
    },
    education: {
      en: 'MD, University of Cape Town — Fellowship, Moorfields London',
      ar: 'دكتوراه في الطب، جامعة كيب تاون — زمالة، مورفيلدز لندن',
    },
    workingDays: [0, 3, 5],
    hours: { start: '11:00', end: '17:00' },
  },
  {
    id: 'd8',
    name: 'Dr. Daniel Park',
    title: { en: 'Dental Surgeon', ar: 'جراح أسنان' },
    department: 'dental',
    experience: 11,
    languages: ['English', 'Korean', 'Japanese'],
    rating: 4.7,
    reviews: 152,
    photo: 'https://images.pexels.com/photos/6528855/pexels-photo-6528855.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: {
      en: 'Digital smile design and implantology expert with a boutique, pain-free treatment philosophy.',
      ar: 'خبير تصميم الابتسامة الرقمي وزراعة الأسنان بفلسفة علاجية راقية وخالية من الألم.',
    },
    education: {
      en: 'DDS, Yonsei University — Fellowship, UCLA',
      ar: 'جراحة فم وأسنان، جامعة يونسي — زمالة، جامعة كاليفورنيا لوس أنجلوس',
    },
    workingDays: [1, 3, 6],
    hours: { start: '10:00', end: '18:00' },
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Whitfield',
    country: 'United Kingdom',
    text: {
      en: 'From the first call to my full recovery, everything felt five-star. The cardiology team explained every step with such kindness.',
      ar: 'من أول اتصال إلى شفائي الكامل، كان كل شيء بمستوى النجوم الخمسة. فريق القلب شرح لي كل خطوة بلطف بالغ.',
    },
    rating: 5,
    avatar: '👩🏼',
  },
  {
    name: 'Kenji Tanaka',
    country: 'Japan',
    text: {
      en: 'The precision of the robotic surgery and the nursing care were beyond anything I expected. Truly world-class.',
      ar: 'دقة الجراحة بالروبوت وتمريض كانا أعلى من كل توقعاتي. مستوى عالمي حقًا.',
    },
    rating: 5,
    avatar: '👨🏻',
  },
  {
    name: 'Fatima Al-Sayed',
    country: 'Egypt',
    text: {
      en: 'They treated my mother like family. The private rooms and 24/7 attention made a hard time so much easier.',
      ar: 'عاملوا أمي كأنها من العائلة. الغرف الخاصة والعناية على مدار الساعة جعلت الموقف أسهل بكثير.',
    },
    rating: 5,
    avatar: '🧕🏽',
  },
  {
    name: 'Lucas Meyer',
    country: 'Germany',
    text: {
      en: 'Booked my appointment online in two minutes, seen on time, and the sports-injury rehab program got me back on the field.',
      ar: 'حجزت موعدي أونلاين بدقيقتين، استقبلوني في موعدي، وبرنامج إعادة التأهيل أعادني للملاعب.',
    },
    rating: 5,
    avatar: '👨🏼',
  },
  {
    name: 'Olivia Parker',
    country: 'Australia',
    text: {
      en: 'The maternity suite was immaculate and the team made the whole experience calm and beautiful.',
      ar: 'غرفة الولادة كانت مثالية والفريق جعل التجربة كلها هادئة وجميلة.',
    },
    rating: 5,
    avatar: '👩🏻',
  },
  {
    name: 'Rajesh Malhotra',
    country: 'India',
    text: {
      en: 'Outstanding oncology care with genuine human compassion. The second-opinion clinic gave me real clarity.',
      ar: 'رعاية أورام استثنائية مع تعاطف إنساني حقيقي. عيادة الرأي الثاني أوضحت لي كل شيء.',
    },
    rating: 5,
    avatar: '👨🏾',
  },
];

export const faqs: FaqItem[] = [
  {
    question: { en: 'Do I need a referral to book an appointment?', ar: 'هل أحتاج إلى إحالة لحجز موعد؟' },
    answer: {
      en: 'No referral is needed. You can book directly online, by phone, or through WhatsApp — and we can coordinate specialist referrals internally.',
      ar: 'لا حاجة لإحالة. يمكنك الحجز مباشرة عبر الموقع أو الهاتف أو واتساب — ونتواصل مع التخصصات الداخلية نيابة عنك.',
    },
  },
  {
    question: { en: 'Which insurance plans do you accept?', ar: 'ما هي خطط التأمين المقبولة؟' },
    answer: {
      en: 'We work with 30+ international and regional insurers. Share your policy details and our team will verify coverage before your visit.',
      ar: 'نتعامل مع أكثر من 30 شركة تأمين دولية ومحلية. شاركنا بيانات بطاقتك وسيراجع فريقنا التغطية قبل زيارتك.',
    },
  },
  {
    question: { en: 'How soon can I get an appointment?', ar: 'ما مدى سرعة الحصول على موعد؟' },
    answer: {
      en: 'Most specialties offer same-week appointments, and our urgent-care desk can arrange same-day consultations when clinically needed.',
      ar: 'معظم التخصصات توفر مواعيد خلال نفس الأسبوع، وقسم الرعاية العاجلة يرتب استشارات في نفس اليوم عند الحاجة.',
    },
  },
  {
    question: { en: 'Do you treat international patients?', ar: 'هل تقدمون رعاية للمرضى الدوليين؟' },
    answer: {
      en: 'Yes — our international patient office handles visas, airport transfers, interpreters, and telemedicine follow-ups after you return home.',
      ar: 'نعم — مكتب المرضى الدوليين يتولى التأشيرات والانتقالات والمترجمين والمتابعة عن بُعد بعد عودتك.',
    },
  },
  {
    question: { en: 'Can I get a cost estimate before treatment?', ar: 'هل يمكن الحصول على تقدير التكلفة قبل العلاج؟' },
    answer: {
      en: 'Absolutely. After your consultation we provide a transparent, itemized estimate — no hidden fees, ever.',
      ar: 'بالتأكيد. بعد الاستشارة نقدم تقديرًا شفافًا ومفصلًا — بدون أي رسوم خفية أبدًا.',
    },
  },
  {
    question: { en: 'Is emergency care available 24/7?', ar: 'هل رعاية الطوارئ متاحة على مدار الساعة؟' },
    answer: {
      en: 'Yes. Our emergency department is open 24/7 with on-site trauma, cardiac, and stroke teams ready at all times.',
      ar: 'نعم. قسم الطوارئ مفتوح 24/7 مع فرق إصابات وقلب وجُلع جاهزة في كل الأوقات.',
    },
  },
];

export const stats = [
  { value: 25, suffix: '+', label: { en: 'Years of Excellence', ar: 'سنة من التميز' } },
  { value: 120, suffix: '+', label: { en: 'Specialist Doctors', ar: 'طبيبًا أخصائيًا' } },
  { value: 50, suffix: 'K+', label: { en: 'Patients Treated Yearly', ar: 'مريض سنويًا' } },
  { value: 98, suffix: '%', label: { en: 'Patient Satisfaction', ar: 'رضا المرضى' } },
];

export const whyUs = [
  {
    icon: 'award',
    title: { en: 'Internationally Accredited', ar: 'اعتماد دولي' },
    desc: { en: 'JCI-accredited pathways and internationally trained consultants.', ar: 'مسارات معتمدة من JCI واستشاريون مدربون عالميًا.' },
  },
  {
    icon: 'clock',
    title: { en: 'Zero Waiting Time', ar: 'بلا انتظار' },
    desc: { en: 'Guaranteed on-time appointments with our punctuality promise.', ar: 'مواعيد مضمونة في وقتها مع وعدنا بالدقة.' },
  },
  {
    icon: 'shield-check',
    title: { en: 'Safety First', ar: 'السلامة أولًا' },
    desc: { en: 'Hospital-grade sterilization and smart patient-safety systems.', ar: 'تعقيم بمستوى المستشفيات وأنظمة ذكية لسلامة المرضى.' },
  },
  {
    icon: 'heart-handshake',
    title: { en: 'Human-Centered Care', ar: 'رعاية إنسانية' },
    desc: { en: 'Coordinators, interpreters, and follow-up calls for every patient.', ar: 'منسقون ومترجمون ومكالمات متابعة لكل مريض.' },
  },
];

export const insurance = [
  'Aetna', 'Cigna', 'Bupa', 'Allianz', 'MetLife', 'AXA', 'Vitality', 'Prudential', 'GlobeMed', 'MedNet',
];

export const timeline = [
  { year: '2001', text: { en: 'Founded as a 30-bed specialty clinic', ar: 'التأسيس كعيادة متخصصة بـ 30 سريرًا' } },
  { year: '2010', text: { en: 'Opened the first robotic-surgery suite in the region', ar: 'افتتاح أول غرفة جراحة بالروبوت في المنطقة' } },
  { year: '2018', text: { en: 'JCI accreditation with Gold Seal of Approval', ar: 'اعتماد JCI مع الختم الذهبي' } },
  { year: '2024', text: { en: 'Launched the AI-assisted diagnostics center', ar: 'إطلاق مركز التشخيص بمساعدة الذكاء الاصطناعي' } },
];
