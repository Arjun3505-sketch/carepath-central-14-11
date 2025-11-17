-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert patient role for new users
  insert into public.user_roles (user_id, role)
  values (new.id, 'patient');
  
  return new;
end;
$$;

-- Create trigger that fires when a new user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();