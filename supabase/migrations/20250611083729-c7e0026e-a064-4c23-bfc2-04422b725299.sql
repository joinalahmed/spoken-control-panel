
-- Add knowledge_base_id column to campaigns table
ALTER TABLE campaigns ADD COLUMN knowledge_base_id uuid REFERENCES knowledge_base(id);
