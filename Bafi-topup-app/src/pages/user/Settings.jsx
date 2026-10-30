import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, Globe, Moon, Sun, Bell, Shield, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate as useNav } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import DeleteAccount from '../../components/profile/DeleteAccount';

const Settings = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: t('appearance') || 'Appearance',
      items: [
        {
          icon: isDark ? Moon : Sun,
          label: t('theme') || 'Theme',
          value: isDark ? t('dark') || 'Dark' : t('light') || 'Light',
          onClick: toggleTheme,
        },
      ],
    },
    {
      title: t('language') || 'Language',
      items: [
        {
          icon: Globe,
          label: t('language') || 'Language',
          value: language === 'en' ? 'English' : 'বাংলা',
          onClick: toggleLanguage,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" /> {t('settings') || 'Settings'}
        </h1>

        {settingsGroups.map((group, gi) => (
          <Card key={gi} variant="gaming" padding="md">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, ii) => {
                const Icon = item.icon;
                return (
                  <button
                    key={ii}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium text-gray-800 dark:text-white">
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        ))}

        <DeleteAccount onDelete={() => console.log('Delete account')} />
      </div>
    </div>
  );
};

export default Settings;
