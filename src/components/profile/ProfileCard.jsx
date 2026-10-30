import React from 'react';
import { Mail, Phone, Calendar, Shield, Edit, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, formatInitials } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ProfileCard = ({ user, isAdmin, onEdit }) => {
  const { t } = useLanguage();
  if (!user) return null;

  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const phone = user.user_metadata?.phone || '';

  return (
    <Card variant="gaming" padding="lg">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
          <span className="text-white font-bold text-3xl">
            {formatInitials(name) || 'U'}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
              {name}
            </h2>
            {isAdmin && (
              <Badge variant="warning" size="sm" icon={Shield}>
                {t('admin') || 'Admin'}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
            {phone && (
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{phone}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{t('memberSince') || 'Member since'}: {formatDate(user.created_at)}</span>
            </p>
          </div>

          {onEdit && (
            <div className="mt-4">
              <Button variant="primary" size="sm" leftIcon={Edit} onClick={onEdit}>
                {t('editProfile') || 'Edit Profile'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
