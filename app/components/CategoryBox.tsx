'use client';

import qs from 'query-string';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { IconType } from 'react-icons';

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ icon: Icon, label, selected }) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};
    if (params) currentQuery = qs.parse(params.toString());

    const updatedQuery: any = { ...currentQuery, category: label };
    if (params?.get('category') === label) delete updatedQuery.category;

    router.push(qs.stringifyUrl({ url: '/', query: updatedQuery }, { skipNull: true }));
  }, [label, router, params]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-row items-center gap-2 px-4 py-2 rounded-full border
        transition cursor-pointer whitespace-nowrap flex-shrink-0 text-sm font-medium
        ${selected
          ? 'bg-brand-600 border-brand-600 text-white'
          : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50'
        }
      `}
    >
      <Icon size={15} />
      <span>{label}</span>
    </div>
  );
};

export default CategoryBox;
