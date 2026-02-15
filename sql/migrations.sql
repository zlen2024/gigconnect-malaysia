-- Create storage bucket for images
insert into storage.buckets (id, name, public)
values ('gig-images', 'gig-images', true)
on conflict (id) do nothing;

-- Set up storage policies for the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'gig-images' );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'gig-images' and auth.role() = 'authenticated' );

-- Add images column to jobs table to match gigs table structure
alter table public.jobs
add column if not exists images text[] default array[]::text[];

-- Fix order creation policy for students applying to jobs
drop policy if exists "Clients can create orders." on public.orders;

create policy "Users can create orders (as client or student)."
  on public.orders for insert
  with check ( auth.uid() = client_id or auth.uid() = student_id );
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
