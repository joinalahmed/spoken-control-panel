
import { 
  buildCampaignObject, 
  buildContactObject, 
  buildAgentObject, 
  buildScriptObject, 
  buildUserObject 
} from '../../shared/utils/campaign-response.ts';

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
    // User details for the contact/phone number
    contact_user: user ? buildUserObject(user) : null,
    outbound_call: {
      campaign: buildCampaignObject(campaign),
      agent: buildAgentObject(agent),
      script: script ? buildScriptObject(script) : null,
      knowledge_bases: knowledgeBases
    }
  };

  if (contact) {
    response.outbound_call.contact = buildContactObject(contact);
  }

  return response;
};
