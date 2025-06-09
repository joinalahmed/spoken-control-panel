
import { useState } from 'react';
import { Agent } from '@/hooks/useAgents';
import { Contact } from '@/hooks/useContacts';

export const useDashboardState = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [contactsView, setContactsView] = useState<'list' | 'create'>('list');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [kbsView, setKbsView] = useState<'list' | 'create'>('list');
  const [campaignsView, setCampaignsView] = useState<'overview' | 'create' | 'details' | 'call-details'>('overview');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  return {
    activeTab,
    setActiveTab,
    selectedAgent,
    setSelectedAgent,
    showCreateAgent,
    setShowCreateAgent,
    contactsView,
    setContactsView,
    editingContact,
    setEditingContact,
    viewingContact,
    setViewingContact,
    kbsView,
    setKbsView,
    campaignsView,
    setCampaignsView,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedCallId,
    setSelectedCallId,
  };
};
