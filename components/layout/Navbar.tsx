'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useI18n, SUPPORTED_LANGUAGES } from '@/lib/i18n';

const languages = Object.values(SUPPORTED_LANGUAGES);

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const changeLang = (lang: string) => {
    setLanguage(lang as any);
    setIsLangOpen(false);
  };

  const navbarClass = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled
      ? theme === 'light'
        ? 'bg-white/98 shadow-sm'
        : 'bg-[rgb(10,10,10)]/98 shadow-lg'
      : theme === 'light'
      ? 'bg-white/95'
      : 'bg-[rgb(10,10,10)]/95'
  } backdrop-blur-md border-b border-[rgb(var(--color-border))]`;

  return (
    <nav className={navbarClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left side - Login, Language, Theme */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              pathname === '/' ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium text-sm hover:-translate-y-0.5 transition-transform"
                >
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <Link
                  href="/"
                  className="px-4 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium text-sm hover:-translate-y-0.5 transition-transform"
                >
                  {t('nav.home')}
                </Link>
              )
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium text-sm hover:-translate-y-0.5 transition-transform"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-[rgb(var(--color-border))] rounded-md hover:bg-[rgb(var(--color-bg-secondary))] transition-colors"
                aria-label="Select language"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-md shadow-lg min-w-[140px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLang(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[rgb(var(--color-bg-tertiary))] transition-colors first:rounded-t-md last:rounded-b-md ${
                        language === lang.code ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))]' : ''
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 border border-[rgb(var(--color-border))] rounded-md hover:bg-[rgb(var(--color-bg-secondary))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-[rgb(var(--color-primary))] transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-[rgb(var(--color-primary))] transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-[rgb(var(--color-primary))] transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 ml-auto">
            <li><Link href="#" className="hover:text-[rgb(var(--color-text-secondary))] transition-colors">{t('nav.application')}</Link></li>
            <li><Link href="/studienkolleg" className="hover:text-[rgb(var(--color-text-secondary))] transition-colors">{t('nav.studienkolleg')}</Link></li>
            <li><Link href="#" className="hover:text-[rgb(var(--color-text-secondary))] transition-colors">{t('nav.university')}</Link></li>
            <li><Link href="#" className="hover:text-[rgb(var(--color-text-secondary))] transition-colors">{t('nav.workAndLife')}</Link></li>
          </ul>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <ul className="absolute top-full right-0 w-auto min-w-[200px] bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-md shadow-lg mt-2 mr-4 md:hidden">
              <li><Link href="#" className="block px-4 py-3 hover:bg-[rgb(var(--color-bg-tertiary))] rounded-t-md transition-colors">{t('nav.application')}</Link></li>
              <li><Link href="/studienkolleg" className="block px-4 py-3 hover:bg-[rgb(var(--color-bg-tertiary))] transition-colors">{t('nav.studienkolleg')}</Link></li>
              <li><Link href="#" className="block px-4 py-3 hover:bg-[rgb(var(--color-bg-tertiary))] transition-colors">{t('nav.university')}</Link></li>
              <li><Link href="#" className="block px-4 py-3 hover:bg-[rgb(var(--color-bg-tertiary))] rounded-b-md transition-colors">{t('nav.workAndLife')}</Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
