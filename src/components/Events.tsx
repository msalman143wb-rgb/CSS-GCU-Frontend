import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@/components/ui/Events.css";
import { Calendar, MapPin } from "lucide-react";
import EventRegistrationForm from "./EventRegistrationForm";
import type { Event } from "../types";


async function fetchEvents() {
  const response = await fetch('/api/events');
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

export default function Events() {
  const [registrationEvent, setRegistrationEvent] = useState<string | null>(null);
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const today = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= today);
  const pastEvents = events.filter(event => new Date(event.date) < today);

  // Refs to marquee divs for controlling pause/play
  const upcomingRef = useRef<HTMLDivElement>(null);
  const pastRef = useRef<HTMLDivElement>(null);

  const handleHover = (ref: React.RefObject<HTMLDivElement>, paused: boolean) => {
    if (ref.current) {
      if (paused) ref.current.classList.add("animateMarqueePaused");
      else ref.current.classList.remove("animateMarqueePaused");
    }
  };

  const renderMarquee = (eventsList: Event[], showRegisterButton: boolean, ref: React.RefObject<HTMLDivElement>) => (
    <div
      className="marquee-container"
      onMouseEnter={() => handleHover(ref, true)}
      onMouseLeave={() => handleHover(ref, false)}
    >
      <div ref={ref} className="animateMarquee">
        {eventsList.concat(eventsList).map((event, idx) => (
          <div
            key={`${event.id}-${idx}`}
            className="min-w-[430px] max-w-[430px] overflow-hidden hover-elevate active-elevate-2 inline-block mr-6"
          >
            {event.image && (
              <img
                src={`/attached_assets/generated_images/${event.image}`}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <p className="text-muted-foreground mb-4">{event.description}</p>
              {showRegisterButton && event.registrationLink && (
                <Button
                  className="w-full"
                  onClick={() => setRegistrationEvent(event.title)}
                >
                  Register Now
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Events</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From workshops to hackathons, we organize events that inspire learning and innovation
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-8 overflow-hidden">
              {upcomingEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
                </div>
              ) : renderMarquee(upcomingEvents, true, upcomingRef)}
            </TabsContent>

            <TabsContent value="past" className="space-y-8 overflow-hidden">
              {pastEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No past events to display.</p>
                </div>
              ) : renderMarquee(pastEvents, false, pastRef)}
            </TabsContent>
          </Tabs>
        )}

        {registrationEvent && (
          <EventRegistrationForm
            eventTitle={registrationEvent}
            onClose={() => setRegistrationEvent(null)}
          />
        )}
      </div>
    </section>
  );
}
