import type { Listing } from '../types/listing'

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Sunlit Villa with Garden',
    slug: 'sunlit-villa-with-garden',
    location: 'Oak Lane, Riverside',
    city: 'Portland',
    pricePerMonth: 2400,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: 185,
    type: 'villa',
    description: 'Spacious family villa with a private garden and modern finishes. Open-plan living area, large kitchen, and a quiet neighborhood perfect for families.',
    amenities: ['Parking', 'Garden', 'Balcony', 'AC', 'Dishwasher', 'Laundry'],
    availableFrom: '2025-04-01',
    featured: true,
  },
  {
    id: '2',
    title: 'Downtown Loft Apartment',
    slug: 'downtown-loft-apartment',
    location: 'Market Street',
    city: 'Seattle',
    pricePerMonth: 1850,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    type: 'apartment',
    description: 'Industrial-style loft in the heart of the city. High ceilings, exposed brick, and walking distance to cafes and transit.',
    amenities: ['Parking', 'Gym', 'AC', 'Dishwasher'],
    availableFrom: '2025-03-15',
    featured: true,
  },
  {
    id: '3',
    title: 'Cozy Cottage by the Lake',
    slug: 'cozy-cottage-by-the-lake',
    location: 'Lakeshore Drive',
    city: 'Portland',
    pricePerMonth: 1600,
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    ],
    bedrooms: 2,
    bathrooms: 1,
    area: 72,
    type: 'cottage',
    description: 'Charming cottage with lake views. Perfect for a couple or small family looking for a peaceful retreat.',
    amenities: ['Garden', 'Parking', 'Fireplace'],
    availableFrom: '2025-05-01',
    featured: true,
  },
  {
    id: '4',
    title: 'Family House with Yard',
    slug: 'family-house-with-yard',
    location: 'Maple Avenue',
    city: 'Seattle',
    pricePerMonth: 2200,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80',
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    type: 'house',
    description: 'Three-bedroom house with a fenced yard, ideal for kids and pets. Quiet street, good schools nearby.',
    amenities: ['Parking', 'Garden', 'Laundry', 'AC'],
    availableFrom: '2025-04-15',
  },
  {
    id: '5',
    title: 'Modern Apartment in Midtown',
    slug: 'modern-apartment-midtown',
    location: 'Fifth Avenue',
    city: 'Portland',
    pricePerMonth: 1500,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    ],
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    type: 'apartment',
    description: 'Bright one-bedroom with modern appliances. Close to public transport and shopping.',
    amenities: ['AC', 'Dishwasher', 'Gym'],
    availableFrom: '2025-03-01',
  },
  {
    id: '6',
    title: 'Hilltop Villa with Views',
    slug: 'hilltop-villa-with-views',
    location: 'Summit Road',
    city: 'Seattle',
    pricePerMonth: 3200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: 280,
    type: 'villa',
    description: 'Luxury villa with panoramic views. Pool, home office, and large entertaining spaces.',
    amenities: ['Parking', 'Pool', 'Garden', 'AC', 'Laundry', 'Balcony'],
    availableFrom: '2025-06-01',
    featured: true,
  },
]

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug)
}

export function getFeaturedListings(): Listing[] {
  return listings.filter((l) => l.featured)
}

export function filterListings(filters: {
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  type?: string
}): Listing[] {
  return listings.filter((listing) => {
    if (filters.city && listing.city.toLowerCase() !== filters.city.toLowerCase()) return false
    if (filters.minPrice != null && listing.pricePerMonth < filters.minPrice) return false
    if (filters.maxPrice != null && listing.pricePerMonth > filters.maxPrice) return false
    if (filters.bedrooms != null && listing.bedrooms < filters.bedrooms) return false
    if (filters.type && listing.type !== filters.type) return false
    return true
  })
}
