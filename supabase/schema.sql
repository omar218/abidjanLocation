-- ==============================================================================
-- SCHEMA SUPABASE POUR ABIDJAN LOCATION (SAAS IMMOBILIER)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TYPE ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('proprietaire', 'locataire', 'agence', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLE DES PROFILS UTILISATEURS (Liée à auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'locataire'::user_role NOT NULL,
    is_subscribed BOOLEAN DEFAULT false NOT NULL,
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE DES BIENS IMMOBILIERS (PROPERTIES)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    price_xof INTEGER NOT NULL CHECK (price_xof > 0),
    commune TEXT NOT NULL,
    quartier TEXT NOT NULL,
    rooms INTEGER NOT NULL DEFAULT 1 CHECK (rooms > 0),
    type TEXT NOT NULL, -- '2p', '3p', '4p', 'villa', 'bureau', 'autre'
    furnished BOOLEAN DEFAULT false NOT NULL,
    surface_m2 INTEGER CHECK (surface_m2 > 0),
    images TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE DES ABONNEMENTS / PAIEMENTS MOBILE MONEY (CINETPAY)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    amount_xof INTEGER NOT NULL,
    operator TEXT NOT NULL, -- 'ORANGE', 'MTN', 'MOOV'
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'ACCEPTED', 'FAILED'
    started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. INDEX POUR OPTIMISER LES RECHERCHES
CREATE INDEX IF NOT EXISTS idx_properties_commune ON public.properties (commune);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties (price_xof);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties (type);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties (owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties (created_at DESC);

-- 7. TRIGGER AUTOMATIQUE POUR CRÉER LE PROFIL À L'INSCRIPTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'phone', new.phone),
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'locataire'::user_role)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. TRIGGER POUR METTRE À JOUR updated_at AUTOMATIQUEMENT
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 9. CONFIGURATION ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Politiques pour PROFILES
CREATE POLICY "Les profils sont visibles par les utilisateurs connectés"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Politiques pour PROPERTIES
CREATE POLICY "Toutes les annonces sont publiques en lecture"
    ON public.properties FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Les propriétaires et agences peuvent publier des annonces"
    ON public.properties FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('proprietaire', 'agence', 'admin')
        )
    );

CREATE POLICY "Les propriétaires peuvent modifier leurs propres annonces"
    ON public.properties FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = owner_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Les propriétaires peuvent supprimer leurs propres annonces"
    ON public.properties FOR DELETE
    TO authenticated
    USING (
        auth.uid() = owner_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Politiques pour SUBSCRIPTIONS
CREATE POLICY "Les utilisateurs voient leurs propres abonnements"
    ON public.subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 10. CONFIGURATION DU STORAGE BUCKET POUR LES PHOTOS D'ANNONCES
-- ==============================================================================

-- Création du bucket 'property-images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Politiques RLS pour le Storage Bucket
CREATE POLICY "Lecture publique des photos d'annonces"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'property-images');

CREATE POLICY "Upload de photos par les utilisateurs connectés"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Suppression de photos par le propriétaire"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'property-images' AND auth.uid() = owner);
