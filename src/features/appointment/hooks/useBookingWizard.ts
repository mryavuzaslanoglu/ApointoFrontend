import { useState, useCallback } from 'react';
import type { ServiceItem } from '@/entities/service/model';
import type { StaffSummary } from '@/entities/staff/model';
import type { AvailableSlot } from '@/entities/appointment/model';

export type BookingStep = 'services' | 'staff' | 'datetime' | 'review';

export type BookingData = {
  selectedServices: ServiceItem[];
  selectedStaff: StaffSummary | null;
  selectedSlot: AvailableSlot | null;
  notes: string;
};

const initialBookingData: BookingData = {
  selectedServices: [],
  selectedStaff: null,
  selectedSlot: null,
  notes: '',
};

export function useBookingWizard() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('services');
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  const updateBookingData = useCallback((updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    const steps: BookingStep[] = ['services', 'staff', 'datetime', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const steps: BookingStep[] = ['services', 'staff', 'datetime', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: BookingStep) => {
    setCurrentStep(step);
  }, []);

  const resetWizard = useCallback(() => {
    setCurrentStep('services');
    setBookingData(initialBookingData);
  }, []);

  const canProceedToNext = useCallback(() => {
    switch (currentStep) {
      case 'services':
        return bookingData.selectedServices.length > 0;
      case 'staff':
        return bookingData.selectedStaff !== null;
      case 'datetime':
        return bookingData.selectedSlot !== null;
      case 'review':
        return true;
      default:
        return false;
    }
  }, [currentStep, bookingData]);

  const getTotalDuration = useCallback(() => {
    return bookingData.selectedServices.reduce(
      (total, service) => total + service.durationInMinutes + service.bufferTimeInMinutes,
      0
    );
  }, [bookingData.selectedServices]);

  const getTotalPrice = useCallback(() => {
    return bookingData.selectedServices.reduce((total, service) => total + service.price, 0);
  }, [bookingData.selectedServices]);

  return {
    currentStep,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    goToStep,
    resetWizard,
    canProceedToNext,
    getTotalDuration,
    getTotalPrice,
  };
}