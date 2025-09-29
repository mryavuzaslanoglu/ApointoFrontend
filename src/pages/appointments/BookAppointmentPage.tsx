import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingWizard } from '@/features/appointment/components/BookingWizard';

export function BookAppointmentPage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Navigate to appointments page or show success message
    navigate('/appointments');
  };

  const handleCancel = () => {
    // Navigate back or to dashboard
    navigate('/');
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Randevu Al</h1>
          <p className="mt-2 text-gray-600">
            Adım adım randevu oluşturma sürecini tamamlayın
          </p>
        </div>

        <BookingWizard onComplete={handleComplete} onCancel={handleCancel} />
      </div>
    </div>
  );
}