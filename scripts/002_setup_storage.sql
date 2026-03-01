-- Storage policies for products bucket
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Products bucket is publicly readable') then
    create policy "Products bucket is publicly readable" on storage.objects
      for select using (bucket_id = 'products');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can upload product images') then
    create policy "Users can upload product images" on storage.objects
      for insert with check (
        bucket_id = 'products' 
        and auth.role() = 'authenticated'
      );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can update their own product images') then
    create policy "Users can update their own product images" on storage.objects
      for update using (
        bucket_id = 'products'
        and auth.uid() = owner
      );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can delete their own product images') then
    create policy "Users can delete their own product images" on storage.objects
      for delete using (
        bucket_id = 'products'
        and auth.uid() = owner
      );
  end if;
end
$$;

-- Storage policies for avatars bucket
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Avatars bucket is publicly readable') then
    create policy "Avatars bucket is publicly readable" on storage.objects
      for select using (bucket_id = 'avatars');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can upload their own avatar') then
    create policy "Users can upload their own avatar" on storage.objects
      for insert with check (
        bucket_id = 'avatars'
        and auth.uid() = owner
      );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can update their own avatar') then
    create policy "Users can update their own avatar" on storage.objects
      for update using (
        bucket_id = 'avatars'
        and auth.uid() = owner
      );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can delete their own avatar') then
    create policy "Users can delete their own avatar" on storage.objects
      for delete using (
        bucket_id = 'avatars'
        and auth.uid() = owner
      );
  end if;
end
$$;
