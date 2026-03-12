import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import { listings, filterListings } from '../data/listings'
import type { PropertyType } from '../types/listing'

export default function Listings() {
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city') ?? undefined
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const bedrooms = searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined
  const type = (searchParams.get('type') as PropertyType | null) ?? undefined

  const results = city || minPrice != null || maxPrice != null || bedrooms != null || type
    ? filterListings({ city, minPrice, maxPrice, bedrooms, type })
    : listings

  return (
    <div className="py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl font-semibold text-[var(--color-stone)] mb-2">Rentals</h1>
        <p className="text-[var(--color-stone)]/80 mb-8">Houses and apartments available to rent.</p>
        <div className="mb-10">
          <SearchBar />
        </div>
        <p className="text-[var(--color-stone)]/70 mb-6">
          {results.length} {results.length === 1 ? 'property' : 'properties'} found
        </p>
        {results.length === 0 ? (
          <p className="text-[var(--color-stone)]/70 py-12 text-center">No properties match your filters. Try adjusting your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
