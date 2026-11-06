import React from 'react';
import { Link2, Copy, Check, Share2, MessageCircle, Send, Facebook } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import Card from '../ui/Card';

const ReferralLink = ({ referralCode }) => {
  const { t } = useLanguage();
  const { notifySuccess } = useNotifications();
  const [copied, setCopied] = React.useState(false);

  const referralLink = referralCode
    ? `${window.location.origin}/register?ref=${referralCode}`
    : '';

  const shareText = encodeURIComponent(
    `🎮 Join BAFI Gaming! Use my code: ${referralCode}`
  );

  const handleCopy = () => {
    if (!referralLink) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      notifySuccess(t('linkCopied') || 'Link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BAFI Gaming',
          text: `Join BAFI Gaming with code: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  const shareButtons = [
    { id: 'whatsapp', icon: MessageCircle, color: 'bg-green-500', url: `https://wa.me/?text=${shareText}%20${encodeURIComponent(referralLink)}` },
    { id: 'telegram', icon: Send, color: 'bg-sky-500', url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}` },
    { id: 'facebook', icon: Facebook, color: 'bg-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}` },
  ];

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Link2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        {t('referralLink') || 'Referral Link'}
      </h3>

      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
        <p className="flex-1 text-xs text-gray-600 dark:text-gray-400 truncate font-mono">
          {referralLink || 'Generating link...'}
        </p>
        <button
          onClick={handleCopy}
          disabled={!referralLink}
          className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition disabled:opacity-50 flex-shrink-0"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={handleShare}
          disabled={!referralLink}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          {t('shareNow') || 'Share Now'}
        </button>
      </div>

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
          {t('orShareVia') || 'Or share via'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {shareButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <a
                key={btn.id}
                href={btn.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-11 h-11 ${btn.color} text-white rounded-lg flex items-center justify-center hover:opacity-90 transition shadow-md`}
                aria-label={btn.id}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ReferralLink;
