import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
});

export const createTaskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Status is required"),
  userId: z.number().int().positive("User ID must be a positive integer"),
});

export const updateTaskSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  status: z.string().min(1, "Status is required").optional(),
  userId: z
    .number()
    .int()
    .positive("User ID must be a positive integer")
    .optional(),
});
