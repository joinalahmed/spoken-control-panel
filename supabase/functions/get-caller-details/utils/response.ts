
import { 
  buildCampaignObject, 
  buildContactObject, 
  buildAgentObject, 
  buildScriptObject, 
  buildUserObject 
} from '../../shared/utils/campaign-response.ts';

export const buildCallerResponse = (
  campaign: any,
  contact: any,
  agent: any,
  script: any,
  user: any,
  knowledgeBases: any[]
) => {
  return {
    success: true,
    campaign_id: campaign.id,
    voice_id: agent?.voice_id || null,
    caller: {
      contact: buildContactObject(contact),
      campaign: buildCampaignObject(campaign),
      agent: agent ? buildAgentObject(agent) : null,
      script: script ? buildScriptObject(script) : null,
      user: user ? buildUserObject(user) : null,
      knowledge_bases: knowledgeBases
    }
  };
};
