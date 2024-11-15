import { Contact } from '@/components/landing/contact';
import { CTA } from '@/components/landing/cta';
import { FAQs } from '@/components/landing/faqs';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Pricing } from '@/components/landing/pricing';
import { Stats } from '@/components/landing/stats';

export default function Home() {
  return (
    <>
      <div className='p-3'>
        <Header />
        <Hero />
        <Features />
        <Stats />
        <Pricing />
        <FAQs />
        <CTA />
        <Contact />
        <Footer />
      </div>

    </>
  );
}
