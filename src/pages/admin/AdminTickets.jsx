import React, { useEffect, useState } from 'react';
import { Package, MessageSquare, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import { formatRelativeTime, formatOrderId } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const AdminTickets = () => {
  const { t } = useLanguage();
  const { notifySuccess } = useNotifications();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTickets = async () => {
    setLoading(true);
    const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleClose = async (id) => {
    const { error } = await supabase.from('tickets').update({ status: 'closed' }).eq('id', id);
    if (!error) {
      notifySuccess(t('ticketClosed') || 'Ticket closed');
      fetchTickets();
    }
  };

  const filtered = filter === 'all' ? tickets : tickets.filter((tk) => tk.status === filter);

  const getStatusConfig = (status) => {
    const map = {
      open: { variant: 'info', label: t('open') || 'Open' },
      closed: { variant: 'success', label: t('closed') || 'Closed' },
      pending: { variant: 'warning', label: t('pending') || 'Pending' },
    };
    return map[status] || map.open;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6" /> {t('supportTickets') || 'Support Tickets'}
          </h1>
          <p className="text-white/70 text-sm">{tickets.length} {t('total') || 'total'}</p>
        </div>

        <div className="flex gap-2">
          {['all', 'open', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition capitalize ${
                filter === f ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t(f) || f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
      ) : filtered.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">{t('noTickets') || 'No tickets'}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status);
            return (
              <Card key={ticket.id} variant="gaming" padding="md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{ticket.subject}</p>
                      <Badge variant={statusConfig.variant} size="sm">{statusConfig.label}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{ticket.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{ticket.user_email || 'User'}</span>
                      <span>•</span>
                      <span>{formatOrderId(ticket.id)}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(ticket.created_at)}</span>
                    </div>
                  </div>
                  {ticket.status !== 'closed' && (
                    <Button variant="success" size="sm" leftIcon={CheckCircle} onClick={() => handleClose(ticket.id)}>
                      {t('close') || 'Close'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
