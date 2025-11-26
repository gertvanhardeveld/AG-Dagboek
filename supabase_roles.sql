-- Run this in the Supabase SQL Editor

-- 1. Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text default 'student' check (role in ('student', 'teacher')),
  created_at timestamptz default now()
);

-- 2. Enable RLS on profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
on profiles for select
to authenticated
using (true);

create policy "Users can insert their own profile"
on profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
to authenticated
using (auth.uid() = id);

-- 3. Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Update Entries RLS for Teachers
-- Allow teachers to view all entries
create policy "Teachers can view all entries"
on entries for select
to authenticated
using (
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'teacher'
  )
);
