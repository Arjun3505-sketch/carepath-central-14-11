-- =====================================================
-- MEDICAL FILES STORAGE BUCKET CONFIGURATION
-- Run this SQL in your Lovable Cloud SQL Editor
-- =====================================================

-- Step 1: Create medical-files storage bucket with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-files',
  'medical-files',
  false, -- Private bucket for security
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

-- Step 2: RLS Policy - Doctors can upload files for any patient
CREATE POLICY "Doctors can upload medical files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'medical-files' AND
  EXISTS (
    SELECT 1 FROM doctors WHERE doctors.id = auth.uid()
  )
);

-- Step 3: RLS Policy - Doctors can view all medical files
CREATE POLICY "Doctors can view all medical files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-files' AND
  EXISTS (
    SELECT 1 FROM doctors WHERE doctors.id = auth.uid()
  )
);

-- Step 4: RLS Policy - Patients can view only their own files
-- Files are organized by patient_id in folder structure: {file-type}/{patient_id}/{filename}
CREATE POLICY "Patients can view their own medical files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-files' AND
  EXISTS (
    SELECT 1 FROM patients 
    WHERE patients.id = auth.uid() AND
    (
      -- Check if file path contains patient's ID
      (storage.objects.name LIKE 'diagnoses/' || patients.id::text || '/%') OR
      (storage.objects.name LIKE 'lab-reports/' || patients.id::text || '/%') OR
      (storage.objects.name LIKE 'prescriptions/' || patients.id::text || '/%')
    )
  )
);

-- Step 5: RLS Policy - Doctors can delete medical files
CREATE POLICY "Doctors can delete medical files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'medical-files' AND
  EXISTS (
    SELECT 1 FROM doctors WHERE doctors.id = auth.uid()
  )
);

-- Step 6: Add file_url column to diagnoses table
ALTER TABLE diagnoses ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Step 7: Add file_url column to lab_reports table
ALTER TABLE lab_reports ADD COLUMN IF NOT EXISTS file_url TEXT;

-- =====================================================
-- VERIFICATION QUERIES (Optional - run to verify setup)
-- =====================================================

-- Check bucket configuration
SELECT * FROM storage.buckets WHERE id = 'medical-files';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check column additions
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('diagnoses', 'lab_reports') 
AND column_name = 'file_url';
