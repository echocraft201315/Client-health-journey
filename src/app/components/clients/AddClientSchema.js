import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  programId: z.string().min(1, { message: 'Please select a program.' }),
  programCategory: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Please enter a valid date in YYYY-MM-DD format.'
  }),
  notes: z.string().optional(),
  coachId: z.string().min(1, { message: 'Please select a coach.' }),
  initialWeight: z.number().optional(),
  weightDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Please enter a valid date in YYYY-MM-DD format.'
  }),
  goals: z.array(z.enum(['weight_loss', 'skin_tightening', 'build_muscle', 'improve_health'])).default([]),
  goalWeight: z.number().optional(),
});

export const formSchema2 = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  programId: z.string().min(1, { message: 'Please select a program.' }),
  programCategory: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Please enter a valid date in YYYY-MM-DD format.'
  }),
  notes: z.string().optional(),
  coachId: z.string().optional(),
  initialWeight: z.number().optional(),
  weightDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Please enter a valid date in YYYY-MM-DD format.'
  }),
  goals: z.array(z.enum(['weight_loss', 'skin_tightening', 'build_muscle', 'improve_health'])).default([]),
  goalWeight: z.number().optional(),
});


export const clientGoals = [
  { id: 'weight_loss', label: 'Weight Loss' },
  { id: 'skin_tightening', label: 'Skin Tightening' },
  { id: 'build_muscle', label: 'Build Muscle' },
  { id: 'improve_health', label: 'Improve Overall Health' }
];
