import { z } from 'zod'
import { validatePhoneNumber, getCountryByCode } from './countries'

// User details validation schema
export const userDetailsSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters')
    .toLowerCase()
    .trim(),
  
  countryCode: z
    .string()
    .min(2, 'Please select a country')
    .max(2, 'Invalid country code'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .trim(),
  
  position: z
    .string()
    .min(2, 'Position must be at least 2 characters long')
    .max(100, 'Position must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal(''))
}).refine((data) => {
  // Custom validation for phone number based on country
  const phoneValidation = validatePhoneNumber(data.phone, data.countryCode);
  return phoneValidation.isValid;
}, {
  message: "Invalid phone number for selected country",
  path: ["phone"]
});

// Type inference from schema
export type UserDetails = z.infer<typeof userDetailsSchema>

// Validation result type
export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string>
  data?: UserDetails
}

// Validate function with detailed error handling
export const validateUserDetails = (data: any): ValidationResult => {
  try {
    const validatedData = userDetailsSchema.parse(data)
    return {
      isValid: true,
      errors: {},
      data: validatedData
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errors[issue.path[0] as string] = issue.message
        }
      })
      return {
        isValid: false,
        errors
      }
    }
    return {
      isValid: false,
      errors: { general: 'Validation failed' }
    }
  }
}

// Field-specific validation for real-time feedback
export const validateField = (field: keyof UserDetails, value: string, countryCode?: string): string | null => {
  try {
    if (field === 'phone' && countryCode) {
      // Special handling for phone validation with country
      const phoneValidation = validatePhoneNumber(value, countryCode);
      return phoneValidation.isValid ? null : phoneValidation.error || 'Invalid phone number';
    }
    
    const fieldSchema = userDetailsSchema.shape[field]
    fieldSchema.parse(value)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Invalid input'
    }
    return 'Invalid input'
  }
}
