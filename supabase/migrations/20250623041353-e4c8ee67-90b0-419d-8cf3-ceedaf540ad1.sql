
-- Add extracted_data_config to campaigns table to store data extraction settings
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS extracted_data_config jsonb DEFAULT '[]'::jsonb;

-- Update the campaigns table comment to document the new column
COMMENT ON COLUMN campaigns.extracted_data_config IS 'Configuration for what data fields should be extracted from calls in this campaign';
