import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional().nullable(),
  tourType: z.string().min(1, 'Tour type is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
  source: z.string().max(100).optional(),
});

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  shortDescription: z.string().min(1, 'Short description is required').max(500),
  fullDescription: z.string().min(1, 'Full description is required').max(10000),
  deliveryType: z.enum(['ONLINE', 'IN_PERSON', 'HYBRID']),
  category: z.string().min(1).max(100),
  level: z.string().min(1).max(50),
  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().min(0).optional().nullable(),
  durationHours: z.coerce.number().int().min(1),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  seatCapacity: z.coerce.number().int().min(1).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  thumbnail: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export const lessonSchema = z.object({
  courseId: z.string().min(1),
  moduleTitle: z.string().min(1, 'Module title is required').max(200),
  lessonTitle: z.string().min(1, 'Lesson title is required').max(200),
  lessonType: z.enum(['CONTENT', 'QUIZ']).optional(),
  videoUrl: z.string().url().optional().nullable().or(z.literal('')),
  content: z.string().max(50000).optional().nullable(),
  resources: z.string().max(5000).optional().nullable(),
  questions: z.any().optional().nullable(),
  orderIndex: z.coerce.number().int().min(0),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  bio: z.string().max(2000).optional().nullable(),
});

export const templateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  type: z.string().min(1).max(50),
  subject: z.string().min(1, 'Subject is required').max(300),
  body: z.string().min(1, 'Body is required').max(10000),
  variables: z.string().max(1000).optional().nullable(),
  isActive: z.boolean().optional(),
});

export function formatZodError(error: z.ZodError): string {
  return error.issues.map(e => e.message).join(', ');
}
