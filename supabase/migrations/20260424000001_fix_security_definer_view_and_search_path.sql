-- Fix SECURITY DEFINER view user_coin_balance (DLV-101)
-- The view ran with creator privileges, bypassing RLS on coin_transactions.
-- Any authenticated user could read all users' coin balances via the API.
-- Recreating without SECURITY DEFINER makes it SECURITY INVOKER (Postgres default),
-- so the caller's RLS policies on coin_transactions are enforced normally.
DROP VIEW IF EXISTS public.user_coin_balance;
CREATE VIEW public.user_coin_balance AS
  SELECT user_id,
    (COALESCE(sum(delta), (0)::bigint))::integer AS coins
  FROM coin_transactions
  GROUP BY user_id;

GRANT SELECT ON public.user_coin_balance TO authenticated, anon;

-- Fix mastery_to_stage mutable search_path (DLV-102)
-- Without SET search_path, a caller could manipulate the search_path to shadow
-- built-in objects. Pin it to empty so the function always uses fully-qualified names.
CREATE OR REPLACE FUNCTION public.mastery_to_stage(mastery_val numeric)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  SET search_path = ''
AS $function$
  SELECT CASE
    WHEN mastery_val < 0.2 THEN 'seed'
    WHEN mastery_val < 0.4 THEN 'sprout'
    WHEN mastery_val < 0.6 THEN 'growing'
    WHEN mastery_val < 0.8 THEN 'blooming'
    ELSE 'mastered'
  END;
$function$;
