import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, TrendingUp, ChevronRight, CalendarDays } from 'lucide-react';
import { useAuthStore } from '@/entities/auth/model/authStore';
import { CustomerDashboardPage } from './CustomerDashboardPage';
import { appointmentApi } from '@/features/appointment/api/appointmentApi';
import type { Appointment } from '@/entities/appointment/model';

// Admin dashboard - modern and feature-rich
function AdminDashboardPage() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    completedToday: 0,
    upcomingToday: 0,
    cancelledToday: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        setIsLoading(true);
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Bu API endpoint'i henüz admin için spesifik olmayabilir
        // Gerçek implementasyonda admin için özel endpoint olması gerekir
        const response = await appointmentApi.getMyAppointments({
          includePast: true,
          startDate: startOfDay.toISOString(),
          endDate: endOfDay.toISOString()
        });

        const appointments = response.data;
        setTodayAppointments(appointments);

        // İstatistikleri hesapla
        const total = appointments.length;
        const completed = appointments.filter(apt => apt.status === 'Completed').length;
        const upcoming = appointments.filter(apt =>
          apt.status === 'Scheduled' || apt.status === 'Confirmed'
        ).length;
        const cancelled = appointments.filter(apt => apt.status === 'Cancelled').length;

        setStats({
          totalToday: total,
          completedToday: completed,
          upcomingToday: upcoming,
          cancelledToday: cancelled
        });
      } catch (error) {
        console.error('Failed to fetch today data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayData();
  }, []);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'Planlandı';
      case 'Confirmed': return 'Onaylandı';
      case 'Completed': return 'Tamamlandı';
      case 'Cancelled': return 'İptal';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">👨‍💼</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Admin Kontrol Paneli
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            İşletmenizi yönetin, randevuları takip edin ve performansı izleyin
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bugünkü Toplam</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : stats.totalToday}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-3xl font-bold text-green-600">{isLoading ? '...' : stats.completedToday}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yaklaşan</p>
                <p className="text-3xl font-bold text-yellow-600">{isLoading ? '...' : stats.upcomingToday}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">İptal Edilen</p>
                <p className="text-3xl font-bold text-red-600">{isLoading ? '...' : stats.cancelledToday}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link
            to="/admin/calendar"
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8 opacity-10">
              <CalendarDays className="w-full h-full" />
            </div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Takvim Görünümü</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Tüm randevuları takvim formatında görüntüleyin
                </p>
              </div>
              <ChevronRight className="h-8 w-8 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-4 text-sm text-indigo-200">
              📅 Gelişmiş takvim yönetimi
            </div>
          </Link>

          <Link
            to="/staff"
            className="group relative overflow-hidden bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-indigo-200 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8 opacity-5">
              <Users className="w-full h-full text-indigo-500" />
            </div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Personel Yönetimi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Personel bilgilerini yönetin ve programları düzenleyin
                </p>
              </div>
              <ChevronRight className="h-8 w-8 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="mt-4 text-sm text-indigo-600">
              👥 Ekip yönetimi
            </div>
          </Link>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bugünkü Randevular</h2>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('tr-TR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
              <Link
                to="/admin/calendar"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Takvimi Aç
              </Link>
            </div>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">📅 Bugünkü randevular yükleniyor...</p>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Calendar className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bugün randevu yok</h3>
                <p className="text-gray-600 mb-6">Bugün için henüz planlanmış randevu bulunmuyor.</p>
                <Link
                  to="/admin/calendar"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Takvimi Görüntüle
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                        {formatTime(appointment.startTime)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.customerName || 'Müşteri'}</p>
                        <p className="text-sm text-gray-600">{appointment.staffName}</p>
                        <p className="text-xs text-gray-500">
                          {appointment.services.map(s => s.serviceName).join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        ₺{appointment.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                {todayAppointments.length > 5 && (
                  <div className="text-center pt-4">
                    <Link
                      to="/admin/calendar"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-50 hover:to-purple-50 text-gray-700 hover:text-indigo-600 rounded-xl font-medium transition-all duration-200 border-2 border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {todayAppointments.length - 5} randevu daha var - Takvimi görüntüle
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

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user?.roles) {
    return (
      <section className="page">
        <h1>Yetki Kontrolü</h1>
        <p>Kullanıcı rolleri yükleniyor...</p>
      </section>
    );
  }

  const isAdmin = user.roles.includes('Admin');
  const isCustomer = user.roles.includes('Customer');

  if (isAdmin) {
    return <AdminDashboardPage />;
  } else if (isCustomer) {
    return <CustomerDashboardPage />;
  }

  return (
    <section className="page">
      <h1>Yetkisiz Erişim</h1>
      <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
    </section>
  );
}
