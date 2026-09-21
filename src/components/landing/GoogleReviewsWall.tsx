import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, Plus, X, CheckCircle2, Sparkles, ExternalLink, Send, MessageSquare, MapPin } from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export type PinColor = 'red' | 'green' | 'pink' | 'yellow' | 'purple';

export interface StickyColorConfig {
  frontBg: string;
  backBg: string;
  textColor: string;
  quoteColor: string;
  metaColor: string;
  border: string;
  avatarBg: string;
  avatarText: string;
  pin: PinColor;
  backRotate: number;
}

export const STICKY_PALETTES: Record<string, StickyColorConfig> = {
  cream: {
    frontBg: '#FAF6EB',
    backBg: '#EEE7D3',
    textColor: '#1F1B16',
    quoteColor: '#2D261E',
    metaColor: '#6B5E4E',
    border: 'border-[#E5DEC7]',
    avatarBg: '#E8DFCA',
    avatarText: '#4A3E2A',
    pin: 'red',
    backRotate: -4,
  },
  bubblegum_pink: {
    frontBg: '#FFAED7',
    backBg: '#F295C1',
    textColor: '#260E1C',
    quoteColor: '#3B152C',
    metaColor: '#7A3A61',
    border: 'border-[#F09BC7]',
    avatarBg: '#F592C4',
    avatarText: '#4D1035',
    pin: 'green',
    backRotate: 4.5,
  },
  lavender: {
    frontBg: '#C4A1EE',
    backBg: '#AF88DE',
    textColor: '#1D122F',
    quoteColor: '#2B1A46',
    metaColor: '#5B3E88',
    border: 'border-[#B28BE0]',
    avatarBg: '#AF88DE',
    avatarText: '#371861',
    pin: 'pink',
    backRotate: -3.5,
  },
  coral_red: {
    frontBg: '#FF5757',
    backBg: '#E53E3E',
    textColor: '#FFFFFF',
    quoteColor: '#FFF5F5',
    metaColor: '#FFE0E0',
    border: 'border-[#E03A3A]',
    avatarBg: '#D93838',
    avatarText: '#FFFFFF',
    pin: 'yellow',
    backRotate: 4,
  },
  soft_pink: {
    frontBg: '#FFC2E5',
    backBg: '#F2A6D3',
    textColor: '#280E1E',
    quoteColor: '#3A182D',
    metaColor: '#7B4065',
    border: 'border-[#EFA9D1]',
    avatarBg: '#F4A9D3',
    avatarText: '#4E1138',
    pin: 'red',
    backRotate: -5,
  },
  dusty_rose: {
    frontBg: '#F08080',
    backBg: '#DE6868',
    textColor: '#FFFFFF',
    quoteColor: '#FFF5F5',
    metaColor: '#FFE3E3',
    border: 'border-[#D66161]',
    avatarBg: '#CE5B5B',
    avatarText: '#FFFFFF',
    pin: 'yellow',
    backRotate: 3.5,
  },
  mint_aqua: {
    frontBg: '#52DE97',
    backBg: '#3DC57F',
    textColor: '#0B281B',
    quoteColor: '#103524',
    metaColor: '#1D553C',
    border: 'border-[#3DC57F]',
    avatarBg: '#3DC57F',
    avatarText: '#072115',
    pin: 'pink',
    backRotate: -4,
  },
  peach_salmon: {
    frontBg: '#FFADA4',
    backBg: '#F2968B',
    textColor: '#2C1412',
    quoteColor: '#3D1D1A',
    metaColor: '#7E443F',
    border: 'border-[#EF9B91]',
    avatarBg: '#F49A90',
    avatarText: '#521A15',
    pin: 'red',
    backRotate: 4.5,
  },
  pale_sage: {
    frontBg: '#A6ECCB',
    backBg: '#90DEB6',
    textColor: '#0F2C1F',
    quoteColor: '#183D2C',
    metaColor: '#346650',
    border: 'border-[#93DEC0]',
    avatarBg: '#92DDB6',
    avatarText: '#0B271A',
    pin: 'purple',
    backRotate: -3.5,
  },
  warm_orange: {
    frontBg: '#FFA858',
    backBg: '#EF923C',
    textColor: '#2A1505',
    quoteColor: '#3B1F08',
    metaColor: '#7C4A1D',
    border: 'border-[#EE9441]',
    avatarBg: '#EE9441',
    avatarText: '#4C2304',
    pin: 'red',
    backRotate: 4,
  },
  mustard_yellow: {
    frontBg: '#EED663',
    backBg: '#DDC24B',
    textColor: '#2A2304',
    quoteColor: '#3B3108',
    metaColor: '#716117',
    border: 'border-[#DCBF42]',
    avatarBg: '#DEC24B',
    avatarText: '#453B05',
    pin: 'red',
    backRotate: -4.5,
  },
  sky_blue: {
    frontBg: '#BAE5FC',
    backBg: '#A2D6F2',
    textColor: '#0A2335',
    quoteColor: '#11324B',
    metaColor: '#2E5A7A',
    border: 'border-[#A1D4F0]',
    avatarBg: '#A3D5F1',
    avatarText: '#072134',
    pin: 'yellow',
    backRotate: 3.5,
  },
};

export const JustdialLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill="#F85A00" />
    <path
      d="M8.5 21.5V11.5H11.5V19C11.5 20.4 10.5 21.5 8.5 21.5ZM14.8 21.5V9.5H17.8V14.5C18.4 13.5 19.7 12.8 21.3 12.8C24.1 12.8 26.2 14.9 26.2 17.8C26.2 20.7 24.1 22.8 21.2 22.8C19.6 22.8 18.3 22.1 17.7 21V21.5H14.8ZM20.6 20.2C22.2 20.2 23.3 19.1 23.3 17.8C23.3 16.5 22.2 15.4 20.6 15.4C19 15.4 17.8 16.5 17.8 17.8C17.8 19.1 19 20.2 20.6 20.2Z"
      fill="#FFFFFF"
    />
  </svg>
);

export interface Review {
  id: string;
  name: string;
  role: 'Parent' | 'Student' | 'Alumni';
  detail: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  colorKey: string;
  frontRotate: number;
}

export const REAL_REVIEWS: Review[] = [
  {
    id: 'rev-jd-1',
    name: 'Vaishnavi Gangaramani',
    role: 'Student',
    detail: '11th & 12th Commerce Batch',
    rating: 5,
    date: 'Verified Justdial Review',
    comment: 'I joined Vidhya Tutorials in 11th STD and to be honest it was one of the best decisions I ever made. The teachers over here are so supportive and very helpful. Teachers like Vinayak Sir for accounts and Vikas Sir for maths & theory are great and motivating mentors. They arranged Marathi lectures for us, took regular prelims and tests, and always kept us motivated. Highly recommend to everyone!',
    likes: 58,
    colorKey: 'cream',
    frontRotate: -1.6,
  },
  {
    id: 'rev-jd-2',
    name: 'Palak Jagtap',
    role: 'Student',
    detail: '4-Year Student • Commerce Wing',
    rating: 5,
    date: 'Verified Justdial Review',
    comment: 'It was a really great experience being there for 4 years. The teaching staff is truly exceptional. From below average to average and good, they helped me improve. Vinayak Sir for accounts provided great tips and tricks, and they even arranged Marathi lectures. Highly recommended classes!',
    likes: 51,
    colorKey: 'mint_aqua',
    frontRotate: 2.2,
  },
  {
    id: 'rev-jd-3',
    name: 'Fallah Abbas',
    role: 'Student',
    detail: 'School & Junior College Batch',
    rating: 5,
    date: 'Verified Justdial Review',
    comment: 'It was an amazing journey with Vidhya Tutorials. Teachers and sir are very hardworking, they help weak students to improve and score great percentages. We not only learned subjects but also life lessons and discipline.',
    likes: 64,
    colorKey: 'lavender',
    frontRotate: -2.1,
  },
  {
    id: 'rev-jd-4',
    name: 'Hardik Tank',
    role: 'Student',
    detail: '10th Board SSC & Maths',
    rating: 5,
    date: 'Verified Justdial Review',
    comment: 'Vidhya Tutorials is the best classes in Mumbai. Vikas Sir knows how to teach Maths in the easiest way and gives personal attention to every student. Conducts prelims and practice tests regularly.',
    likes: 46,
    colorKey: 'warm_orange',
    frontRotate: 1.7,
  },
  {
    id: 'rev-jd-5',
    name: 'Prachu Sutar',
    role: 'Student',
    detail: '2 Years Classroom Batch',
    rating: 5,
    date: 'Verified Justdial Review',
    comment: 'Classes is excellent! All teachers and sir are teaching very good. Learning here is very enjoyable and easy to understand. Best coaching institute with 2 years of wonderful learning experience.',
    likes: 39,
    colorKey: 'bubblegum_pink',
    frontRotate: -1.4,
  },
  {
    id: 'rev-real-1',
    name: 'Pooja Rathod',
    role: 'Student',
    detail: '10th SSC Board • 92.4%',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Also the weak students also gets improved here, all the doubts are cleared down by all the teachers. I have never thought that I would get classes like this which gives me so much knowledge. Highly recommend Vidhya Tutorials!',
    likes: 48,
    colorKey: 'cream',
    frontRotate: -1.2,
  },
  {
    id: 'rev-real-2',
    name: 'Kishore Wankhede',
    role: 'Parent',
    detail: 'Parent of 10th SSC Student',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Vidya Tutorial is an excellent coaching institute with supportive teachers and a positive learning environment. Concepts are explained clearly, making studies easier and interesting for my son.',
    likes: 35,
    colorKey: 'bubblegum_pink',
    frontRotate: 1.5,
  },
  {
    id: 'rev-real-3',
    name: 'Shaikh Ayesha',
    role: 'Student',
    detail: '12th Science PCMB & NEET',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Best coaching at Matunga Road! The physics and chemistry faculty explains every topic from the basics. Extra doubt-clearing sessions before exams helped me gain huge confidence for NEET.',
    likes: 52,
    colorKey: 'lavender',
    frontRotate: -2.0,
  },
  {
    id: 'rev-jd-6',
    name: 'Smit Jain',
    role: 'Student',
    detail: 'Junior College Wing',
    rating: 5,
    date: 'Verified Justdial Review',
    comment: 'One of the best classes with great faculty. Mentors motivate students and teach important life lessons alongside syllabus. Regular mock tests and doubt clearing.',
    likes: 42,
    colorKey: 'sky_blue',
    frontRotate: 2.0,
  },
  {
    id: 'rev-real-4',
    name: 'Ramesh Gupta',
    role: 'Parent',
    detail: 'Parent of 12th Commerce Student',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Accounts and OCM teaching here is exceptional. Vikas Sir and team give personalized attention to every student. Weekly test papers and marks feedback helped my daughter score 91% in HSC board.',
    likes: 29,
    colorKey: 'coral_red',
    frontRotate: 1.8,
  },
  {
    id: 'rev-real-5',
    name: 'Sneha Jadhav',
    role: 'Student',
    detail: '10th Board • 94.6%',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Best coaching for 9th and 10th std. Both Maths 1 & 2 and Science 1 & 2 are covered in depth with multiple prelim test series. Teachers are always available for doubt clearing.',
    likes: 41,
    colorKey: 'soft_pink',
    frontRotate: -1.5,
  },
  {
    id: 'rev-real-6',
    name: 'Mohammad Farhan',
    role: 'Student',
    detail: 'HSC Science & MHT-CET (98.2%ile)',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'The shortcut tips and mock test analysis for MHT-CET were phenomenal. Teachers sit with you 1-on-1 until every formula and numerical doubt is 100% resolved. Truly the best classes in Mumbai.',
    likes: 63,
    colorKey: 'dusty_rose',
    frontRotate: 2.2,
  },
  {
    id: 'rev-real-7',
    name: 'Anita Kamble',
    role: 'Parent',
    detail: 'Parent of 9th Std Foundation Student',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Very disciplined institute. Attendance and performance are tracked strictly with regular parent updates. My daughter improved from 65% to 88% after joining the school section batch here.',
    likes: 37,
    colorKey: 'mint_aqua',
    frontRotate: -1.8,
  },
  {
    id: 'rev-real-8',
    name: 'Devendra Solanki',
    role: 'Alumni',
    detail: 'Commerce Wing Alumni',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Studied here for both 11th and 12th Commerce. The interactive teaching method for Economics and Accounts eliminated all board exam fear. Vidhya Tutorials is truly the best coaching at Matunga Road.',
    likes: 33,
    colorKey: 'peach_salmon',
    frontRotate: 1.4,
  },
  {
    id: 'rev-real-9',
    name: 'Reshma Patel',
    role: 'Parent',
    detail: 'Parent of 8th Std School Wing',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Friendly and motivating atmosphere. The teachers build confidence even in students who struggle with Geometry and Algebra. My daughter loves coming to class every day.',
    likes: 26,
    colorKey: 'pale_sage',
    frontRotate: -1.2,
  },
  {
    id: 'rev-real-10',
    name: 'Pradeep Sharma',
    role: 'Parent',
    detail: 'Parent of 10th SSC Student',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Best decision to enroll our child here for 10th board preparation. The test series, chapter-wise revisions, and personal mentoring by sir made a tremendous difference in board marks.',
    likes: 44,
    colorKey: 'warm_orange',
    frontRotate: 2.0,
  },
  {
    id: 'rev-real-11',
    name: 'Zoya Ansari',
    role: 'Student',
    detail: '12th Commerce • Accounts 96/100',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Joined for Book Keeping - Accountancy and Economics. The teachers are approachable and make complex balance sheets and accounts very easy to understand. Best commerce coaching!',
    likes: 39,
    colorKey: 'mustard_yellow',
    frontRotate: -2.2,
  },
  {
    id: 'rev-real-12',
    name: 'Santosh Yadav',
    role: 'Parent',
    detail: 'Parent of 7th Std Student',
    rating: 5,
    date: 'Verified Google Review',
    comment: 'Proper guidance, regular tests every Sunday, and dedicated faculty. Even in school wing, they cover every textbook subject thoroughly including languages. Very happy with the coaching quality.',
    likes: 31,
    colorKey: 'sky_blue',
    frontRotate: 1.6,
  },
];

/**
 * Photorealistic 3D Push Pin SVG matching the user's reference image
 */
export const PushPin: React.FC<{ pinColor: PinColor }> = ({ pinColor }) => {
  const pinPalettes: Record<PinColor, { headStart: string; headEnd: string; neckStart: string; neckEnd: string; highlight: string; rim: string }> = {
    red: {
      headStart: '#FF5252',
      headEnd: '#C62828',
      neckStart: '#EF5350',
      neckEnd: '#B71C1C',
      highlight: '#FFCDD2',
      rim: '#D32F2F',
    },
    green: {
      headStart: '#66BB6A',
      headEnd: '#2E7D32',
      neckStart: '#4CAF50',
      neckEnd: '#1B5E20',
      highlight: '#C8E6C9',
      rim: '#388E3C',
    },
    pink: {
      headStart: '#F06292',
      headEnd: '#AD1457',
      neckStart: '#EC407A',
      neckEnd: '#880E4F',
      highlight: '#F8BBD0',
      rim: '#C2185B',
    },
    yellow: {
      headStart: '#FFEE58',
      headEnd: '#F57F17',
      neckStart: '#FDD835',
      neckEnd: '#E65100',
      highlight: '#FFF9C4',
      rim: '#FBC02D',
    },
    purple: {
      headStart: '#BA68C8',
      headEnd: '#6A1B9A',
      neckStart: '#AB47BC',
      neckEnd: '#4A148C',
      highlight: '#E1BEE7',
      rim: '#8E24AA',
    },
  };

  const p = pinPalettes[pinColor] || pinPalettes.red;
  const uniqueId = `pin-${pinColor}-${Math.random().toString(36).substr(2, 5)}`;

  return (
    <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none filter drop-shadow-[2px_6px_4px_rgba(0,0,0,0.32)]">
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`headGrad-${uniqueId}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor={p.headStart} />
            <stop offset="85%" stopColor={p.headEnd} />
            <stop offset="100%" stopColor="#1a0000" stopOpacity="0.75" />
          </radialGradient>
          <linearGradient id={`neckGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={p.neckEnd} />
            <stop offset="30%" stopColor={p.neckStart} />
            <stop offset="65%" stopColor={p.highlight} />
            <stop offset="85%" stopColor={p.neckStart} />
            <stop offset="100%" stopColor={p.neckEnd} />
          </linearGradient>
          <radialGradient id={`flangeGrad-${uniqueId}`} cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor={p.highlight} />
            <stop offset="50%" stopColor={p.rim} />
            <stop offset="100%" stopColor={p.neckEnd} />
          </radialGradient>
          <linearGradient id={`needleGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A4A4A" />
            <stop offset="50%" stopColor="#D8D8D8" />
            <stop offset="100%" stopColor="#2B2B2B" />
          </linearGradient>
        </defs>

        {/* Needle piercing paper shadow */}
        <ellipse cx="17.5" cy="36" rx="3" ry="1.2" fill="#0f172a" fillOpacity="0.45" />

        {/* Steel needle pin */}
        <path d="M15 24 L16.5 35.5 L17 24 Z" fill={`url(#needleGrad-${uniqueId})`} />

        {/* Lower flange base collar */}
        <ellipse cx="16" cy="23.5" rx="7.5" ry="3.2" fill={`url(#flangeGrad-${uniqueId})`} />

        {/* Cylindrical waisted neck body */}
        <path d="M11 12 C11 17, 10 20, 8.5 22.5 C11 23.5, 21 23.5, 23.5 22.5 C22 20, 21 17, 21 12 Z" fill={`url(#neckGrad-${uniqueId})`} />

        {/* Top spherical dome head */}
        <ellipse cx="16" cy="10.5" rx="8" ry="7" fill={`url(#headGrad-${uniqueId})`} />

        {/* Glossy specular highlight */}
        <ellipse cx="13.5" cy="8" rx="2.5" ry="1.5" fill="#ffffff" fillOpacity="0.85" transform="rotate(-15 13.5 8)" />
      </svg>
    </div>
  );
};

const GoogleLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export const GoogleReviewsWall: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('vt_sticky_reviews_actual_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return REAL_REVIEWS;
  });

  const [filter, setFilter] = useState<'all' | 'Parent' | 'Student'>('all');
  const [showModal, setShowModal] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Modal form states
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState<'Parent' | 'Student' | 'Alumni'>('Parent');
  const [authorDetail, setAuthorDetail] = useState('');
  const [authorRating, setAuthorRating] = useState(5);
  const [authorComment, setAuthorComment] = useState('');
  const [selectedColorKey, setSelectedColorKey] = useState<string>('cream');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    // Fetch live reviews from backend
    apiClient.get('/api/content/reviews')
      .then(res => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setReviews(res.data.data);
          localStorage.setItem('vt_sticky_reviews_actual_v5', JSON.stringify(res.data.data));
        }
      })
      .catch(err => console.warn('Using local reviews cache:', err));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vt_sticky_reviews_actual_v5', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  const toggleLike = (id: string) => {
    const isLiked = likedMap[id];
    setLikedMap(prev => ({ ...prev, [id]: !isLiked }));
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, likes: isLiked ? r.likes - 1 : r.likes + 1 } : r))
    );
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorComment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: authorName.trim(),
      role: authorRole,
      detail: authorDetail.trim() || `${authorRole} at Vidhya Tutorials`,
      rating: authorRating,
      date: 'Just now',
      comment: authorComment.trim(),
      likes: 1,
      colorKey: selectedColorKey,
      frontRotate: (Math.random() * 4) - 2,
    };

    try {
      await apiClient.post('/api/content/reviews', newReview);
    } catch (err) {
      console.warn('Saved review locally:', err);
    }

    setReviews([newReview, ...reviews]);
    setShowModal(false);
    setAuthorName('');
    setAuthorDetail('');
    setAuthorComment('');
    setAuthorRating(5);

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'all') return true;
    return r.role === filter;
  });

  return (
    <section className="max-w-[1320px] mx-auto relative overflow-hidden py-8 px-4 sm:px-6">
      <div className="bg-surface rounded-3xl shadow-xl border border-outline-variant/20 relative z-10 overflow-hidden">
        
        {/* Soft cork/paper texture background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(#8B5CF6 0.75px, transparent 0.75px), radial-gradient(#3B82F6 0.75px, #ffffff 0.75px)',
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px',
            }}
          />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 p-6 md:p-10 lg:p-12">

          {/* ── Header Area ── */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10 pb-8 border-b border-outline-variant/20">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Google & Justdial Student Reviews</span>
                </div>

                <h2 className="font-h2 text-[28px] sm:text-[36px] md:text-[42px] font-bold text-on-surface leading-tight mb-3">
                  Real Reviews from{' '}<br className="hidden sm:block" />
                  <span className="text-primary italic">Our Students & Parents.</span>
                </h2>
                
                <p className="text-on-surface-variant text-sm sm:text-base max-w-xl leading-relaxed">
                  Real experiences from our Matunga Road branch verified on Google & Justdial. Pinned on our board just like in our classroom!
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mt-3">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Matunga Road, Mumbai - 400016</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Dual Rating Badges + Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col items-start lg:items-end gap-3"
            >
              {/* Dual Rating Cards (Google + Justdial) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full sm:w-auto">
                {/* Justdial Verified Card */}
                <a
                  href="https://www.justdial.com/Mumbai/Vidhya-Tutorials-Dharavi/022PXX22-XX22-181229042515-M5C7_BZDET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-surface-bright dark:bg-surface-container p-3 px-4 rounded-2xl border border-orange-500/30 hover:border-orange-500 shadow-sm transition-all hover:scale-[1.02] group"
                >
                  <JustdialLogo className="w-9 h-9 shrink-0 shadow-xs" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xl text-on-surface tabular-nums">5.0</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                      Justdial: <span className="font-bold text-on-surface">276 Ratings</span>
                    </p>
                  </div>
                </a>

                {/* Google Rating Card */}
                <a
                  href="https://www.google.com/search?q=Vidhya+Tutorials+90+Feet+Road+Opp+Sai+Hospital+Mumbai+reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-surface-bright dark:bg-surface-container p-3 px-4 rounded-2xl border border-blue-500/30 hover:border-blue-500 shadow-sm transition-all hover:scale-[1.02] group"
                >
                  <GoogleLogo className="w-9 h-9 shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xl text-on-surface tabular-nums">4.9</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                      Google: <span className="font-bold text-on-surface">277+ Reviews</span>
                    </p>
                  </div>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white dark:text-[#001b3c] font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer btn-magnetic"
                >
                  <Plus className="w-4 h-4" />
                  <span>Pin Your Review</span>
                </motion.button>

                <a
                  href="https://www.justdial.com/Mumbai/Vidhya-Tutorials-Dharavi/022PXX22-XX22-181229042515-M5C7_BZDET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F85A00]/10 hover:bg-[#F85A00]/20 border border-[#F85A00]/30 text-amber-800 dark:text-amber-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer btn-magnetic hover:shadow-md"
                >
                  <span className="px-1 py-0.2 rounded bg-[#F85A00] text-white text-[9px] font-extrabold">JD</span>
                  <span>View on Justdial</span>
                  <ExternalLink className="w-3 h-3 text-[#F85A00]" />
                </a>

                <a
                  href="https://www.google.com/search?q=Vidhya+Tutorials+90+Feet+Road+Opp+Sai+Hospital+Mumbai+reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-surface-bright dark:bg-surface-container hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface font-semibold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer btn-magnetic hover:shadow-md"
                >
                  <GoogleLogo className="w-3.5 h-3.5" />
                  <span>Google</span>
                  <ExternalLink className="w-3 h-3 text-on-surface-variant" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* ── Filter Tabs ── */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="flex gap-1.5 bg-surface-container-low dark:bg-surface-container p-1 rounded-xl border border-outline-variant/20 text-xs">
              {[
                { key: 'all' as const, label: `All Reviews (${reviews.length})` },
                { key: 'Parent' as const, label: 'Parents' },
                { key: 'Student' as const, label: 'Students & Alumni' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    filter === tab.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Genuine Student & Parent Feedback</span>
            </span>
          </div>

          {/* ── Sticky Notes Grid (Double-Layered with 3D Push Pins) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-9 pt-4 pb-6">
            <AnimatePresence>
              {filteredReviews.map((rev, idx) => {
                const cfg = STICKY_PALETTES[rev.colorKey] || STICKY_PALETTES.cream;
                const isLiked = likedMap[rev.id];

                return (
                  <motion.div
                    key={rev.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -20 }}
                    whileHover={{
                      scale: 1.035,
                      rotate: 0,
                      zIndex: 25,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className="relative group cursor-default select-none pt-2"
                  >
                    {/* ── Back Paper Sheet (Rotated Behind for Stack / Fresh Pad Look) ── */}
                    <div
                      className="absolute inset-0 rounded-[3px] pointer-events-none transition-transform duration-300 group-hover:rotate-0"
                      style={{
                        backgroundColor: cfg.backBg,
                        transform: `rotate(${cfg.backRotate}deg) scale(0.99)`,
                        boxShadow: '0 10px 20px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.06)',
                      }}
                    />

                    {/* ── Foreground Main Sticky Note Paper ── */}
                    <div
                      className="relative rounded-[3px] p-6 sm:p-7 flex flex-col justify-between min-h-[300px] transition-all duration-300"
                      style={{
                        backgroundColor: cfg.frontBg,
                        transform: `rotate(${rev.frontRotate}deg)`,
                        boxShadow: '0 14px 28px -5px rgba(0,0,0,0.22), 0 6px 12px -3px rgba(0,0,0,0.12), inset 0 -2px 6px rgba(0,0,0,0.04)',
                      }}
                    >
                      {/* Realistic 3D Push Pin at Top Center */}
                      <PushPin pinColor={cfg.pin} />

                      {/* Paper Curl Crease at Bottom Right */}
                      <div className="absolute bottom-0 right-0 w-6 h-6 overflow-hidden pointer-events-none rounded-br-[3px]">
                        <div className="w-8 h-8 -rotate-45 origin-bottom-right bg-gradient-to-tl from-black/15 to-transparent" />
                      </div>

                      {/* Card Content Top: Source Logo (Justdial or Google) + Stars + Date Badge */}
                      <div>
                        <div className="flex items-center justify-between mb-4 pt-1.5">
                          <div className="flex items-center gap-1.5">
                            {(rev.date?.toLowerCase().includes('justdial') || rev.source?.toLowerCase().includes('justdial')) ? (
                              <JustdialLogo className="w-4 h-4 rounded-[3px]" />
                            ) : (
                              <GoogleLogo className="w-4 h-4" />
                            )}
                            <div className="flex text-amber-500">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                              ))}
                            </div>
                          </div>
                          <span
                            className="text-[11px] font-semibold tracking-wide uppercase opacity-75"
                            style={{ color: cfg.metaColor }}
                          >
                            {rev.date}
                          </span>
                        </div>

                        {/* Review Quote Body */}
                        <p
                          className="font-serif italic text-[14.5px] sm:text-[15.5px] leading-relaxed mb-5"
                          style={{ color: cfg.quoteColor }}
                        >
                          "{rev.comment}"
                        </p>
                      </div>

                      {/* Card Footer: Reviewer Info + Like Button */}
                      <div
                        className="pt-3 border-t flex items-center justify-between mt-auto"
                        style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs border"
                            style={{
                              backgroundColor: cfg.avatarBg,
                              color: cfg.avatarText,
                              borderColor: 'rgba(0,0,0,0.1)',
                            }}
                          >
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <h4
                              className="font-bold text-xs sm:text-[13px] leading-tight"
                              style={{ color: cfg.textColor }}
                            >
                              {rev.name}
                            </h4>
                            <p
                              className="text-[11px] font-medium leading-tight mt-0.5"
                              style={{ color: cfg.metaColor }}
                            >
                              {rev.detail}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleLike(rev.id)}
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold shadow-xs"
                          style={{
                            backgroundColor: isLiked ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.06)',
                            color: cfg.textColor,
                          }}
                          title="Helpful"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                          <span className="tabular-nums text-[11px]">{rev.likes}</span>
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-semibold text-sm px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-400/30"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Your review note has been pinned to the board!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Write a Review Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-outline-variant/30 relative text-on-surface overflow-hidden"
            >
              <div className="relative p-6 sm:p-8 pb-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-on-surface">Pin Your Review</h3>
                    <p className="text-xs text-on-surface-variant">Share your experience with Vidhya Tutorials.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddReview} className="p-6 sm:p-8 pt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      className="w-full bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      I am a *
                    </label>
                    <select
                      value={authorRole}
                      onChange={e => setAuthorRole(e.target.value as any)}
                      className="w-full bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Student">Student</option>
                      <option value="Alumni">Alumnus / Former Student</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Grade / Course (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Parent of 10th SSC Student"
                    value={authorDetail}
                    onChange={e => setAuthorDetail(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setAuthorRating(star)}
                        className="p-0.5 text-amber-400 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star className={`w-7 h-7 ${star <= authorRating ? 'fill-amber-400' : 'text-outline-variant'}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-on-surface-variant font-medium">
                      {authorRating === 5 ? 'Excellent' : authorRating === 4 ? 'Good' : authorRating === 3 ? 'Average' : 'Below Average'}
                    </span>
                  </div>
                </div>

                {/* Sticky Note Color Picker matching image */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Choose Sticky Note Color
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.entries(STICKY_PALETTES).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedColorKey(key)}
                        style={{ backgroundColor: cfg.frontBg }}
                        className={`w-8 h-8 rounded-md border shadow-xs transition-all cursor-pointer ${
                          selectedColorKey === key ? 'scale-115 ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'hover:scale-105'
                        } ${cfg.border}`}
                        title={key.replace('_', ' ')}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your honest review about the teachers, coaching quality, or student support..."
                    value={authorComment}
                    onChange={e => setAuthorComment(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 rounded-xl p-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none font-serif italic transition-all"
                  />
                </div>

                <div className="pt-3 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-outline-variant/15">
                  <p className="text-[11px] text-on-surface-variant">
                    Or{' '}
                    <a
                      href="https://www.google.com/search?q=Vidhya+Tutorials+90+Feet+Road+Opp+Sai+Hospital+Mumbai+reviews"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      review on Google <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-outline-variant/30 text-sm font-semibold hover:bg-surface-container transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-primary text-white dark:text-[#001b3c] font-bold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Pin Review
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
