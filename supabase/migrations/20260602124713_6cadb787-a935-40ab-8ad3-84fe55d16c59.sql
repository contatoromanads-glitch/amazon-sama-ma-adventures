-- Fix 1: Restrict storage listing on public bucket (files still accessible via direct URL)
DROP POLICY IF EXISTS "Public read site-images" ON storage.objects;

CREATE POLICY "Admin list site-images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Revoke EXECUTE on SECURITY DEFINER function from public roles.
-- RLS policies evaluate function calls under the table owner's privileges, so
-- policies that reference has_role continue to work.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;