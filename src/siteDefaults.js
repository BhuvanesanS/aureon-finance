import { courses } from './courseData.js'
import { testimonialDefaults } from './testimonialDefaults.js'

export const defaultContent = {
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
