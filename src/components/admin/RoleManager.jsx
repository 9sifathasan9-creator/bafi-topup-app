import React, { useState } from 'react';
import { Shield, User, Users, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const RoleManager = ({ user, currentRole, onRoleChange }) => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState(currentRole || 'user');

  const roles = [
    { id: 'user', icon: User, label: t('user') || 'User', desc: t('userDesc') || 'Normal user access', color: 'blue' },
    { id: 'moderator', icon: Users, label: t('moderator') || 'Moderator', desc: t('moderatorDesc') || 'Can manage content', color: 'purple' },
    { id: 'admin', icon: Shield, label: t('admin') || 'Admin', desc: t('adminDesc') || 'Full access', color: 'red' },
  ];

  const colorMap = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  };

  const handleChange = (roleId) => {
    setSelectedRole(roleId);
    onRoleChange?.(user?.id, roleId);
  };

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4">
        {t('manageRole') || 'Manage Role'}: {user?.email}
      </h3>

      <div className="space-y-2">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => handleChange(role.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition ${
                isSelected
                  ? colorMap[role.color]
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-gray-800 dark:text-white">{role.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{role.desc}</p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default RoleManager;
