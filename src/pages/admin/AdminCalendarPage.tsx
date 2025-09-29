import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, MapPin, Phone, Mail } from 'lucide-react';
import { appointmentApi } from '@/features/appointment/api/appointmentApi';
import type { Appointment } from '@/entities/appointment/model';

interface CalendarDay {
  date: Date;
  appointments: Appointment[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Get calendar days for current month
  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];
    const today = new Date();

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date,
        appointments: getAppointmentsForDate(date),
        isCurrentMonth: false,
        isToday: isSameDay(date, today)
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        appointments: getAppointmentsForDate(date),
        isCurrentMonth: true,
        isToday: isSameDay(date, today)
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        appointments: getAppointmentsForDate(date),
        isCurrentMonth: false,
        isToday: isSameDay(date, today)
      });
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getAppointmentsForDate = (date: Date): Appointment[] => {
    return appointments.filter(appointment =>
      isSameDay(new Date(appointment.startTime), date)
    );
  };

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Bu admin için özel bir endpoint olmalı, şimdilik mevcut olanı kullanıyoruz
      const response = await appointmentApi.getMyAppointments({
        includePast: true,
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      });

      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'Confirmed': return 'bg-blue-500';
      case 'Scheduled': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const monthYear = currentDate.toLocaleDateString('tr-TR', {
    month: 'long',
    year: 'numeric'
  });

  const calendarDays = getCalendarDays();
  const weekDays = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Randevu Takvimi
            </h1>
            <p className="text-gray-600 mt-2">Tüm randevuları takvim görünümünde yönetin</p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center capitalize">
              {monthYear}
            </h2>

            <button
              onClick={() => navigateMonth('next')}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                {weekDays.map((day) => (
                  <div key={day} className="p-4 text-center font-semibold text-gray-700">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Body */}
              <div className="grid grid-cols-7">
                {calendarDays.map((calendarDay, index) => (
                  <div
                    key={index}
                    className={`
                      min-h-[120px] p-2 border-b border-r border-gray-100 relative
                      ${!calendarDay.isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                      ${calendarDay.isToday ? 'bg-blue-50 border-blue-200' : ''}
                    `}
                  >
                    <div className={`
                      text-sm font-medium mb-2
                      ${!calendarDay.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                      ${calendarDay.isToday ? 'text-blue-600' : ''}
                    `}>
                      {calendarDay.date.getDate()}
                    </div>

                    <div className="space-y-1">
                      {calendarDay.appointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          onClick={() => setSelectedAppointment(appointment)}
                          className={`
                            text-xs p-1 rounded cursor-pointer text-white
                            ${getStatusColor(appointment.status)}
                            hover:opacity-80 transition-opacity
                          `}
                        >
                          <div className="font-medium truncate">
                            {formatTime(appointment.startTime)}
                          </div>
                          <div className="truncate">
                            {appointment.customerName || 'Müşteri'}
                          </div>
                        </div>
                      ))}

                      {calendarDay.appointments.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{calendarDay.appointments.length - 3} daha
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Appointment Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              {selectedAppointment ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Randevu Detayları</h3>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full text-white
                      ${getStatusColor(selectedAppointment.status)}
                    `}>
                      {selectedAppointment.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedAppointment.startTime).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(selectedAppointment.startTime)} - {formatTime(selectedAppointment.endTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedAppointment.customerName || 'Müşteri Bilgisi Yok'}
                        </p>
                        <p className="text-sm text-gray-600">Müşteri</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedAppointment.staffName}</p>
                        <p className="text-sm text-gray-600">Personel</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Hizmetler</h4>
                      <div className="space-y-2">
                        {selectedAppointment.services.map((service, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{service.serviceName}</span>
                            <span className="font-medium">₺{service.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                        <span>Toplam</span>
                        <span>₺{selectedAppointment.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {selectedAppointment.notes && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Notlar</h4>
                        <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Detayları görmek için bir randevuya tıklayın</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-gray-600">Randevular yükleniyor...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}