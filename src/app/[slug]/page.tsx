export const dynamic = 'force-static';
export const revalidate = false;

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import Hero from '@/components/landingpage/Hero';
import Header from '@/components/landingpage/Header';
import Steps from '@/components/landingpage/Steps';
import Benefits from '@/components/landingpage/Benefits';
import About from '@/components/landingpage/About';
import { Testimonials } from '@/components/landingpage/Testimonials';
import CTA from '@/components/landingpage/CTA';
import ImageGallery from '@/components/landingpage/ImageGallery';
import FAQ from '@/components/landingpage/FAQ';
import Trust from '@/components/landingpage/Trust';

interface DynamicParams {
  slug?: string | Array<string>;
}

type ParamsSource = Promise<DynamicParams> | undefined;

async function resolveSlug(paramsSource: ParamsSource): Promise<string> {
  if (!paramsSource) {
    notFound();
  }

  const resolvedParams = await paramsSource;
  const rawSlug = resolvedParams?.slug;
  const slugCandidate = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slugCandidate) {
    notFound();
  }

  return slugCandidate;
}

async function loadData(slug: string) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  const client = new ConvexHttpClient(url);
  return client.query(api.landingPages.getLandingPage, { slug });
}

async function getPageMetadata(slug: string) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  const client = new ConvexHttpClient(url);
  const data = await client.query(api.landingPages.getLandingPage, { slug });
  if (!data) return null;
  const styling = data.landingPage?.styling ?? {};
  const meta = styling.meta ?? {};
  const layout = styling.layout ?? {};
  return {
    title: meta.title ?? '',
    description: meta.description ?? '',
    indexed: typeof meta.indexed === 'boolean' ? meta.indexed : true,
    favicon: typeof layout.favicon === 'string' ? layout.favicon : undefined,
  } as {
    title: string;
    description: string;
    indexed: boolean;
    favicon?: string;
  };
}

export async function generateMetadata({ params }: { params?: ParamsSource }): Promise<Metadata> {
  const slug = await resolveSlug(params);
  const metadata = await getPageMetadata(slug);
  if (!metadata) return notFound();

  return {
    title: metadata.title,
    description: metadata.description,
    robots: metadata.indexed
      ? { index: true, follow: true }
      : { index: false, follow: false },
    ...(metadata.favicon && {
      icons: {
        icon: metadata.favicon,
        shortcut: metadata.favicon,
        apple: metadata.favicon,
      },
    }),
  };
}

export default async function Page({ params }: { params?: ParamsSource }) {
  const slug = await resolveSlug(params);
  const data = await loadData(slug);
  if (!data) return notFound();

  const components: Record<string, React.ComponentType<any>> = {
    hero: Hero,
    steps: Steps,
    benefits: Benefits,
    about: About,
    testimonials: Testimonials,
    cta: CTA,
    images: ImageGallery,
    faq: FAQ,
    trust: Trust,
  };

  const headerSection = data.sections.find((section: any) =>
    typeof section.type === 'string' && section.type.startsWith('header')
  );
  const otherSections = data.sections.filter((section: any) =>
    !(typeof section.type === 'string' && section.type.startsWith('header'))
  );

  return (
    <>
      {headerSection && (
        <Header data={headerSection.content} />
      )}
      <main>
        {otherSections.map((section: any) => {
          const baseType = typeof section.type === 'string' ? section.type.split('-')[0] : '';
          const SectionComponent = components[baseType] ?? null;
          return (
            <section key={section._id}>
              {SectionComponent ? (
                <SectionComponent data={section.content} />
              ) : (
                <pre>{JSON.stringify(section.content, null, 2)}</pre>
              )}
            </section>
          );
        })}
      </main>
    </>
  );
}


