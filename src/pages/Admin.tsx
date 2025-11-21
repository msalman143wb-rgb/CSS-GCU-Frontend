import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Edit, Mail, Users } from "lucide-react";
import type { Event, TeamMember, Announcement, ContactMessage, Registration } from "../types";

async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'API request failed';
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
}

export default function Admin() {
  const [adminPassword, setAdminPassword] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  // Queries
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => apiRequest('/api/events'),
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['teamMembers'],
    queryFn: () => apiRequest('/api/team-members'),
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: () => apiRequest('/api/announcements'),
  });

  const {
    data: contactMessages = [],
    refetch: refetchContacts,
    isFetching: isFetchingContacts,
  } = useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: () =>
      apiRequest('/api/contact', {
        headers: {
          'x-admin-password': adminPassword,
        },
      }),
    enabled: false,
  });

  const {
    data: registrations = [],
    refetch: refetchRegistrations,
    isFetching: isFetchingRegistrations,
  } = useQuery<Registration[]>({
    queryKey: ['registrations'],
    queryFn: () =>
      apiRequest('/api/registrations', {
        headers: {
          'x-admin-password': adminPassword,
        },
      }),
    enabled: false,
  });

  // Event mutations
  const createEventMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/events', {
      method: 'POST',
      body: JSON.stringify({ ...data, adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setShowEventForm(false);
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setShowEventForm(false);
      setEditingEvent(null);
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/events/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  // Team member mutations
  const createMemberMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/team-members', {
      method: 'POST',
      body: JSON.stringify({ ...data, adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      setShowMemberForm(false);
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/team-members/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      setShowMemberForm(false);
      setEditingMember(null);
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/team-members/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  // Announcement mutations
  const createAnnouncementMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/announcements', {
      method: 'POST',
      body: JSON.stringify({ ...data, adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setShowAnnouncementForm(false);
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setShowAnnouncementForm(false);
      setEditingAnnouncement(null);
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/announcements/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ adminPassword }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  // Contact message mutation - FIXED
  const deleteContactMessageMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/contact/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': adminPassword,
      },
    }),
    onSuccess: () => {
      // Invalidate and refetch contact messages
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      refetchContacts(); // Force immediate refetch
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  // Registration mutation - FIXED
  const deleteRegistrationMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/registrations/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': adminPassword,
      },
    }),
    onSuccess: () => {
      // Invalidate and refetch registrations
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      refetchRegistrations(); // Force immediate refetch
      setError("");
    },
    onError: (error: Error) => setError(error.message),
  });

  // Form handlers
  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      image: formData.get('image') as string,
      registrationLink: formData.get('registrationLink') as string,
    };

    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleMemberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      bio: formData.get('bio') as string,
      image: formData.get('image') as string,
      socialLinks: formData.get('socialLinks') as string,
      order: parseInt(formData.get('order') as string) || 0,
    };

    if (editingMember) {
      updateMemberMutation.mutate({ id: editingMember.id, data });
    } else {
      createMemberMutation.mutate(data);
    }
  };

  const handleAnnouncementSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as string,
      date: formData.get('date') as string,
    };

    if (editingAnnouncement) {
      updateAnnouncementMutation.mutate({ id: editingAnnouncement.id, data });
    } else {
      createAnnouncementMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <Label htmlFor="adminPassword">Admin Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="registrations">Registration Requests</TabsTrigger>
            <TabsTrigger value="contact">Contact Messages</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Events</h2>
              <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingEvent(null)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" defaultValue={editingEvent?.title} required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" defaultValue={editingEvent?.description} required />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" name="date" type="date" defaultValue={editingEvent?.date} required />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" defaultValue={editingEvent?.location} required />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" defaultValue={editingEvent?.image || ''} />
                    </div>
                    <div>
                      <Label htmlFor="registrationLink">Registration Link</Label>
                      <Input id="registrationLink" name="registrationLink" defaultValue={editingEvent?.registrationLink || ''} />
                    </div>
                    <Button type="submit" disabled={!adminPassword}>
                      {editingEvent ? 'Update' : 'Create'} Event
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{event.title}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingEvent(event);
                            setShowEventForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteEventMutation.mutate(event.id)}
                          disabled={!adminPassword}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    <p className="text-sm"><strong>Date:</strong> {event.date}</p>
                    <p className="text-sm"><strong>Location:</strong> {event.location}</p>
                    {event.image && (
                      <p className="text-sm"><strong>Image:</strong> {event.image}</p>
                    )}
                    {event.registrationLink && (
                      <p className="text-sm">
                        <strong>Registration:</strong>{' '}
                        <a href={event.registrationLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {event.registrationLink}
                        </a>
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Announcements</h2>
              <Dialog open={showAnnouncementForm} onOpenChange={setShowAnnouncementForm}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingAnnouncement(null)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" defaultValue={editingAnnouncement?.title} required />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea id="content" name="content" defaultValue={editingAnnouncement?.content} required />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Input id="type" name="type" defaultValue={editingAnnouncement?.type} placeholder="e.g., Opportunity, Event, Notice" required />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" name="date" type="date" defaultValue={editingAnnouncement?.date} required />
                    </div>
                    <Button type="submit" disabled={!adminPassword}>
                      {editingAnnouncement ? 'Update' : 'Create'} Announcement
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{announcement.title}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingAnnouncement(announcement);
                            setShowAnnouncementForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
                          disabled={!adminPassword}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                    <p className="text-sm"><strong>Type:</strong> {announcement.type}</p>
                    <p className="text-sm"><strong>Date:</strong> {announcement.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Team Members</h2>
              <Dialog open={showMemberForm} onOpenChange={setShowMemberForm}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingMember(null)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleMemberSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" defaultValue={editingMember?.name} required />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" name="role" defaultValue={editingMember?.role} required />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" defaultValue={editingMember?.bio || ''} />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" defaultValue={editingMember?.image || ''} />
                    </div>
                    <div>
                      <Label htmlFor="socialLinks">Social Links (JSON)</Label>
                      <Textarea id="socialLinks" name="socialLinks" defaultValue={editingMember?.socialLinks || ''} placeholder='{"github": "url", "linkedin": "url"}' />
                    </div>
                    <div>
                      <Label htmlFor="order">Display Order</Label>
                      <Input id="order" name="order" type="number" defaultValue={editingMember?.order || 0} />
                    </div>
                    <Button type="submit" disabled={!adminPassword}>
                      {editingMember ? 'Update' : 'Create'} Team Member
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{member.name}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingMember(member);
                            setShowMemberForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMemberMutation.mutate(member.id)}
                          disabled={!adminPassword}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm"><strong>Role:</strong> {member.role}</p>
                    {member.bio && <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>}
                    {member.image && (
                      <p className="text-sm mt-2">
                        <strong>Image:</strong> {member.image}
                      </p>
                    )}
                    {member.socialLinks && (
                      <p className="text-sm mt-2">
                        <strong>Social Links:</strong> {member.socialLinks}
                      </p>
                    )}
                    <p className="text-sm mt-2"><strong>Order:</strong> {member.order}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Registration Requests Tab */}
          <TabsContent value="registrations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Registration Requests</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => refetchRegistrations()} 
                  disabled={!adminPassword || isFetchingRegistrations}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {isFetchingRegistrations ? 'Loading...' : 'Load Registrations'}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {registrations.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      {!adminPassword 
                        ? 'Enter admin password and click "Load Registrations"' 
                        : isFetchingRegistrations 
                          ? 'Loading registrations...' 
                          : 'No registration requests yet.'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                registrations.map((registration) => (
                  <Card key={registration.id} className="relative">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <div>
                          <span className="text-lg">{registration.name}</span>
                          <p className="text-sm font-normal text-muted-foreground mt-1">
                            {registration.phone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteRegistrationMutation.mutate(registration.id)}
                            disabled={!adminPassword}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm"><strong>Roll Number:</strong> {registration.roll_number}</p>
                          <p className="text-sm"><strong>Department:</strong> {registration.department}</p>
                        </div>
                        <div>
                          <p className="text-sm"><strong>Event:</strong></p>
                          <p className="text-sm text-muted-foreground">{registration.event_title}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Registered: {new Date(registration.created_at).toLocaleDateString()} at{' '}
                          {new Date(registration.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="contact" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Contact Messages</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {contactMessages.length} message{contactMessages.length !== 1 ? 's' : ''}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => refetchContacts()} 
                  disabled={!adminPassword || isFetchingContacts}
                >
                  {isFetchingContacts ? 'Loading...' : 'Load Messages'}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {contactMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      {!adminPassword 
                        ? 'Enter admin password and click "Load Messages"' 
                        : isFetchingContacts 
                          ? 'Loading messages...' 
                          : 'No contact messages yet.'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                contactMessages.map((message) => (
                  <Card key={message.id} className="relative">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <div>
                          <span className="text-lg">{message.name}</span>
                          <p className="text-sm font-normal text-muted-foreground mt-1">
                            {message.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`mailto:${message.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteContactMessageMutation.mutate(message.id)}
                            disabled={!adminPassword}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{message.message}</p>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Received: {new Date(message.createdAt).toLocaleDateString()} at{' '}
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                        <a
                          href={`mailto:${message.email}?subject=Re: Your message to CSS GCU&body=Dear ${message.name},%0D%0A%0D%0AThank you for your message...`}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Reply via Email
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}