-- Fix RLS policy for orders to allow students to apply
-- This ensures that both client_id and student_id can create orders

DO $$
BEGIN
    -- Drop the policy if it exists to avoid conflicts
    DROP POLICY IF EXISTS "Users can create orders (as client or student)." ON public.orders;
    -- Also drop the old restrictive policy if it still hangs around
    DROP POLICY IF EXISTS "Clients can create orders." ON public.orders;
END $$;

-- Create the correct policy
CREATE POLICY "Users can create orders (as client or student)."
  ON public.orders FOR INSERT
  WITH CHECK ( auth.uid() = client_id OR auth.uid() = student_id );
