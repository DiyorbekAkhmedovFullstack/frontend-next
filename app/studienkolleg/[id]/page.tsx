'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommentSection from '@/components/comments/CommentSection';

const studienkollegData: Record<string, {
  name: string;
  city: string;
  state: string;
  fullDescription: string;
  website: string;
  address: string;
  courses: string[];
  requirements: string[];
  applicationDeadline: string;
  duration: string;
  fees: string;
}> = {
  'halle': {
    name: 'Studienkolleg Halle',
    city: 'Halle (Saale)',
    state: 'Saxony-Anhalt',
    fullDescription: 'Studienkolleg Halle is one of the oldest and most prestigious preparatory colleges in Germany. Located in Halle (Saale), it has been preparing international students for German university studies since 1956. The institution is known for its experienced faculty and comprehensive preparation programs.',
    website: 'https://www.studienkolleg-halle.de',
    address: 'Ludwig-Wucherer-Straße 2, 06108 Halle (Saale)',
    courses: ['T-Kurs (Technical/Engineering/Natural Sciences)', 'M-Kurs (Medical/Biological)', 'W-Kurs (Economics/Social Sciences)'],
    requirements: [
      'Secondary school certificate equivalent to German Hauptschulabschluss or higher',
      'German language proficiency (at least B1 level)',
      'Entrance examination (mathematics and German)',
      'Valid university admission letter or application',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €200-300 per semester (semester contribution)',
  },
  'tu-berlin': {
    name: 'Studienkolleg TU Berlin',
    city: 'Berlin',
    state: 'Berlin',
    fullDescription: 'The Studienkolleg of the Technical University Berlin is specialized in preparing international students for technical and engineering studies. With state-of-the-art facilities and close connection to TU Berlin, students receive excellent preparation for their future studies.',
    website: 'https://www.tu.berlin/studienkolleg',
    address: 'Jungstraße 2, 10247 Berlin',
    courses: ['T-Kurs (Technical/Engineering/Natural Sciences)', 'W-Kurs (Economics/Social Sciences)'],
    requirements: [
      'University entrance qualification from your home country',
      'German language certificate (B1 level minimum)',
      'Passed entrance exam in mathematics and German',
      'Valid residence permit for Germany',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €300 per semester',
  },
  'fu-berlin': {
    name: 'Studienkolleg FU Berlin',
    city: 'Berlin',
    state: 'Berlin',
    fullDescription: 'The Studienkolleg of the Free University Berlin focuses on humanities, social sciences, and languages. It offers excellent preparation for students planning to study these subjects at German universities. The college benefits from FU Berlin\'s strong international orientation.',
    website: 'https://www.fu-berlin.de/studienkolleg',
    address: 'Malteserstraße 74-100, 12249 Berlin',
    courses: ['G-Kurs (Humanities/German Studies/Arts)', 'W-Kurs (Economics/Social Sciences)', 'S-Kurs (Languages)'],
    requirements: [
      'Recognized secondary school certificate',
      'German language skills (B1 level certified)',
      'Entrance examination success',
      'Letter of motivation',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €300 per semester',
  },
  'hamburg': {
    name: 'Studienkolleg Hamburg',
    city: 'Hamburg',
    state: 'Hamburg',
    fullDescription: 'Studienkolleg Hamburg serves the universities in Hamburg and northern Germany. Located in Germany\'s second-largest city, it offers a vibrant international atmosphere and comprehensive preparation for various fields of study.',
    website: 'https://www.studienkolleg-hamburg.de',
    address: 'Holstenglacis 6, 20355 Hamburg',
    courses: ['T-Kurs (Technical/Engineering)', 'M-Kurs (Medical/Biological)', 'W-Kurs (Economics)', 'G-Kurs (Humanities)'],
    requirements: [
      'Secondary education certificate',
      'German B1 certificate',
      'Entrance test (German and Mathematics)',
      'Valid passport and visa',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €350 per semester',
  },
  'munich': {
    name: 'Studienkolleg Munich',
    city: 'Munich',
    state: 'Bavaria',
    fullDescription: 'Studienkolleg München is Bavaria\'s central preparatory college, serving universities throughout the state. Located in Munich, one of Germany\'s most important academic centers, it provides excellent preparation and cultural experiences.',
    website: 'https://www.studienkolleg-muenchen.de',
    address: 'Barer Straße 21, 80333 München',
    courses: ['T-Kurs (Technical)', 'M-Kurs (Medical)', 'W-Kurs (Economics)', 'G-Kurs (Humanities)'],
    requirements: [
      'University entrance qualification',
      'German language B1 certificate',
      'Passed entrance examination',
      'Health insurance in Germany',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €400 per semester',
  },
  'leipzig': {
    name: 'Studienkolleg Leipzig',
    city: 'Leipzig',
    state: 'Saxony',
    fullDescription: 'Studienkolleg Leipzig prepares international students for universities in Saxony. The college is known for its strong academic programs and excellent support services for international students.',
    website: 'https://www.studienkolleg.uni-leipzig.de',
    address: 'Lumumbastraße 4, 04105 Leipzig',
    courses: ['T-Kurs (Technical)', 'M-Kurs (Medical)', 'W-Kurs (Economics)', 'G-Kurs (Humanities)'],
    requirements: [
      'Recognized school certificate',
      'German B1 level minimum',
      'Entrance exam success',
      'Blocked account (proof of financial resources)',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €250 per semester',
  },
  'hannover': {
    name: 'Studienkolleg Hannover',
    city: 'Hannover',
    state: 'Lower Saxony',
    fullDescription: 'Studienkolleg Hannover is the central preparatory college for Lower Saxony. It has a strong focus on technical and engineering subjects, complemented by comprehensive programs in other fields.',
    website: 'https://www.studienkolleg-hannover.de',
    address: 'Am Kleinen Felde 30, 30167 Hannover',
    courses: ['T-Kurs (Technical/Engineering)', 'M-Kurs (Medical)', 'W-Kurs (Economics)', 'G-Kurs (Humanities)'],
    requirements: [
      'Secondary school leaving certificate',
      'German language certificate B1',
      'Entrance examination in German and Mathematics',
      'Valid student visa',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €300 per semester',
  },
  'koethen': {
    name: 'Studienkolleg Köthen',
    city: 'Köthen',
    state: 'Saxony-Anhalt',
    fullDescription: 'Studienkolleg Köthen specializes in engineering and natural sciences preparation. It is affiliated with Anhalt University of Applied Sciences and provides targeted preparation for technical studies.',
    website: 'https://www.hs-anhalt.de/studienkolleg',
    address: 'Bernburger Straße 55, 06366 Köthen',
    courses: ['T-Kurs (Technical/Engineering)', 'TI-Kurs (Technical/Computer Science)'],
    requirements: [
      'Secondary education certificate',
      'German B1 certificate',
      'Mathematics and German entrance test',
      'Acceptance letter from a German university',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €200 per semester',
  },
  'frankfurt': {
    name: 'Studienkolleg Frankfurt',
    city: 'Frankfurt am Main',
    state: 'Hesse',
    fullDescription: 'Studienkolleg Frankfurt serves the universities in Hesse. Located in Germany\'s financial capital, it offers diverse course options and benefits from the city\'s international atmosphere.',
    website: 'https://www.studienkolleg-frankfurt.de',
    address: 'Bockenheimer Landstraße 133, 60325 Frankfurt am Main',
    courses: ['T-Kurs (Technical)', 'M-Kurs (Medical)', 'W-Kurs (Economics)', 'G-Kurs (Humanities)', 'S-Kurs (Languages)'],
    requirements: [
      'Recognized secondary school certificate',
      'German language B1 level',
      'Entrance test passed',
      'Proof of health insurance',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €350 per semester',
  },
  'marburg': {
    name: 'Studienkolleg Marburg',
    city: 'Marburg',
    state: 'Hesse',
    fullDescription: 'Studienkolleg Marburg is located in one of Germany\'s oldest university towns. It has a strong academic tradition and provides excellent preparation for studies at Phillips University Marburg and other universities in the region.',
    website: 'https://www.uni-marburg.de/studienkolleg',
    address: 'Biegenstraße 12, 35037 Marburg',
    courses: ['T-Kurs (Technical)', 'M-Kurs (Medical)', 'W-Kurs (Economics)', 'G-Kurs (Humanities)'],
    requirements: [
      'University entrance qualification',
      'German B1 certificate',
      'Successful entrance examination',
      'Valid residence permit',
    ],
    applicationDeadline: 'January 15 (for summer semester), July 15 (for winter semester)',
    duration: '2 semesters (1 year)',
    fees: 'Approximately €300 per semester',
  },
};

export default function StudienkollegDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const studienkolleg = studienkollegData[id];

  if (!studienkolleg) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[rgb(var(--color-bg))] pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-black mb-4">Studienkolleg Not Found</h1>
            <Link href="/studienkolleg" className="text-[rgb(var(--color-primary))] hover:underline">
              Back to Studienkolleg List
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[rgb(var(--color-bg))]">
        {/* Hero Section with Image (only for Halle) */}
        {id === 'halle' && (
          <div className="relative h-[500px] md:h-[600px] overflow-hidden">
            <Image
              src="/studienkolleg/halle.jpg"
              alt="City of Halle"
              fill
              priority
              className="object-cover hero-image-filter"
            />
            <div
              className="absolute inset-0 z-[2]"
              style={{
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%)',
              }}
            />
            <div className="absolute inset-0 z-[3] flex items-end pb-16 md:pb-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-white">
                  <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-semibold mb-4">
                    Since 1956
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4"
                      style={{
                        textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
                        letterSpacing: '-1px',
                      }}>
                    {studienkolleg.name}
                  </h1>
                  <p className="text-xl md:text-2xl font-light mb-6"
                     style={{
                       textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
                     }}>
                    <svg className="inline-block w-6 h-6 mr-2 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {studienkolleg.city}, {studienkolleg.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content area ready for your step-by-step implementation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <Link
            href="/studienkolleg"
            className="inline-flex items-center text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-text))] mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all Studienkollegs
          </Link>

          {/* Application & Aufnahmetest Sections */}
          <div className="my-12 md:my-20 grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Application Section */}
            <div className="border-2 border-dashed border-[rgb(var(--color-border))] rounded-lg p-6 md:p-8 flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">Application</h2>

              {/* Application Process Flow */}
              <div className="mb-8">
                <h3 className="text-xs md:text-sm uppercase tracking-wider text-[rgb(var(--color-text-secondary))] mb-4 font-semibold">Application Process</h3>
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  <div className="px-4 py-2 md:px-6 md:py-3 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm md:text-base font-medium">
                    UniAssist
                  </div>
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-[rgb(var(--color-text-secondary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="px-4 py-2 md:px-6 md:py-3 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm md:text-base font-medium">
                    Martin Luther University
                  </div>
                </div>
              </div>

              {/* Deadlines */}
              <div className="mb-8">
                <h3 className="text-xs md:text-sm uppercase tracking-wider text-[rgb(var(--color-text-secondary))] mb-4 font-semibold">Application Deadlines</h3>
                <div className="flex gap-6 md:gap-8 flex-wrap">
                  <div>
                    <p className="text-sm md:text-base text-[rgb(var(--color-text-secondary))] mb-2">Wintersemester</p>
                    <p className="text-xl md:text-2xl font-bold">30.06</p>
                  </div>
                  <div className="w-px bg-[rgb(var(--color-border))]"></div>
                  <div>
                    <p className="text-sm md:text-base text-[rgb(var(--color-text-secondary))] mb-2">Sommersemester</p>
                    <p className="text-xl md:text-2xl font-bold">15.12</p>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="mb-8">
                <h3 className="text-xs md:text-sm uppercase tracking-wider text-[rgb(var(--color-text-secondary))] mb-4 font-semibold">Required Documents</h3>
                <ul className="space-y-2 text-base md:text-lg">
                  <li>Passport</li>
                  <li>School diploma</li>
                  <li>Language certificate</li>
                </ul>
              </div>

              {/* German Language Requirements */}
              <div className="mb-8">
                <h3 className="text-xs md:text-sm uppercase tracking-wider text-[rgb(var(--color-text-secondary))] mb-4 font-semibold">German Language Level</h3>
                <div className="flex gap-6 md:gap-8 flex-wrap items-end">
                  <div>
                    <p className="text-sm md:text-base text-[rgb(var(--color-text-secondary))] mb-2">Minimal</p>
                    <p className="text-2xl md:text-3xl font-black text-[rgb(var(--color-primary))]">B2</p>
                  </div>
                  <div className="pb-1 md:pb-2 text-lg md:text-xl text-[rgb(var(--color-text-secondary))]">/</div>
                  <div>
                    <p className="text-sm md:text-base text-[rgb(var(--color-text-secondary))] mb-2">Recommended</p>
                    <p className="text-2xl md:text-3xl font-black text-[rgb(var(--color-primary))]">C1</p>
                  </div>
                </div>
              </div>

              {/* Step-by-step Guide Button */}
              <div className="mt-auto">
                <Link
                  href="#"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 md:py-5 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-lg font-semibold text-sm md:text-base leading-tight hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(var(--color-primary),0.4)] transition-all duration-300"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span className="text-center">Step-by-step guide through application process</span>
                </Link>
              </div>
            </div>

            {/* Aufnahmetest Section */}
            <div className="border-2 border-dashed border-[rgb(var(--color-border))] rounded-lg p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">Aufnahmetest</h2>

              {/* Next Exam Date */}
              <div className="mb-12 md:mb-16">
                <h3 className="text-xs md:text-sm uppercase tracking-wider text-[rgb(var(--color-text-secondary))] mb-4 md:mb-6 font-semibold">Next Exam</h3>
                <p className="text-2xl md:text-3xl font-bold">31.01.2025</p>
              </div>

              {/* Exam Subjects */}
              <div>
                <h3 className="text-xs md:text-sm uppercase tracking-wider text-[rgb(var(--color-text-secondary))] mb-4 md:mb-6 font-semibold">Exam Subjects</h3>
                <div className="space-y-6">
                  {/* T-Kurs */}
                  <div>
                    <p className="font-bold text-lg mb-3">T-Kurs</p>
                    <div className="flex gap-2 flex-wrap text-sm">
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        German
                      </span>
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        Maths
                      </span>
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        Physics
                      </span>
                    </div>
                  </div>

                  {/* M-Kurs */}
                  <div>
                    <p className="font-bold text-lg mb-3">M-Kurs</p>
                    <div className="flex gap-2 flex-wrap text-sm">
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        German
                      </span>
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        Maths
                      </span>
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        Biology
                      </span>
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        Chemistry
                      </span>
                    </div>
                  </div>

                  {/* W-Kurs */}
                  <div>
                    <p className="font-bold text-lg mb-3">W-Kurs</p>
                    <div className="flex gap-2 flex-wrap text-sm">
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        German
                      </span>
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        Maths
                      </span>
                    </div>
                  </div>

                  {/* G-Kurs */}
                  <div>
                    <p className="font-bold text-lg mb-3">G-Kurs</p>
                    <div className="flex gap-2 flex-wrap text-sm">
                      <span className="px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg">
                        German
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prepare for Exam Button */}
              <div className="mt-12 md:mt-16">
                <Link
                  href="#"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 md:py-5 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-lg font-semibold text-sm md:text-base leading-tight hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(var(--color-primary),0.4)] transition-all duration-300"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-center">Prepare for the exam by solving real-life examples</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Life and Study Balance & Finance Sections */}
          <div className="my-12 md:my-20 grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Life and Study Balance Section - Only for Halle */}
            {id === 'halle' && (
              <div className="border-2 border-dashed border-[rgb(var(--color-border))] rounded-lg p-6 md:p-8 flex flex-col">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">Life and Study Balance</h2>

                <div className="space-y-6 text-base md:text-lg leading-relaxed text-[rgb(var(--color-text))] mb-8">
                  <p>
                    Student life in Halle (Saale) combines a great deal of academic knowledge with rich student activity.
                    Each student receives a Semester ticket, which allows them to use all public transport in Germany for
                    6 months without limit and even sometimes travel outside the country to cities such as Salzburg, Basel,
                    Strasbourg, etc.
                  </p>

                  <p>
                    Very good and fast transport connections to the city of Leipzig open a window of opportunity for leisure,
                    shopping and entertainment.
                  </p>
                </div>

                {/* Explore Library Button */}
                <div className="mt-auto">
                  <Link
                    href="#"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 md:py-5 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-lg font-semibold text-sm md:text-base leading-tight hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(var(--color-primary),0.4)] transition-all duration-300"
                  >
                    <svg className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-center">Explore Studiwelt library</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Finance Section - Reusable */}
            <div className="border-2 border-dashed border-[rgb(var(--color-border))] rounded-lg p-6 md:p-8 flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">Finance</h2>

              {/* Monthly Expenses */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between py-3 border-b border-[rgb(var(--color-border))]">
                  <span className="text-base md:text-lg font-medium">Rent</span>
                  <span className="text-lg md:text-xl font-bold text-[rgb(var(--color-primary))]">300 €</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgb(var(--color-border))]">
                  <span className="text-base md:text-lg font-medium">Grocery</span>
                  <span className="text-lg md:text-xl font-bold text-[rgb(var(--color-primary))]">150 €</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgb(var(--color-border))]">
                  <span className="text-base md:text-lg font-medium">Insurance</span>
                  <span className="text-lg md:text-xl font-bold text-[rgb(var(--color-primary))]">30 €</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[rgb(var(--color-border))]">
                  <span className="text-base md:text-lg font-medium">Personal</span>
                  <span className="text-base md:text-lg text-[rgb(var(--color-text-secondary))] italic">depends on you :)</span>
                </div>
              </div>

              {/* Work as Student Button */}
              <div className="mt-auto">
                <Link
                  href="#"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 md:py-5 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-lg font-semibold text-sm md:text-base leading-tight hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(var(--color-primary),0.4)] transition-all duration-300"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-center">Work as Student and finance yourself in Germany</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection studienkollegId={id} />

        </div>
      </main>

      <Footer />
    </>
  );
}
