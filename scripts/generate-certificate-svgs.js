// Simple certificate preview generator using HTML to Canvas
const fs = require('fs');
const path = require('path');

const certificates = [
  { id: 'ai-business-lund', title: 'AI, Business & the Future of Work', org: 'Lund University', color: '#003f7f' },
  { id: 'ai-empathy-ethics', title: 'AI, Empathy & Ethics', org: 'UC Santa Cruz', color: '#006db8' },
  { id: 'data-literacy', title: 'Data Literacy', org: 'University of Copenhagen', color: '#901a1e' },
  { id: 'data-science-ethics', title: 'Data Science Ethics', org: 'University of Michigan', color: '#00274c' },
  { id: 'business-implications-ai', title: 'Business Implications of AI', org: 'EIT Digital', color: '#0052cc' },
  { id: 'sustainable-digital', title: 'Sustainable Digital Innovation', org: 'EIT Digital', color: '#0052cc' },
  { id: 'manage-remote-team', title: 'Manage a Remote Team', org: 'GitLab', color: '#fc6d26' },
  { id: 'intro-generative-ai', title: 'Introduction to Generative AI', org: 'Google Cloud', color: '#4285f4' },
  { id: 'google-docs', title: 'Google Docs', org: 'Google', color: '#4285f4' },
  { id: 'google-drive', title: 'Google Drive', org: 'Google', color: '#0f9d58' },
  { id: 'google-gmail', title: 'Google Gmail', org: 'Google', color: '#ea4335' },
  { id: 'google-meet', title: 'Google Meet', org: 'Google', color: '#00ac47' },
  { id: 'google-sheets', title: 'Google Sheets', org: 'Google', color: '#0f9d58' },
  { id: 'google-slides', title: 'Google Slides', org: 'Google', color: '#ff6d01' },
  { id: 'innovation-emerging-tech', title: 'Innovation and Emerging Technology', org: 'Macquarie University', color: '#b8860b' },
  { id: 'leading-diverse-teams', title: 'Leading Diverse Teams', org: 'UCI', color: '#0064a4' },
  { id: 'new-tech-business', title: 'New Technologies for Business Leaders', org: 'Rutgers', color: '#cc0033' },
  { id: 'professionalism-change', title: 'Professionalism in an Era of Change', org: 'University of Virginia', color: '#232d4b' },
  { id: 'company-future', title: 'Managing the Company of the Future', org: 'University of London', color: '#003865' }
];

// For now, let's create simple SVG certificates that will work as placeholder images
certificates.forEach(cert => {
  const svg = `<svg width="400" height="280" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="400" height="280" fill="url(#bgGradient)" stroke="${cert.color}" stroke-width="8"/>
    
    <!-- Certificate content -->
    <rect x="20" y="20" width="360" height="240" fill="white" rx="10" opacity="0.95"/>
    
    <!-- Header -->
    <text x="200" y="50" text-anchor="middle" fill="${cert.color}" font-family="serif" font-size="14" font-weight="bold">CERTIFICATE OF COMPLETION</text>
    
    <!-- Title -->
    <text x="200" y="90" text-anchor="middle" fill="#333" font-family="serif" font-size="16" font-weight="bold">
      <tspan x="200" dy="0">${cert.title.length > 30 ? cert.title.substring(0, 30) + '...' : cert.title}</tspan>
    </text>
    
    <!-- Organization -->
    <text x="200" y="130" text-anchor="middle" fill="${cert.color}" font-family="serif" font-size="14" font-style="italic">${cert.org}</text>
    
    <!-- Coursera -->
    <text x="200" y="160" text-anchor="middle" fill="#0056d3" font-family="serif" font-size="12" font-weight="bold">Coursera</text>
    
    <!-- Trophy icon -->
    <text x="350" y="40" text-anchor="middle" fill="${cert.color}" font-size="24" opacity="0.3">🏆</text>
    
    <!-- Decorative border -->
    <rect x="30" y="30" width="340" height="220" fill="none" stroke="${cert.color}" stroke-width="1" opacity="0.3"/>
  </svg>`;

  const svgPath = path.join(__dirname, `../public/certificate-previews/${cert.id}.svg`);
  fs.writeFileSync(svgPath, svg);
});

console.log('Certificate preview SVG files generated!');
console.log('These SVG files can be used as certificate preview images.');
