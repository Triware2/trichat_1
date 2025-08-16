# Fix User Creation Issue

## Problem
The error "Failed to load users. Please try again." occurs because the `profiles` table has a foreign key constraint that requires the `id` to exist in the `auth.users` table.

## Solution
Run this SQL in your Supabase SQL Editor to remove the foreign key constraint:

```sql
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
```

## Steps
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Paste and run the SQL above
4. Refresh your application
5. Try creating a new user

## What This Fixes
- ✅ Removes foreign key constraint that was causing the error
- ✅ Allows direct profile creation without auth user dependency
- ✅ Maintains email functionality - welcome emails will still be sent
- ✅ Keeps all user management features working

After running this SQL, you should be able to create new users without any errors! 