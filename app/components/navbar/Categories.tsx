'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { TiCamera } from 'react-icons/ti';
import { FaPersonHalfDress } from 'react-icons/fa6';
import {
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from 'react-icons/gi';
import { FaSkiing } from 'react-icons/fa';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';

import CategoryBox from '../CategoryBox';
import Container from '../Container';

export const categories = [
  { label: 'SpaServices',      icon: TbBeach,          description: 'Professional body massage & spa treatments' },
  { label: 'SalesMen',         icon: GiWindmill,       description: 'Sales professionals for business promotion' },
  { label: 'HomeTutions',      icon: MdOutlineVilla,   description: 'Best home tutors in the city' },
  { label: 'WebDeveloper',     icon: TbMountain,       description: 'Professional website development' },
  { label: 'HealthCare',       icon: TbPool,           description: 'Healthcare professionals near you' },
  { label: 'Fitness&Training', icon: GiIsland,         description: 'Personal fitness & health trainers' },
  { label: 'DeliveryBoys',     icon: GiBoatFishing,    description: 'Reliable delivery personnel' },
  { label: 'Drivers',          icon: FaSkiing,         description: 'Experienced drivers for hire' },
  { label: 'MakeupArtists',    icon: GiCastle,         description: 'Professional makeup & beauty artists' },
  { label: 'Maids',            icon: FaPersonHalfDress, description: 'Household help & cleaning staff' },
  { label: 'OnlineCourses',    icon: GiForestCamp,     description: 'Online learning & coaching' },
  { label: 'Photographers',    icon: TiCamera,         description: 'Professional event photographers' },
  { label: 'Meditation',       icon: GiCactus,         description: 'Guided meditation sessions' },
  { label: 'EventManagers',    icon: GiCaveEntrance,   description: 'Event planning & management' },
  { label: 'InteriorDesigner', icon: IoDiamond,        description: 'Professional interior design services' },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();

  if (pathname !== '/') return null;

  return (
    <div className="bg-white border-b border-slate-100">
      <Container>
        <div className="py-3 flex flex-row items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((item) => (
            <CategoryBox
              key={item.label}
              label={item.label}
              icon={item.icon}
              selected={category === item.label}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
