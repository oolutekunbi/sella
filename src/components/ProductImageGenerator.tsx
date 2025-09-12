"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Share2,
  ArrowLeft,
  Instagram,
  MessageCircle,
} from "lucide-react";
import html2canvas from "html2canvas";

interface ProductData {
  name: string;
  price: string;
  currency: string;
  description: string;
  // category: string;
  paymentMethods: string[];
  logo?: string;
  contactInfo: {
    phone?: string;
    whatsapp?: string;
    instagram?: string;
  };
}

interface ProductImageGeneratorProps {
  image: string;
  productData: ProductData;
  onBack: () => void;
  onSave?: (generatedImage: string) => void;
}

const paymentIcons: { [key: string]: string } = {
  momo: "📱",
  bank: "🏦",
  cash: "💵",
  card: "💳",
};

const paymentLabels: { [key: string]: string } = {
  momo: "Mobile Money",
  bank: "Bank Transfer",
  cash: "Cash on Delivery",
  card: "Card Payment",
};

export default function ProductImageGenerator({
  image,
  productData,
  onBack,
  onSave,
}: ProductImageGeneratorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateImage = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: "#fffff9",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
  
      const imageUrl = canvas.toDataURL("image/png", 0.9);
      setGeneratedImage(imageUrl);
      
      // Auto-save the image when generated
      await saveToLocalStorage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    setIsSaving(true);
    try {
      // Save to localStorage
      await saveToLocalStorage(generatedImage);
      
      // Trigger download
      const link = document.createElement("a");
      link.download = `${productData.name.replace(/\s+/g, "_")}_product_tag.png`;
      link.href = generatedImage;
      link.click();
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(generatedImage);
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndFinish = () => {
    if (generatedImage) {
      onSave?.(generatedImage);
    }
  };

  const shareImage = async () => {
    if (!generatedImage) return;
    
    setIsSaving(true);
    try {
      // Save to localStorage
      await saveToLocalStorage(generatedImage);
      
      // Rest of your existing share logic...
      if (navigator.share) {
        try {
          const response = await fetch(generatedImage);
          const blob = await response.blob();
          const file = new File(
            [blob],
            `${productData.name.replace(/\s+/g, "_")}_product_tag.png`,
            { type: "image/png" }
          );
          await navigator.share({
            files: [file],
          });
          return;
        } catch (error) {
          console.log("Web Share API failed, falling back to manual method");
        }
      }
      
      // Fallback for browsers without Web Share API
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `${productData.name.replace(/\s+/g, "_")}_product_tag.png`;
      link.click();
      
      // Open WhatsApp web
      setTimeout(() => {
        window.open('https://web.whatsapp.com', '_blank');
      }, 100);
    } catch (error) {
      console.error('Error sharing image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const shareToWhatsApp = async () => {
    if (!generatedImage) {
      alert("Please generate the image first!");
      return;
    }

    // Try Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        // Convert base64 to blob
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File(
          [blob],
          `${productData.name.replace(/\s+/g, "_")}_product_tag.png`,
          {
            type: "image/png",
          }
        );

        await navigator.share({
          files: [file],
        });
        return;
      } catch (error) {
        console.log("Web Share API failed, falling back to manual method");
      }
    }

    // For desktop, download the image
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `${productData.name.replace(/\s+/g, "_")}_product_tag.png`;
    link.click();
    
    // Open WhatsApp web
    setTimeout(() => {
      window.open('https://web.whatsapp.com', '_blank');
    }, 100);
  };

  const shareToInstagram = () => {
    // Instagram sharing would typically require their API or manual sharing
    alert("Save the image and share it manually on Instagram!");
  };

  const saveToLocalStorage = async (imageUrl: string) => {
    try {
      const productKey = `product_${Date.now()}`;
      const productToSave = {
        ...productData,
        imageUrl,
        timestamp: Date.now(),
      };
      localStorage.setItem(productKey, JSON.stringify(productToSave));
      return productKey;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return null;
    }
  };

  useEffect(() => {
    // Auto-generate image when component mounts
    const timer = setTimeout(() => {
      generateImage();
    }, 500);

    return () => clearTimeout(timer);
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Tag Preview
          </h1>
          <p className="text-gray-600">Preview and share your product tag</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center  gap-8">
          {/* Generated Image Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Product Tag</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <img
                    src={generatedImage}
                    alt="Generated product tag"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadImage}
                      className="flex-1 bg-[#A9968D] hover:bg-[#8a7a6f]"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    {/* <Button
                      onClick={shareToWhatsApp}
                      variant="outline"
                      className="flex-1"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button> */}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A9968D] mx-auto mb-2"></div>
                      <p className="text-gray-600">Generating image...</p>
                    </div>
                  ) : (
                    <Button
                      onClick={generateImage}
                      className="bg-[#A9968D] hover:bg-[#8a7a6f]"
                    >
                      Generate Image
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Share Your Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Button
                  onClick={shareToWhatsApp}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <MessageCircle className="h-6 w-6 mb-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={shareToInstagram}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Instagram className="h-6 w-6 mb-2" />
                  Instagram
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Product Summary</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {productData.name}
                  </p>
                  <p>
                    <strong>Price:</strong> {productData.currency}{" "}
                    {productData.price}
                  </p>
                  {/* <p>
                    <strong>Category:</strong> {productData.category}
                  </p> */}
                  <p>
                    <strong>Payment:</strong>{" "}
                    {productData.paymentMethods
                      .map((p) => paymentLabels[p])
                      .join(", ")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleSaveAndFinish}
                  className="w-full bg-[#A9968D] hover:bg-[#8a7a6f]"
                >
                  Save & Finish
                </Button>
                <Button onClick={onBack} variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Edit Product Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hidden canvas for image generation */}
        <div className="fixed -left-[9999px] -top-[9999px] p-5">
          <div
            ref={canvasRef}
            className="w-auto relative overflow-visible"
            style={{
              fontFamily: "Inter, sans-serif",
              transform: 'scale(1)',
              transformOrigin: 'top left',
              objectFit: 'contain',
              width: '600px',
              minWidth: '600px',
              maxWidth: '600px',
              // zoom: 1
            }}
          >
            {/* Product Image */}
 
            <div className="relative h-auto overflow-hidden">
              <img
                src={image}
                alt="Product"
                className="object-contain"
                crossOrigin="anonymous"
              />

              {productData.logo && (
                <div className="absolute top-4 right-4 z-130">
                  <img
                    src={productData.logo}
                    alt="Company Logo"
                    className="w-auto h-24 object-contain bg-white/90 rounded-lg p-1"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 z-130 space-y-2">
                <div className="font-black text-5xl md:text-5xl text-white leading-none mb-5">
                  {productData.currency} {Number(productData.price).toLocaleString()}
                </div>

                <h2 className="text-xl md:text-4xl font-bold text-white leading-tight">
                  {productData.name}
                </h2>

                <p className="text-base md:text-lg font-normal tracking-wide text-white">
                  {productData.description}
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4 space-y-3">
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                Created with Sella • Tag It. Share It. Sell It.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
