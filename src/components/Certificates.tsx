'use client';

import React from 'react';
import { AnimatedSection, ScrollReveal } from './animations';
import CertificateCarousel from './CertificateCarousel';

// Certificate data for the carousel
const certificates = [
  {
    id: '1',
    title: 'AI, Business & the Future of Work',
    organization: 'Lund University - Coursera',
    type: 'AI & Business',
    filename: 'AI, Business & the Future of Work - Lund University - Coursera NGNAGY4E0BWW.pdf',
    path: '/Stephan-Certificates/AI, Business & the Future of Work - Lund University - Coursera NGNAGY4E0BWW.pdf',
    preview: '/certificate-previews/ai-business-lund.svg'
  },
  {
    id: '2',
    title: 'AI, Empathy & Ethics',
    organization: 'UC Santa Cruz - Coursera',
    type: 'AI Ethics',
    filename: 'AI, Empathy & Ethics - US SANTA CRUZ- Coursera 5FUDOMOKQJA2.pdf',
    path: '/Stephan-Certificates/AI, Empathy & Ethics - US SANTA CRUZ- Coursera 5FUDOMOKQJA2.pdf',
    preview: '/certificate-previews/ai-empathy-ethics.svg'
  },
  {
    id: '3',
    title: 'Data Literacy',
    organization: 'University of Copenhagen - Coursera',
    type: 'Data Science',
    filename: 'Data Literacy - University of Copehangen - Coursera 3QMWORSEKX28.pdf',
    path: '/Stephan-Certificates/Data Literacy - University of Copehangen - Coursera 3QMWORSEKX28.pdf',
    preview: '/certificate-previews/data-literacy.svg'
  },
  {
    id: '4',
    title: 'Data Science Ethics',
    organization: 'University of Michigan - Coursera',
    type: 'Data Science',
    filename: 'Data Science Ethics - University of Michigan - Coursera YDM5MX379A6D.pdf',
    path: '/Stephan-Certificates/Data Science Ethics - University of Michigan - Coursera YDM5MX379A6D.pdf',
    preview: '/certificate-previews/data-science-ethics.svg'
  },
  {
    id: '5',
    title: 'Business Implications of AI',
    organization: 'EIT Digital - Coursera',
    type: 'AI & Business',
    filename: 'EIT Digital - Business Implications of AI - Coursera SBI2CT1OEWMV.pdf',
    path: '/Stephan-Certificates/EIT Digital - Business Implications of AI - Coursera SBI2CT1OEWMV.pdf',
    preview: '/certificate-previews/business-implications-ai.svg'
  },
  {
    id: '6',
    title: 'Sustainable Digital Innovation',
    organization: 'EIT Digital - Coursera',
    type: 'Innovation',
    filename: 'EIT Digital - Sustainable Digital Innovation - Coursera KZBNU80Y584P.pdf',
    path: '/Stephan-Certificates/EIT Digital - Sustainable Digital Innovation - Coursera KZBNU80Y584P.pdf',
    preview: '/certificate-previews/sustainable-digital-innovation.svg'
  },
  {
    id: '7',
    title: 'Manage a Remote Team',
    organization: 'GitLab - Coursera',
    type: 'Management',
    filename: 'Gitlab - Manage a Remote Team - Coursera 2XUK9VFF7KPH.pdf',
    path: '/Stephan-Certificates/Gitlab - Manage a Remote Team - Coursera 2XUK9VFF7KPH.pdf',
    preview: '/certificate-previews/manage-remote-team.svg'
  },
  {
    id: '8',
    title: 'Introduction to Generative AI',
    organization: 'Google Cloud - Coursera',
    type: 'AI & ML',
    filename: 'Google Cloud- Introduction to Generative AI - Coursera HKDD5LZKHIPT.pdf',
    path: '/Stephan-Certificates/Google Cloud- Introduction to Generative AI - Coursera HKDD5LZKHIPT.pdf',
    preview: '/certificate-previews/intro-generative-ai.svg'
  },
  {
    id: '9',
    title: 'Google Docs',
    organization: 'Google - Coursera',
    type: 'Productivity',
    filename: 'Google Docs - Coursera C69GDTW4LHUA.pdf',
    path: '/Stephan-Certificates/Google Docs - Coursera C69GDTW4LHUA.pdf',
    preview: '/certificate-previews/google-docs.svg'
  },
  {
    id: '10',
    title: 'Google Drive',
    organization: 'Google - Coursera',
    type: 'Productivity',
    filename: 'Google Drive - Coursera LLSF9KU4BE0X.pdf',
    path: '/Stephan-Certificates/Google Drive - Coursera LLSF9KU4BE0X.pdf',
    preview: '/certificate-previews/google-drive.svg'
  },
  {
    id: '11',
    title: 'Google Gmail',
    organization: 'Google - Coursera',
    type: 'Productivity',
    filename: 'Google Gmail - Coursera OSV05GY1OY1K.pdf',
    path: '/Stephan-Certificates/Google Gmail - Coursera OSV05GY1OY1K.pdf',
    preview: '/certificate-previews/google-gmail.svg'
  },
  {
    id: '12',
    title: 'Google Meet',
    organization: 'Google - Coursera',
    type: 'Productivity',
    filename: 'Google Meet - Coursera RB2TKRAIH4WG.pdf',
    path: '/Stephan-Certificates/Google Meet - Coursera RB2TKRAIH4WG.pdf',
    preview: '/certificate-previews/google-meet.svg'
  },
  {
    id: '13',
    title: 'Google Sheets',
    organization: 'Google - Coursera',
    type: 'Productivity',
    filename: 'Google Sheets - Coursera 29HF7UAMYUTA.pdf',
    path: '/Stephan-Certificates/Google Sheets - Coursera 29HF7UAMYUTA.pdf',
    preview: '/certificate-previews/google-sheets.svg'
  },
  {
    id: '14',
    title: 'Google Slides',
    organization: 'Google - Coursera',
    type: 'Productivity',
    filename: 'Google Slides - Coursera VX82B1NUHWVI.pdf',
    path: '/Stephan-Certificates/Google Slides - Coursera VX82B1NUHWVI.pdf',
    preview: '/certificate-previews/google-slides.svg'
  },
  {
    id: '15',
    title: 'Innovation and Emerging Technology: Be Disruptive',
    organization: 'Macquarie University Australia - Coursera',
    type: 'Innovation',
    filename: 'Innovation and emerging technology_ Be disruptive - Macqaire University Austalia - Coursera LIV3PQ0WJE2X.pdf',
    path: '/Stephan-Certificates/Innovation and emerging technology_ Be disruptive - Macqaire University Austalia - Coursera LIV3PQ0WJE2X.pdf',
    preview: '/certificate-previews/innovation-emerging-technology.svg'
  },
  {
    id: '16',
    title: 'Leading Diverse Teams',
    organization: 'UCI - Coursera',
    type: 'Leadership',
    filename: 'Leading Diverse Teams - UCI - Coursera ZC9VN37X094Z.pdf',
    path: '/Stephan-Certificates/Leading Diverse Teams - UCI - Coursera ZC9VN37X094Z.pdf',
    preview: '/certificate-previews/leading-diverse-teams.svg'
  },
  {
    id: '17',
    title: 'New Technologies for Business Leaders',
    organization: 'Rutgers - Coursera',
    type: 'Technology',
    filename: 'New Technologies for Business Leaders - Rutgers - Coursera 7T87PYBWCPW7.pdf',
    path: '/Stephan-Certificates/New Technologies for Business Leaders - Rutgers - Coursera 7T87PYBWCPW7.pdf',
    preview: '/certificate-previews/new-technologies-business.svg'
  },
  {
    id: '18',
    title: 'Professionalism in an Era of Change',
    organization: 'Coursera',
    type: 'Professional Development',
    filename: 'Professionalism in an era of change - Coursera UMIH61273PJP.pdf',
    path: '/Stephan-Certificates/Professionalism in an era of change - Coursera UMIH61273PJP.pdf',
    preview: '/certificate-previews/professionalism-change.svg'
  },
  {
    id: '19',
    title: 'Managing the Company of the Future',
    organization: 'University of London - Coursera',
    type: 'Management',
    filename: 'University of London - Managing the Company of the Future - Coursera 3CVT7THP5LI4.pdf',
    path: '/Stephan-Certificates/University of London - Managing the Company of the Future - Coursera 3CVT7THP5LI4.pdf',
    preview: '/certificate-previews/company-future.svg'
  }
];

const Certificates: React.FC = () => {
  return (
    <section id="certificates" className="py-20 px-6">
      <AnimatedSection>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Professional Certificates
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                A comprehensive collection of professional certifications spanning AI, business, data science, 
                Google Workspace, leadership, and emerging technologies from top universities and organizations worldwide.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <CertificateCarousel certificates={certificates} />
          </ScrollReveal>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Certificates;
