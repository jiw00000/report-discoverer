import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ResourceTypes from "@/components/ResourceTypes";
import ImageSearch from "@/components/ImageSearch";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <section id="categories">
          <CategoryGrid />
        </section>
        <section id="resources">
          <ResourceTypes />
        </section>
        <section id="images">
          <ImageSearch />
        </section>
        <section id="features">
          <Features />
        </section>
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
