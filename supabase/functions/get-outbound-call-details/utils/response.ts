
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
    outbound_call: {
      campaign: buildCampaignObject(campaign),
      agent: buildAgentObject(agent),
      script: script ? buildScriptObject(script) : null,
      user: user ? buildUserObject(user) : null,
      knowledge_bases: knowledgeBases
    }
  };

  if (contact) {
    response.outbound_call.contact = buildContactObject(contact);
  }

  return response;
};
