import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Events from "@/components/Events";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Announcements from "@/components/Announcements";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Stats />
      <Events />
      <Team />
      <Testimonials />
      <Announcements />
      <Contact />
    </div>
  );
}
