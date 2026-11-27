import { courses } from './courseData.js'
import { testimonialDefaults } from './testimonialDefaults.js'

export const defaultContent = {
  brand: {
    name: 'Mubsa Fin Institute°',
    shortName: 'Mubsa Fin Institute',
    tagline: 'We Grow Together',
    descriptor: 'MARKET EDUCATION',
    logo: '/mubsa-logo.jpg',
    favicon: '/favicon.svg',
    headerCtaLabel: 'MUBSA MAGIC',
    headerCtaUrl: ''
  },
  hero: {
    kicker: 'MARKET INTELLIGENCE · STRATEGIC ANALYSIS · RISK DISCIPLINE',
    title: "Don't just follow the market.\nLearn to read it.",
    text: 'At Mubsa Fin Institute, we provide structured market education, practical chart analysis, and focused learning in trading strategies, risk management and learn to approach every trade with a clear strategy and disciplined mind set.',
    image: '/mubsa-market-learning-hero.png',
    workshopImage: '/mubsa-workshop-learning.png',
    primaryCtaText: 'Join MARKET DNA',
    primaryCtaLink: '/webinar',
    secondaryCtaText: 'Explore Courses',
    secondaryCtaLink: '/courses',
    communityCtaText: 'The 5% Club',
    badgeText: 'STRUCTURED MARKET LEARNING'
  },
  about: {
    founderName: 'Mubarak Ahmad',
    founderRole: 'Founder & Academic Director',
    founderImage: '/client-portrait.jpg',
    founderMentorImage: '/client-founder.jpg',
    founderBio: `Mubsa Fin Institute provides market education from the foundations to advanced analysis. Founder and Academic Director Mubarak Ahmad is a share-market educator based in Dubai. His mission is to help at least one million middle-class people move forward through proper trading and investment education.

His market journey includes five years of learning, four years of trading experience, and two years of teaching experience. He has completed basic, intermediate, and advanced training in Dubai through programmes carrying KHDA certification, and has attended more than 100 webinars and courses across the UAE, India, Malaysia, the United States, and the United Kingdom.

His teaching approach puts preparation, a focused market window, patience, selective entries, and planned exits ahead of watching the market all day. The aim is to make market learning more structured for working professionals and full-time traders. Trading remains risky; no method can guarantee income or results.`,
    founderQuote: '“The greatest investment begins with investing in knowledge.”',
    visionTitle: 'OUR VISION',
    visionText: 'To shape a generation of knowledgeable and disciplined traders and investors who understand market behaviour, think independently, identify opportunities through informed analysis, and approach financial markets with confidence and responsibility.',
    missionTitle: 'OUR MISSION',
    missionText: 'To empower at least one million middle-class individuals through accessible and quality trading and investment education, equipping them with the knowledge and skills to navigate financial markets responsibly.',
    engineeringStoryTitle: 'Engineering expertise, kept in its own lane.',
    engineeringStoryText: `Alongside his market education work, Mubarak Ahmad is a senior security systems engineer with more than 12 years of experience in the UAE and India. At Hikvision MEA, he supports technical delivery and training across the UAE and Oman, with a focus on AI-enabled security, CCTV, and ELV systems.

His engineering work includes system planning, configuration, implementation support, troubleshooting, and user training. His profile records more than 150 product and user training sessions and a technical-support community of more than 600 MEA engineers that has resolved over 4,000 cases.`
  },
  stats: [
    { number: '5+', label: 'Years of Market Education' },
    { number: '4+', label: 'Years of Active Market Experience' },
    { number: '2+', label: 'Years of Trading Education' },
    { number: '100+', label: 'Learning Sessions & Industry Webinars' }
  ],
  stages: [
    { number: '01', title: 'Learn', text: 'Build clear market foundations.' },
    { number: '02', title: 'Analyse', text: 'Read price and market information.' },
    { number: '03', title: 'Plan', text: 'Create a structured approach.' },
    { number: '04', title: 'Practice', text: 'Apply concepts with guided exercises.' },
    { number: '05', title: 'Progress', text: 'Strengthen independent thinking.' }
  ],
  promises: [
    { title: 'Structured learning' },
    { title: 'Skill-focused' },
    { title: 'Learn at your pace' }
  ],
  community: {
    title: 'WE GROW TOGETHER.',
    text: 'Be part of our growing community. Join our public Telegram channel to stay connected.',
    buttonLabel: 'Join our 5% CLUB',
    buttonUrl: ''
  },
  footer: {
    description: 'Build your market understanding through a structured, time-conscious approach. Mubsa Fin Institute helps learners study markets, charts, and risk with purpose.',
    disclaimer: 'Trading and investing involve risk, including possible loss of capital. Course content is educational and does not guarantee profits or replace financial advice based on individual circumstances.',
    copyright: 'Mubsa Fin Institute. All rights reserved.'
  },
  mediaLibrary: [],
  popupEnabled: true,
  popupDelay: 4,
  popupTitle: 'Join our upcoming Market DNA',
  popupText: 'Enter your details below to register for our upcoming MARKET DNA',
  videoUrl: '',
  gallery: [],
  testimonials: testimonialDefaults,
  policies: [],
  contact: {
    title: 'Have a question about the courses or other queries?',
    description: 'Contact Mubsa Fin Institute',
    location: 'Dubai · India',
    phone: '+91 9983 67 9983',
    email: 'askme@mubsacapital.com',
    website: 'mubsafin.com'
  },
  registrationLabel: 'REGISTER TO CLAIM YOUR SLOT',
  communityLabel: 'The 5% CLUB',
  socialLinks: [
    { label: 'Telegram', url: 'https://t.me/mubsafin' },
    { label: 'Instagram', url: 'https://www.instagram.com/grow.with.mubsa/' },
    { label: 'YouTube', url: 'https://www.youtube.com/@GrowWithGroups' },
    { label: 'LinkedIn', url: 'https://linkedin.com/company/mubsafin' },
    { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61596730557828' },
    { label: 'Threads', url: 'https://www.threads.com/@grow.with.mubsa' },
    { label: 'X', url: 'https://x.com/mubsafin' }
  ],
  courses,
  faqs: [
    {
      category: 'Services',
      question: 'What can I learn with Mubsa?',
      answer: 'Our learning path covers market foundations, chart analysis, risk management, and advanced methods. Explore the three course outlines to find your starting point.'
    },
    {
      category: 'Trading',
      question: 'Do you guarantee profits from trading?',
      answer: 'No. Trading and investing involve risk, including possible loss of capital. Course content is educational and does not guarantee profits.'
    },
    {
      category: 'Courses',
      question: 'Do I need previous trading experience?',
      answer: 'No, you don’t need any previous trading experience. Our course is designed as basic, Intermediate and Advance. So you’ll be guided based on your Trading experience.'
    },
    {
      category: 'Courses',
      question: 'How do I choose a course?',
      answer: 'Review the curriculum and send a course enquiry. Tell us about your current experience so we can discuss a suitable learning path.'
    },
    {
      category: 'Courses',
      question: 'Is this personal financial advice?',
      answer: 'No. Course content is educational. It does not replace financial advice based on your individual circumstances.'
    },
    {
      category: 'Support',
      question: 'How can I join a webinar?',
      answer: 'Check our Webinar button on our home page. Fill in the form and submit. Our team assist your further.'
    },
    {
      category: 'Support',
      question: 'How can I contact your support team?',
      answer: 'You can reach our team through the contact form, email, or WhatsApp listed on our website. We\'re happy to assist you with your queries.'
    },
    {
      category: 'Services',
      question: 'Do you manage or trade on behalf of clients?',
      answer: 'No, we do not manage client accounts or execute trades on anyone\'s behalf. Our focus is solely on providing financial market education and helping students develop independent trading skills.'
    }
  ]
}
