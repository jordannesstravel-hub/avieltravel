-- ENUMS
create type if not exists offer_category as enum ('PROMO','PESSAH','SUKKOT','SUMMER','WINTER','GENERAL');
create type if not exists flight_route as enum ('PARIS_TLV','PARIS_EILAT');
create type if not exists trip_type as enum ('OW','RT');
create type if not exists lead_type as enum ('FLIGHT','PACKAGE','HOTEL_QUOTE','CAR_QUOTE');

-- OFFERS: FLIGHTS
create table if not exists offers_flights (
  id uuid primary key default gen_random_uuid(),
  active boolean not null default true,
  priority int not null default 0,
  category offer_category not null default 'GENERAL',
  route flight_route not null,
  trip trip_type not null,
  depart_date date not null,
  return_date date,
  price_eur int not null,
  notes_fr text,
  notes_en text,
  notes_he text,
  created_at timestamptz not null default now()
);

create index if not exists idx_flights_active on offers_flights(active);
create index if not exists idx_flights_route on offers_flights(route);
create index if not exists idx_flights_depart on offers_flights(depart_date);
create index if not exists idx_flights_cat on offers_flights(category);

-- OFFERS: PACKAGES (PARIS <-> EILAT only)
create table if not exists offers_packages (
  id uuid primary key default gen_random_uuid(),
  active boolean not null default true,
  priority int not null default 0,
  category offer_category not null default 'GENERAL',
  depart_date date not null,
  nights int not null,
  hotel_name text not null,
  board text,
  price_eur int not null,
  notes_fr text,
  notes_en text,
  notes_he text,
  created_at timestamptz not null default now()
);

create index if not exists idx_packages_active on offers_packages(active);
create index if not exists idx_packages_depart on offers_packages(depart_date);
create index if not exists idx_packages_cat on offers_packages(category);

-- HOME BANNERS (ads/slider)
create table if not exists home_banners (
  id uuid primary key default gen_random_uuid(),
  active boolean not null default true,
  sort_order int not null default 0,
  start_date date,
  end_date date,
  title_fr text,
  title_en text,
  title_he text,
  subtitle_fr text,
  subtitle_en text,
  subtitle_he text,
  cta_fr text,
  cta_en text,
  cta_he text,
  target_type text not null, -- 'PAGE' | 'WHATSAPP' | 'FILTER'
  target_value text not null,
  image_path_desktop text not null,
  image_path_mobile text,
  created_at timestamptz not null default now()
);

create index if not exists idx_banners_active on home_banners(active);
create index if not exists idx_banners_order on home_banners(sort_order);

-- LEADS (requests)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  type lead_type not null,
  lang text not null, -- 'fr'|'en'|'he'
  payload jsonb not null,
  status text not null default 'NEW', -- NEW / IN_PROGRESS / DONE
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_type on leads(type);
create index if not exists idx_leads_status on leads(status);

-- SETTINGS (contact info, emails)
create table if not exists settings (
  key text primary key,
  value jsonb not null
);

insert into settings(key, value)
values
('contact', jsonb_build_object(
  'phone_fr_display','01 85 43 13 75',
  'phone_fr_tel','+33185431375',
  'phone_il1_display','+972 55 772 6027',
  'phone_il1_tel','+972557726027',
  'phone_il2_display','+972 55 966 1683',
  'phone_il2_tel','+972559661683',
  'whatsapp_display','06 11 09 07 31',
  'whatsapp_e164','+33611090731',
  'email_israel','resa.isradmc@gmail.com',
  'email_world','jordan.nesstravel@gmail.com'
))
on conflict (key) do nothing;

-- RLS: allow public read of offers + banners; allow insert leads
alter table offers_flights enable row level security;
alter table offers_packages enable row level security;
alter table home_banners enable row level security;
alter table leads enable row level security;

create policy if not exists "public read flights"
on offers_flights for select
to anon
using (true);

create policy if not exists "public read packages"
on offers_packages for select
to anon
using (true);

create policy if not exists "public read banners"
on home_banners for select
to anon
using (true);

create policy if not exists "public insert leads"
on leads for insert
to anon
with check (true);
