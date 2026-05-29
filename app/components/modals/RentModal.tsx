'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import useRentModal from '@/app/hooks/useRentModal';
import Modal from './Modal';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import { categories } from '../navbar/Categories';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import Heading from '../Heading';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  IMAGES = 2,
  DESCRIPTION = 3,
  CONTACT = 4,
  IDPROOF = 5,
  PRICE = 6,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
      phone: '',
      contactEmail: '',
      idProofUrl: '',
    },
  });

  const location = watch('location');
  const category = watch('category');
  const imageSrc = watch('imageSrc');
  const idProofUrl = watch('idProofUrl');

  const Map = useMemo(() => dynamic(() => import('../Map'), { ssr: false }), [location]);

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const onBack = () => setStep((v) => v - 1);
  const onNext = () => setStep((v) => v + 1);

  const actionLabel = useMemo(() => (step === STEPS.PRICE ? 'Create Service' : 'Next'), [step]);
  const secondaryActionLabel = useMemo(() => (step === STEPS.CATEGORY ? undefined : 'Back'), [step]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) return onNext();

    setIsLoading(true);
    axios.post('/api/listings', data)
      .then(() => {
        toast.success('Service listed successfully!');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => toast.error('Something went wrong.'))
      .finally(() => setIsLoading(false));
  };

  // ── Step bodies ──────────────────────────────────────────────────

  let bodyContent = (
    <div className="flex flex-col gap-6">
      <Heading title="What type of service do you offer?" subtitle="Choose a category" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(cat) => setCustomValue('category', cat)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Where do you offer this service?" subtitle="Help customers find you" />
        <CountrySelect value={location} onChange={(v) => setCustomValue('location', v)} />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Add a photo of your service" subtitle="Show customers what to expect" />
        <ImageUpload onChange={(v) => setCustomValue('imageSrc', v)} value={imageSrc} />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Describe your service" subtitle="A clear description helps customers choose you" />
        <Input id="title" label="Service Title" disabled={isLoading} register={register} errors={errors} required />
        <Input id="description" label="Description" disabled={isLoading} register={register} errors={errors} required />
      </div>
    );
  }

  if (step === STEPS.CONTACT) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Your contact information" subtitle="Shared with customers after they pay — keep this accurate" />
        <Input id="phone" label="Mobile Number (e.g. +91 9876543210)" disabled={isLoading} register={register} errors={errors} required />
        <Input id="contactEmail" label="Contact Email" type="email" disabled={isLoading} register={register} errors={errors} required />
      </div>
    );
  }

  if (step === STEPS.IDPROOF) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading
          title="Upload your ID proof"
          subtitle="Required to verify you as a service provider — Aadhaar, PAN, or Driving Licence"
        />
        <ImageUpload onChange={(v) => setCustomValue('idProofUrl', v)} value={idProofUrl} />
        {idProofUrl && (
          <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
            ✓ ID proof uploaded successfully
          </p>
        )}
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Set your session price" subtitle="Amount customers will pay per booking (in ₹)" />
        <Input id="price" label="Price per session (₹)" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
        <div className="bg-brand-50 rounded-xl p-4 text-sm text-brand-700 border border-brand-100">
          <p className="font-semibold mb-1">Ready to go live?</p>
          <p>After creating your service, you'll need an active subscription to appear in search results.</p>
        </div>
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="List Your Service"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
};

export default RentModal;
