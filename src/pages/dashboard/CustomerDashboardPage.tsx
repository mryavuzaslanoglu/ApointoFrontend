import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { appointmentApi } from '@/features/appointment/api/appointmentApi';
import type { Appointment } from '@/entities/appointment/model';

export function CustomerDashboardPage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await appointmentApi.getMyAppointments({ includePast: false, pageSize: 5 });
        setUpcomingAppointments(response.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        setUpcomingAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        weekday: 'short',
      }),
      time: date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const getNextAppointment = (): Appointment | null => {
    if (upcomingAppointments.length === 0) return null;

    const now = new Date();
    const futureAppointments = upcomingAppointments
      .filter(app => new Date(app.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return futureAppointments[0] || null;
  };

  const nextAppointment = getNextAppointment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Hoş Geldiniz!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Modern ve kolay randevu sistemiyle zamanınızı en verimli şekilde planlayın
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Link
            to="/book-appointment"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8 opacity-10">
              <Plus className="w-full h-full" />
            </div>
            <div className="relative flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Yeni Randevu Al</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Hızlı ve kolay randevu oluşturma sistemi
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-blue-200">
              ✨ Anında rezervasyon yapın
            </div>
          </Link>

          <Link
            to="/appointments"
            className="group relative overflow-hidden bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-purple-200 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8 opacity-5">
              <Calendar className="w-full h-full text-purple-500" />
            </div>
            <div className="relative flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Randevularım</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tüm randevularınızı yönetin ve takip edin
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-purple-600">
              📅 Randevu geçmişinizi görün
            </div>
          </Link>
        </div>

        {/* Next Appointment */}
        {nextAppointment && (
          <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-12 shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-20 -translate-y-10 opacity-5">
              <Clock className="w-full h-full text-green-500" />
            </div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Bir Sonraki Randevunuz</h2>
                  <p className="text-green-600 font-medium">🕐 Yaklaşan randevu</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <Calendar className="h-5 w-5 text-green-600 mr-2" />
                      <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Tarih</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatDateTime(nextAppointment.startTime).date}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Saat</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatDateTime(nextAppointment.startTime).time} - {formatDateTime(nextAppointment.endTime).time}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <User className="h-5 w-5 text-purple-600 mr-2" />
                      <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Personel</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{nextAppointment.staffName}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center mb-3">
                    <span className="text-lg">✨</span>
                    <p className="text-sm font-semibold text-gray-700 ml-2 uppercase tracking-wide">Hizmetler</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nextAppointment.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm"
                      >
                        💄 {service.serviceName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Appointments */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Yaklaşan Randevular</h2>
                  <p className="text-sm text-gray-600">Önümüzdeki randevularınız</p>
                </div>
              </div>
              <Link
                to="/appointments"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>Tümünü Görüntüle</span>
                <Calendar className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">✨ Randevularınız yükleniyor...</p>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Calendar className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz yaklaşan randevunuz yok</h3>
                <p className="text-gray-600 mb-6">İlk randevunuzu alarak güzellik yolculuğunuza başlayın!</p>
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  İlk Randevunu Al
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingAppointments.slice(0, 3).map((appointment, index) => {
                  const { date, time } = formatDateTime(appointment.startTime);
                  const endTime = formatDateTime(appointment.endTime).time;
                  const gradients = [
                    'from-blue-400 to-purple-500',
                    'from-green-400 to-blue-500',
                    'from-purple-400 to-pink-500'
                  ];

                  return (
                    <div
                      key={appointment.id}
                      className="relative overflow-hidden bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group"
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradients[index % 3]}`}></div>

                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${gradients[index % 3]} rounded-xl flex items-center justify-center shadow-md`}>
                            <Clock className="h-6 w-6 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-center mb-2">
                                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tarih & Saat</p>
                                </div>
                                <p className="text-lg font-bold text-gray-900">{date}</p>
                                <p className="text-md text-blue-600 font-semibold">{time} - {endTime}</p>
                              </div>

                              <div className="text-right md:text-left">
                                <div className="flex items-center justify-end md:justify-start mb-2">
                                  <User className="h-4 w-4 text-gray-500 mr-2" />
                                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Personel & Ücret</p>
                                </div>
                                <p className="text-lg font-bold text-gray-900">{appointment.staffName}</p>
                                <div className="flex items-center justify-end md:justify-start mt-1">
                                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                    {appointment.services.length} hizmet
                                  </span>
                                  <span className="ml-2 text-lg font-bold text-green-600">
                                    ₺{appointment.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex flex-wrap gap-2">
                                {appointment.services.slice(0, 3).map((service, serviceIndex) => (
                                  <span
                                    key={serviceIndex}
                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                                  >
                                    ✨ {service.serviceName}
                                  </span>
                                ))}
                                {appointment.services.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                                    +{appointment.services.length - 3} daha
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {upcomingAppointments.length > 3 && (
                  <div className="text-center pt-6">
                    <Link
                      to="/appointments"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-600 rounded-xl font-medium transition-all duration-200 border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {upcomingAppointments.length - 3} randevu daha var - Tümünü gör
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}