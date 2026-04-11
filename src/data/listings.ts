import type { Listing } from '../types/listing'

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Serenity Ridge Villa',
    slug: 'serenity-ridge-villa',
    location: 'Sunnyvale, CA',
    city: 'Sunnyvale',
    pricePerMonth: 3600,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: Math.round(2100 / 10.764),
    type: 'villa',
    description:
      'Spacious villa with modern finishes, open-plan living, and a quiet neighborhood.',
    amenities: ['Parking', 'Garden', 'Balcony', 'AC', 'Dishwasher', 'Laundry'],
    availableFrom: '2025-04-01',
    featured: true,
  },
  {
    id: '2',
    title: 'Mountain Chalet',
    slug: 'mountain-chalet',
    location: 'Aspen, USA',
    city: 'Aspen',
    pricePerMonth: 4800,
    image: 'https://images.unsplash.com/photo-1518780664699-ffc508f65214?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518780664699-ffc508f65214?w=1200&q=80',
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: Math.round(2800 / 10.764),
    type: 'house',
    description: 'Alpine retreat with vaulted ceilings and easy access to trails and dining.',
    amenities: ['Parking', 'Fireplace', 'AC', 'Laundry'],
    availableFrom: '2025-03-15',
    featured: true,
  },
  {
    id: '3',
    title: 'Vineyard Estate',
    slug: 'vineyard-estate',
    location: 'Napa Valley, USA',
    city: 'Napa Valley',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
    ],
    pricePerMonth: 6000,
    bedrooms: 5,
    bathrooms: 4,
    area: Math.round(4000 / 10.764),
    type: 'villa',
    description: 'Estate living among the vines with pool-ready grounds and sunset views.',
    amenities: ['Parking', 'Pool', 'Garden', 'AC', 'Laundry', 'Balcony'],
    availableFrom: '2025-05-01',
    featured: true,
  },
  {
    id: '4',
    title: 'Lakeside Haven',
    slug: 'lakeside-haven',
    location: 'Austin, USA',
    city: 'Austin',
    pricePerMonth: 4600,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    ],
    bedrooms: 4,
    bathrooms: 3,
    area: Math.round(2700 / 10.764),
    type: 'house',
    description: 'Lakeside living with generous outdoor space and room to entertain.',
    amenities: ['Parking', 'Garden', 'Laundry', 'AC'],
    availableFrom: '2025-04-15',
    featured: true,
  },
  {
    id: '5',
    title: 'Coastal Retreat',
    slug: 'coastal-retreat',
    location: 'Malibu, USA',
    city: 'Malibu',
    pricePerMonth: 7200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    ],
    bedrooms: 6,
    bathrooms: 4,
    area: Math.round(4500 / 10.764),
    type: 'villa',
    description: 'Ocean air and panoramic coastal views from this expansive retreat.',
    amenities: ['Parking', 'Pool', 'Garden', 'AC', 'Laundry', 'Balcony'],
    availableFrom: '2025-06-01',
    featured: true,
  },
  {
    id: '6',
    title: 'Bayview Luxury',
    slug: 'bayview-luxury',
    location: 'San Francisco, USA',
    city: 'San Francisco',
    pricePerMonth: 6500,
    image: 'https://images.unsplash.com/photo-1600566753089-00f18fb6b3ea?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600566753089-00f18fb6b3ea?w=1200&q=80',
    ],
    bedrooms: 5,
    bathrooms: 4,
    area: Math.round(3200 / 10.764),
    type: 'villa',
    description: 'Bay views and refined finishes in a sought-after San Francisco setting.',
    amenities: ['Parking', 'Garden', 'AC', 'Laundry', 'Balcony'],
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
