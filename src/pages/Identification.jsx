import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function IdentityVerification() {
  const [currentStep, setCurrentStep] = useState('personal');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationality: '',
    email: '',
    city: '',
    district: '',
    fullAddress: ''
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentSelect = (docType) => {
    setSelectedDocument(docType);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const handleNext = () => {
    if (currentStep === 'personal') {
      setCurrentStep('document');
    } else if (currentStep === 'document' && documentFile) {
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      setVerificationComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep === 'document') {
      setCurrentStep('personal');
    } else if (currentStep === 'address') {
      setCurrentStep('document');
    }
  };

  if (verificationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">VERIFICATION SUBMITTED!</h2>
          <p className="text-gray-600 mb-8">Verification has been submitted successfully</p>
          
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-8">
            You will be notified via email once your verification process is being successful
          </p>
          
          <div className="flex gap-3">
            <button className="flex-1 border-2 border-green-600 text-green-600 py-3 rounded-lg font-medium hover:bg-green-50">
              HOME
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
              CHECK STATUS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Identity Verification</h1>
        <p className="text-gray-500 mb-8">Verify your identity and get started</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              currentStep === 'personal' || currentStep === 'document' || currentStep === 'address'
                ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {currentStep === 'personal' || currentStep === 'document' || currentStep === 'address' && '✓'}
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-700">Personal Information</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            currentStep === 'document' || currentStep === 'address' ? 'bg-green-500' : 'bg-gray-300'
          }`} />
          
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              currentStep === 'document' || currentStep === 'address'
                ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {(currentStep === 'document' || currentStep === 'address') && '✓'}
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-700">Proof Of Address</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            currentStep === 'address' ? 'bg-green-500' : 'bg-gray-300'
          }`} />
          
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              currentStep === 'address' ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {currentStep === 'address' && '✓'}
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-700">Upload Document</span>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 'personal' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">First Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter you first name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Last Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter you last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Nationality<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="nationality"
                placeholder="Enter you nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email address<span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="Enter you email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Document Upload */}
        {currentStep === 'document' && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-900 font-medium mb-4">Select a document type below to confirm your identity</p>
              
              <div className="space-y-3">
                <div 
                  onClick={() => handleDocumentSelect('national-id')}
                  className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                >
                  <span className="text-gray-900 font-medium">National ID card</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <div 
                  onClick={() => handleDocumentSelect('drivers-license')}
                  className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center ${
                    selectedDocument === 'drivers-license' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-gray-900 font-medium">Driver's Licence</span>
                  <ChevronRight className={`w-5 h-5 ${selectedDocument === 'drivers-license' ? 'text-green-500' : 'text-gray-400'}`} />
                </div>

                {selectedDocument === 'drivers-license' && (
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/png,image/jpeg,.pdf"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <p className="text-gray-900 font-medium mb-3">Choose a file or drag & drop it here</p>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
                        Browse file / Take photo
                      </button>
                    </label>
                    {documentFile ? (
                      <p className="text-green-600 text-sm mt-2">{documentFile.name}</p>
                    ) : (
                      <p className="text-gray-400 text-sm mt-2">No file choosen</p>
                    )}
                  </div>
                )}

                <p className="text-red-500 text-sm mt-2">File not supported</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 12a6 6 0 11-1.5-11.83 1 1 0 00-.5-1.94A8 8 0 1010 18z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-600 text-sm">
                    Make sure the document clearly shows your photo, full name, date of birth, and the date of issue.
                  </p>
                </div>

                <div className="text-gray-600 text-xs space-y-1">
                  <p>• Supported file types: PNG, JPG, PDF</p>
                  <p>• Maximum file size: 5MB</p>
                </div>
                
                <div className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                  <span className="text-gray-900 font-medium">International Passport</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Address Information */}
        {currentStep === 'address' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">City<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="city"
                placeholder="Enter you city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">District<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="district"
                placeholder="Enter you district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Full Address<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="fullAddress"
                placeholder="Enter you full address"
                value={formData.fullAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3 flex gap-2">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 12a6 6 0 11-1.5-11.83 1 1 0 00-.5-1.94A8 8 0 1010 18z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600 text-sm">
                  Please ensure that your address matches the one on your passport or ID card. If your information does not match, your documents cannot be verified
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep !== 'personal' && (
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50"
            >
              BACK
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 'personal' && (!formData.firstName || !formData.lastName || !formData.nationality || !formData.email)) ||
              (currentStep === 'document' && !documentFile)
            }
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-white ${
              (currentStep === 'personal' && (!formData.firstName || !formData.lastName || !formData.nationality || !formData.email)) ||
              (currentStep === 'document' && !documentFile)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {currentStep === 'address' ? 'SUBMIT' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
}