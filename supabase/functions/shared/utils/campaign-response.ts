
export const buildCampaignObject = (campaign: any) => {
  return {
    id: campaign.id,
    name: campaign.name,
    description: campaign.description,
    status: campaign.status,
    campaign_type: campaign.settings?.campaign_type || 'outbound'
  };
};

export const buildContactObject = (contact: any) => {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    city: contact.city,
    state: contact.state,
    zip_code: contact.zip_code,
    status: contact.status
  };
};

export const buildAgentObject = (agent: any) => {
  return {
    id: agent.id,
    name: agent.name,
    voice: agent.voice,
    voice_id: agent.voice_id || agent.voice,
    status: agent.status,
    description: agent.description,
    system_prompt: agent.system_prompt,
    first_message: agent.first_message,
    company: agent.company,
    agent_type: agent.agent_type
  };
};

export const buildScriptObject = (script: any) => {
  return {
    id: script.id,
    name: script.name,
    description: script.description,
    company: script.company,
    agent_type: script.agent_type,
    voice: script.voice,
    first_message: script.first_message,
    sections: script.sections
  };
};

export const buildUserObject = (user: any) => {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email
  };
};
