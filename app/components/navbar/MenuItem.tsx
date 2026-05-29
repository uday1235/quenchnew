'use client';

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 hover:bg-slate-50 transition font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
    >
      {label}
    </div>
  );
};

export default MenuItem;
