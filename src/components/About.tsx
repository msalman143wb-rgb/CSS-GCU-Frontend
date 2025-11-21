import { Card } from "@/components/ui/card";
import { Target, Eye, Award } from "lucide-react";

export default function About() {
  const sections = [
    {
      icon: Eye,
      title: "Our Vision",
      content: "To foster a vibrant community of computer science enthusiasts who push the boundaries of technology and innovation.",
    },
    {
      icon: Target,
      title: "Our Mission",
      content: "Empowering students through workshops, competitions, and collaborative projects that bridge academic learning with real-world applications.",
    },
    {
      icon: Award,
      title: "Our Goals",
      content: "Create opportunities for skill development, professional networking, and hands-on experience in cutting-edge technologies.",
    },
  ];

  return (
    <section className="py-20 bg-card" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-about-title">
            About Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The Computer Science Society at GCU Lahore is dedicated to nurturing talent, 
            promoting innovation, and building a strong community of future tech leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <Card
              key={index}
              className="p-6 hover-elevate active-elevate-2"
              data-testid={`card-about-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <section.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
                <p className="text-muted-foreground">{section.content}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-background rounded-lg p-8 border">
          <h3 className="text-2xl font-semibold mb-4">Our History</h3>
          <p className="text-muted-foreground leading-relaxed">
            Founded by passionate computer science students at Government College University Lahore, 
            the Computer Science Society has grown into one of the most active and influential student 
            organizations on campus. Through years of organizing hackathons, workshops, seminars, and 
            tech talks, we've created a platform where students can learn, collaborate, and innovate 
            together. Our society continues to be a driving force in promoting technological excellence 
            and fostering the next generation of computer scientists and engineers.
          </p>
        </div>
      </div>
    </section>
  );
}
