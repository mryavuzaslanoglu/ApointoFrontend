import React from 'react';
import type { ServiceItem } from '@/entities/service/model';
import type { StaffSummary } from '@/entities/staff/model';

interface StaffSelectionStepProps {
  selectedServices: ServiceItem[];
  selectedStaff: StaffSummary | null;
  onStaffChange: (staff: StaffSummary | null) => void;
}

export function StaffSelectionStep({ selectedServices, selectedStaff, onStaffChange }: StaffSelectionStepProps) {
  // Get all staff who can perform the selected services
  const getEligibleStaff = (): StaffSummary[] => {
    if (selectedServices.length === 0) return [];

    // Find staff who can perform ALL selected services
    const allStaffFromServices = selectedServices.flatMap(service => service.assignedStaff);

    // Group by staff ID to count how many services each staff can perform
    const staffServiceCount = allStaffFromServices.reduce((acc, staff) => {
      acc[staff.id] = (acc[staff.id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Filter staff who can perform all selected services
    const eligibleStaff = allStaffFromServices.filter(staff =>
      staffServiceCount[staff.id] === selectedServices.length
    );

    // Remove duplicates
    const uniqueStaff = eligibleStaff.filter((staff, index, self) =>
      index === self.findIndex(s => s.id === staff.id)
    );

    return uniqueStaff;
  };

  const eligibleStaff = getEligibleStaff();

  const handleStaffSelect = (staff: StaffSummary | null) => {
    onStaffChange(staff);
  };

  if (selectedServices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Önce hizmet seçimi yapınız.</p>
      </div>
    );
  }

  if (eligibleStaff.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Seçilen hizmetleri verebilecek personel bulunamadı.</p>
        <p className="text-gray-600 mt-2">Lütfen hizmet seçiminizi gözden geçirin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Personel Seçin</h2>
        <p className="text-gray-600">Seçilen hizmetleri verebilecek personellerden birini seçin</p>
      </div>

      <div className="space-y-4">
        {/* Any staff option */}
        <div
          className={`
            relative border rounded-lg p-4 cursor-pointer transition-all duration-200
            ${selectedStaff === null
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }
          `}
          onClick={() => handleStaffSelect(null)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Farketmez</h3>
              <p className="text-sm text-gray-600">Müsait olan ilk personel atansın</p>
            </div>
            <input
              type="radio"
              checked={selectedStaff === null}
              onChange={() => handleStaffSelect(null)}
              className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Individual staff options */}
        {eligibleStaff.map((staff) => (
          <div
            key={staff.id}
            className={`
              relative border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selectedStaff?.id === staff.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
            `}
            onClick={() => handleStaffSelect(staff)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {staff.firstName} {staff.lastName}
                </h3>
                {staff.title && (
                  <p className="text-sm text-gray-600">{staff.title}</p>
                )}

                {/* Show which selected services this staff can perform */}
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Verebileceği seçili hizmetler:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedServices
                      .filter(service => service.assignedStaff.some(s => s.id === staff.id))
                      .map((service) => (
                        <span
                          key={service.id}
                          className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                        >
                          {service.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="ml-4">
                <input
                  type="radio"
                  checked={selectedStaff?.id === staff.id}
                  onChange={() => handleStaffSelect(staff)}
                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStaff && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Seçilen Personel</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {selectedStaff.firstName[0]}{selectedStaff.lastName[0]}
              </span>
            </div>
            <div>
              <p className="font-medium">{selectedStaff.firstName} {selectedStaff.lastName}</p>
              {selectedStaff.title && (
                <p className="text-sm text-gray-600">{selectedStaff.title}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}