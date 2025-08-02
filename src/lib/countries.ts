// Country data with calling codes and phone number patterns
export interface Country {
  code: string;
  name: string;
  callingCode: string;
  flag: string;
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  example: string;
}

export const countries: Country[] = [
{
    code: 'IN',
    name: 'India',
    callingCode: '+91',
    flag: '🇮🇳',
    minLength: 10,
    maxLength: 10,
    pattern: /^[6-9]\d{9}$/,
    example: '9876543210'
  },
  {
    code: 'US',
    name: 'United States',
    callingCode: '+1',
    flag: '🇺🇸',
    minLength: 10,
    maxLength: 10,
    pattern: /^\d{10}$/,
    example: '(555) 123-4567'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    callingCode: '+44',
    flag: '🇬🇧',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{8,9}$/,
    example: '7911 123456'
  },
  {
    code: 'CA',
    name: 'Canada',
    callingCode: '+1',
    flag: '🇨🇦',
    minLength: 10,
    maxLength: 10,
    pattern: /^\d{10}$/,
    example: '(416) 555-1234'
  },
  {
    code: 'AU',
    name: 'Australia',
    callingCode: '+61',
    flag: '🇦🇺',
    minLength: 9,
    maxLength: 9,
    pattern: /^[2-478]\d{8}$/,
    example: '412 345 678'
  },
  {
    code: 'DE',
    name: 'Germany',
    callingCode: '+49',
    flag: '🇩🇪',
    minLength: 10,
    maxLength: 12,
    pattern: /^[1-9]\d{9,11}$/,
    example: '30 12345678'
  },
  {
    code: 'FR',
    name: 'France',
    callingCode: '+33',
    flag: '🇫🇷',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    example: '1 23 45 67 89'
  },
  {
    code: 'JP',
    name: 'Japan',
    callingCode: '+81',
    flag: '🇯🇵',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{9,10}$/,
    example: '90 1234 5678'
  },
  {
    code: 'CN',
    name: 'China',
    callingCode: '+86',
    flag: '🇨🇳',
    minLength: 11,
    maxLength: 11,
    pattern: /^1[3-9]\d{9}$/,
    example: '138 0013 8000'
  },
  {
    code: 'BR',
    name: 'Brazil',
    callingCode: '+55',
    flag: '🇧🇷',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{9,10}$/,
    example: '11 99999-9999'
  },
  {
    code: 'MX',
    name: 'Mexico',
    callingCode: '+52',
    flag: '🇲🇽',
    minLength: 10,
    maxLength: 10,
    pattern: /^[1-9]\d{9}$/,
    example: '55 1234 5678'
  },
  {
    code: 'RU',
    name: 'Russia',
    callingCode: '+7',
    flag: '🇷🇺',
    minLength: 10,
    maxLength: 10,
    pattern: /^[3-9]\d{9}$/,
    example: '912 345-67-89'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    callingCode: '+27',
    flag: '🇿🇦',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    example: '82 123 4567'
  },
  {
    code: 'KR',
    name: 'South Korea',
    callingCode: '+82',
    flag: '🇰🇷',
    minLength: 9,
    maxLength: 10,
    pattern: /^[1-9]\d{8,9}$/,
    example: '10 1234 5678'
  },
  {
    code: 'IT',
    name: 'Italy',
    callingCode: '+39',
    flag: '🇮🇹',
    minLength: 9,
    maxLength: 10,
    pattern: /^[3]\d{8,9}$/,
    example: '312 345 6789'
  },
  {
    code: 'ES',
    name: 'Spain',
    callingCode: '+34',
    flag: '🇪🇸',
    minLength: 9,
    maxLength: 9,
    pattern: /^[6-9]\d{8}$/,
    example: '612 34 56 78'
  },
  {
    code: 'NL',
    name: 'Netherlands',
    callingCode: '+31',
    flag: '🇳🇱',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    example: '6 12345678'
  },
  {
    code: 'SE',
    name: 'Sweden',
    callingCode: '+46',
    flag: '🇸🇪',
    minLength: 9,
    maxLength: 9,
    pattern: /^[1-9]\d{8}$/,
    example: '70 123 45 67'
  },
  {
    code: 'NO',
    name: 'Norway',
    callingCode: '+47',
    flag: '🇳🇴',
    minLength: 8,
    maxLength: 8,
    pattern: /^[2-9]\d{7}$/,
    example: '412 34 567'
  },
  {
    code: 'SG',
    name: 'Singapore',
    callingCode: '+65',
    flag: '🇸🇬',
    minLength: 8,
    maxLength: 8,
    pattern: /^[3689]\d{7}$/,
    example: '8123 4567'
  }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const validatePhoneNumber = (phone: string, countryCode: string): { isValid: boolean; error?: string } => {
  const country = getCountryByCode(countryCode);
  
  if (!country) {
    return { isValid: false, error: 'Invalid country selected' };
  }

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < country.minLength) {
    return { 
      isValid: false, 
      error: `Phone number must be at least ${country.minLength} digits for ${country.name}` 
    };
  }
  
  if (cleanPhone.length > country.maxLength) {
    return { 
      isValid: false, 
      error: `Phone number must be at most ${country.maxLength} digits for ${country.name}` 
    };
  }
  
  if (!country.pattern.test(cleanPhone)) {
    return { 
      isValid: false, 
      error: `Invalid phone number format for ${country.name}. Example: ${country.example}` 
    };
  }
  
  return { isValid: true };
};

export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  if (!country) return phone;
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Basic formatting based on country
  switch (countryCode) {
    case 'US':
    case 'CA':
      if (cleanPhone.length >= 6) {
        return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
      } else if (cleanPhone.length >= 3) {
        return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3)}`;
      }
      return cleanPhone;
    
    case 'IN':
      // Return phone number without any formatting (no gaps)
      return cleanPhone;
    
    default:
      // Default formatting: add space every 3-4 digits
      return cleanPhone.replace(/(\d{3,4})(?=\d)/g, '$1 ');
  }
};
