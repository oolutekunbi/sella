'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Upload, Edit, Trash2, Download, Eye, Plus, Copy, X } from 'lucide-react'
import ProductImageGenerator from './ProductImageGenerator'

interface ProductData {
  id: string
  image: string
  name: string
  price: string
  currency: string
  description: string
  // category: string
  paymentMethods: string[]
  logo?: string
  contactInfo: {
    phone?: string
    whatsapp?: string
    instagram?: string
  }
  generatedImage?: string
}

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

export default function BatchProductCreator() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null)
  const [previewProduct, setPreviewProduct] = useState<ProductData | null>(null)
  const [selectedPayments, setSelectedPayments] = useState<string[]>(['momo'])
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isBulkEditing, setIsBulkEditing] = useState(false)
  const [bulkPrice, setBulkPrice] = useState('')
  const [bulkDescription, setBulkDescription] = useState('')
  const [bulkTitle, setBulkTitle] = useState('')
  const [bulkLogo, setBulkLogo] = useState<string | null>(null)
  const [defaultTemplate, setDefaultTemplate] = useState<Partial<ProductForm>>({
    currency: 'GHS',
    paymentMethods: ['momo'],
    contactInfo: { phone: '', whatsapp: '', instagram: '' }
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: '',
      currency: 'GHS',
      description: '',
      // category: '',
      paymentMethods: ['momo'],
      logo: '',
      contactInfo: {
        phone: '',
        whatsapp: '',
        instagram: '',
      },
    },
  })

  const handleMultipleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const newProduct: ProductData = {
          id: `product-${Date.now()}-${index}`,
          image: imageUrl,
          name: `Product ${products.length + index + 1}`,
          price: '',
          currency: defaultTemplate.currency || 'GHS',
          description: '',
          // category: '',
          paymentMethods: defaultTemplate.paymentMethods || ['momo'],
          logo: defaultTemplate.logo || '',
          contactInfo: defaultTemplate.contactInfo || { phone: '', whatsapp: '', instagram: '' }
        }
        
        setProducts(prev => [...prev, newProduct])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleEditProduct = (product: ProductData) => {
    setEditingProduct(product)
    setSelectedPayments(product.paymentMethods)
    setLogoPreview(product.logo || null)
    
    form.reset({
      name: product.name,
      price: product.price,
      currency: product.currency,
      description: product.description,
      // category: product.category,
      paymentMethods: product.paymentMethods,
      logo: product.logo || '',
      contactInfo: product.contactInfo,
    })
  }

  const handleSaveProduct = (values: ProductForm) => {
    if (!editingProduct) return

    const updatedProduct: ProductData = {
      ...editingProduct,
      ...values,
      paymentMethods: selectedPayments,
      logo: logoPreview || '',
    }

    setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p))
    setEditingProduct(null)
    setLogoPreview(null)
  }

  const handleBulkSave = () => {
    setProducts(prev => 
      prev.map(product => ({
        ...product,
        ...(bulkPrice && { price: bulkPrice }),
        ...(bulkDescription && { description: bulkDescription }),
        ...(bulkTitle && { name: bulkTitle }),
        ...(bulkLogo && { logo: bulkLogo })
      })));
    setIsBulkEditing(false);
    setBulkPrice('');
    setBulkDescription('');
    setBulkTitle('');
    setBulkLogo(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleDuplicateProduct = (product: ProductData) => {
    const duplicated: ProductData = {
      ...product,
      id: `product-${Date.now()}`,
      name: `${product.name} (Copy)`,
      generatedImage: undefined
    }
    setProducts(prev => [...prev, duplicated])
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

  const togglePaymentMethod = (method: string) => {
    setSelectedPayments(prev => {
      if (prev.includes(method)) {
        return prev.filter(p => p !== method)
      } else {
        return [...prev, method]
      }
    })
  }

  const generateAllTags = async () => {
    setIsGenerating(true)
    // This would integrate with the ProductImageGenerator component
    // For now, we'll simulate the generation
    for (const product of products) {
      if (!product.generatedImage) {
        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In real implementation, this would call the actual generation logic
        setProducts(prev => prev.map(p => 
          p.id === product.id 
            ? { ...p, generatedImage: `generated-${p.id}` }
            : p
        ))
      }
    }
    setIsGenerating(false)
  }

  const downloadAllTags = () => {
    products.forEach((product, index) => {
      if (product.generatedImage) {
        // Create download link for each generated image
        const link = document.createElement('a')
        link.download = `${product.name.replace(/\s+/g, '_')}_product_tag.png`
        link.href = product.generatedImage
        link.click()
        
        // Add delay between downloads to avoid browser blocking
        setTimeout(() => {}, index * 100)
      }
    })
  }

  const handlePreviewProduct = (product: ProductData) => {
    setPreviewProduct(product)
  }

  const handleSaveGeneratedImage = (productId: string, generatedImage: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, generatedImage } : p
    ))
    setPreviewProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Product Creator</h1>
          <p className="text-gray-600">Upload multiple images and create product tags in bulk</p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Product Images</CardTitle>
            <CardDescription>Select multiple images to create product tags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center w-full"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-lg font-medium text-gray-700 mb-2">
                  Upload Product Images
                </span>
                <span className="text-sm text-gray-500">
                  Select multiple images (PNG, JPG) to get started
                </span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {products.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Images ({products.length})</CardTitle>
                <CardDescription>Edit details for each product</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={generateAllTags}
                  disabled={isGenerating}
                  className="bg-[#A9968D] hover:bg-[#8a7a6f]"
                >
                  {isGenerating ? 'Generating...' : 'Generate All Tags'}
                </Button>
                <Button
                  onClick={downloadAllTags}
                  variant="outline"
                  disabled={!products.some(p => p.generatedImage)}
                  className="mr-2"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
                <Button
                  onClick={() => setIsBulkEditing(true)}
                  variant="outline"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Bulk Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.generatedImage && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          Generated
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm mb-2 truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-3">
                        {product.price ? `${product.currency} ${product.price}` : 'No price set'}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreviewProduct(product)}
                          disabled={!product.name || !product.price}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicateProduct(product)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product Details</DialogTitle>
              <DialogDescription>
                Update the information for this product
              </DialogDescription>
            </DialogHeader>
            
            {editingProduct && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveProduct)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Red Silk Dress" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price *</FormLabel>
                          <FormControl>
                            <Input placeholder="150.00" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...field}>
                              <option value="GHS">₵ GHS</option>
                              <option value="USD">$ USD</option>
                              <option value="EUR">€ EUR</option>
                              <option value="GBP">£ GBP</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <FormControl>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...field}>
                              <option value="">Select category</option>
                              {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Describe your product..."
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Logo Upload */}
                  <div>
                    <Label className="text-sm font-medium">Company Logo (Optional)</Label>
                    <div className="mt-2">
                      {logoPreview ? (
                        <div className="relative inline-block">
                          <img src={logoPreview} alt="Logo" className="w-16 h-16 object-contain border rounded" />
                          <button type="button" onClick={removeLogo} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                          <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          <button type="button" onClick={() => logoInputRef.current?.click()} className="text-sm text-gray-600">
                            <Plus className="w-4 h-4 mx-auto mb-1" />
                            Upload Logo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <Label className="text-sm font-medium">Payment Methods *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {paymentOptions.map((payment) => (
                        <div
                          key={payment.id}
                          onClick={() => togglePaymentMethod(payment.id)}
                          className={`p-2 border rounded cursor-pointer text-sm ${
                            selectedPayments.includes(payment.id)
                              ? 'border-[#A9968D] bg-[#A9968D]/10'
                              : 'border-gray-200'
                          }`}
                        >
                          <span className="mr-2">{payment.icon}</span>
                          {payment.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setEditingProduct(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-[#A9968D] hover:bg-[#8a7a6f]">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        {previewProduct && (
          <Dialog open={!!previewProduct} onOpenChange={() => setPreviewProduct(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <ProductImageGenerator
                image={previewProduct.image}
                productData={previewProduct}
                onBack={() => setPreviewProduct(null)}
                onSave={(generatedImage) => handleSaveGeneratedImage(previewProduct.id, generatedImage)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Bulk Edit Dialog */}
        <Dialog open={isBulkEditing} onOpenChange={setIsBulkEditing}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bulk Edit Products</DialogTitle>
              <DialogDescription>
                Update multiple fields for all products at once
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulk-title" className="text-sm font-medium">
                    Set Title for All (leave empty to skip)
                  </Label>
                  <Input
                    id="bulk-title"
                    type="text"
                    placeholder="e.g., Premium Product"
                    value={bulkTitle}
                    onChange={(e) => setBulkTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bulk-price" className="text-sm font-medium">
                    Set Price for All (leave empty to skip)
                  </Label>
                  <Input
                    id="bulk-price"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 99.99"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium block mb-2">
                    Set Logo for All (leave empty to skip)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full justify-start"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {bulkLogo ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    {bulkLogo && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setBulkLogo(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <input
                      type="file"
                      ref={logoInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setBulkLogo(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  {bulkLogo && (
                    <div className="mt-2">
                      <img
                        src={bulkLogo}
                        alt="Logo preview"
                        className="h-10 w-10 object-contain rounded-md border"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                <Label htmlFor="bulk-description" className="text-sm font-medium">
                  Set Description for All (leave empty to skip)
                </Label>
                <textarea
                  id="bulk-description"
                  placeholder="Enter description for all products"
                  value={bulkDescription}
                  onChange={(e) => setBulkDescription(e.target.value)}
                  className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsBulkEditing(false)
                    setBulkPrice('')
                    setBulkDescription('')
                    setBulkTitle('')
                    setBulkLogo(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleBulkSave}
                  disabled={!bulkPrice && !bulkDescription && !bulkTitle && !bulkLogo}
                  className="bg-[#A9968D] hover:bg-[#8a7a6f]"
                >
                  Apply to All
                </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
