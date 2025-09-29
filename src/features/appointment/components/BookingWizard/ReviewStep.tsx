import React, { useState } from 'react';
import type { ServiceItem } from '@/entities/service/model';
import type { StaffSummary } from '@/entities/staff/model';
import type { AvailableSlot } from '@/entities/appointment/model';
import { appointmentApi } from '@/features/appointment/api/appointmentApi';

interface ReviewStepProps {
  selectedServices: ServiceItem[];
  selectedStaff: StaffSummary | null;
  selectedSlot: AvailableSlot | null;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
}

export function ReviewStep({
  selectedServices,
  selectedStaff,
  selectedSlot,
  notes,
  onNotesChange,
  onConfirm,
}: ReviewStepProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selectedSlot) return;

    setIsConfirming(true);
    setError(null);

    try {
      await appointmentApi.createAppointment({
        staffId: selectedSlot.staffId,
        startTimeUtc: selectedSlot.startTime,
        serviceIds: selectedServices.map(s => s.id),
        notes: notes.trim() || null,
      });

      setIsConfirming(false);
      onConfirm();
    } catch (err) {
      console.error('Appointment creation failed:', err);
      setError('Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setIsConfirming(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const totalPrice = selectedServices.reduce((total, service) => total + service.price, 0);
  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.durationInMinutes + service.bufferTimeInMinutes,
    0
  );

  if (!selectedSlot) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Randevu bilgileri eksik.</p>
      </div>
    );
  }

  const { date, time } = formatDateTime(selectedSlot.startTime);
  const endTime = formatDateTime(selectedSlot.endTime).time;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Randevu Özeti</h2>
        <p className="text-gray-600">Randevu bilgilerinizi kontrol edin ve onaylayın</p>
      </div>

      {/* Services */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Seçilen Hizmetler</h3>
        <div className="space-y-3">
          {selectedServices.map((service) => (
            <div key={service.id} className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">{service.durationInMinutes} dakika</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₺{service.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Toplam</p>
              <p className="text-sm text-gray-600">{totalDuration} dakika</p>
            </div>
            <p className="text-lg font-semibold text-gray-900">₺{totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Randevu Detayları</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Tarih</p>
            <p className="text-gray-900">{date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Saat</p>
            <p className="text-gray-900">{time} - {endTime}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Personel</p>
            <p className="text-gray-900">{selectedSlot.staffName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Süre</p>
            <p className="text-gray-900">{totalDuration} dakika</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notlar (İsteğe bağlı)</h3>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Randevunuzla ilgili özel notlarınızı buraya yazabilirsiniz..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Confirm Button */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfirming ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Randevu Oluşturuluyor...
              </span>
            ) : (
              'Randevuyu Onayla'
            )}
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-2">
              {error}
            </p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Randevunuzu onayladıktan sonra size e-posta ile bilgi verilecektir.
          </p>
        </div>
      </div>
    </div>
  );
}