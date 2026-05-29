'use client';

import { useRouter } from 'next/navigation';
import { BiSearchAlt } from 'react-icons/bi';
import Button from './Button';
import Heading from './Heading';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No services found',
  subtitle = 'Try a different search or category.',
  showReset,
}) => {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-4 justify-center items-center">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
        <BiSearchAlt size={32} className="text-brand-400" />
      </div>
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-2">
        {showReset && (
          <Button outline label="Clear filters" onClick={() => router.push('/')} />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
