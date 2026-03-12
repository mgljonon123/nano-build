import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PropertyType } from '../types/listing'

const CITIES = ['Portland', 'Seattle']
const TYPES: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'villa', label: 'Villa' },
]

export default function SearchBar() {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [type, setType] = useState<PropertyType | ''>('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (bedrooms) params.set('bedrooms', bedrooms)
    if (type) params.set('type', type)
    navigate(`/listings?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-4 p-6 bg-white rounded-xl shadow-md border border-[var(--color-warm-light)]/20"
    >
      <div>
        <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">City</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-40 px-3 py-2 border border-[var(--color-warm-light)]/40 rounded-lg bg-[var(--color-sand)]/50 focus:ring-2 focus:ring-[var(--color-warm)]/30 focus:border-[var(--color-warm)]"
        >
          <option value="">Any</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType((e.target.value || '') as PropertyType | '')}
          className="w-36 px-3 py-2 border border-[var(--color-warm-light)]/40 rounded-lg bg-[var(--color-sand)]/50 focus:ring-2 focus:ring-[var(--color-warm)]/30 focus:border-[var(--color-warm)]"
        >
          <option value="">Any</option>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">Min price</label>
        <input
          type="number"
          placeholder="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min={0}
          className="w-28 px-3 py-2 border border-[var(--color-warm-light)]/40 rounded-lg bg-[var(--color-sand)]/50 focus:ring-2 focus:ring-[var(--color-warm)]/30 focus:border-[var(--color-warm)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">Max price</label>
        <input
          type="number"
          placeholder="5000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min={0}
          className="w-28 px-3 py-2 border border-[var(--color-warm-light)]/40 rounded-lg bg-[var(--color-sand)]/50 focus:ring-2 focus:ring-[var(--color-warm)]/30 focus:border-[var(--color-warm)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">Bedrooms</label>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="w-24 px-3 py-2 border border-[var(--color-warm-light)]/40 rounded-lg bg-[var(--color-sand)]/50 focus:ring-2 focus:ring-[var(--color-warm)]/30 focus:border-[var(--color-warm)]"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="px-6 py-2.5 bg-[var(--color-stone)] text-[var(--color-sand)] font-medium rounded-lg hover:bg-[var(--color-warm)] transition-colors"
      >
        Search
      </button>
    </form>
  )
}
