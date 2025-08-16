-- Remove foreign key constraint from profiles table
-- This allows creating profiles without corresponding auth.users entries

-- Drop the foreign key constraint if it exists
DO $$ 
BEGIN
    -- Check if the constraint exists before trying to drop it
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fkey' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
    END IF;
END $$;

-- Add a comment explaining the change
COMMENT ON TABLE public.profiles IS 'Profiles table - can contain profiles without corresponding auth.users entries for admin-created users'; 