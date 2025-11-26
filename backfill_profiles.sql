-- Run this in the Supabase SQL Editor to create profiles for existing users

insert into public.profiles (id, full_name, role)
select 
  id, 
  coalesce(raw_user_meta_data->>'full_name', email), -- Use email as fallback name
  coalesce(raw_user_meta_data->>'role', 'student')
from auth.users
where id not in (select id from public.profiles);
