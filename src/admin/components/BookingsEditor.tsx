import { useState, useEffect } from 'react';
import { adminApi, Booking } from '../api/mockApi';
import { Calendar, Phone, User, Clock, RefreshCw, CheckCircle2, Clock3, XCircle } from 'lucide-react';

export default function BookingsEditor() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.fetchBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (id: string | number, status: string) => {
    setUpdatingId(id);
    try {
      await adminApi.updateBookingStatus(id, status);
      await loadBookings();
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении статуса заявки');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-200"><CheckCircle2 size={12}/> Подтверждена</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-200"><CheckCircle2 size={12}/> Завершена</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-medium border border-red-200"><XCircle size={12}/> Отменена</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-200"><Clock3 size={12}/> Новая</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-rose-500" size={22} />
            Заявки на примерку
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Управление записями клиентов из формы на сайте
          </p>
        </div>
        <button
          onClick={loadBookings}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Обновить"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin text-rose-500' : ''} />
        </button>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">Загрузка заявок...</div>
      ) : bookings.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          Пока нет поступивших заявок
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-400 font-semibold">
              <tr>
                <th className="p-3">Клиент</th>
                <th className="p-3">Телефон</th>
                <th className="p-3">Дата и время</th>
                <th className="p-3">Статус</th>
                <th className="p-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-3 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400 shrink-0" />
                      <span>{b.clientName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <a href={`tel:${b.clientPhone}`} className="flex items-center gap-2 text-rose-600 hover:underline">
                      <Phone size={14} />
                      <span>{b.clientPhone}</span>
                    </a>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{b.preferredDate || 'Не указана'}</span>
                      <Clock size={14} className="text-gray-400 ml-1" />
                      <span>{b.preferredTime || '14:00'}</span>
                    </div>
                  </td>
                  <td className="p-3">{getStatusBadge(b.status || 'new')}</td>
                  <td className="p-3 text-right">
                    <select
                      value={b.status || 'new'}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      disabled={updatingId === b.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs rounded-lg px-2 py-1 focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="new">Новая</option>
                      <option value="confirmed">Подтвердить</option>
                      <option value="completed">Завершить</option>
                      <option value="cancelled">Отменить</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
