-- Make storage buckets public so files can be accessed
UPDATE storage.buckets SET public = true WHERE id = 'evidence-files';
UPDATE storage.buckets SET public = true WHERE id = 'case-documents';
UPDATE storage.buckets SET public = true WHERE id = 'user-uploads';