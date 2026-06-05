import Header from '../components/Header';
import Hero from '../components/Hero';
import HorizontalScroll from '../components/HorizontalScroll';
import Collections from '../components/Collections';
import Advantages from '../components/Advantages';
import SalonPhotos from '../components/SalonPhotos';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HorizontalScroll />
        <Collections />
        <Advantages />
        <SalonPhotos />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
