'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const studienkollegs = [
  {
    id: 'halle',
    name: 'Studienkolleg Halle',
    city: 'Halle (Saale)',
    state: 'Saxony-Anhalt',
    description: 'One of the oldest and most renowned Studienkollegs in Germany.',
  },
  {
    id: 'tu-berlin',
    name: 'Studienkolleg TU Berlin',
    city: 'Berlin',
    state: 'Berlin',
    description: 'Technical University Berlin\'s preparatory college for international students.',
  },
  {
    id: 'fu-berlin',
    name: 'Studienkolleg FU Berlin',
    city: 'Berlin',
    state: 'Berlin',
    description: 'Free University Berlin\'s Studienkolleg focusing on humanities and social sciences.',
  },
  {
    id: 'hamburg',
    name: 'Studienkolleg Hamburg',
    city: 'Hamburg',
    state: 'Hamburg',
    description: 'Located in Germany\'s second-largest city, offering comprehensive preparation courses.',
  },
  {
    id: 'munich',
    name: 'Studienkolleg Munich',
    city: 'Munich',
    state: 'Bavaria',
    description: 'Bavaria\'s leading preparatory college in the heart of Munich.',
  },
  {
    id: 'leipzig',
    name: 'Studienkolleg Leipzig',
    city: 'Leipzig',
    state: 'Saxony',
    description: 'Preparing international students for universities in Saxony.',
  },
  {
    id: 'hannover',
    name: 'Studienkolleg Hannover',
    city: 'Hannover',
    state: 'Lower Saxony',
    description: 'Lower Saxony\'s central Studienkolleg with strong technical programs.',
  },
  {
    id: 'koethen',
    name: 'Studienkolleg Köthen',
    city: 'Köthen',
    state: 'Saxony-Anhalt',
    description: 'Specialized in engineering and natural sciences preparation.',
  },
  {
    id: 'frankfurt',
    name: 'Studienkolleg Frankfurt',
    city: 'Frankfurt am Main',
    state: 'Hesse',
    description: 'Financial hub\'s preparatory college with diverse course offerings.',
  },
  {
    id: 'marburg',
    name: 'Studienkolleg Marburg',
    city: 'Marburg',
    state: 'Hesse',
    description: 'Historic university town\'s Studienkolleg with excellent academic reputation.',
  },
];

export default function StudienkollegPage() {
  return (
    <>
      <Navbar />

      <main className={`min-h-screen bg-[rgb(var(--color-bg))] ${inter.className}`}>
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[450px] max-h-[650px] overflow-hidden">
          <Image
            src="/studienkolleg/studienkolleg2.jpg"
            alt="International students"
            fill
            priority
            className="object-cover"
            style={{
              objectPosition: '50% 35%',
              filter: 'brightness(0.95) contrast(1.05)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-bg))]/95 via-[rgb(var(--color-bg))]/50 to-transparent z-[2]" />

          <div className="absolute inset-0 z-[3] flex items-end pb-12 md:pb-16">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
                  Studienkolleg
                </h1>
                <p className="text-lg md:text-xl text-[rgb(var(--color-text-secondary))] max-w-2xl">
                  Preparatory colleges bridging international education to German universities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Info Section */}
          <section className="py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  What is a<br />Studienkolleg?
                </h2>
                <div className="w-16 h-1 bg-[rgb(var(--color-primary))] mb-8" />
              </div>

              <div className="space-y-6 text-lg text-[rgb(var(--color-text-secondary))] leading-relaxed">
                <p>
                  A Studienkolleg is a preparatory course for international students who wish to study at a German university
                  but whose school-leaving certificates are not recognized as equivalent to the German Abitur.
                </p>
                <p>
                  The program typically lasts two semesters (one year) and ends with the "Feststellungsprüfung" (assessment exam).
                  Successfully passing this exam qualifies you for university admission in Germany.
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-[rgb(var(--color-border))]" />

          {/* Course Types */}
          <section className="py-20 md:py-28">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-widest text-[rgb(var(--color-text-secondary))] font-semibold">
                Course Types
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
              <div>
                <div className="text-6xl font-bold text-[rgb(var(--color-primary))] mb-3">T</div>
                <h3 className="font-semibold mb-2">T-Kurs</h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  Technical, mathematical and scientific subjects
                </p>
              </div>

              <div>
                <div className="text-6xl font-bold text-[rgb(var(--color-primary))] mb-3">M</div>
                <h3 className="font-semibold mb-2">M-Kurs</h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  Medical and biological studies
                </p>
              </div>

              <div>
                <div className="text-6xl font-bold text-[rgb(var(--color-primary))] mb-3">W</div>
                <h3 className="font-semibold mb-2">W-Kurs</h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  Economics and social sciences
                </p>
              </div>

              <div>
                <div className="text-6xl font-bold text-[rgb(var(--color-primary))] mb-3">G</div>
                <h3 className="font-semibold mb-2">G-Kurs</h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  Humanities, German studies and arts
                </p>
              </div>

              <div>
                <div className="text-6xl font-bold text-[rgb(var(--color-primary))] mb-3">S</div>
                <h3 className="font-semibold mb-2">S-Kurs</h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  Language studies
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-[rgb(var(--color-border))]" />

          {/* Studienkollegs List */}
          <section className="py-20 md:py-28">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Studienkolleg
              </h2>
              <p className="text-lg text-[rgb(var(--color-text-secondary))]">
                Explore preparatory colleges across Germany
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studienkollegs.map((stk) => (
                <Link
                  key={stk.id}
                  href={`/studienkolleg/${stk.id}`}
                  className="group relative bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] p-8 transition-all duration-300 hover:border-[rgb(var(--color-primary))] hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold group-hover:text-[rgb(var(--color-primary))] transition-colors">
                      {stk.name}
                    </h3>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                      {stk.city} • {stk.state}
                    </p>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed pt-2">
                      {stk.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-sm font-medium text-[rgb(var(--color-primary))]">
                    <span>View details</span>
                    <svg
                      className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
