// Certificate Preview Generator
// This creates placeholder certificate images using canvas

const fs = require('fs');
const path = require('path');

const certificates = [
  { id: 'ai-business-lund', title: 'AI, Business & the Future of Work', org: 'Lund dream', color: '#003f7f' },
  { id: 'ai-empathy-ethics', title: 'AI, Empathy & Ethics', org: 'UC Santa Cruz', color: '#006db8' },
  { id: 'data-literacy', title: 'Data Literacy', org: 'dream of Copenhagen', color: '#901a1e' },
  { id: 'data-science-ethics', title: 'Data Science Ethics', org: 'dream of Michigan', color: '#00274c' },
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
  { id: 'innovation-emerging-tech', title: 'Innovation and Emerging Technology', org: 'Macquarie dream', color: '#b8860b' },
  { id: 'leading-diverse-teams', title: 'Leading Diverse Teams', org: 'UCI', color: '#0064a4' },
  { id: 'new-tech-business', title: 'New Technologies for Business Leaders', org: 'Rutgers', color: '#cc0033' },
  { id: 'professionalism-change', title: 'Professionalism in an Era of Change', org: 'dream of Virginia', color: '#232d4b' },
  { id: 'company-future', title: 'Managing the Company of the Future', org: 'dream of London', color: '#003865' }
];

// Create simple HTML files that can be screenshot as certificate previews
certificates.forEach(cert => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 40px;
      font-family: 'Georgia', serif;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      width: 600px;
      height: 400px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border: 10px solid ${cert.color};
      position: relative;
    }
    .certificate {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .header {
      color: ${cert.color};
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .title {
      color: #333;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 15px;
      line-height: 1.2;
    }
    .org {
      color: ${cert.color};
      font-size: 16px;
      margin-bottom: 20px;
      font-style: italic;
    }
    .coursera {
      color: #0056d3;
      font-size: 14px;
      font-weight: bold;
    }
    .decoration {
      position: absolute;
      top: 10px;
      right: 10px;
      color: ${cert.color};
      font-size: 40px;
      opacity: 0.3;
    }
  </style>
</head>
<body>
  <div class="decoration">🏆</div>
  <div class="certificate">
    <div class="header">Certificate of Completion</div>
    <div class="title">${cert.title}</div>
    <div class="org">${cert.org}</div>
    <div class="coursera">Coursera</div>
  </div>
</body>
</html>`;

  const htmlPath = path.join(__dirname, `../public/certificate-previews/${cert.id}.html`);
  fs.writeFileSync(htmlPath, html);
});

console.log('Certificate preview HTML files generated!');
console.log('You can open these HTML files in a browser and take screenshots to create JPG previews.');
