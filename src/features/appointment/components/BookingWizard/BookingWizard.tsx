import React from 'react';
import { useBookingWizard } from '@/features/appointment/hooks/useBookingWizard';
import { ServiceSelectionStep } from './ServiceSelectionStep';
import { StaffSelectionStep } from './StaffSelectionStep';
import { DateTimeSelectionStep } from './DateTimeSelectionStep';
import { ReviewStep } from './ReviewStep';

interface BookingWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function BookingWizard({ onComplete, onCancel }: BookingWizardProps) {
  const {
    currentStep,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    resetWizard,
    canProceedToNext,
  } = useBookingWizard();

  const handleComplete = () => {
    resetWizard();
    onComplete?.();
  };

  const steps = [
    { key: 'services', title: 'Hizmet Seçimi', number: 1 },
    { key: 'staff', title: 'Personel Seçimi', number: 2 },
    { key: 'datetime', title: 'Tarih & Saat', number: 3 },
    { key: 'review', title: 'Gözden Geçir', number: 4 },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 'services':
        return (
          <ServiceSelectionStep
            selectedServices={bookingData.selectedServices}
            onServicesChange={(services) => updateBookingData({ selectedServices: services })}
          />
        );
      case 'staff':
        return (
          <StaffSelectionStep
            selectedServices={bookingData.selectedServices}
            selectedStaff={bookingData.selectedStaff}
            onStaffChange={(staff) => updateBookingData({ selectedStaff: staff })}
          />
        );
      case 'datetime':
        return (
          <DateTimeSelectionStep
            selectedServices={bookingData.selectedServices}
            selectedStaff={bookingData.selectedStaff}
            selectedSlot={bookingData.selectedSlot}
            onSlotChange={(slot) => updateBookingData({ selectedSlot: slot })}
          />
        );
      case 'review':
        return (
          <ReviewStep
            selectedServices={bookingData.selectedServices}
            selectedStaff={bookingData.selectedStaff}
            selectedSlot={bookingData.selectedSlot}
            notes={bookingData.notes}
            onNotesChange={(notes) => updateBookingData({ notes })}
            onConfirm={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex-1">
              <div className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm
                    ${index <= currentStepIndex
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                    }
                  `}
                >
                  {step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`
                      text-sm font-medium
                      ${index <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'}
                    `}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 ml-4
                      ${index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'}
                    `}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[500px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <div>
          {currentStepIndex > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Geri
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              resetWizard();
              onCancel?.();
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            İptal
          </button>

          {currentStep !== 'review' && (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              İleri
            </button>
          )}
        </div>
      </div>
    </div>
  );
}