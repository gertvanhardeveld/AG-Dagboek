-- Run this in the Supabase SQL Editor

create table entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  mood integer,
  activities text,
  learnings text,
  challenges text,
  "nextSteps" text,
  created_at timestamptz default now()
);

alter table entries enable row level security;

create policy "Users can see their own entries"
on entries for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own entries"
on entries for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own entries"
on entries for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can delete their own entries"
on entries for delete
to authenticated
using (auth.uid() = user_id);
