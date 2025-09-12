'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, ArrowUpDown, ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CachedImage = {
  id: string;
  url: string;
  timestamp: number;
  name: string;
};

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

export function CachedImages() {
  const [cachedImages, setCachedImages] = useState<CachedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  useEffect(() => {
    loadCachedImages();
  }, []);

  const sortImages = (images: CachedImage[], sortOption: SortOption) => {
    return [...images].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return a.timestamp - b.timestamp;
        case 'date-desc':
        default:
          return b.timestamp - a.timestamp;
      }
    });
  };

  const loadCachedImages = () => {
    try {
      const images: CachedImage[] = [];
      
      // Loop through all items in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('product_')) {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            if (data.imageUrl) {
              images.push({
                id: key,
                url: data.imageUrl,
                timestamp: data.timestamp || 0,
                name: data.name || 'Unnamed Product'
              });
            }
          }
        }
      }
      
      // Sort images
      const sortedImages = sortImages(images, sortBy);
      setCachedImages(sortedImages);
    } catch (error) {
      console.error('Error loading cached images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    const newSortBy = value as SortOption;
    setSortBy(newSortBy);
    setCachedImages(prev => sortImages(prev, newSortBy));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      localStorage.removeItem(id);
      setCachedImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="text-center py-8">Loading your images...</div>;
  }

  if (cachedImages.length === 0) {
    return <div className="text-center py-8 text-gray-500">No saved images found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">
                <div className="flex items-center gap-2">
                  <ArrowUpNarrowWide className="h-4 w-4" />
                  <span>Name (A-Z)</span>
                </div>
              </SelectItem>
              <SelectItem value="name-desc">
                <div className="flex items-center gap-2">
                  <ArrowDownNarrowWide className="h-4 w-4" />
                  <span>Name (Z-A)</span>
                </div>
              </SelectItem>
              <SelectItem value="date-desc">
                <div className="flex items-center gap-2">
                  <ArrowDownNarrowWide className="h-4 w-4" />
                  <span>Newest first</span>
                </div>
              </SelectItem>
              <SelectItem value="date-asc">
                <div className="flex items-center gap-2">
                  <ArrowUpNarrowWide className="h-4 w-4" />
                  <span>Oldest first</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cachedImages.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-square group">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image.url, image.name);
                  }}
                  className="bg-white/90 hover:bg-white transition-all transform hover:scale-110"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image.id);
                  }}
                  className="bg-white/90 hover:bg-white transition-all transform hover:scale-110"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium line-clamp-1">
                {image.name}
              </CardTitle>
              <p className="text-xs text-gray-500">
                {new Date(image.timestamp).toLocaleString()}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}