import { useEffect, useRef, useState } from "react";
import { Users, Calendar, Award, Code } from "lucide-react";

interface Stat {
  icon: typeof Users;
  value: number;
  label: string;
  suffix?: string;
}

//todo: remove mock functionality
const stats: Stat[] = [
  { icon: Users, value: 500, label: "Active Members", suffix: "+" },
  { icon: Calendar, value: 50, label: "Events Organized", suffix: "+" },
  { icon: Award, value: 15, label: "Competitions Won", suffix: "" },
  { icon: Code, value: 100, label: "Projects Built", suffix: "+" },
];

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const endTime = startTime + duration;

          const updateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const currentCount = Math.floor(progress * end);
            
            setCount(currentCount);

            if (now < endTime) {
              requestAnimationFrame(updateCount);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(updateCount);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={countRef}>
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-stats-title">
            Our Impact
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
            Numbers that showcase our community's growth and achievements
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-lg mb-4">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
