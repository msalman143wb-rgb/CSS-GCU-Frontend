import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const navItems = [
    { name: "Home", path: "/", hash: "" },
    { name: "About", path: "/", hash: "#about" },
    { name: "Events", path: "/", hash: "#events" },
    { name: "Team", path: "/", hash: "#team" },
    { name: "Announcements", path: "/", hash: "#announcements" },
    { name: "Contact", path: "/", hash: "#contact" },
  ];

  // Scroll to section if hash is provided
  const scrollToSection = (hash: string) => {
    setMobileMenuOpen(false);

    setTimeout(() => {
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  // Detect current section in viewport
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.filter((item) => item.hash).map((item) => item.hash);
      let current = "";
      for (const hash of sections) {
        const el = document.querySelector(hash);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 100) current = hash;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderNavButton = (item: typeof navItems[0], mobile = false) => {
  const isActive = activeSection === item.hash;
  const btnClass = isActive
  ? "relative after:block after:absolute after:left-0 after-bottom-0 after:w-full after:h-0.5 after:bg-primary after:translate-y-full"
  : "";


  return (
    <Button
      key={item.name}
      onClick={() => scrollToSection(item.hash)}
      data-testid={`link-${mobile ? "mobile" : "nav"}-${item.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
      variant="ghost"
      size={mobile ? undefined : "sm"}
      className={`${mobile ? "w-full justify-start" : "relative"} ${btnClass}`}
      type="button"
    >
      {item.name}
    </Button>
  );
};

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
          >
            <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center">
              <img
                src="favicon.png" // <-- replace with your logo path
                alt="Logo"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight">
                Computer Science Society
              </span>
              <span className="text-xs text-muted-foreground">GCU Lahore</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => renderNavButton(item))}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => renderNavButton(item, true))}
          </div>
        </div>
      )}
    </nav>
  );
}
