import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TeamMember } from "../types";
import styles from "@/components/ui/Team.module.css";

// Fetch team members from API
async function fetchTeamMembers() {
  const response = await fetch("/api/team-members");
  if (!response.ok) {
    throw new Error("Failed to fetch team members");
  }
  return response.json();
}

// Get initials for fallback avatar
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Get member image from attached_assets folder
const getMemberImage = (member: TeamMember) => {
  const fileName = member.name + ".PNG";
  return `/attached_assets/generated_images/${fileName}`;
};

export default function Team() {
  const [isHovered, setIsHovered] = useState(false);

  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["teamMembers"],
    queryFn: fetchTeamMembers,
  });

  // Sort members by order
  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order);

  // Separate president
  const president = sortedMembers.find(
    (member) => member.role.toLowerCase() === "president"
  );
  const otherMembers = sortedMembers.filter((member) => member !== president);

  // Loading or empty state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  if (sortedMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No team members to display.</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-card" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            data-testid="text-team-title"
          >
            Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the dedicated individuals leading the Computer Science Society
          </p>
        </div>

        {/* President */}
        {president && (
          <div className="flex justify-center mb-12">
            <Card className="p-6 w-72 hover-elevate active-elevate-2 flex flex-col items-center text-center">
              <Avatar className="w-28 h-28 mb-4 border-4 border-accent/20">
                {president.name ? (
                  <AvatarImage
                    src={getMemberImage(president)}
                    alt={president.name}
                  />
                ) : (
                  <AvatarFallback>{getInitials(president.name)}</AvatarFallback>
                )}
              </Avatar>
              <h4 className="text-lg font-semibold mb-1">{president.name}</h4>
              <p className="text-sm text-muted-foreground">{president.role}</p>
              {president.bio && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                  {president.bio}
                </p>
              )}
            </Card>
          </div>
        )}

        {/* Other Members - marquee */}
        {otherMembers.length > 0 && (
          <div
            className="overflow-hidden relative py-4 h-64 flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`flex gap-6 items-center justify-center ${
                styles.animateMarquee
              } ${isHovered ? styles.animateMarqueePaused : ""}`}
            >
              {otherMembers.concat(otherMembers).map((member, idx) => (
                <Card
                  key={idx}
                  className="p-6 w-64 flex-shrink-0 hover-elevate active-elevate-2 flex flex-col items-center text-center"
                  data-testid={`card-team-${member.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <Avatar className="w-24 h-24 mb-4 border-4 border-accent/20">
                    {member.name ? (
                      <AvatarImage
                        src={getMemberImage(member)}
                        alt={member.name}
                      />
                    ) : (
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <h4 className="text-lg font-semibold mb-1">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  {member.bio && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
