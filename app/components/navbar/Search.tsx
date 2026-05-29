'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { BiSearch, BiX } from 'react-icons/bi';
import qs from 'query-string';

const Search = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params?.get('q') ?? '');

  const handleSearch = useCallback(() => {
    const current = params ? qs.parse(params.toString()) : {};
    const query = value.trim()
      ? { ...current, q: value.trim() }
      : { ...current };

    if (!value.trim()) delete (query as any).q;

    router.push(qs.stringifyUrl({ url: '/', query }, { skipNull: true }));
  }, [value, params, router]);

  const handleClear = useCallback(() => {
    setValue('');
    const current = params ? qs.parse(params.toString()) : {};
    delete (current as any).q;
    router.push(qs.stringifyUrl({ url: '/', query: current }, { skipNull: true }));
  }, [params, router]);

  return (
    <div className="flex-1 max-w-md mx-4">
      <div className="flex items-center border border-slate-200 rounded-full px-4 py-2.5 bg-white shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-brand-300 transition gap-2">
        <BiSearch size={18} className="text-slate-400 flex-shrink-0" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search services…"
          className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
        />
        {value && (
          <button onClick={handleClear} className="text-slate-400 hover:text-slate-600 transition">
            <BiX size={18} />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-700 transition flex-shrink-0"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
