-- Create profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  phone text,
  avatar_url text,
  role text default 'BUYER' check (role in ('ADMIN', 'SELLER', 'BUYER')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable row level security
alter table public.profiles enable row level security;

-- Create RLS policies for profiles
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'profiles_select_own') then
    create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'profiles_insert_own') then
    create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'profiles_update_own') then
    create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'profiles_delete_own') then
    create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);
  end if;
end
$$;

-- Create trigger to auto-create profile on auth user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', null),
    coalesce(new.raw_user_meta_data ->> 'avatar', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'BUYER')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Drop existing trigger if it exists and create new one
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create storage buckets for product images and avatars
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
