import HeroSection from "./organisms/HeroSection/HeroSection";
import { AboutSection } from "./organisms/AboutSection";
import { ServicesSection } from "./organisms/ServicesSection";

export default function Homesection() {
    return (
       <div>
         <HeroSection />
         <AboutSection />
         <ServicesSection />
       </div>
    );
}