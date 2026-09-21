import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Check,
  Camera,
  Printer,
  FileText,
  User,
  Home,
  MapPin,
  CreditCard,
  Award
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { getFormConfig } from '../../utils/formConfig';

const admissionSchema = z.object({
  // Student & Family
  studentName: z.string().min(2, "Student's name must be at least 2 characters"),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),

  // Present Address
  presentDivision: z.string().min(2, 'Division/Area is required'),
  presentDistrict: z.string().min(2, 'District/City is required'),
  presentAddress: z.string().min(5, 'Full address is required'),

  // Permanent Address
  sameAsPresent: z.boolean().optional(),
  permanentDivision: z.string().optional(),
  permanentDistrict: z.string().optional(),
  permanentAddress: z.string().optional(),

  // Personal Profile
  phone: z.string().min(10, 'Valid 10-digit phone is required'),
  email: z.string().email('Invalid email address'),
  occupation: z.string().min(2, "Parent's occupation is required"),
  religion: z.string().optional(),
  nationality: z.string().optional(),
  nidNumber: z.string().optional(),
  bloodGroup: z.string().optional(),
  maritalStatus: z.string().optional(),

  // Academic Course
  previousSchool: z.string().min(2, 'Previous school/college is required'),
  standard: z.string().min(1, 'Please select a standard'),
  stream: z.string().optional(),

  // Declaration & Signatures
  declarationAccepted: z.boolean().refine(val => val === true, {
    message: 'Please accept the declaration',
  }),
  studentSignature: z.string().min(2, "Student's signature name is required"),
  parentSignature: z.string().min(2, "Parent's / Authorized signature is required"),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

export function AdmissionFormPage() {
  const [config, setConfig] = useState(() => getFormConfig('admission'));

  useEffect(() => {
    const handleUpdate = () => setConfig(getFormConfig('admission'));
    window.addEventListener('vt_form_configs_updated', handleUpdate);
    return () => window.removeEventListener('vt_form_configs_updated', handleUpdate);
  }, []);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramStandard = searchParams.get('standard');
  const paramStream = searchParams.get('stream');

  useEffect(() => {
    if (searchParams.get('print') === 'true') {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [error, setError] = useState('');

  // Passport Photo State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Subject enrollment type: All vs Particular
  const [enrollmentType, setEnrollmentType] = useState<'ALL_SUBJECTS' | 'INDIVIDUAL_SUBJECTS'>('ALL_SUBJECTS');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [sameAsPresent, setSameAsPresent] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      gender: 'Male',
      sameAsPresent: true,
      standard:
        paramStandard && ['6th', '7th', '8th', '9th', '10th', '11th', '12th'].includes(paramStandard)
          ? paramStandard
          : '10th',
      stream: paramStream && ['Science', 'Commerce'].includes(paramStream) ? paramStream : 'Science',
      declarationAccepted: true,
    },
  });

  const selectedStandard = watch('standard');
  const selectedStream = watch('stream');
  const watchPresentDivision = watch('presentDivision');
  const watchPresentDistrict = watch('presentDistrict');
  const watchPresentAddress = watch('presentAddress');

  const showStream = ['11th', '12th'].includes(selectedStandard || '');

  // Dynamic Subjects
  const availableSubjects = useMemo(() => {
    if (['6th', '7th', '8th'].includes(selectedStandard)) {
      return ['Maths', 'Science', 'History', 'Geography', 'English', 'Hindi', 'Marathi'];
    }
    if (['9th', '10th'].includes(selectedStandard)) {
      return [
        'Maths 1',
        'Maths 2',
        'Science 1',
        'Science 2',
        'History',
        'Geography',
        'English',
        'Hindi',
        'Marathi',
        'Tamil',
      ];
    }
    if (['11th', '12th'].includes(selectedStandard)) {
      if (selectedStream === 'Commerce') {
        return ['Book Keeping - Accountancy', 'OCM', 'Maths 1', 'Maths 2', 'Economics', 'English', 'SP'];
      }
      return [
        'Physics',
        'Chemistry',
        'Mathematics',
        'Biology',
        'English',
        'PCM Combination',
        'PCB Combination',
        'PCMB Combination',
      ];
    }
    return [];
  }, [selectedStandard, selectedStream]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        setPhotoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSameAsPresentToggle = (checked: boolean) => {
    setSameAsPresent(checked);
    if (checked) {
      setValue('permanentDivision', watchPresentDivision || '');
      setValue('permanentDistrict', watchPresentDistrict || '');
      setValue('permanentAddress', watchPresentAddress || '');
    }
  };

  const onSubmit = async (data: AdmissionFormData) => {
    if (enrollmentType === 'INDIVIDUAL_SUBJECTS' && selectedSubjects.length === 0) {
      setError('Please select at least one subject for individual enrollment.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        ...data,
        permanentDivision: sameAsPresent ? data.presentDivision : data.permanentDivision || data.presentDivision,
        permanentDistrict: sameAsPresent ? data.presentDistrict : data.permanentDistrict || data.presentDistrict,
        permanentAddress: sameAsPresent ? data.presentAddress : data.permanentAddress || data.presentAddress,
        enrollmentType,
        subjects: enrollmentType === 'ALL_SUBJECTS' ? ['All Subjects', ...availableSubjects] : selectedSubjects,
        photoUrl: photoPreview,
      };

      const res = await apiClient.post('/api/admissions/apply', payload);
      setSubmittedData({ ...payload, applicationId: res.data?.applicationId });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit admission application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (success && submittedData) {
    return (
      <div className="min-h-[100dvh] bg-[#070b13] py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-surface max-w-2xl w-full rounded-3xl p-6 sm:p-12 text-center shadow-2xl border border-outline-variant/30 print:border-none print:shadow-none print:p-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/logo.svg?v=1783890290950"
              alt="Vidhya Tutorials Logo"
              className="h-10 sm:h-12 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
            <span className="text-xl sm:text-2xl font-black text-on-surface uppercase tracking-tight font-[var(--font-display)]">
              VIDHYA TUTORIALS
            </span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
            Official Admission Receipt
          </span>

          <h2 className="text-xl sm:text-3xl font-black text-on-surface mt-3 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
            Thank you, <span className="font-bold text-on-surface">{submittedData.studentName}</span>. Your application has been registered with Vidhya Tutorials.
          </p>

          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-6 text-left space-y-2.5 mb-8 border border-outline-variant/20 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-on-surface-variant font-medium">Application ID:</span>
              <span className="font-mono font-bold text-primary">{submittedData.applicationId || 'VT-ADM-2026'}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-on-surface-variant font-medium">Student Name:</span>
              <span className="font-bold text-on-surface">{submittedData.studentName}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-on-surface-variant font-medium">Parents:</span>
              <span className="text-on-surface">{submittedData.fatherName} & {submittedData.motherName}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-on-surface-variant font-medium">Standard / Wing:</span>
              <span className="font-bold text-on-surface">{submittedData.standard} {submittedData.stream ? `(${submittedData.stream})` : ''}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <span className="text-on-surface-variant font-medium">Enrollment:</span>
              <span className="text-on-surface font-semibold">
                {submittedData.enrollmentType === 'ALL_SUBJECTS' ? 'All Subjects' : 'Particular Subjects'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-medium">Branch:</span>
              <span className="text-on-surface">Matunga Road, Mumbai - 400016</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-left mb-6 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <Check className="w-4 h-4 shrink-0" />
              <span>Notification Sent to Vidhya Tutorials Desk via Email & WhatsApp!</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Our academic counselor will contact you shortly. You can also send your application details directly to our official WhatsApp helpline for faster processing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center print:hidden">
            <a
              href={`https://wa.me/${config.helplineWhatsApp?.replace(/[^0-9]/g, '') || '918898117343'}?text=${encodeURIComponent(
                `*New Admission Form Submitted!*\n\nApplication ID: ${submittedData.applicationId || 'VT-ADM-2026'}\nStudent Name: ${submittedData.studentName}\nClass: ${submittedData.standard} ${submittedData.stream ? `(${submittedData.stream})` : ''}\nPhone: ${submittedData.phone}\n\nKindly confirm my enrollment and counseling slot with Vikas Sir.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer shadow-md"
            >
              <span>Notify Center via WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Application</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer shadow-md"
            >
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-surface-container-lowest py-6 sm:py-10 px-3 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white">
      <div className="max-w-4xl mx-auto print:max-w-none print:w-full">

        {/* Back Link & Quick Actions */}
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg"
              title="Print blank admission form or pre-filled application"
            >
              <Printer className="w-4 h-4" />
              <span>Print Form / PDF</span>
            </button>
            <span className="text-[11px] sm:text-xs text-on-surface-variant font-medium hidden sm:inline">
              {config.sessionTag || 'Academic Session 2026–2027'}
            </span>
          </div>
        </div>

        {/* ── Official Admission Form Sheet (Responsive Desktop & Mobile) ── */}
        <div className="bg-surface rounded-2xl sm:rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden print:border-none print:shadow-none print:rounded-none print:bg-white">

          {/* Top Accent Strip */}
          <div className="h-2.5 bg-gradient-to-r from-primary to-blue-600 w-full print:hidden" />

          <div className="p-4 sm:p-8 md:p-12 print:p-2 print:text-black">

            {/* ── Letterhead Header: Exact Website Logo + Strictly "VIDHYA TUTORIALS" + Photo Box ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 pb-6 border-b-2 border-outline-variant/30">
              
              {/* Exact Vidhya Tutorials Logo from Website + ONLY "VIDHYA TUTORIALS" */}
              <div className="flex items-center gap-3.5 sm:gap-5 w-full sm:w-auto justify-center sm:justify-start">
                <img
                  src="/logo.svg?v=1783890290950"
                  alt="Vidhya Tutorials Logo"
                  className="h-12 sm:h-16 w-auto object-contain shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-on-surface tracking-tight uppercase font-[var(--font-display)]">
                  VIDHYA TUTORIALS
                </h1>
              </div>

              {/* Right: Passport Photo Box (Aligned on desktop, stacked on mobile) */}
              <div className="relative shrink-0">
                <div className="w-28 h-32 sm:w-32 sm:h-36 border-2 border-dashed border-outline-variant/70 rounded-xl flex flex-col items-center justify-center text-center p-2 bg-surface-container-low hover:border-primary transition-all overflow-hidden cursor-pointer shadow-xs">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Student"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-on-surface-variant/70 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant leading-tight">
                        Affix Photo
                      </span>
                      <span className="text-[8px] text-on-surface-variant/60 mt-0.5">
                        Passport Size
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer print:hidden"
                    title="Upload passport photograph"
                  />
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="text-center my-5 sm:my-6">
              <span className="inline-block border-y-2 border-primary/40 print:border-black py-1 px-8 font-black text-base sm:text-xl tracking-widest text-primary print:text-black uppercase">
                ADMISSION FORM
              </span>
              <div className="flex items-center justify-center gap-2 mt-3 print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface shadow-xs transition-colors cursor-pointer hover:border-primary/40"
                  title="Print blank form for offline submission or print pre-filled"
                >
                  <Printer className="w-3.5 h-3.5 text-primary" />
                  <span>Print Blank / Filled Form</span>
                </button>
                <span className="text-[11px] text-on-surface-variant hidden sm:inline">
                  (Fill online or print blank to submit offline at Matunga Road center)
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs sm:text-sm font-semibold flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">

              {/* ── 1. Student & Parents Identity ── */}
              <div className="space-y-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                  <User className="w-4 h-4" />
                  <span>1. Student & Family Information</span>
                </h3>

                {/* Desktop: Grid / Mobile: Stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 items-center">
                  <label className="text-xs sm:text-sm font-bold text-on-surface">
                    Student's Full Name <span className="text-error">*</span>
                  </label>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sanjay Verma"
                      {...register('studentName')}
                      className={`w-full bg-surface-container-low border ${
                        errors.studentName ? 'border-error ring-1 ring-error' : 'border-outline-variant/40 focus:border-primary'
                      } rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all`}
                    />
                    {errors.studentName && (
                      <span className="text-xs text-error font-semibold mt-1 block">{errors.studentName.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 items-center">
                  <label className="text-xs sm:text-sm font-bold text-on-surface">
                    Father's Name <span className="text-error">*</span>
                  </label>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Father's full name"
                      {...register('fatherName')}
                      className={`w-full bg-surface-container-low border ${
                        errors.fatherName ? 'border-error ring-1 ring-error' : 'border-outline-variant/40 focus:border-primary'
                      } rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all`}
                    />
                    {errors.fatherName && (
                      <span className="text-xs text-error font-semibold mt-1 block">{errors.fatherName.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 items-center">
                  <label className="text-xs sm:text-sm font-bold text-on-surface">
                    Mother's Name <span className="text-error">*</span>
                  </label>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Mother's full name"
                      {...register('motherName')}
                      className={`w-full bg-surface-container-low border ${
                        errors.motherName ? 'border-error ring-1 ring-error' : 'border-outline-variant/40 focus:border-primary'
                      } rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all`}
                    />
                    {errors.motherName && (
                      <span className="text-xs text-error font-semibold mt-1 block">{errors.motherName.message}</span>
                    )}
                  </div>
                </div>

                {/* Date of Birth + Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-on-surface block mb-1">
                      Birth Date (DD/MM/YYYY) <span className="text-error">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('dob')}
                      className={`w-full bg-surface-container-low border ${
                        errors.dob ? 'border-error ring-1 ring-error' : 'border-outline-variant/40 focus:border-primary'
                      } rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all`}
                    />
                    {errors.dob && <span className="text-xs text-error font-semibold mt-0.5 block">{errors.dob.message}</span>}
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-on-surface block mb-1">
                      Gender <span className="text-error">*</span>
                    </label>
                    <div className="flex gap-4 pt-1.5">
                      {['Male', 'Female', 'Other'].map(g => (
                        <label key={g} className="flex items-center gap-1.5 text-sm font-medium text-on-surface cursor-pointer">
                          <input
                            type="radio"
                            value={g}
                            {...register('gender')}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 2. Present Address & Permanent Address (Side by Side on Desktop, Stacked on Mobile) ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Present Address Box */}
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-outline-variant/60 bg-surface-container-low/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5 border-b border-outline-variant/20 pb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>Present Address</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                        Division / Area *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Matunga Road, Mumbai"
                        {...register('presentDivision')}
                        className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                      {errors.presentDivision && (
                        <span className="text-[11px] text-error font-semibold mt-0.5 block">{errors.presentDivision.message}</span>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                        District / City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        {...register('presentDistrict')}
                        className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                      {errors.presentDistrict && (
                        <span className="text-[11px] text-error font-semibold mt-0.5 block">{errors.presentDistrict.message}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                      Full Address / Street / House No. *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Room No 12, Kumbharwada, Opp. BMC School"
                      {...register('presentAddress')}
                      className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    {errors.presentAddress && (
                      <span className="text-[11px] text-error font-semibold mt-0.5 block">{errors.presentAddress.message}</span>
                    )}
                  </div>
                </div>

                {/* Permanent Address Box */}
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-outline-variant/60 bg-surface-container-low/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-primary" />
                      <span>Permanent Address</span>
                    </h4>

                    <label className="flex items-center gap-1.5 text-xs font-bold text-primary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPresent}
                        onChange={e => handleSameAsPresentToggle(e.target.checked)}
                        className="w-3.5 h-3.5 text-primary rounded"
                      />
                      <span>Same as Present</span>
                    </label>
                  </div>

                  {!sameAsPresent ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                            Division / Area
                          </label>
                          <input
                            type="text"
                            placeholder="Native Place Division"
                            {...register('permanentDivision')}
                            className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                            District / State
                          </label>
                          <input
                            type="text"
                            placeholder="District / State"
                            {...register('permanentDistrict')}
                            className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                          Full Permanent Address
                        </label>
                        <input
                          type="text"
                          placeholder="House, Street, Village"
                          {...register('permanentAddress')}
                          className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="py-5 text-center text-xs text-on-surface-variant font-medium">
                      ✓ Same as Present Address selected.
                    </div>
                  )}
                </div>
              </div>

              {/* ── 3. Personal Profile & Identification ── */}
              <div className="space-y-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                  <CreditCard className="w-4 h-4" />
                  <span>3. Personal Profile & Identification</span>
                </h3>

                {/* 3 columns on desktop, 2 on tablet, 1 on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      {...register('phone')}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    {errors.phone && <span className="text-[11px] text-error font-semibold mt-0.5 block">{errors.phone.message}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="student@gmail.com"
                      {...register('email')}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    {errors.email && <span className="text-[11px] text-error font-semibold mt-0.5 block">{errors.email.message}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface block mb-1">
                      Parent's Occupation *
                    </label>
                    <input
                      type="text"
                      placeholder="Business / Service"
                      {...register('occupation')}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    {errors.occupation && (
                      <span className="text-[11px] text-error font-semibold mt-0.5 block">{errors.occupation.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface block mb-1">
                    Previous School / College Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Our Lady of Good Counsel High School / SIES College"
                    {...register('previousSchool')}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  {errors.previousSchool && (
                    <span className="text-[11px] text-error font-semibold mt-0.5 block">{errors.previousSchool.message}</span>
                  )}
                </div>
              </div>

              {/* ── 4. Course & Subject Enrollment ── */}
              <div className="space-y-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                  <Award className="w-4 h-4" />
                  <span>4. Course & Subject Enrollment</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface block mb-1">
                      Class / Standard Enrolling For *
                    </label>
                    <select
                      {...register('standard')}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm font-bold outline-none focus:border-primary text-on-surface"
                    >
                      <option value="6th">Class 6th (School Section)</option>
                      <option value="7th">Class 7th (School Section)</option>
                      <option value="8th">Class 8th (School Section)</option>
                      <option value="9th">Class 9th (SSC Board Prep)</option>
                      <option value="10th">Class 10th (SSC Board Champions)</option>
                      <option value="11th">Class 11th (Junior College)</option>
                      <option value="12th">Class 12th (HSC Board & CET/NEET)</option>
                    </select>
                  </div>

                  {showStream && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-on-surface block mb-1">
                        Stream (11th & 12th) *
                      </label>
                      <select
                        {...register('stream')}
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm font-bold outline-none focus:border-primary text-on-surface"
                      >
                        <option value="Science">Science (PCM / PCB / PCMB - NEET & CET)</option>
                        <option value="Commerce">Commerce (Accounts, OCM, Economics, SP)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Subject Selection Option */}
                <div className="p-4 sm:p-5 rounded-2xl border border-outline-variant/40 bg-surface-container-low space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-on-surface">Subject Selection Option</h4>
                      <p className="text-[11px] sm:text-xs text-on-surface-variant">
                        Enroll in complete board package or select specific subjects.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEnrollmentType('ALL_SUBJECTS')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          enrollmentType === 'ALL_SUBJECTS'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                        }`}
                      >
                        All Subjects
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEnrollmentType('INDIVIDUAL_SUBJECTS');
                          if (selectedSubjects.length === 0) setSelectedSubjects([...availableSubjects]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          enrollmentType === 'INDIVIDUAL_SUBJECTS'
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-surface text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                        }`}
                      >
                        Particular Subjects
                      </button>
                    </div>
                  </div>

                  {enrollmentType === 'ALL_SUBJECTS' ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Enrolled in All Subjects: Covers complete syllabus, Sunday mock test series, and personalized doubt clearing.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-on-surface">Select individual subjects needed:</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedSubjects([...availableSubjects])}
                            className="text-primary hover:underline font-semibold"
                          >
                            Select All
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setSelectedSubjects([])}
                            className="text-on-surface-variant hover:underline font-semibold"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
                        {availableSubjects.map(sub => {
                          const isChecked = selectedSubjects.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => toggleSubject(sub)}
                              className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-primary/10 border-primary text-primary shadow-xs'
                                  : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
                              }`}
                            >
                              <span className="truncate pr-1">{sub}</span>
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                                  isChecked ? 'bg-primary border-primary text-white' : 'border-outline-variant/60'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── 5. DECLARATION ── */}
              <div className="p-4 sm:p-6 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-2.5 text-center">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary">
                  DECLARATION
                </h4>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-serif italic max-w-2xl mx-auto">
                  "I hereby declare that all the information provided above is true and accurate. I will obey all the rules and regulations of the institution and be fully responsible for violating the rules."
                </p>

                <div className="flex justify-center pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      {...register('declarationAccepted')}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span>I agree to the declaration</span>
                  </label>
                </div>
                {errors.declarationAccepted && (
                  <span className="text-xs text-error font-semibold block">{errors.declarationAccepted.message}</span>
                )}
              </div>

              {/* ── 6. Signatures (Side by side on desktop, stacked on mobile) ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2 border-t border-outline-variant/20">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    Student's Signature (Type Name) *
                  </label>
                  <input
                    type="text"
                    placeholder="Student's signature name"
                    {...register('studentSignature')}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant/60 focus:border-primary px-3 py-2 text-sm font-serif italic outline-none"
                  />
                  <span className="text-[10px] text-on-surface-variant block mt-1">Student's Signature</span>
                  {errors.studentSignature && (
                    <span className="text-xs text-error font-semibold mt-0.5 block">{errors.studentSignature.message}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    Authorized's / Parent's Signature (Type Name) *
                  </label>
                  <input
                    type="text"
                    placeholder="Parent's signature name"
                    {...register('parentSignature')}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant/60 focus:border-primary px-3 py-2 text-sm font-serif italic outline-none"
                  />
                  <span className="text-[10px] text-on-surface-variant block mt-1">Authorized's Signature</span>
                  {errors.parentSignature && (
                    <span className="text-xs text-error font-semibold mt-0.5 block">{errors.parentSignature.message}</span>
                  )}
                </div>
              </div>

              {/* Official Office Use Section (Visible on Print) */}
              <div className="hidden print:block border-2 border-dashed border-gray-400 p-4 rounded-xl mt-6 text-xs text-gray-800 break-inside-avoid">
                <div className="font-bold uppercase tracking-wider text-center border-b border-gray-300 pb-1 mb-3">
                  FOR OFFICE USE ONLY — VIDHYA TUTORIALS
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div><span className="font-semibold">Application No:</span> _________________</div>
                  <div><span className="font-semibold">Batch / Wing:</span> _________________</div>
                  <div><span className="font-semibold">Fee Receipt No:</span> _________________</div>
                  <div><span className="font-semibold">Admission Date:</span> ____/____/2026</div>
                </div>
                <div className="flex justify-between items-end mt-6 pt-2">
                  <div><span className="font-semibold">Counselor / Clerk Sign:</span> _________________</div>
                  <div><span className="font-semibold">Center Head / Authorized Sign:</span> _________________</div>
                </div>
              </div>

              {/* Printed Institute Contact Footer */}
              <div className="hidden print:block pt-3 border-t border-gray-300 text-[10px] text-center text-gray-600">
                Vidhya Tutorials • Matunga Road, Mumbai - 400016 • Tel: +91 99871 18369 / +91 93247 18369
              </div>

              {/* ── Submit & Print Buttons Row (Screen only) ── */}
              <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <div className="text-[11px] sm:text-xs text-on-surface-variant text-center sm:text-left">
                  Matunga Road, Mumbai - 400016
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    title="Print form as PDF or physical copy"
                  >
                    <Printer className="w-4 h-4 text-primary" />
                    <span>Print Form</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Admission...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Submit Admission Form</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
