export type PropertyType = 'house' | 'apartment' | 'cottage' | 'villa'

export interface Listing {
  id: string
  title: string
  slug: string
  location: string
  city: string
  pricePerMonth: number
  image: string
  images: string[]
  bedrooms: number
  bathrooms: number
  area: number // sqm
  type: PropertyType
  description: string
  amenities: string[]
  availableFrom: string
  featured?: boolean
}

export interface SearchFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  type?: PropertyType
}
