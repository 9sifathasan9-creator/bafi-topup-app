import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Send, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES, DEFAULT_CONTACT, APP_VERSION } from '../../utils/constants';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const footerLinkClass = 'text-slate-600 dark:text-white/70 hover:text-purple-600 dark:hover:text-white transition text-sm';

  return (
    <footer className="bg-white/60 dark:bg-white/5 backdrop-blur-lg border-t border-gray-200 dark:border-white/20 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2 mb-4">
              <img src="/icon-192.png" alt="BAFI Topup" className="w-8 h-8 rounded-lg shadow-sm object-cover" />
              <span className="text-slate-800 dark:text-white font-bold text-xl">BAFI Topup</span>
            </Link>
            <p className="text-slate-600 dark:text-white/70 text-sm mb-4">{t('welcomeSubtitle')}</p>
            <div className="flex items-center space-x-3">
              <a href={DEFAULT_CONTACT.FACEBOOK} className="w-9 h-9 bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition shadow-sm border border-gray-100 dark:border-none"><Facebook className="w-4 h-4 text-slate-600 dark:text-white" /></a>
              <a href={DEFAULT_CONTACT.YOUTUBE} className="w-9 h-9 bg-white dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-600 rounded-lg flex items-center justify-center transition shadow-sm border border-gray-100 dark:border-none"><Youtube className="w-4 h-4 text-slate-600 dark:text-white" /></a>
              <a href={`https://t.me/${DEFAULT_CONTACT.TELEGRAM}`} className="w-9 h-9 bg-white dark:bg-white/10 hover:bg-sky-50 dark:hover:bg-sky-500 rounded-lg flex items-center justify-center transition shadow-sm border border-gray-100 dark:border-none"><Send className="w-4 h-4 text-slate-600 dark:text-white" /></a>
              <a href={`https://wa.me/${DEFAULT_CONTACT.WHATSAPP?.replace(/\D/g, '')}`} className="w-9 h-9 bg-white dark:bg-white/10 hover:bg-green-50 dark:hover:bg-green-600 rounded-lg flex items-center justify-center transition shadow-sm border border-gray-100 dark:border-none"><Phone className="w-4 h-4 text-slate-600 dark:text-white" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-slate-800 dark:text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to={ROUTES.HOME} className={footerLinkClass}>{t('home')}</Link></li>
              <li><Link to={ROUTES.GAMES} className={footerLinkClass}>{t('games')}</Link></li>
              <li><Link to={ROUTES.ABOUT} className={footerLinkClass}>{t('aboutUs')}</Link></li>
              <li><Link to={ROUTES.CONTACT} className={footerLinkClass}>{t('contactUs')}</Link></li>
              <li><Link to={ROUTES.FAQ} className={footerLinkClass}>{t('faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-800 dark:text-white font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li><Link to={ROUTES.TERMS} className={footerLinkClass}>{t('termsOfService')}</Link></li>
              <li><Link to={ROUTES.PRIVACY} className={footerLinkClass}>{t('privacyPolicy')}</Link></li>
              <li><Link to="/refund" className={footerLinkClass}>{t('refundPolicy')}</Link></li>
              <li><Link to={ROUTES.SUPPORT} className={footerLinkClass}>{t('support')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-800 dark:text-white font-semibold mb-4">{t('contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-slate-500 dark:text-white/70 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${DEFAULT_CONTACT.EMAIL}`} className={footerLinkClass}>{DEFAULT_CONTACT.EMAIL}</a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-slate-500 dark:text-white/70 mt-0.5 flex-shrink-0" />
                <a href={`tel:${DEFAULT_CONTACT.PHONE}`} className={footerLinkClass}>{DEFAULT_CONTACT.PHONE}</a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-500 dark:text-white/70 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600 dark:text-white/70 text-sm">{DEFAULT_CONTACT.ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <p className="text-slate-500 dark:text-white/70 text-sm text-center md:text-left">© {currentYear} BAFI Topup. {t('allRightsReserved')}</p>
          <p className="text-slate-400 dark:text-white/50 text-xs">v{APP_VERSION} • {t('madeWith')} ❤️ {t('by')} BAFI Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
