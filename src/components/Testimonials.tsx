import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

//todo: remove mock functionality
const testimonials = [
  {
    name: "Usman Ali",
    role: "CS Graduate 2024",
    content: "Being part of CSS helped me develop not just technical skills, but also leadership and teamwork abilities. The hackathons and workshops were game-changers for my career.",
    initials: "UA",
  },
  {
    name: "Ayesha Malik",
    role: "Current Member",
    content: "The society provides an amazing platform to learn from industry experts and collaborate with talented peers. It's been instrumental in my growth as a developer.",
    initials: "AM",
  },
  {
    name: "Hassan Raza",
    role: "Alumni, Software Engineer",
    content: "CSS events gave me hands-on experience that I couldn't get in the classroom. The networking opportunities and mentorship were invaluable for landing my first job.",
    initials: "HR",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-title">
            What Our Members Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hear from students who've experienced the impact of being part of our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover-elevate active-elevate-2 relative"
              data-testid={`card-testimonial-${index}`}
            >
              <Quote className="h-8 w-8 text-accent/30 mb-4" />
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-accent/20">
                  <AvatarFallback className="bg-accent/10 text-accent-foreground">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
