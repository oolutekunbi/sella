'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Camera, Upload, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import Webcam from 'react-webcam'
import ProductImageGenerator from '@/components/ProductImageGenerator'

const productSchema = z.object({
  image: z.string().min(1, 'Product image is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.string().min(1, 'Price is required'),
  currency: z.string().min(1, 'Currency is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  paymentMethods: z.array(z.string()).min(1, 'At least one payment method is required'),
  logo: z.string().optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
  }),
})

type ProductFormData = z.infer<typeof productSchema>

const paymentOptions = [
  { id: 'momo', label: 'Mobile Money', icon: '📱' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
  { id: 'cash', label: 'Cash on Delivery', icon: '💵' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
]

const categories = [
  'Fashion & Clothing',
  'Beauty & Cosmetics',
  'Electronics',
  'Home & Garden',
  'Food & Beverages',
  'Handmade & Crafts',
  'Sports & Fitness',
  'Books & Education',
  'Other'
]

export default function CreateProductPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedPayments, setSelectedPayments] = useState<string[]>(['momo'])
  const [showPreview, setShowPreview] = useState(false)
  const [finalProductData, setFinalProductData] = useState<ProductFormData | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      image: '',
      name: '',
      price: '',
      currency: 'GHS',
      description: '',
      category: '',
      paymentMethods: ['momo'],
      logo: '',
      contactInfo: {
        phone: '',
        whatsapp: '',
        instagram: '',
      },
    },
  })

  const totalSteps = 5

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      form.setValue('image', imageSrc)
      setShowCamera(false)
      setCurrentStep(2)
    }
  }, [webcamRef, form])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string
        form.setValue('image', imageSrc)
        setCurrentStep(2)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        form.setValue('logo', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    form.setValue('logo', '')
  }

  const nextStep = async () => {
    const isValid = await form.trigger(getFieldsForStep(currentStep))
    if (isValid) {
      if (currentStep === 4) {
        // Update payment methods before moving to final step
        form.setValue('paymentMethods', selectedPayments)
      }
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number): (keyof ProductFormData)[] => {
    switch (step) {
      case 1: return ['image']
      case 2: return ['name', 'price', 'currency']
      case 3: return ['description', 'category']
      case 4: return [] // Logo is optional, no validation needed
      case 5: return ['paymentMethods']
      default: return []
    }
  }

  const togglePaymentMethod = (method: string) => {
    setSelectedPayments(prev => {
      if (prev.includes(method)) {
        return prev.filter(p => p !== method)
      } else {
        return [...prev, method]
      }
    })
  }

  const handleFinalSubmit = (values: ProductFormData) => {
    const finalData = { ...values, paymentMethods: selectedPayments }
    setFinalProductData(finalData)
    setShowPreview(true)
  }

  const handleBackFromPreview = () => {
    setShowPreview(false)
    setCurrentStep(4)
  }

  const handleSaveProduct = (generatedImage: string) => {
    console.log('Product saved with generated image:', generatedImage)
    router.push('/dashboard') 
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Product Photo</CardTitle>
              <CardDescription>Capture or upload a photo of your product</CardDescription>
            </CardHeader>
            <CardContent>
              {form.watch('image') ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={form.watch('image')} 
                      alt="Product" 
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    <Button 
                      onClick={() => {
                        form.setValue('image', '')
                        setShowCamera(false)
                      }}
                      variant="outline" 
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      Retake
                    </Button>
                  </div>
                </div>
              ) : showCamera ? (
                <div className="space-y-4">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg"
                    videoConstraints={{
                      width: 1280,
                      height: 720,
                      facingMode: "user"
                    }}
                  />
                  <div className="flex justify-center gap-4">
                    <Button onClick={capture} size="lg" className="bg-[#A9968D] hover:bg-[#8a7a6f]">
                      <Camera className="mr-2 h-5 w-5" />
                      Capture Photo
                    </Button>
                    <Button onClick={() => setShowCamera(false)} variant="outline" size="lg">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowCamera(true)}>
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-[#A9968D] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Take Photo</h3>
                      <p className="text-gray-600">Use your camera to capture a product photo</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => fileInputRef.current?.click()}>
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-[#A9968D] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Upload Photo</h3>
                      <p className="text-gray-600">Choose an existing photo from your device</p>
                    </CardContent>
                  </Card>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
              {form.formState.errors.image && (
                <p className="text-sm text-red-500 mt-2">{form.formState.errors.image.message}</p>
              )}
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Basic Information</CardTitle>
              <CardDescription>Add your product name and price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Red Silk Dress"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="150.00"
                            type="number"
                            step="0.01"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="GHS">GHS</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Product Details</CardTitle>
              <CardDescription>Add description and category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Describe your product in detail..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Company Branding</CardTitle>
              <CardDescription>Upload your company logo (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Company Logo (Optional)</Label>
                <div className="mt-2">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-20 h-20 object-contain border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="cursor-pointer flex flex-col items-center w-full"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload company logo</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Your logo will appear in the top right corner of your product tag
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Payment & Contact</CardTitle>
              <CardDescription>Set up payment methods and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Payment Methods *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {paymentOptions.map((payment) => (
                    <div
                      key={payment.id}
                      onClick={() => togglePaymentMethod(payment.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPayments.includes(payment.id)
                          ? 'border-[#A9968D] bg-[#A9968D]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{payment.icon}</span>
                        <span className="text-sm font-medium">{payment.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedPayments.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">Select at least one payment method</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Contact Information</Label>
                
                <FormField
                  control={form.control}
                  name="contactInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+233 XX XXX XXXX"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+233 XX XXX XXXX"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram Handle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="@yourusername"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (showPreview && finalProductData) {
    return (
      <ProductImageGenerator
        image={finalProductData.image}
        productData={{
          name: finalProductData.name,
          price: finalProductData.price,
          currency: finalProductData.currency,
          description: finalProductData.description,
          // category: finalProductData.category,
          paymentMethods: finalProductData.paymentMethods,
          logo: finalProductData.logo,
          contactInfo: finalProductData.contactInfo,
        }}
        onBack={handleBackFromPreview}
        onSave={handleSaveProduct}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')} 
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Product Tag</h1>
          <p className="text-gray-600">Follow the steps to create your product tag</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-[#A9968D] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-[#A9968D]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Photo</span>
            <span>Basic Info</span>
            <span>Details</span>
            <span>Branding</span>
            <span>Payment</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-[#A9968D] hover:bg-[#8a7a6f]"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-[#A9968D] hover:bg-[#8a7a6f]"
                >
                  Create Product Tag
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
