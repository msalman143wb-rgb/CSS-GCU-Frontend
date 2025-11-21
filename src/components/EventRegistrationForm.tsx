import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventRegistrationFormProps {
  eventTitle: string;
  onClose: () => void;
}

export default function EventRegistrationForm({ eventTitle, onClose }: EventRegistrationFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    department: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-()]+$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Extra check to ensure eventTitle exists
  if (!eventTitle || !eventTitle.trim()) {
    toast({
      title: "Error",
      description: "Event title is missing. Please try again.",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);
  try {
    const payload = {
      name: formData.name.trim(),
      roll_number: formData.rollNo.trim(),
      department: formData.department.trim(),
      phone: formData.phone.trim(),
      event_title: eventTitle.trim(),
    };

    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error || "Failed to submit registration");
    }

    const data = await response.json();
    console.log("Registration saved:", data);

    setIsSuccess(true);
    toast({
      title: "Registration Successful!",
      description: `You've been registered for ${eventTitle}`,
    });

    setTimeout(() => onClose(), 2000);
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to submit registration",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Registration Successful!</h3>
          <p className="text-muted-foreground">
            You've been registered for {eventTitle}. Check your email for confirmation.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-semibold mb-1">Event Registration</h3>
            <p className="text-sm text-muted-foreground">{eventTitle}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "rollNo", "department", "phone"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field === "name"
                  ? "Full Name"
                  : field === "rollNo"
                  ? "Roll Number"
                  : field === "department"
                  ? "Department"
                  : "Phone Number"}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id={field}
                type={field === "phone" ? "tel" : "text"}
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                }
                placeholder={
                  field === "name"
                    ? "John Doe"
                    : field === "rollNo"
                    ? "BSCS-2021-001"
                    : field === "department"
                    ? "BSCS, BBA, etc."
                    : "+92 300 1234567"
                }
                className={errors[field] ? "border-destructive" : ""}
              />
              {errors[field] && (
                <p className="text-sm text-destructive mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
