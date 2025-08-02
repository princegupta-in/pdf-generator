"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { pdf } from '@react-pdf/renderer'
import PDFDocument from '@/components/PDFDocument'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UserDetails, validateUserDetails, validateField } from '@/lib/validation'
import { countries, formatPhoneNumber, getCountryByCode } from '@/lib/countries'

export default function UserDetailsForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<UserDetails>({
    name: "",
    email: "",
    countryCode: "IN", // Default to India
    phone: "",
    position: "",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('pdfFormData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        const validation = validateUserDetails(parsedData)
        
        if (validation.isValid && validation.data) {
          setFormData(validation.data)
          setDataLoaded(true)
        } else {
          // If saved data is invalid, still load it but show validation errors
          setFormData(parsedData)
          setErrors(validation.errors)
          setDataLoaded(true)
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error)
        // Clear invalid data from localStorage
        localStorage.removeItem('pdfFormData')
      }
    }
  }, [])

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    const updatedData = {
      ...formData,
      [field]: value,
    }
    
    setFormData(updatedData)

    // Save to localStorage immediately for persistence
    localStorage.setItem('pdfFormData', JSON.stringify(updatedData))

    // Real-time validation with country context for phone
    let error: string | null = null;
    if (field === 'phone') {
      error = validateField(field, value, formData.countryCode);
    } else {
      error = validateField(field, value);
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }))
  }

  const handleCountryChange = (countryCode: string) => {
    const updatedData = {
      ...formData,
      countryCode,
      phone: '', // Clear phone when country changes
    }
    
    setFormData(updatedData)
    localStorage.setItem('pdfFormData', JSON.stringify(updatedData))
    
    // Clear phone error when country changes
    setErrors(prev => ({
      ...prev,
      phone: '',
      countryCode: ''
    }))
  }

  const handlePhoneChange = (value: string) => {
    // Format phone number based on country
    const formattedPhone = formatPhoneNumber(value, formData.countryCode);
    handleInputChange('phone', formattedPhone);
  }

  const clearForm = () => {
    const emptyData = {
      name: "",
      email: "",
      countryCode: "IN",
      phone: "",
      position: "",
      description: "",
    }
    setFormData(emptyData)
    setErrors({})
    setDataLoaded(false)
    localStorage.removeItem('pdfFormData')
  }

  const validateForm = (): boolean => {
    const validation = validateUserDetails(formData)
    setErrors(validation.errors)
    return validation.isValid
  }

  const handleViewPDF = () => {
    if (!validateForm()) {
      return
    }
    
    // Store form data in localStorage and navigate to preview page
    localStorage.setItem('pdfFormData', JSON.stringify(formData))
    router.push('/preview')
  }

  const handleDownloadPDF = async () => {
    if (!validateForm()) {
      return
    }

    setIsGenerating(true)
    try {
      const doc = <PDFDocument {...formData} />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${formData.name || 'profile'}_profile.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const isFormValid = formData.name && formData.email && formData.countryCode && formData.phone && formData.position && Object.values(errors).every(error => !error)

  const selectedCountry = getCountryByCode(formData.countryCode);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Add Your details</h1>
        </div>

        {/* Data loaded notification */}
        {dataLoaded && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 text-sm font-medium">
                Your previous data has been loaded. You can continue editing or start fresh.
              </span>
            </div>
            <Button
              onClick={clearForm}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-100 hover:cursor-pointer"
            >
              Clear Form
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Image src="/user.svg" alt="User" width={20} height={20} className="text-gray-400" />
              </div>
              <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                <span className="text-sm font-medium text-gray-700 mr-2">Name</span>
              </div>
              <Input
                id="name"
                type="text"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`pl-24 h-14 text-base border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-colors placeholder:text-gray-400 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : ''
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600 mt-1 ml-2">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Image src="/mail.svg" alt="Mail" width={20} height={20} className="text-gray-400" />
              </div>
              <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                <span className="text-sm font-medium text-gray-700 mr-2">Email</span>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="e.g. Johndoe@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-24 h-14 text-base border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-colors placeholder:text-gray-400 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : ''
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1 ml-2">{errors.email}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <div className="flex gap-2">
              {/* Country Selector */}
              <div className="relative w-40 z-10">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                  <Image src="/phone-call.svg" alt="Phone" width={20} height={20} className="text-gray-400" />
                </div>
                <Select value={formData.countryCode} onValueChange={handleCountryChange}>
                  <SelectTrigger className="pl-12 h-14 text-base border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-colors">
                    <SelectValue>
                      {selectedCountry && (
                        <div className="flex items-center gap-2">
                          <span>{selectedCountry.flag}</span>
                          <span className="text-sm">{selectedCountry.callingCode}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.callingCode}</span>
                          <span className="text-sm text-gray-600">{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number Input */}
              <div className="flex-1 relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder={selectedCountry?.example || "Enter phone number"}
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`h-14 text-base border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-colors placeholder:text-gray-400 ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
              </div>
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1 ml-2">{errors.phone}</p>
            )}
            {errors.countryCode && (
              <p className="text-sm text-red-600 mt-1 ml-2">{errors.countryCode}</p>
            )}
            {selectedCountry && !errors.phone && formData.phone && (
              <p className="text-sm text-green-600 mt-1 ml-2 relative z-0">
                ✓ Valid {selectedCountry.name} phone number
              </p>
            )}
          </div>

          {/* Position Field */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Image src="/position.svg" alt="Position" width={20} height={20} className="text-gray-400" />
              </div>
              <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                <span className="text-sm font-medium text-gray-700 mr-2">Position</span>
              </div>
              <Input
                id="position"
                type="text"
                placeholder="e.g. Junior Front end Developer"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className={`pl-28 h-14 text-base border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-colors placeholder:text-gray-400 ${
                  errors.position ? 'border-red-500 focus:ring-red-500' : ''
                }`}
              />
            </div>
            {errors.position && (
              <p className="text-sm text-red-600 mt-1 ml-2">{errors.position}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                <Image src="/Description.svg" alt="Description" width={20} height={20} className="text-gray-400" />
              </div>
              <div className="absolute top-4 left-12 flex items-center pointer-events-none">
                <span className="text-sm font-medium text-gray-700 mr-2">Description</span>
              </div>
              <Textarea
                id="description"
                placeholder="e.g. Work experiences"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`pl-32 pt-4 min-h-[56px] text-base border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-colors resize-none placeholder:text-gray-400 ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                rows={3}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-600 mt-1 ml-2">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            onClick={handleViewPDF}
            disabled={!isFormValid}
            className="flex-1 h-14 text-base font-medium bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            <Image src="/view.svg" alt="View" width={20} height={20} className="mr-2" />
            View PDF
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={!isFormValid || isGenerating}
            className="flex-1 h-14 text-base font-medium bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <Image src="/Download.svg" alt="Download" width={20} height={20} className="mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
