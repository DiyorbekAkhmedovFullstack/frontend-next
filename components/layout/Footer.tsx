'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[rgb(var(--color-bg-secondary))] border-t border-[rgb(var(--color-border))] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Life in Germany */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.lifeInGermany.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#housing" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.lifeInGermany.housing')}
                </Link>
              </li>
              <li>
                <Link href="#work" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.lifeInGermany.work')}
                </Link>
              </li>
              <li>
                <Link href="#traveling" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.lifeInGermany.traveling')}
                </Link>
              </li>
              <li>
                <Link href="#hobbies" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.lifeInGermany.hobbies')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Study in Germany */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.studyInGermany.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#roadmap" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.studyInGermany.roadmap')}
                </Link>
              </li>
              <li>
                <Link href="#application" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.studyInGermany.application')}
                </Link>
              </li>
              <li>
                <Link href="#visa" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.studyInGermany.nationalVisa')}
                </Link>
              </li>
              <li>
                <Link href="#studienkolleg" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.studyInGermany.studienkolleg')}
                </Link>
              </li>
              <li>
                <Link href="#university" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.studyInGermany.university')}
                </Link>
              </li>
            </ul>
          </div>

          {/* About us */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.aboutUs.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#team" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.aboutUs.team')}
                </Link>
              </li>
              <li>
                <Link href="#goals" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.aboutUs.goals')}
                </Link>
              </li>
              <li>
                <Link href="#mission" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.aboutUs.mission')}
                </Link>
              </li>
              <li>
                <Link href="#socials" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
                  {t('footer.aboutUs.socials')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[rgb(var(--color-border))] text-center text-[rgb(var(--color-text-secondary))]">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
