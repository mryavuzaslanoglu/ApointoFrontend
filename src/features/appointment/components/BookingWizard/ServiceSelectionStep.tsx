import React, { useState, useEffect } from 'react';
import type { ServiceItem } from '@/entities/service/model';
import { servicesApi } from '@/features/services/api/servicesApi';

interface ServiceSelectionStepProps {
  selectedServices: ServiceItem[];
  onServicesChange: (services: ServiceItem[]) => void;
}

export function ServiceSelectionStep({ selectedServices, onServicesChange }: ServiceSelectionStepProps) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await servicesApi.getServices();
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Hizmetler yüklenirken bir hata oluştu.');
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceToggle = (service: ServiceItem, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }

    const isSelected = selectedServices.some(s => s.id === service.id);

    if (isSelected) {
      onServicesChange(selectedServices.filter(s => s.id !== service.id));
    } else {
      onServicesChange([...selectedServices, service]);
    }
  };

  const selectedServiceIds = selectedServices.map(s => s.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Henüz hizmet tanımlanmamış.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hizmet Seçin</h2>
        <p className="text-gray-600">Randevu almak istediğiniz hizmetleri seçin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const isSelected = selectedServiceIds.includes(service.id);

          return (
            <div
              key={service.id}
              className={`
                relative border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
              onClick={(e) => handleServiceToggle(service, e)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>{service.durationInMinutes} dakika</span>
                    <span>₺{service.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleServiceToggle(service);
                    }}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              {service.assignedStaff.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Hizmet veren personel:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.assignedStaff.map((staff) => (
                      <span
                        key={staff.id}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {staff.firstName} {staff.lastName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedServices.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Seçilen Hizmetler</h3>
          <div className="space-y-2">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span>{service.name}</span>
                <div className="flex gap-4">
                  <span>{service.durationInMinutes} dk</span>
                  <span>₺{service.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="border-t pt-2 font-medium">
              <div className="flex justify-between">
                <span>Toplam:</span>
                <div className="flex gap-4">
                  <span>
                    {selectedServices.reduce((total, s) => total + s.durationInMinutes + s.bufferTimeInMinutes, 0)} dk
                  </span>
                  <span>
                    ₺{selectedServices.reduce((total, s) => total + s.price, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}