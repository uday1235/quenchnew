'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import qs from 'query-string';
import { HiOutlineLocationMarker, HiOutlineCurrencyRupee, HiX } from 'react-icons/hi';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Rishikesh'];

const PRICE_RANGES = [
  { label: 'Under ₹1,000',  minPrice: '0',    maxPrice: '999'   },
  { label: '₹1k – ₹5k',    minPrice: '1000', maxPrice: '4999'  },
  { label: '₹5k – ₹20k',   minPrice: '5000', maxPrice: '19999' },
  { label: '₹20k+',         minPrice: '20000', maxPrice: ''     },
];

export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  const activeLocation = params?.get('location') ?? '';
  const activeMin      = params?.get('minPrice') ?? '';
  const activeMax      = params?.get('maxPrice') ?? '';

  const hasFilters = activeLocation || activeMin || activeMax;

  const setFilter = useCallback((patch: Record<string, string | undefined>) => {
    const current = params ? qs.parse(params.toString()) : {};
    const next = { ...current, ...patch };
    Object.keys(next).forEach((k) => { if (!next[k]) delete next[k]; });
    router.push(qs.stringifyUrl({ url: '/', query: next }, { skipNull: true }));
  }, [params, router]);

  const clearAll = useCallback(() => {
    const current = params ? qs.parse(params.toString()) : {};
    delete current.location;
    delete current.minPrice;
    delete current.maxPrice;
    router.push(qs.stringifyUrl({ url: '/', query: current }, { skipNull: true }));
  }, [params, router]);

  const toggleCity = (city: string) =>
    setFilter({ location: activeLocation === city ? undefined : city });

  const togglePrice = (min: string, max: string) => {
    const isActive = activeMin === min && activeMax === max;
    setFilter({ minPrice: isActive ? undefined : min, maxPrice: isActive ? undefined : (max || undefined) });
  };

  return (
    <div className="bg-white border-b border-slate-100 py-2.5">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 xl:px-20">
        <div className="flex flex-wrap items-center gap-2">

          {/* City filter */}
          <div className="flex items-center gap-1.5 mr-1">
            <HiOutlineLocationMarker size={14} className="text-slate-400 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:inline">City</span>
          </div>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => toggleCity(city)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeLocation === city
                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 bg-white'
              }`}
            >
              {city}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Price filter */}
          <div className="flex items-center gap-1.5 mr-1">
            <HiOutlineCurrencyRupee size={14} className="text-slate-400 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:inline">Price</span>
          </div>
          {PRICE_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => togglePrice(r.minPrice, r.maxPrice)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeMin === r.minPrice && activeMax === r.maxPrice
                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 bg-white'
              }`}
            >
              {r.label}
            </button>
          ))}

          {/* Clear all */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="ml-auto flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-semibold transition"
            >
              <HiX size={13} /> Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
