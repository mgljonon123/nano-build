import { Link } from 'react-router-dom'
import type { Listing } from '../types/listing'

interface PropertyCardProps {
  listing: Listing
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Link
      to={`/listings/${listing.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-[var(--color-warm-light)]/20"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <p className="text-[var(--color-warm)] text-sm font-medium uppercase tracking-wide">{listing.type}</p>
        <h3 className="font-serif text-xl font-semibold text-[var(--color-stone)] mt-1 group-hover:text-[var(--color-warm)] transition-colors">
          {listing.title}
        </h3>
        <p className="text-[var(--color-stone)]/70 text-sm mt-1">{listing.location}, {listing.city}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-[var(--color-stone)]/80">
          <span>{listing.bedrooms} bed</span>
          <span>{listing.bathrooms} bath</span>
          <span>{listing.area} m²</span>
        </div>
        <p className="mt-4 font-semibold text-[var(--color-stone)]">
          <span className="text-[var(--color-warm)]">${listing.pricePerMonth}</span>
          <span className="text-[var(--color-stone)]/70 font-normal">/month</span>
        </p>
      </div>
    </Link>
  )
}
