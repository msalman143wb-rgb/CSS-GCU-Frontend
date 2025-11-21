import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Megaphone, Calendar } from "lucide-react";
import type { Announcement } from "../types";

async function fetchAnnouncements() {
  const response = await fetch('/api/announcements');
  if (!response.ok) {
    throw new Error('Failed to fetch announcements');
  }
  return response.json();
}

function getIcon(type: string) {
  const iconMap: Record<string, any> = {
    'Opportunity': Megaphone,
    'Event': Calendar,
    'Notice': Bell,
    'Result': Megaphone,
  };
  return iconMap[type] || Bell;
}

export default function Announcements() {
  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
  });

  return (
    <section className="py-20" id="announcements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-announcements-title">
            Announcements
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest news, opportunities, and important notices
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((announcement) => {
              const Icon = getIcon(announcement.type);
              return (
                <Card
                  key={announcement.id}
                  className="p-6 hover-elevate active-elevate-2"
                  data-testid={`card-announcement-${announcement.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        <Badge variant="secondary" className="flex-shrink-0">
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{new Date(announcement.date).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">{announcement.content}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
