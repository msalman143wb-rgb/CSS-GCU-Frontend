import { Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { SiGithub } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/CSSGCU/" },
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/css.gcu/?hl=en" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/computer-science-society-gcu/" },
  ];

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Computer Science Society</h3>
            <p className="text-muted-foreground text-sm">
              Government College University Lahore
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Empowering future tech leaders through innovation and collaboration.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="/team" className="text-muted-foreground hover:text-foreground transition-colors">
                  Team
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 bg-muted hover-elevate active-elevate-2 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`footer-link-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:css@gcu.edu.pk" className="hover:text-foreground transition-colors">
                css@gcu.edu.pk
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Computer Science Society, GCU Lahore. All rights reserved.</p>
          <p className="mt-2">Built for Tech Taakra 2025 By<i> Muhammad Salman</i> and <i>Huzaifa Saeed</i></p>
        </div>
      </div>
    </footer>
  );
}
