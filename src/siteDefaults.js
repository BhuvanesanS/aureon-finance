import { courses } from './courseData.js'
export const defaultContent = {
  popupEnabled: true, popupDelay: 4, popupTitle: 'Your market learning journey starts here.',
  popupText: 'Meet Mubarak Ahmad and explore a structured approach to charts, time cycles, and risk. Join an upcoming webinar or speak with our team.',
  videoUrl: '', gallery: [
    { title: 'Mubarak Ahmad — founder portrait', city: 'Founder', image: '/client-founder.jpg' },
    { title: 'Mubarak Ahmad — mentor portrait', city: 'Mentor', image: '/client-portrait.jpg' },
  ], testimonials: [], policies: [],
  contact: { title: 'Let’s start a conversation.', description: 'Tell us where you are in your learning journey.', location: 'Dubai · India', phone: '+91 9983 67 9983', email: 'askme@mubsacapital.com' },
  registrationLabel: 'Register here', communityLabel: 'Join free community',
  socialLinks: [],
  courses,
  faqs: [
  ['Services', 'What can I learn with Mubsa?', 'Our learning path covers market foundations, chart analysis, risk management, and advanced methods. Explore the three course outlines to find your starting point.'],
  ['Trading', 'Do you guarantee profits from trading?', 'No. Markets are uncertain and you can lose capital. Our programmes teach market analysis and risk awareness; they do not promise income or returns.'],
  ['Courses', 'Do I need previous trading experience?', 'The Basic Course starts with market fundamentals. Intermediate and Advanced courses build on chart-reading experience.'],
  ['Courses', 'How do I choose a course?', 'Review the curriculum and send a course enquiry. Tell us about your current experience so we can discuss a suitable learning path.'],
  ['Payment', 'How do I pay for a course?', 'Contact the team for the current fee, schedule, and payment instructions. This website does not collect payments or card details.'],
  ['Support', 'How can I join a webinar?', 'Use the free webinar button. When a session is published, you can register directly. Otherwise you can request an update from the team.'],
  ['Support', 'Where can I get help?', 'Email askme@mubsacapital.com or use the contact form. Include your enquiry reference if you have one.'],
].map(([category, question, answer]) => ({ category, question, answer })),
}
