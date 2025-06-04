const fs = require('fs');
const path = require('path');

// Certificate data with preview image paths
const certificates = [
  {
    id: 'ai-business-lund',
    title: 'AI, Business & the Future of Work',
    organization: 'Lund University',
    type: 'AI & Business',
    filename: 'AI, Business & the Future of Work - Lund University - Coursera NGNAGY4E0BWW.pdf',
    preview: '/certificate-previews/ai-business-lund.jpg'
  },
  {
    id: 'ai-empathy-ethics',
    title: 'AI, Empathy & Ethics',
    organization: 'UC Santa Cruz',
    type: 'AI & Ethics',
    filename: 'AI, Empathy & Ethics - US SANTA CRUZ- Coursera 5FUDOMOKQJA2.pdf',
    preview: '/certificate-previews/ai-empathy-ethics.jpg'
  },
  {
    id: 'data-literacy',
    title: 'Data Literacy',
    organization: 'University of Copenhagen',
    type: 'Data Science',
    filename: 'Data Literacy - University of Copehangen - Coursera 3QMWORSEKX28.pdf',
    preview: '/certificate-previews/data-literacy.jpg'
  },
  {
    id: 'data-science-ethics',
    title: 'Data Science Ethics',
    organization: 'University of Michigan',
    type: 'Data Science',
    filename: 'Data Science Ethics - University of Michigan - Coursera YDM5MX379A6D.pdf',
    preview: '/certificate-previews/data-science-ethics.jpg'
  },
  {
    id: 'business-implications-ai',
    title: 'Business Implications of AI',
    organization: 'EIT Digital',
    type: 'AI & Business',
    filename: 'EIT Digital - Business Implications of AI - Coursera SBI2CT1OEWMV.pdf',
    preview: '/certificate-previews/business-implications-ai.jpg'
  },
  {
    id: 'sustainable-digital',
    title: 'Sustainable Digital Innovation',
    organization: 'EIT Digital',
    type: 'Innovation',
    filename: 'EIT Digital - Sustainable Digital Innovation - Coursera KZBNU80Y584P.pdf',
    preview: '/certificate-previews/sustainable-digital.jpg'
  },
  {
    id: 'manage-remote-team',
    title: 'Manage a Remote Team',
    organization: 'GitLab',
    type: 'Leadership',
    filename: 'Gitlab - Manage a Remote Team - Coursera 2XUK9VFF7KPH.pdf',
    preview: '/certificate-previews/manage-remote-team.jpg'
  },
  {
    id: 'intro-generative-ai',
    title: 'Introduction to Generative AI',
    organization: 'Google Cloud',
    type: 'AI & Technology',
    filename: 'Google Cloud- Introduction to Generative AI - Coursera HKDD5LZKHIPT.pdf',
    preview: '/certificate-previews/intro-generative-ai.jpg'
  },
  {
    id: 'google-docs',
    title: 'Google Docs',
    organization: 'Google',
    type: 'Google Workspace',
    filename: 'Google Docs - Coursera C69GDTW4LHUA.pdf',
    preview: '/certificate-previews/google-docs.jpg'
  },
  {
    id: 'google-drive',
    title: 'Google Drive',
    organization: 'Google',
    type: 'Google Workspace',
    filename: 'Google Drive - Coursera LLSF9KU4BE0X.pdf',
    preview: '/certificate-previews/google-drive.jpg'
  },
  {
    id: 'google-gmail',
    title: 'Google Gmail',
    organization: 'Google',
    type: 'Google Workspace',
    filename: 'Google Gmail - Coursera OSV05GY1OY1K.pdf',
    preview: '/certificate-previews/google-gmail.jpg'
  },
  {
    id: 'google-meet',
    title: 'Google Meet',
    organization: 'Google',
    type: 'Google Workspace',
    filename: 'Google Meet - Coursera RB2TKRAIH4WG.pdf',
    preview: '/certificate-previews/google-meet.jpg'
  },
  {
    id: 'google-sheets',
    title: 'Google Sheets',
    organization: 'Google',
    type: 'Google Workspace',
    filename: 'Google Sheets - Coursera 29HF7UAMYUTA.pdf',
    preview: '/certificate-previews/google-sheets.jpg'
  },
  {
    id: 'google-slides',
    title: 'Google Slides',
    organization: 'Google',
    type: 'Google Workspace',
    filename: 'Google Slides - Coursera VX82B1NUHWVI.pdf',
    preview: '/certificate-previews/google-slides.jpg'
  },
  {
    id: 'innovation-emerging-tech',
    title: 'Innovation and Emerging Technology',
    organization: 'Macquarie University',
    type: 'Innovation',
    filename: 'Innovation and emerging technology_ Be disruptive - Macqaire University Austalia - Coursera LIV3PQ0WJE2X.pdf',
    preview: '/certificate-previews/innovation-emerging-tech.jpg'
  },
  {
    id: 'leading-diverse-teams',
    title: 'Leading Diverse Teams',
    organization: 'UCI',
    type: 'Leadership',
    filename: 'Leading Diverse Teams - UCI - Coursera ZC9VN37X094Z.pdf',
    preview: '/certificate-previews/leading-diverse-teams.jpg'
  },
  {
    id: 'new-tech-business',
    title: 'New Technologies for Business Leaders',
    organization: 'Rutgers',
    type: 'Business & Technology',
    filename: 'New Technologies for Business Leaders - Rutgers - Coursera 7T87PYBWCPW7.pdf',
    preview: '/certificate-previews/new-tech-business.jpg'
  },
  {
    id: 'professionalism-change',
    title: 'Professionalism in an Era of Change',
    organization: 'University of Virginia',
    type: 'Professional Development',
    filename: 'Professionalism in an era of change - Coursera UMIH61273PJP.pdf',
    preview: '/certificate-previews/professionalism-change.jpg'
  },
  {
    id: 'company-future',
    title: 'Managing the Company of the Future',
    organization: 'University of London',
    type: 'Management',
    filename: 'University of London - Managing the Company of the Future - Coursera 3CVT7THP5LI4.pdf',
    preview: '/certificate-previews/company-future.jpg'
  }
];

// Generate a simple certificate preview data file
const outputPath = path.join(__dirname, '../src/data/certificates.js');
const outputContent = `export const certificates = ${JSON.stringify(certificates, null, 2)};`;

// Ensure the data directory exists
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputPath, outputContent);
console.log('Certificate data generated successfully!');
console.log(`File saved to: ${outputPath}`);
