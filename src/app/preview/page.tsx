"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PDFViewer, pdf } from '@react-pdf/renderer'
import PDFDocument from '@/components/PDFDocument'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UserDetails, validateUserDetails } from '@/lib/validation'
import { getCountryByCode } from '@/lib/countries'

export default function PreviewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<UserDetails | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Get form data from localStorage
    const savedData = localStorage.getItem('pdfFormData')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      
      // Validate the data from localStorage
      const validation = validateUserDetails(parsedData)
      if (validation.isValid && validation.data) {
        setFormData(validation.data)
      } else {
        // If data is invalid, redirect back to form
        console.error('Invalid data in localStorage:', validation.errors)
        router.push('/')
      }
    } else {
      // If no data found, redirect back to form
      router.push('/')
    }
  }, [router])

  const handleEditDetails = () => {
    // Ensure data is saved before navigating
    if (formData) {
      localStorage.setItem('pdfFormData', JSON.stringify(formData))
    }
    router.push('/')
  }

  const handleDownloadPDF = async () => {
    if (!formData) return

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

  if (!formData) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your PDF preview.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PDF Preview</h1>
              <p className="text-gray-600">Review your document before downloading</p>
            </div>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex items-center gap-2 hover:cursor-pointer"
            >
              <Image src="/chevron-left.svg" alt="Back" width={20} height={20} />
              Back to Form
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PDF Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Document Preview</h2>
              <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <PDFViewer width="100%" height="100%">
                  <PDFDocument {...formData} />
                </PDFViewer>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Review your PDF and make any necessary changes before downloading.
                </p>
              </div>

              {/* Document Info */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Document Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">
                      {(() => {
                        const country = getCountryByCode(formData.countryCode)
                        return country ? `${country.callingCode} ${formData.phone}` : formData.phone
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position:</span>
                    <span className="font-medium">{formData.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">PDF (A4)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleEditDetails}
                  variant="outline"
                  className="w-full h-12 text-base font-medium rounded-xl border-2 cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Details
                </Button>

                <Button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 rounded-xl hover:cursor-pointer"
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

              {/* Tips */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check all information is correct</li>
                  <li>• Ensure proper formatting</li>
                  <li>• Download will save to your default folder</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
