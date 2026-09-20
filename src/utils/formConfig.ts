import { apiClient } from '../api/apiClient';

export interface BaseFormConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  sessionTag: string;
  helplinePhone: string;
  helplineWhatsApp: string;
  successMessage: string;
  standards: string[];
  noticeText?: string;
  customFields?: { [key: string]: any };
}

export interface WebsiteFormsConfig {
  admission: BaseFormConfig & {
    streams: string[];
    declarationText: string;
  };
  enquiry: BaseFormConfig & {
    topics: string[];
  };
  freeDemo: BaseFormConfig & {
    subjects: string[];
    timeSlots: string[];
  };
  counseling: BaseFormConfig & {
    counselingModes: string[];
    discussionFocusList: string[];
    timeSlots: string[];
  };
  admissionPopup: BaseFormConfig & {
    autoPopupEnabled: boolean;
    floatingBadgeEnabled: boolean;
    popupDelaySeconds: number;
  };
}

export const DEFAULT_FORM_CONFIGS: WebsiteFormsConfig = {
  admission: {
    id: 'admission',
    name: 'Online Admission Application Form',
    title: 'Student Admission Application Form',
    subtitle: 'Official admission form for Academic Year 2026–2027. Fill details accurately.',
    enabled: true,
    sessionTag: 'Session 2026–2027',
    helplinePhone: '+91 88981 17343',
    helplineWhatsApp: '918898117343',
    successMessage: 'Admission application submitted successfully! Our counseling team will contact you shortly.',
    standards: [
      '8th Standard',
      '9th Standard',
      '10th SSC Board',
      '11th Science',
      '12th Science (HSC)',
      '11th Commerce',
      '12th Commerce',
      'MHT-CET / NEET / JEE Special'
    ],
    streams: ['General School (8th-10th)', 'Science (PCM / PCB / PCMB)', 'Commerce (Accounts / Stats)'],
    declarationText: 'I hereby declare that all the information provided above is true and complete to the best of my knowledge.',
    noticeText: 'Physical verification of original documents will be scheduled after online review.'
  },
  enquiry: {
    id: 'enquiry',
    name: 'Quick Admission & Fee Enquiry Modal',
    title: 'Inquire for Admission',
    subtitle: 'Get fee structures, batch schedules, syllabus plan, and counseling details.',
    enabled: true,
    sessionTag: 'Academic Session 2026–2027',
    helplinePhone: '+91 88981 17343',
    helplineWhatsApp: '918898117343',
    successMessage: 'Thank you! Your enquiry has been received. Our senior counselor will call you within 2 hours.',
    standards: [
      '8th Standard',
      '9th Standard',
      '10th Standard (SSC / CBSE)',
      '11th Science',
      '12th Science',
      '11th Commerce',
      '12th Commerce',
      'NEET / JEE Crash Course'
    ],
    topics: [
      'Admission Eligibility & Fee Details',
      'Batches & Timing Information',
      'Science Wing (Physics, Chem, Maths, Bio)',
      'Commerce Wing (Accounts, Economics, OCM)',
      'Scholarship & Concession Test'
    ],
    noticeText: 'Zero commitment enquiry. Our academic counselors will provide clear batch fees and schedule.'
  },
  freeDemo: {
    id: 'freeDemo',
    name: 'Free Demo Class Booking Modal',
    title: 'Book a Free Demo Class',
    subtitle: 'Experience classroom teaching quality firsthand with Vikas Sir & Senior Faculty.',
    enabled: true,
    sessionTag: '100% Free Demo Session',
    helplinePhone: '+91 88981 17343',
    helplineWhatsApp: '918898117343',
    successMessage: 'Demo class booked! Our coordinator will confirm your seat timing via WhatsApp/SMS.',
    standards: [
      '8th Standard',
      '9th Standard',
      '10th Standard',
      '11th Science',
      '12th Science',
      '11th Commerce',
      '12th Commerce'
    ],
    subjects: [
      'Mathematics & Science',
      'Physics & Chemistry',
      'Biology Special',
      'Accounts & Economics',
      'Full Syllabus Overview'
    ],
    timeSlots: [
      'Weekday Evening (5:00 PM - 8:00 PM)',
      'Weekday Morning (8:00 AM - 11:00 AM)',
      'Weekend Special Batch (Sat / Sun)'
    ],
    noticeText: 'Demo attendees receive complimentary chapter worksheets & formula handbook.'
  },
  counseling: {
    id: 'counseling',
    name: '1-on-1 Academic Counseling Form',
    title: 'Book 1-on-1 Academic Counseling',
    subtitle: 'Personalized career evaluation, board strategy, and score improvement consultation.',
    enabled: true,
    sessionTag: 'Director Mentorship Desk',
    helplinePhone: '+91 88981 17343',
    helplineWhatsApp: '918898117343',
    successMessage: 'Counseling slot requested! Our advisory team will reach out to lock in your appointment time.',
    standards: [
      '8th - 10th School Wing',
      '10th Board Appearing',
      '11th Science Stream',
      '12th HSC / MHT-CET',
      '11th - 12th Commerce'
    ],
    counselingModes: [
      'In-Person at Center (90 Feet Rd, Dharavi)',
      'Online Video Consultation (Google Meet)'
    ],
    discussionFocusList: [
      'Board Strategy & Score Improvement',
      'Science Stream Selection Guidance (PCM vs PCB)',
      'Commerce Career Roadmap (CA / CS / BBA)',
      'Parent-Teacher Academic Assessment'
    ],
    timeSlots: [
      'Evening (5:00 PM - 8:00 PM)',
      'Morning (10:00 AM - 1:00 PM)',
      'Sunday Dedicated Session'
    ],
    noticeText: 'Parents are strongly encouraged to accompany students for counseling sessions.'
  },
  admissionPopup: {
    id: 'admissionPopup',
    name: 'Quick Admission Popup & Floating Badge',
    title: 'Admissions Open for AY 2026–2027',
    subtitle: 'Limited seats per batch to guarantee individual attention. Inquire now!',
    enabled: true,
    autoPopupEnabled: true,
    floatingBadgeEnabled: true,
    popupDelaySeconds: 2,
    sessionTag: 'Admission Open',
    helplinePhone: '+91 88981 17343',
    helplineWhatsApp: '918898117343',
    successMessage: 'Thank you! We will get in touch with you right away.',
    standards: [
      '8th Standard',
      '9th Standard',
      '10th SSC / CBSE',
      '11th Science',
      '12th Science',
      '11th Commerce',
      '12th Commerce'
    ],
    noticeText: 'Early-bird admission privileges apply for registrations completed this week.'
  }
};

const STORAGE_KEY = 'vt_all_website_form_configs_v1';

export function getAllFormConfigs(): WebsiteFormsConfig {
  let result: WebsiteFormsConfig = { ...DEFAULT_FORM_CONFIGS };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      result = {
        ...DEFAULT_FORM_CONFIGS,
        ...parsed,
        admission: { ...DEFAULT_FORM_CONFIGS.admission, ...(parsed.admission || {}) },
        enquiry: { ...DEFAULT_FORM_CONFIGS.enquiry, ...(parsed.enquiry || {}) },
        freeDemo: { ...DEFAULT_FORM_CONFIGS.freeDemo, ...(parsed.freeDemo || {}) },
        counseling: { ...DEFAULT_FORM_CONFIGS.counseling, ...(parsed.counseling || {}) },
        admissionPopup: { ...DEFAULT_FORM_CONFIGS.admissionPopup, ...(parsed.admissionPopup || {}) },
      };
    }
  } catch (err) {
    console.error('Failed to load form configs from storage:', err);
  }

  // Strictly sync legacy widget toggle
  try {
    const legacyToggle = localStorage.getItem('vt_floating_admission_button');
    if (legacyToggle === 'false') {
      result.admissionPopup.floatingBadgeEnabled = false;
    } else if (legacyToggle === 'true') {
      result.admissionPopup.floatingBadgeEnabled = true;
    }
  } catch (e) {
    // browser-only
  }

  return result;
}

export function getFormConfig<K extends keyof WebsiteFormsConfig>(formKey: K): WebsiteFormsConfig[K] {
  const configs = getAllFormConfigs();
  return configs[formKey];
}

export function saveFormConfig<K extends keyof WebsiteFormsConfig>(formKey: K, config: WebsiteFormsConfig[K]): void {
  const all = getAllFormConfigs();
  all[formKey] = config;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // Also sync floating button key for backward compatibility
  if (formKey === 'admissionPopup') {
    const popupCfg = config as any;
    const isBadgeEnabled = popupCfg.floatingBadgeEnabled !== false && popupCfg.enabled !== false;
    localStorage.setItem('vt_floating_admission_button', String(isBadgeEnabled));
  }

  // Dispatch custom event for immediate UI reflection in open components
  window.dispatchEvent(new CustomEvent('vt_form_configs_updated', { detail: { formKey, config } }));
  window.dispatchEvent(new Event('vt_admin_setting_changed'));

  // Sync to backend server
  apiClient.put('/api/appointments/configs', all).catch((err) => {
    console.warn('Could not sync form configs to backend API:', err.message);
  });
}

export function saveAllFormConfigs(allConfigs: WebsiteFormsConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allConfigs));
  window.dispatchEvent(new CustomEvent('vt_form_configs_updated', { detail: { all: true } }));
  window.dispatchEvent(new Event('vt_admin_setting_changed'));

  apiClient.put('/api/appointments/configs', allConfigs).catch((err) => {
    console.warn('Could not sync form configs to backend API:', err.message);
  });
}

export function resetFormConfig<K extends keyof WebsiteFormsConfig>(formKey: K): WebsiteFormsConfig[K] {
  const defaultConfig = DEFAULT_FORM_CONFIGS[formKey];
  saveFormConfig(formKey, defaultConfig);
  return defaultConfig;
}

export async function fetchServerFormConfigs(): Promise<WebsiteFormsConfig | null> {
  try {
    const { data } = await apiClient.get('/api/appointments/configs');
    if (data?.data && Object.keys(data.data).length > 0) {
      const merged = {
        ...DEFAULT_FORM_CONFIGS,
        ...data.data,
        admission: { ...DEFAULT_FORM_CONFIGS.admission, ...(data.data.admission || {}) },
        enquiry: { ...DEFAULT_FORM_CONFIGS.enquiry, ...(data.data.enquiry || {}) },
        freeDemo: { ...DEFAULT_FORM_CONFIGS.freeDemo, ...(data.data.freeDemo || {}) },
        counseling: { ...DEFAULT_FORM_CONFIGS.counseling, ...(data.data.counseling || {}) },
        admissionPopup: { ...DEFAULT_FORM_CONFIGS.admissionPopup, ...(data.data.admissionPopup || {}) },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('vt_form_configs_updated', { detail: { all: true } }));
      return merged;
    }
  } catch (err) {
    // silently fallback to local
  }
  return null;
}
