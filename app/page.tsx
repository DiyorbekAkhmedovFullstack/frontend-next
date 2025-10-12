'use client';

import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { t } = useI18n();

  const features = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      titleKey: 'features.extensiveLibrary.title',
      descriptionKey: 'features.extensiveLibrary.description',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      titleKey: 'features.communityPower.title',
      descriptionKey: 'features.communityPower.description',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      titleKey: 'features.flexibleLearning.title',
      descriptionKey: 'features.flexibleLearning.description',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      titleKey: 'features.trackProgress.title',
      descriptionKey: 'features.trackProgress.description',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
      titleKey: 'features.expertInstructors.title',
      descriptionKey: 'features.expertInstructors.description',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      titleKey: 'features.personalSupport.title',
      descriptionKey: 'features.personalSupport.description',
    },
  ];
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0 z-[1]">
          <Image
            src="/hero-image.jpg"
            alt="Modern Library"
            fill
            priority
            className="object-cover hero-image-filter"
          />
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.4) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-[3] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
          <div className="animate-fade-in-down inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold tracking-[0.2em] mb-8 text-white shadow-lg">
            {t('hero.badge')}
          </div>

          <h2 className="animate-fade-in-up mb-6">
            <span
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-2"
              style={{
                letterSpacing: '-2px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('hero.title')}
            </span>
          </h2>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[rgb(var(--color-bg))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[rgb(var(--color-text-secondary))] mb-12 text-lg">
            {t('hero.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[rgb(var(--color-bg-secondary))] p-8 rounded-lg border border-[rgb(var(--color-border))] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:border-[rgb(var(--color-primary))]"
              >
                <div className="text-[rgb(var(--color-primary))] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{t(feature.titleKey)}</h3>
                <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">{t(feature.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
