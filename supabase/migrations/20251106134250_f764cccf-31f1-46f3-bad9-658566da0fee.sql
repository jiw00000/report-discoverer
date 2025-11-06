-- Add birth_date column to profiles table
ALTER TABLE public.profiles
ADD COLUMN birth_date DATE;

-- Update the handle_new_user function to include birth_date
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, birth_date)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE((new.raw_user_meta_data->>'birth_date')::date, NULL)
  );
  RETURN new;
END;
$function$;