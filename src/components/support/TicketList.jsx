import React from 'react';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatRelativeTime, formatOrderId } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const TicketList = ({ tickets = [], loading = false, onTicketClick }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonLoader variant="list" count={3} />
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={t('noTickets') || 'No support tickets'}
        description={t('noTicketsDesc') || 'Your tickets will appear here'}
      />
    );
  }

  const getStatusConfig = (status) => {
    const map = {
      open: { variant: 'info', icon: Clock, label: t('open') || 'Open' },
      closed: { variant: 'success', icon: CheckCircle, label: t('closed') || 'Closed' },
      pending: { variant: 'warning', icon: AlertCircle, label: t('pending') || 'Pending' },
    };
    return map[status] || map.open;
  };

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const statusConfig = getStatusConfig(ticket.status);
        const StatusIcon = statusConfig.icon;

        return (
          <Card
            key={ticket.id}
            variant="gaming"
            padding="md"
            hover
            clickable={!!onTicketClick}
            onClick={() => onTicketClick?.(ticket)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                    {ticket.subject || 'No subject'}
                  </p>
                  <Badge variant={statusConfig.variant} size="sm">
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {ticket.message}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatOrderId(ticket.id)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(ticket.created_at)}</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TicketList;
