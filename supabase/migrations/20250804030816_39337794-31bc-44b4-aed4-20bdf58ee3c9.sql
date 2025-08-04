-- Fix the security warning by setting proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, user_type)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', new.email),
    COALESCE(new.raw_user_meta_data ->> 'user_type', 'candidato')
  );
  RETURN new;
END;
$$;