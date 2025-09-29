import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentApi } from '@/features/appointment/api/appointmentApi';
import type { Appointment, AppointmentStatus } from '@/entities/appointment/model';

export function MyAppointmentsPage() {
  const [includePast, setIncludePast] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await appointmentApi.getMyAppointments({ includePast });
      setAppointments(response.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Randevular yüklenirken bir hata oluştu.');
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [includePast]);

  const handleCancel = async (appointmentId: string) => {
    const reason = prompt('İptal sebebini belirtir misiniz? (İsteğe bağlı)');
    if (reason !== null) {
      try {
        setIsCancelling(true);
        await appointmentApi.cancelAppointment(appointmentId, {
          cancellationReason: reason || undefined
        });
        // Refresh appointments after cancellation
        await fetchAppointments();
      } catch (err) {
        console.error('Failed to cancel appointment:', err);
        alert('Randevu iptal edilirken bir hata oluştu.');
      } finally {
        setIsCancelling(false);
      }
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

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'NoShow':
        return 'bg-orange-100 text-orange-800';
      case 'Rescheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'Planlandı';
      case 'Confirmed':
        return 'Onaylandı';
      case 'InProgress':
        return 'Devam Ediyor';
      case 'Completed':
        return 'Tamamlandı';
      case 'Cancelled':
        return 'İptal Edildi';
      case 'NoShow':
        return 'Gelmedi';
      case 'Rescheduled':
        return 'Yeniden Planlandı';
      default:
        return status;
    }
  };

  const canCancelAppointment = (appointment: Appointment) => {
    if (appointment.status === 'Completed' || appointment.status === 'Cancelled') {
      return false;
    }

    // Check if appointment is more than 24 hours away
    const appointmentTime = new Date(appointment.startTime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilAppointment >= 24;
  };

  const upcomingAppointments = appointments.filter(app => {
    const appointmentTime = new Date(app.startTime);
    return appointmentTime > new Date();
  });

  const pastAppointments = appointments.filter(app => {
    const appointmentTime = new Date(app.startTime);
    return appointmentTime <= new Date();
  });

  const displayedAppointments = includePast ? appointments : upcomingAppointments;

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Randevular yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Randevularım</h1>
            <p className="mt-2 text-gray-600">
              Mevcut ve geçmiş randevularınızı görüntüleyin ve yönetin
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <Link
              to="/book-appointment"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Yeni Randevu Al
            </Link>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includePast}
                onChange={(e) => setIncludePast(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Geçmiş randevuları da göster</span>
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">{upcomingAppointments.length}</p>
              <p className="text-sm text-gray-600">Yaklaşan Randevular</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">{pastAppointments.length}</p>
              <p className="text-sm text-gray-600">Tamamlanan Randevular</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
              <p className="text-sm text-gray-600">Toplam Randevu</p>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {displayedAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border p-8">
              {includePast ? (
                <p className="text-gray-600">Henüz hiç randevunuz bulunmuyor.</p>
              ) : (
                <p className="text-gray-600">Yaklaşan randevunuz bulunmuyor.</p>
              )}
              <Link
                to="/book-appointment"
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                İlk Randevunu Al
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAppointments.map((appointment) => {
              const { date, time } = formatDateTime(appointment.startTime);
              const endTime = formatDateTime(appointment.endTime).time;

              return (
                <div key={appointment.id} className="bg-white rounded-lg border shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {date}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium text-gray-700">Saat</p>
                          <p>{time} - {endTime}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Personel</p>
                          <p>{appointment.staffName}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Toplam Ücret</p>
                          <p>₺{appointment.totalPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Hizmetler</p>
                          <p>{appointment.services.length} hizmet</p>
                        </div>
                      </div>

                      {appointment.services.length > 0 && (
                        <div className="mt-4">
                          <p className="font-medium text-gray-700 text-sm mb-2">Seçilen Hizmetler:</p>
                          <div className="flex flex-wrap gap-2">
                            {appointment.services.map((service, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                              >
                                {service.serviceName} ({service.durationInMinutes} dk, ₺{service.price.toFixed(2)})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="mt-4">
                          <p className="font-medium text-gray-700 text-sm">Notlar:</p>
                          <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {canCancelAppointment(appointment) && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          disabled={isCancelling}
                          className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {isCancelling ? 'İptal Ediliyor...' : 'İptal Et'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}