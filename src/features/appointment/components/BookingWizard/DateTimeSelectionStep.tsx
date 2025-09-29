import React, { useState, useMemo, useEffect } from 'react';
import type { ServiceItem } from '@/entities/service/model';
import type { StaffSummary } from '@/entities/staff/model';
import type { AvailableSlot } from '@/entities/appointment/model';
import { appointmentApi } from '@/features/appointment/api/appointmentApi';

interface DateTimeSelectionStepProps {
  selectedServices: ServiceItem[];
  selectedStaff: StaffSummary | null;
  selectedSlot: AvailableSlot | null;
  onSlotChange: (slot: AvailableSlot | null) => void;
}

export function DateTimeSelectionStep({
  selectedServices,
  selectedStaff,
  selectedSlot,
  onSlotChange,
}: DateTimeSelectionStepProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get next 30 days for date selection
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('tr-TR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }),
        date,
      });
    }

    return dates;
  }, []);

  const serviceIds = selectedServices.map(s => s.id);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (serviceIds.length === 0 || selectedDate === '') {
        setAvailableSlots([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);

        const response = await appointmentApi.findAvailableSlots({
          serviceIds,
          preferredStaffId: selectedStaff?.id || null,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        setAvailableSlots(response.data.availableSlots);
      } catch (err) {
        console.error('Failed to fetch available slots:', err);
        setError('Uygun saatler yüklenirken bir hata oluştu.');
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [serviceIds, selectedStaff?.id, selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    onSlotChange(null); // Reset slot selection when date changes
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    onSlotChange(slot);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (selectedServices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Önce hizmet seçimi yapınız.</p>
      </div>
    );
  }

  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.durationInMinutes + service.bufferTimeInMinutes,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tarih ve Saat Seçin</h2>
        <p className="text-gray-600">
          Randevu için uygun tarih ve saati seçin (Süre: {totalDuration} dakika)
        </p>
      </div>

      {/* Date Selection */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Tarih Seçin
        </label>
        <select
          id="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tarih seçin</option>
          {availableDates.map((date) => (
            <option key={date.value} value={date.value}>
              {date.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Uygun Saatler
          </label>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Uygun saatler yükleniyor...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && availableSlots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Bu tarih için uygun saat bulunamadı.</p>
              <p className="text-gray-500 text-sm mt-1">Lütfen başka bir tarih seçin.</p>
            </div>
          )}

          {!isLoading && !error && availableSlots.length > 0 && (
            <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleSlotSelect(slot)}
                  className={`
                    p-3 text-sm rounded-lg border transition-all duration-200
                    ${selectedSlot?.startTime === slot.startTime
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="font-medium">
                    {formatTime(slot.startTime)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {slot.staffName}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedSlot && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Seçilen Randevu</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tarih:</span>
              <span className="font-medium">
                {availableDates.find(d => d.value === selectedDate)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Saat:</span>
              <span className="font-medium">
                {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Personel:</span>
              <span className="font-medium">{selectedSlot.staffName}</span>
            </div>
            <div className="flex justify-between">
              <span>Süre:</span>
              <span className="font-medium">{totalDuration} dakika</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}