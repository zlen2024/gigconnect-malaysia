
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create a type for user roles
create type user_role as enum ('student', 'client', 'admin');

-- Create a type for order status
-- If the type already exists, we assume it has the basic values.
-- We'll add 'submitted' if needed.
do $$ begin
    create type order_status as enum ('pending', 'paid', 'in_progress', 'submitted', 'completed', 'cancelled');
exception
    when duplicate_object then null;
end $$;

-- Add 'submitted' value if it doesn't exist (Postgres 9.1+)
alter type order_status add value if not exists 'submitted';

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role user_role default 'client',
  full_name text,
  avatar_url text,
  university text,
  bio text,
  skills text[], -- Array of strings for skills
  total_done_projects integer default 0,
  total_earnings numeric default 0.00,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Create gigs table (Services offered by students)
create table public.gigs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text not null,
  price numeric not null, -- Simple price for MVP
  delivery_time integer not null, -- In days
  images text[], -- Array of image URLs
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on gigs
alter table public.gigs enable row level security;

-- Gigs policies
create policy "Gigs are viewable by everyone."
  on public.gigs for select
  using ( true );

create policy "Students can insert their own gigs."
  on public.gigs for insert
  with check ( auth.uid() = user_id );

create policy "Students can update their own gigs."
  on public.gigs for update
  using ( auth.uid() = user_id );

create policy "Students can delete their own gigs."
  on public.gigs for delete
  using ( auth.uid() = user_id );

-- Create jobs table (Requests posted by clients)
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  budget numeric not null,
  location text, -- Can be 'Remote' or specific location
  deadline timestamptz,
  category text not null,
  status text default 'open', -- open, closed, in_progress
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on jobs
alter table public.jobs enable row level security;

-- Jobs policies
create policy "Jobs are viewable by everyone."
  on public.jobs for select
  using ( true );

create policy "Users can insert their own jobs."
  on public.jobs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own jobs."
  on public.jobs for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own jobs."
  on public.jobs for delete
  using ( auth.uid() = user_id );


-- Create orders table (Transactions)
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  gig_id uuid references public.gigs(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  client_id uuid references public.profiles(id) not null, -- The one paying
  student_id uuid references public.profiles(id) not null, -- The one working
  price numeric not null,
  status order_status default 'pending',
  receipt_url text, -- Proof of payment
  submission_url text, -- Link to work result/file
  requirements text, -- Initial requirements from client
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders policies
create policy "Users can view their own orders (as client or student)."
  on public.orders for select
  using ( auth.uid() = client_id or auth.uid() = student_id );

create policy "Clients can create orders."
  on public.orders for insert
  with check ( auth.uid() = client_id );

create policy "Involved users can update order status/details."
  on public.orders for update
  using ( auth.uid() = client_id or auth.uid() = student_id );


-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS on messages
alter table public.messages enable row level security;

-- Messages policies
create policy "Users can view messages they sent or received."
  on public.messages for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can send messages."
  on public.messages for insert
  with check ( auth.uid() = sender_id );


-- Create reviews table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) not null,
  reviewee_id uuid references public.profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- Enable RLS on reviews
alter table public.reviews enable row level security;

-- Reviews policies
create policy "Reviews are public."
  on public.reviews for select
  using ( true );

create policy "Users can create reviews for completed orders they were part of."
  on public.reviews for insert
  with check ( auth.uid() = reviewer_id );

-- Create a function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', (new.raw_user_meta_data->>'role')::user_role);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to complete an order and update stats
create or replace function public.complete_order(order_id uuid)
returns void as $$
declare
  v_student_id uuid;
  v_client_id uuid;
  v_price numeric;
  v_status order_status;
begin
  -- Get order details
  select student_id, client_id, price, status into v_student_id, v_client_id, v_price, v_status
  from public.orders
  where id = order_id;

  -- Security Check: Only the client can complete the order
  if v_client_id != auth.uid() then
    raise exception 'Not authorized to complete this order';
  end if;

  -- Logic Check: Can only complete if submitted (or valid prior state)
  if v_status != 'submitted' then
     raise exception 'Order must be submitted before completion';
  end if;

  -- Update order status
  update public.orders
  set status = 'completed'
  where id = order_id;

  -- Update student stats
  update public.profiles
  set total_done_projects = coalesce(total_done_projects, 0) + 1,
      total_earnings = coalesce(total_earnings, 0) + v_price
  where id = v_student_id;
end;
$$ language plpgsql security definer;

-- Create storage buckets (need to be configured in Supabase dashboard, but documenting here)
-- Buckets: 'avatars', 'gig-images', 'portfolio', 'receipts'
