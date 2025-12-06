import {z} from "zod";
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  nationality: z.string().min(2, "Nationality is required"),
  email: z.string().email("Invalid email address"),
});

export const addressSchema = z.object({
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  fullAddress: z.string().min(5, "Full address is required"),
});

export const documentSchema = z.object({
  documentType: z.string().min(1, "Please select a document type"),
  file: z
    .any()
    .refine((file) => file && file.length > 0, "Please upload a document"),
});