# Stephan El Khoury - Portfolio Website

A modern, responsive portfolio website built with Next.js 13+ App Router, showcasing my professional experience, projects, and skills as a Computer Engineer and Full Stack Developer.

## 🚀 Features

- **Modern Tech Stack**: Next.js 13+ with App Router, TypeScript, TailwindCSS
- **Responsive Design**: Mobile-first approach with smooth animations
- **Interactive Components**: Framer Motion animations and Lenis smooth scrolling  
- **Professional Content**: Real work experience, projects, and certifications
- **Category Filtering**: Projects organized by technology and category
- **Contact Integration**: Direct email and social media links

## 🛠️ Technologies Used

- **Frontend**: Next.js 13+, React 18, TypeScript
- **Styling**: TailwindCSS, PostCSS
- **Animations**: Framer Motion, Lenis (smooth scroll)
- **Icons**: Font Awesome
- **Development**: ESLint, Turbopack
- **Smooth Scroll**: Lenis

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stephan-portfolio.git
   ```

2. Install dependencies:
   ```bash
   cd stephan-portfolio
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```env
   # Add your environment variables here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  ├── app/                # App router pages and layout
  ├── components/         # React components
  │   ├── animations/    # Animation components and hooks
  │   └── ...           # Other components
  ├── styles/            # Global styles
  └── utils/            # Utility functions
public/                 # Static assets
```

## Deployment

The site is automatically deployed through Vercel's Git integration. Every push to the main branch triggers a new deployment.

## Contributing

While this is my personal portfolio, if you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

MIT © Stephan El Khoury
