import { PrismaClient, BlockType } from '@prisma/client';

const prisma = new PrismaClient();

const blocks = [
  {
    slug: 'hero-main',
    type: BlockType.HERO,
    title: 'Stephan El Khoury',
    subtitle: 'Computer Engineer • Full-Stack Developer • QA & SEO Specialist',
    content: {
      badge: 'Full-Stack Development • QA • SEO',
      headingPrimary: 'Building',
      headingAccent: 'Scalable',
      headingSuffix: 'Digital Solutions.',
      description:
        'Computer Engineer and Full-Stack Developer with enterprise experience in web development, quality assurance, SEO optimization, and AI-driven platforms.',
      ctaPrimaryLabel: 'Explore Projects',
      ctaPrimaryHref: '#projects',
      ctaSecondaryLabel: 'View Experience',
      ctaSecondaryHref: '#experience',
      highlights: [
        { title: 'Enterprise Delivery', desc: 'Regional & international clients' },
        { title: 'Quality Assurance', desc: 'Manual + functional + regression testing' },
        { title: 'Technical SEO', desc: 'Performance, visibility, accessibility' },
        { title: 'Cross-Industry', desc: 'SaaS, e-learning, healthcare, music tech' },
      ],
    },
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: 'about-main',
    type: BlockType.ABOUT,
    title: 'About',
    subtitle: 'Professional summary',
    content: {
      kicker: 'Professional Summary',
      headline: 'Computer Engineer focused on',
      headlineAccent: 'full-stack product delivery.',
      paragraphs: [
        'I design, develop, test, and deploy scalable digital products with a strong focus on quality, performance, and maintainability.',
        'My experience spans enterprise websites, SaaS platforms, e-learning systems, healthcare products, and AI-powered applications.',
        'I collaborate with cross-functional teams to deliver measurable outcomes through engineering excellence, QA discipline, and technical SEO.',
      ],
      stats: [
        { value: '2023+', label: 'Enterprise Experience' },
        { value: '5+', label: 'Industries Served' },
        { value: 'E2E', label: 'Product Ownership' },
      ],
    },
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: 'services-main',
    type: BlockType.ABOUT,
    title: 'Services & Expertise',
    subtitle: 'Capabilities',
    content: {
      title: 'Services & Expertise',
      subtitle:
        'A practical, end-to-end service stack combining software engineering, QA, SEO, and product execution.',
      items: [
        { icon: 'monitor', iconColor: '#60a5fa', title: 'Enterprise Website Development', desc: 'Designing and maintaining enterprise-grade websites for regional and international organizations.' },
        { icon: 'code', iconColor: '#fbbf24', title: 'Full-Stack Platform Engineering', desc: 'Building scalable applications with React, Next.js, Node.js, FastAPI, and robust API architecture.' },
        { icon: 'qa', iconColor: '#34d399', title: 'QA Process Implementation', desc: 'Executing manual, functional, and regression testing to improve reliability and release quality.' },
        { icon: 'seo', iconColor: '#c084fc', title: 'Technical SEO Optimization', desc: 'Improving search visibility and page performance with audits, structured fixes, and best practices.' },
        { icon: 'ui', iconColor: '#f472b6', title: 'UX/UI Delivery', desc: 'Developing responsive, accessible interfaces aligned with modern UX standards and business goals.' },
        { icon: 'docs', iconColor: '#818cf8', title: 'Audit & Reporting', desc: 'Using Lighthouse and SEO tooling to identify bottlenecks and prioritize high-impact improvements.' },
        { icon: 'music', iconColor: '#fb7185', title: 'AI & Music Technology Products', desc: 'Creating AI-driven experiences for real-time analysis, recognition, and creative workflows.' },
        { icon: 'business', iconColor: '#22d3ee', title: 'Freelance Product Leadership', desc: 'Managing concept, deployment, hosting, security, backups, and long-term maintenance.' },
      ],
    },
    sortOrder: 3,
    isActive: true,
  },
  {
    slug: 'skills-main',
    type: BlockType.ABOUT,
    title: 'Skills & Tools',
    subtitle: 'Technical proficiency',
    content: {
      title: 'Skills & Tools',
      subtitle:
        'Core capabilities across development, infrastructure, quality, SEO, and design.',
      categories: [
        { icon: 'frontend', title: 'Programming & Frontend', skills: ['JavaScript', 'TypeScript', 'Python', 'PHP', 'HTML5', 'CSS3', 'React', 'Next.js', 'Astro', 'WordPress', 'Elementor'] },
        { icon: 'backend', title: 'Backend & APIs', skills: ['Node.js', 'FastAPI', 'Laravel', 'REST APIs'] },
        { icon: 'cms', title: 'Databases & Platforms', skills: ['PostgreSQL', 'MySQL', 'Headless CMS', 'Enterprise CMS'] },
        { icon: 'qa', title: 'QA & Testing', skills: ['Manual QA', 'Functional Testing', 'Regression Testing', 'Lighthouse Audits'] },
        { icon: 'seo', title: 'SEO & Performance', skills: ['Technical SEO', 'Page Speed Optimization', 'Accessibility (WCAG)', 'Analytics'] },
        { icon: 'creative', title: 'Design & Product Tools', skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'VS Code', 'Postman', 'Docker', 'GitHub Actions', 'Git'] },
      ],
    },
    sortOrder: 4,
    isActive: true,
  },
  {
    slug: 'experience-main',
    type: BlockType.EXPERIENCE,
    title: 'Professional Experience',
    subtitle: 'Roles and impact across enterprise, freelance, and contract delivery',
    content: {
      items: [
        {
          year: 'Jan 2026 - Present',
          title: 'QA Analyst',
          company: 'Ogilvy One',
          description:
            'Responsible for quality, stability, and performance of enterprise digital platforms across multiple clients and industries.',
          metrics: ['Manual + Automated Testing', 'Regression + Integration + Performance', 'Optimizely • Sitecore • WordPress • Adobe'],
        },
        {
          year: 'Jun 2025 - Jan 2026',
          title: 'Full-stack Developer',
          company: 'Ogilvy One',
          description:
            'Designed, developed, and maintained scalable and secure digital platforms with strong cross-team collaboration and delivery ownership.',
          metrics: ['React + Next.js + Vue', 'Node.js + FastAPI + PHP + .NET', 'RBAC + CI/CD + Cloud Integrations'],
        },
        {
          year: 'Sep 2023 - Jun 2025',
          title: 'Frontend Developer',
          company: 'Ogilvy One',
          description:
            'Built and optimized frontend systems for advertising and enterprise projects with focus on performance and user experience.',
          metrics: ['Sitecore + Sitefinity', 'Front-End Engineering', 'SEO + UX Optimization'],
        },
        {
          year: '2021 - Present',
          title: 'Founder & Lead Developer',
          company: 'Multigraphic.lb',
          description:
            'Designing and building full-stack websites from concept to deployment, while managing hosting, security, backups, and maintenance.',
          metrics: ['End-to-End Delivery', 'SEO Optimization', 'UX/UI Leadership'],
        },
        {
          year: 'Contract',
          title: 'Web & Multimedia Developer',
          company: 'Firma Events (Qatar)',
          description:
            'Delivered a complete website and digital assets with end-to-end branding and deployment under tight deadlines.',
          metrics: ['Rapid Delivery', 'Brand + Web', 'Deployment'],
        },
        {
          year: 'Contract',
          title: 'UX/UI & Web Developer',
          company: 'InnovatorsGate',
          description:
            'Built responsive web interfaces and collaborated with stakeholders to improve user flows and layout quality.',
          metrics: ['Responsive UI', 'User Flow Design', 'Stakeholder Collaboration'],
        },
        {
          year: 'Contract',
          title: 'Web Developer & Automation Specialist',
          company: 'Sayegh 1944',
          description:
            'Developed web solutions and automated eBook workflows to improve content delivery and digital asset management.',
          metrics: ['Automation', 'Content Delivery', 'Workflow Efficiency'],
        },
      ],
    },
    sortOrder: 5,
    isActive: true,
  },
  {
    slug: 'architecture-main',
    type: BlockType.ABOUT,
    title: 'Execution Framework',
    subtitle: 'The Pipeline',
    content: {
      title: 'Execution Framework',
      subtitle:
        'How I deliver digital products from strategy to production and optimization.',
      pipeline: [
        { icon: 'screening', title: 'Discovery & Planning', details: ['Requirements gathering', 'UX flow mapping', 'Technical scope', 'Delivery roadmap'], status: 'Structured' },
        { icon: 'base', title: 'Build & Integrate', details: ['Frontend implementation', 'Backend/API development', 'Database modeling', 'CMS integration'], status: 'Scalable' },
        { icon: 'data', title: 'QA & Reliability', details: ['Manual QA', 'Functional + regression testing', 'Bug triage', 'Release readiness'], status: 'Stable' },
        { icon: 'seo', title: 'SEO & Performance', details: ['Technical SEO', 'Lighthouse audits', 'Accessibility checks', 'Continuous optimization'], status: 'Measured' },
      ],
    },
    sortOrder: 6,
    isActive: true,
  },
  {
    slug: 'testimonials-main',
    type: BlockType.ABOUT,
    title: 'Additional Information',
    subtitle: 'Collaboration strengths',
    content: {
      title: 'Additional Information',
      subtitle: 'Key strengths and domain focus from real project delivery.',
      items: [
        {
          quote:
            'Strong experience in enterprise CMS and headless architectures across real client workflows.',
          author: 'Architecture',
          role: 'Enterprise CMS',
        },
        {
          quote:
            'Background in music technology and AI-driven creative platforms, with practical product implementation.',
          author: 'Innovation',
          role: 'AI + Music Tech',
        },
        {
          quote:
            'Excellent communication and cross-team collaboration in agile and deadline-driven environments.',
          author: 'Collaboration',
          role: 'Cross-Functional Teams',
        },
      ],
    },
    sortOrder: 7,
    isActive: true,
  },
  {
    slug: 'contact-main',
    type: BlockType.CONTACT,
    title: "Let's build something",
    subtitle: 'Open to discussing project opportunities and technical consulting.',
    content: {
      title: "Let's build something",
      subtitle: 'Open to full-time, contract, and consulting opportunities.',
      email: 'stephanelkhoury2000@gmail.com',
      phone: '+96178965292',
      location: 'Lebanon',
      linkedin: 'https://www.linkedin.com/in/stephanelkhoury',
      github: 'https://github.com/stephanelkhoury',
    },
    sortOrder: 8,
    isActive: true,
  },
  {
    slug: 'multigraphic-main',
    type: BlockType.ABOUT,
    title: 'Multigraphic.lb',
    subtitle: 'Pixelate to Power',
    content: {
      logoUrl: '/logo-multigraphic.lb.png',
      kicker: 'Startup Showcase',
      title: 'MultigraphicLB',
      subtitle: 'Creative engineering startup focused on high-performance digital experiences.',
      description:
        'Multigraphic.lb is my startup where design, engineering, and growth strategy converge. We deliver bright brand systems, modern websites, and scalable full-stack products for ambitious businesses.',
      ctaLabel: 'Visit Multigraphic.lb',
      ctaHref: 'https://multigraphic.lb',
      projects: [
        {
          title: 'Harmonix AI',
          category: 'AI Music Platform',
          summary: 'AI-driven music analysis platform with real-time chord recognition, tempo insight, tuning guidance, and lyric support.',
          imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
          href: '/projects/harmonix',
          tags: ['AI', 'Audio', 'Product'],
        },
        {
          title: 'Clinickable',
          category: 'Healthcare SaaS',
          summary: 'Clinic management platform with patient records, appointment workflows, and operational dashboards.',
          imageUrl: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
          href: '/projects/clinickable',
          tags: ['SaaS', 'Healthcare', 'Dashboards'],
        },
        {
          title: 'A2Z in F&B',
          category: 'Food & Beverage Platform',
          summary: 'End-to-end digital solution for F&B operations, brand growth, online ordering workflows, and customer engagement.',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
          href: '#',
          tags: ['F&B', 'Growth', 'Operations'],
        },
        {
          title: 'Multigraphic Web Studio',
          category: 'Startup Delivery Engine',
          summary: 'High-performance websites and platform builds for startups and enterprises, optimized for SEO, accessibility, and conversion.',
          imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
          href: '#',
          tags: ['Studio', 'SEO', 'Performance'],
        },
      ],
    },
    sortOrder: 9,
    isActive: true,
  },
];

const projects = [
  {
    title: 'Harmonix',
    slug: 'harmonix',
    summary: 'AI-Powered Music Analysis Platform',
    description:
      'Built a platform for real-time chord recognition, tempo analysis, tuning support, and lyric extraction using AI-driven processing.',
    imageUrl: 'https://images.unsplash.com/photo-1762264644162-363c5b4e151d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    githubUrl: null,
    liveUrl: null,
    technologies: ['React', 'FastAPI', 'AI Models', 'Web Audio'],
    sortOrder: 1,
    isActive: true,
  },
  {
    title: 'SEOphobia',
    slug: 'seophobia',
    summary: 'SEO & UI QA Platform',
    description:
      'Developed an automated audit platform for performance, technical SEO, and UI consistency to support quality governance at scale.',
    imageUrl: 'https://images.unsplash.com/photo-1723987251277-18fc0a1effd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    githubUrl: null,
    liveUrl: null,
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Lighthouse'],
    sortOrder: 2,
    isActive: true,
  },
  {
    title: 'Clinickable',
    slug: 'clinickable',
    summary: 'Clinic Management SaaS',
    description:
      'Implemented a healthcare SaaS platform covering patient records, appointment scheduling, and secure administrative dashboards.',
    imageUrl: 'https://images.unsplash.com/photo-1631563020941-c0c6bc534b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    githubUrl: null,
    liveUrl: null,
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Admin Dashboards'],
    sortOrder: 3,
    isActive: true,
  },
  {
    title: 'Crypto-Engineers / Cryptokers',
    slug: 'crypto-engineers-cryptokers',
    summary: 'E-Learning Platforms',
    description:
      'Built e-learning platforms with authentication, course delivery, payment workflows, and role-based user dashboards.',
    imageUrl: 'https://images.unsplash.com/photo-1770307939909-f27b8e4ae9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    githubUrl: null,
    liveUrl: null,
    technologies: ['Next.js', 'Node.js', 'Payments', 'Authentication'],
    sortOrder: 4,
    isActive: true,
  },
  {
    title: 'Enterprise CMS Delivery',
    slug: 'enterprise-cms-delivery',
    summary: 'WPP – Ogilvy Client Delivery',
    description:
      'Developed and maintained enterprise-level websites for regional and international clients with strong QA and SEO standards.',
    imageUrl: 'https://images.unsplash.com/photo-1746130560622-766ee657968f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    githubUrl: null,
    liveUrl: null,
    technologies: ['Sitecore', 'Sitefinity', 'Next.js', 'SEO'],
    sortOrder: 5,
    isActive: true,
  },
  {
    title: 'Multigraphic.lb Client Platforms',
    slug: 'multigraphic-client-platforms',
    summary: 'Freelance Full-Stack Delivery',
    description:
      'Designed and deployed full-stack websites from concept to production with long-term maintenance, security, and optimization.',
    imageUrl: 'https://images.unsplash.com/photo-1760548425425-e42e77fa38f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    githubUrl: null,
    liveUrl: null,
    technologies: ['WordPress', 'PHP', 'SEO', 'Hosting & Security'],
    sortOrder: 6,
    isActive: true,
  },
];

const systems = [
  {
    name: 'Next.js',
    slug: 'nextjs',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    shortDescription: 'Production-grade React framework for full-stack apps.',
    experience:
      'I use Next.js in production for enterprise websites and scalable full-stack apps with strong SEO and performance requirements.',
    projectLinks: [
      '/upcoming-projects/01-modern-ecommerce-platform',
      '/upcoming-projects/03-project-management-dashboard',
    ],
    certificateLinks: [],
    resourceLinks: ['https://nextjs.org/docs'],
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'React',
    slug: 'react',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    shortDescription: 'Component-based frontend library for interactive web applications.',
    experience:
      'I build responsive and high-performance interfaces in React for enterprise, SaaS, and platform-style products.',
    projectLinks: ['/upcoming-projects/02-realtime-chat-application'],
    certificateLinks: [],
    resourceLinks: ['https://react.dev/'],
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'WordPress',
    slug: 'wordpress',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',
    shortDescription: 'Custom CMS and business websites with scalable content workflows.',
    experience:
      'I build and maintain WordPress websites including custom themes, SEO optimization, and long-term support.',
    projectLinks: [],
    certificateLinks: [],
    resourceLinks: ['https://developer.wordpress.org/'],
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Astro',
    slug: 'astro',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg',
    shortDescription: 'Modern web framework for fast, content-focused websites.',
    experience:
      'I use Astro when performance-first and content-centric delivery is required for modern websites.',
    projectLinks: [],
    certificateLinks: [],
    resourceLinks: ['https://docs.astro.build/'],
    sortOrder: 4,
    isActive: true,
  },
  {
    name: 'Sitecore',
    slug: 'sitecore',
    logoUrl: 'https://www.svgrepo.com/show/354228/sitecore.svg',
    shortDescription: 'Enterprise CMS for large organizations and multilingual operations.',
    experience:
      'I deliver Sitecore-based enterprise experiences with strong QA discipline, governance, and scalable content operations.',
    projectLinks: [],
    certificateLinks: [],
    resourceLinks: ['https://doc.sitecore.com/'],
    sortOrder: 5,
    isActive: true,
  },
  {
    name: 'Sitefinity',
    slug: 'sitefinity',
    logoUrl: 'https://www.svgrepo.com/show/353909/progress.svg',
    shortDescription: 'Digital experience platform for content and marketing operations.',
    experience:
      'I maintain and optimize Sitefinity implementations for performance, accessibility, and stable editorial workflows.',
    projectLinks: [],
    certificateLinks: [],
    resourceLinks: ['https://www.progress.com/documentation/sitefinity-cms'],
    sortOrder: 6,
    isActive: true,
  },
  {
    name: 'FastAPI',
    slug: 'fastapi',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
    shortDescription: 'High-performance Python API framework for modern backends.',
    experience:
      'I build backend services and integrations using FastAPI for speed, reliability, and maintainable architecture.',
    projectLinks: ['/upcoming-projects/07-restful-api-platform'],
    certificateLinks: [],
    resourceLinks: ['https://fastapi.tiangolo.com/'],
    sortOrder: 7,
    isActive: true,
  },
  {
    name: 'Node.js',
    slug: 'nodejs',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    shortDescription: 'JavaScript runtime for scalable APIs and full-stack systems.',
    experience:
      'I use Node.js for REST APIs, integrations, and full-stack platform backends powering production applications.',
    projectLinks: ['/upcoming-projects/02-realtime-chat-application', '/upcoming-projects/07-restful-api-platform'],
    certificateLinks: [],
    resourceLinks: ['https://nodejs.org/en/docs'],
    sortOrder: 8,
    isActive: true,
  },
  {
    name: 'PostgreSQL',
    slug: 'postgresql',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    shortDescription: 'Relational database for transactional, analytics, and SaaS workloads.',
    experience:
      'I design and manage PostgreSQL data models for SaaS products, enterprise platforms, and API-driven applications.',
    projectLinks: ['/upcoming-projects/01-modern-ecommerce-platform', '/upcoming-projects/03-project-management-dashboard'],
    certificateLinks: [],
    resourceLinks: ['https://www.postgresql.org/docs/'],
    sortOrder: 9,
    isActive: true,
  },
  {
    name: 'Docker',
    slug: 'docker',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    shortDescription: 'Containerization platform for reproducible environments and deployment pipelines.',
    experience:
      'I use Docker for consistent local development, deployment workflows, and environment standardization.',
    projectLinks: ['/upcoming-projects/08-dockerized-microservices-platform'],
    certificateLinks: [],
    resourceLinks: ['https://docs.docker.com/'],
    sortOrder: 10,
    isActive: true,
  },
];

const certificates = [
  {
    title: 'AI, Business & the Future of Work',
    issuer: 'Lund University',
    fileUrl: '/Stephan-Certificates/AI, Business & the Future of Work - Lund University - Coursera NGNAGY4E0BWW.pdf',
    externalUrl: '/certificate-previews/ai-business-lund.html',
    issuedAt: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    title: 'AI, Empathy & Ethics',
    issuer: 'UC Santa Cruz',
    fileUrl: '/Stephan-Certificates/AI, Empathy & Ethics - US SANTA CRUZ- Coursera 5FUDOMOKQJA2.pdf',
    externalUrl: '/certificate-previews/ai-empathy-ethics.html',
    issuedAt: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    title: 'Data Literacy',
    issuer: 'University of Copenhagen',
    fileUrl: '/Stephan-Certificates/Data Literacy - University of Copehangen - Coursera 3QMWORSEKX28.pdf',
    externalUrl: '/certificate-previews/data-literacy.html',
    issuedAt: null,
    sortOrder: 3,
    isActive: true,
  },
  {
    title: 'Data Science Ethics',
    issuer: 'University of Michigan',
    fileUrl: '/Stephan-Certificates/Data Science Ethics - University of Michigan - Coursera YDM5MX379A6D.pdf',
    externalUrl: '/certificate-previews/data-science-ethics.html',
    issuedAt: null,
    sortOrder: 4,
    isActive: true,
  },
  {
    title: 'Business Implications of AI',
    issuer: 'EIT Digital',
    fileUrl: '/Stephan-Certificates/EIT Digital - Business Implications of AI - Coursera SBI2CT1OEWMV.pdf',
    externalUrl: '/certificate-previews/business-implications-ai.html',
    issuedAt: null,
    sortOrder: 5,
    isActive: true,
  },
  {
    title: 'Sustainable Digital Innovation',
    issuer: 'EIT Digital',
    fileUrl: '/Stephan-Certificates/EIT Digital - Sustainable Digital Innovation - Coursera KZBNU80Y584P.pdf',
    externalUrl: '/certificate-previews/sustainable-digital.html',
    issuedAt: null,
    sortOrder: 6,
    isActive: true,
  },
  {
    title: 'Manage a Remote Team',
    issuer: 'GitLab',
    fileUrl: '/Stephan-Certificates/Gitlab - Manage a Remote Team - Coursera 2XUK9VFF7KPH.pdf',
    externalUrl: '/certificate-previews/manage-remote-team.html',
    issuedAt: null,
    sortOrder: 7,
    isActive: true,
  },
  {
    title: 'Introduction to Generative AI',
    issuer: 'Google Cloud',
    fileUrl: '/Stephan-Certificates/Google Cloud- Introduction to Generative AI - Coursera HKDD5LZKHIPT.pdf',
    externalUrl: '/certificate-previews/intro-generative-ai.html',
    issuedAt: null,
    sortOrder: 8,
    isActive: true,
  },
  {
    title: 'Google Docs',
    issuer: 'Google',
    fileUrl: '/Stephan-Certificates/Google Docs - Coursera C69GDTW4LHUA.pdf',
    externalUrl: '/certificate-previews/google-docs.html',
    issuedAt: null,
    sortOrder: 9,
    isActive: true,
  },
  {
    title: 'Google Drive',
    issuer: 'Google',
    fileUrl: '/Stephan-Certificates/Google Drive - Coursera LLSF9KU4BE0X.pdf',
    externalUrl: '/certificate-previews/google-drive.html',
    issuedAt: null,
    sortOrder: 10,
    isActive: true,
  },
  {
    title: 'Google Gmail',
    issuer: 'Google',
    fileUrl: '/Stephan-Certificates/Google Gmail - Coursera OSV05GY1OY1K.pdf',
    externalUrl: '/certificate-previews/google-gmail.html',
    issuedAt: null,
    sortOrder: 11,
    isActive: true,
  },
  {
    title: 'Google Meet',
    issuer: 'Google',
    fileUrl: '/Stephan-Certificates/Google Meet - Coursera RB2TKRAIH4WG.pdf',
    externalUrl: '/certificate-previews/google-meet.html',
    issuedAt: null,
    sortOrder: 12,
    isActive: true,
  },
  {
    title: 'Google Sheets',
    issuer: 'Google',
    fileUrl: '/Stephan-Certificates/Google Sheets - Coursera 29HF7UAMYUTA.pdf',
    externalUrl: '/certificate-previews/google-sheets.html',
    issuedAt: null,
    sortOrder: 13,
    isActive: true,
  },
  {
    title: 'Google Slides',
    issuer: 'Google',
    fileUrl: '/Stephan-Certificates/Google Slides - Coursera VX82B1NUHWVI.pdf',
    externalUrl: '/certificate-previews/google-slides.html',
    issuedAt: null,
    sortOrder: 14,
    isActive: true,
  },
  {
    title: 'Innovation and Emerging Technology',
    issuer: 'Macquarie University',
    fileUrl: '/Stephan-Certificates/Innovation and emerging technology_ Be disruptive - Macqaire University Austalia - Coursera LIV3PQ0WJE2X.pdf',
    externalUrl: '/certificate-previews/innovation-emerging-tech.html',
    issuedAt: null,
    sortOrder: 15,
    isActive: true,
  },
  {
    title: 'Leading Diverse Teams',
    issuer: 'UCI',
    fileUrl: '/Stephan-Certificates/Leading Diverse Teams - UCI - Coursera ZC9VN37X094Z.pdf',
    externalUrl: '/certificate-previews/leading-diverse-teams.html',
    issuedAt: null,
    sortOrder: 16,
    isActive: true,
  },
  {
    title: 'New Technologies for Business Leaders',
    issuer: 'Rutgers',
    fileUrl: '/Stephan-Certificates/New Technologies for Business Leaders - Rutgers - Coursera 7T87PYBWCPW7.pdf',
    externalUrl: '/certificate-previews/new-tech-business.html',
    issuedAt: null,
    sortOrder: 17,
    isActive: true,
  },
  {
    title: 'Professionalism in an Era of Change',
    issuer: 'University of Virginia',
    fileUrl: '/Stephan-Certificates/Professionalism in an era of change - Coursera UMIH61273PJP.pdf',
    externalUrl: '/certificate-previews/professionalism-change.html',
    issuedAt: null,
    sortOrder: 18,
    isActive: true,
  },
  {
    title: 'Managing the Company of the Future',
    issuer: 'University of London',
    fileUrl: '/Stephan-Certificates/University of London - Managing the Company of the Future - Coursera 3CVT7THP5LI4.pdf',
    externalUrl: '/certificate-previews/company-future.html',
    issuedAt: null,
    sortOrder: 19,
    isActive: true,
  },
];

async function seed() {
  await prisma.chatMessage.deleteMany({});
  await prisma.chatSession.deleteMany({});
  await prisma.contentBlock.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.supportedSystem.deleteMany({});
  await prisma.certificate.deleteMany({});

  await prisma.contentBlock.createMany({ data: blocks });
  await prisma.project.createMany({ data: projects });
  await prisma.supportedSystem.createMany({ data: systems });
  await prisma.certificate.createMany({ data: certificates });

  const welcomeSession = await prisma.chatSession.create({
    data: {
      visitorId: 'system-seed',
      title: 'Initial seeded conversation',
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: welcomeSession.id,
        role: 'user',
        content: 'Who is Stephan?',
      },
      {
        sessionId: welcomeSession.id,
        role: 'assistant',
        content:
          'Stephan El Khoury is a Computer Engineer and Full Stack Developer focused on building scalable digital products and enterprise CMS solutions.',
      },
    ],
  });

  console.log('✅ Database seeded successfully with blocks, projects, systems, certificates, and chat data.');
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
