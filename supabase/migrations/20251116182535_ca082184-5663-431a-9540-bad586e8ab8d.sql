-- Add file_url column to surgeries table for storing uploaded surgery documents
ALTER TABLE surgeries ADD COLUMN file_url text;