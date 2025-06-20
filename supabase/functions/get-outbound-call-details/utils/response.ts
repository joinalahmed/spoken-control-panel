
export const buildOutboundCallResponse = (
  campaign: any,
  agent: any,
  script: any,
  user: any,
  knowledgeBases: any[],
  contact?: any
) => {
  const response = {
    success: true,
    campaign_id: campaign.id,
    voice_id: agent.voice_id,
    outbound_call: {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
        campaign_type: campaign.settings?.campaign_type || 'outbound'
      },
      agent: agent,
      script: script,
      user: user,
      knowledge_bases: knowledgeBases
    }
  };

  if (contact) {
    response.outbound_call.contact = {
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
  }

  return response;
};
