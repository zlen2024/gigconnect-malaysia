# Supabase Fix Guide

The error `invalid input value for enum order_status: "submitted"` occurs because the `order_status` type in your database is missing the `'submitted'` value.

Follow these steps to fix it:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. In the left sidebar, click on the **SQL Editor** icon.
4. Click **New query**.
5. Copy and paste the following SQL code into the editor:

```sql
-- Fix: Add 'submitted' to order_status enum
-- This command adds the missing value safely.
ALTER TYPE "public"."order_status" ADD VALUE IF NOT EXISTS 'submitted';

-- Optional: Ensure submission_url column exists in orders table (just in case)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS submission_url text;

-- Reload the schema cache to apply changes immediately
NOTIFY pgrst, 'reload schema';
```

6. Click **Run** (bottom right).

After running this, the error should be resolved, and you can submit work successfully.
