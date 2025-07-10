import { z } from 'zod';

export const planOptions = [
  {
    id: "basic",
    name: "Basic",
    description: "For small clinics just getting started",
    price: "$149/month",
    features: ["Up to 50 clients", "1 coach account", "Basic analytics"]
  },
  {
    id: "professional",
    name: "Professional",
    description: "For established clinics",
    price: "$249/month",
    features: ["Up to 200 clients", "5 coach accounts", "Advanced analytics", "Email support"]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large clinics with multiple locations",
    price: "$399/month",
    features: ["Unlimited clients", "Unlimited coach accounts", "Custom analytics", "Priority support", "Optional clinic branding (add-on)"]
  }
];

export const addOnOptions = [
  {
    id: "clinic-branding",
    name: "Your Clinic Branding",
    description: "Custom logo and color scheme for your clinic's portal",
    price: "$499 one-time setup fee",
    availableFor: ["enterprise"]
  }
];

export const clinicSignupSchema = z.object({
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicEmail: z.string().email("Invalid email format").min(1, "Email is required"),
  clinicPhone: z.string().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  primaryContact: z.string().min(1, "Primary contact is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  hipaaAcknowledgment: z.boolean().refine(val => val === true, {
    message: "You must acknowledge the HIPAA disclaimer",
  }),
  legalAcknowledgment: z.boolean().refine(val => val === true, {
    message: "You must agree to the Terms and Privacy Policy",
  }),
  selectedPlan: z.string().min(1, "Please select a plan"),
  addOns: z.array(z.string()).optional().default([]),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const coachSignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

