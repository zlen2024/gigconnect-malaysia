-- Add submission_url column to orders table if it doesn't exist
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS submission_url text;

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
