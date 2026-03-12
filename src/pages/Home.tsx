import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import { getFeaturedListings } from '../data/listings'

export default function Home() {
  const featured = getFeaturedListings()

  return (
    <>
      <section className="relative py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-[var(--color-stone)] leading-tight">
            Find your next home
          </h1>
          <p className="mt-4 text-lg text-[var(--color-stone)]/80 max-w-xl mx-auto">
            Browse houses and apartments for rent. Filter by location, price, and more.
          </p>
          <div className="mt-10 max-w-4xl mx-auto">
            <SearchBar />
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              to="/staging"
              className="inline-flex items-center px-5 py-2.5 rounded-full border border-[var(--color-warm-light)] bg-white/70 text-sm font-medium text-[var(--color-stone)] hover:bg-[var(--color-warm-light)]/40 transition-colors"
            >
              Try AI home staging for your listing
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-semibold text-[var(--color-stone)]">Featured rentals</h2>
            <Link
              to="/listings"
              className="text-[var(--color-warm)] font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
