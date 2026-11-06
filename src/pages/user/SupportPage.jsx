import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Package, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES } from '../../utils/constants';
import Tabs, { TabPanel } from '../../components/ui/Tabs';
import LiveChat from '../../components/support/LiveChat';
import SupportTicket from '../../components/support/SupportTicket';
import TicketList from '../../components/support/TicketList';
import FAQ from '../../components/support/FAQ';

const SupportPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: t('liveChat') || 'Chat', icon: MessageCircle },
    { id: 'tickets', label: t('tickets') || 'Tickets', icon: Package },
    { id: 'new', label: t('new') || 'New Ticket', icon: Send },
    { id: 'faq', label: t('faq') || 'FAQ', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <h1 className="text-2xl font-bold text-white">
          💬 {t('support') || 'Support'}
        </h1>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" fullWidth />

        <TabPanel id="chat" activeTab={activeTab}>
          <div className="gaming-card h-[600px] overflow-hidden">
            <LiveChat />
          </div>
        </TabPanel>
        <TabPanel id="tickets" activeTab={activeTab}>
          <TicketList tickets={[]} loading={false} />
        </TabPanel>
        <TabPanel id="new" activeTab={activeTab}>
          <SupportTicket />
        </TabPanel>
        <TabPanel id="faq" activeTab={activeTab}>
          <FAQ />
        </TabPanel>
      </div>
    </div>
  );
};

export default SupportPage;
