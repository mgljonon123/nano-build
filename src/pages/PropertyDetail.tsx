import { useParams, Link } from 'react-router-dom'
import { getListingBySlug } from '../data/listings'

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>()
  const listing = slug ? getListingBySlug(slug) : undefined

  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-stone)]/80">Property not found.</p>
        <Link to="/listings" className="mt-4 inline-block text-[var(--color-warm)] font-medium hover:underline">
          ← Back to rentals
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/listings" className="inline-block text-[var(--color-warm)] font-medium hover:underline mb-6">
          ← Back to rentals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-stone)]/5">
              <img
                src={listing.images[0] ?? listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            {listing.images.length > 1 && (
              <div className="grid grid-cols-2 gap-2">
                {listing.images.slice(1, 3).map((img, i) => (
                  <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-[var(--color-warm)] text-sm font-medium uppercase tracking-wide">{listing.type}</p>
            <h1 className="font-serif text-3xl font-semibold text-[var(--color-stone)] mt-1">{listing.title}</h1>
            <p className="text-[var(--color-stone)]/70 mt-2">{listing.location}, {listing.city}</p>
            <div className="flex gap-4 mt-4 text-[var(--color-stone)]/80">
              <span>{listing.bedrooms} bedrooms</span>
              <span>{listing.bathrooms} bathrooms</span>
              <span>{listing.area} m²</span>
            </div>
            <p className="mt-6 text-2xl font-semibold text-[var(--color-stone)]">
              <span className="text-[var(--color-warm)]">${listing.pricePerMonth}</span>
              <span className="text-[var(--color-stone)]/70 font-normal text-lg">/month</span>
            </p>
            <p className="text-sm text-[var(--color-stone)]/70 mt-1">Available from {new Date(listing.availableFrom).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <div className="mt-8 p-6 bg-white rounded-xl border border-[var(--color-warm-light)]/20">
              <h3 className="font-semibold text-[var(--color-stone)] mb-2">Contact / Request to rent</h3>
              <p className="text-sm text-[var(--color-stone)]/80 mb-4">
                Use the button below to inquire or request a viewing. We’ll get back to you within 24 hours.
              </p>
              <button
                type="button"
                className="w-full py-3 bg-[var(--color-stone)] text-[var(--color-sand)] font-medium rounded-lg hover:bg-[var(--color-warm)] transition-colors"
              >
                Request to rent
              </button>
            </div>

            <div className="mt-4 p-4 bg-white rounded-xl border border-dashed border-[var(--color-warm-light)]/60">
              <h3 className="font-semibold text-[var(--color-stone)] mb-2">Virtual home staging</h3>
              <p className="text-sm text-[var(--color-stone)]/80 mb-3">
                Boost your listing by generating an AI‑staged version of this room with virtual furniture and decor.
              </p>
              <Link
                to="/staging"
                className="inline-flex w-full justify-center py-2.5 px-4 rounded-lg border border-[var(--color-stone)] text-[var(--color-stone)] font-medium hover:bg-[var(--color-stone)] hover:text-[var(--color-sand)] transition-colors text-sm"
              >
                Open AI staging tool
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-stone)] mb-3">About this property</h2>
            <p className="text-[var(--color-stone)]/85 leading-relaxed">{listing.description}</p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-[var(--color-stone)] mb-3">Amenities</h2>
            <ul className="flex flex-wrap gap-2">
              {listing.amenities.map((a) => (
                <li
                  key={a}
                  className="px-3 py-1.5 bg-[var(--color-warm-light)]/20 text-[var(--color-stone)] rounded-full text-sm"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
