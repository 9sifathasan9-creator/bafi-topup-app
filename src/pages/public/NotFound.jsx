import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card variant="gaming" padding="lg" className="max-w-md w-full text-center">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t('pageNotFound') || 'Page Not Found'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t('pageNotFoundDesc') || 'The page you are looking for does not exist.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" leftIcon={Home} onClick={() => navigate(ROUTES.HOME)} fullWidth>
            {t('goHome') || 'Go Home'}
          </Button>
          <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate(-1)} fullWidth>
            {t('goBack') || 'Go Back'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
