-- Create storage bucket for images
insert into storage.buckets (id, name, public)
values ('gig-images', 'gig-images', true)
on conflict (id) do nothing;

-- Set up storage policies for the bucket
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'Public Access'
  ) then
    create policy "Public Access"
    on storage.objects for select
    using ( bucket_id = 'gig-images' );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'Authenticated Upload'
  ) then
    create policy "Authenticated Upload"
    on storage.objects for insert
    with check ( bucket_id = 'gig-images' and auth.role() = 'authenticated' );
  end if;
end
$$;

-- Add images column to jobs table to match gigs table structure
alter table public.jobs
add column if not exists images text[] default array[]::text[];

-- Add submission_url column to orders table
alter table public.orders
add column if not exists submission_url text;
