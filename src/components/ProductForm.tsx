'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Plus, X } from 'lucide-react'

const productSchema = z.object({
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

type ProductForm = z.infer<typeof productSchema>

interface ProductFormProps {
  onSubmit: (data: ProductForm) => void
  onBack: () => void
}

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

export default function ProductForm({ onSubmit, onBack }: ProductFormProps) {
  const [selectedPayments, setSelectedPayments] = useState<string[]>(['momo'])
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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

  const handleSubmit = (values: ProductForm) => {
    onSubmit({ ...values, paymentMethods: selectedPayments })
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
    // Validate current step before proceeding
    let fieldsToValidate: (keyof ProductForm)[] = []
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'price', 'currency']
        break
      case 2:
        fieldsToValidate = ['category', 'description']
        break
      case 3:
        // No required fields in step 3 (logo is optional)
        break
      case 4:
        // Contact info is optional, but payment methods are required
        break
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate)
      if (!isValid) {
        return // Don't proceed if validation fails
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information'
      case 2: return 'Product Details'
      case 3: return 'Company Branding'
      case 4: return 'Payment & Contact'
      default: return 'Product Information'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getStepTitle()}</CardTitle>
        <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-[#A9968D] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
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
                            <option value="GHS">₵</option>
                            <option value="USD">$</option>
                            <option value="EUR">€</option>
                            <option value="GBP">£</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Step 2: Product Details */}
            {currentStep === 2 && (
              <>
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
              </>
            )}

            {/* Step 3: Company Branding */}
            {currentStep === 3 && (
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
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Upload company logo</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Your logo will appear in the top right corner of your product tag
                </p>
              </div>
            )}

            {/* Step 4: Payment & Contact */}
            {currentStep === 4 && (
              <>
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
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {currentStep === 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Back
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              
              {currentStep === totalSteps ? (
                <Button
                  type="submit"
                  className="flex-1 bg-[#A9968D] hover:bg-[#8a7a6f]"
                >
                  Create Product Tag
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-[#A9968D] hover:bg-[#8a7a6f]"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
