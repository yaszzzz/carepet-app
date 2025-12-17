import HeroSection from "./organisms/HeroSection/HeroSection";
import { AboutSection } from "./organisms/AboutSection";
import { ServicesSection } from "./organisms/ServicesSection";
import { GallerySection } from "./organisms/GallerySection/GallerySection";
import { TeamSection } from "./organisms/TeamSection/TeamSection";
import { ContactSection } from "./organisms/ContactSection/ContactSection";

export default function Homesection() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <TeamSection />
      <ContactSection />
    </div>
  );
}