import { z } from 'zod';

export const CreateAddressSchema = z.object({
  userId: z.string().uuid(),
  label: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  stateProvince: z.string().optional(),
  postalCode: z.string().min(1, 'Postal Code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().default(false).optional(),
});

export const UpdateAddressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1, 'Street is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  stateProvince: z.string().optional(),
  postalCode: z.string().min(1, 'Postal Code is required').optional(),
  country: z.string().min(1, 'Country is required').optional(),
  isDefault: z.boolean().optional(),
});