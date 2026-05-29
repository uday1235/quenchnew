'use client';

import dynamic from "next/dynamic";
import Link from "next/link";
import { IconType } from "react-icons";
import { HiCheckBadge } from "react-icons/hi2";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";

const Map = dynamic(() => import('../Map'), { 
  ssr: false 
});

interface ListingInfoProps {
  user: SafeUser,
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category: {
    icon: IconType,
    label: string;
    description: string;
  } | undefined
  locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
}) => {
  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng

  return ( 
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href={`/providers/${user?.id}`}
          className="flex flex-row items-center gap-3 group w-fit"
        >
          <Avatar src={user?.image} />
          <div>
            <div className="flex items-center gap-1.5 text-lg font-semibold text-slate-800 group-hover:text-brand-600 transition">
              {user?.name}
              {(user as any)?.isVerified && (
                <HiCheckBadge size={18} className="text-emerald-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-400 font-normal">View provider profile →</p>
          </div>
        </Link>
        <div className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div>
            {guestCount} guests
          </div>
          <div>
            {roomCount} rooms
          </div>
          <div>
            {bathroomCount} bathrooms
          </div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon} 
          label={category?.label}
          description={category?.description} 
        />
      )}
      <hr />
      <div className="
      text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr />
      <Map center={coordinates} />
    </div>
   );
}
 
export default ListingInfo;