-- ==============================================================================
-- SEED DE DONNEES POUR SUPABASE (ABIDJAN LOCATION)
-- Insère les biens immobiliers de départ dans la table public.properties
-- ==============================================================================

INSERT INTO public.properties (title, price_xof, commune, quartier, rooms, type, furnished, surface_m2, images) VALUES
('Studio meublé à Cocody Riviera', 150000, 'Cocody', 'Riviera', 1, 'studio', true, 35, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop']),
('2 pièces moderne à Marcory Zone 4', 350000, 'Marcory', 'Zone 4', 2, '2p', false, 55, ARRAY['https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop']),
('Villa 4 ch à Cocody Angré', 900000, 'Cocody', 'Angré', 4, 'villa', false, 220, ARRAY['https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?q=80&w=1600&auto=format&fit=crop']),
('3 pièces à Plateau Dokui', 450000, 'Abobo', 'Plateau Dokui', 3, '3p', false, 75, ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop']),
('Duplex meublé à Bingerville', 700000, 'Bingerville', 'Quartier résidentiel', 3, 'duplex', true, 120, ARRAY['https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop']),
('2 pièces à Yopougon Sideci', 200000, 'Yopougon', 'Sideci', 2, '2p', false, 50, ARRAY['https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop']),
('4 pièces à Treichville', 380000, 'Treichville', 'Quartier Commerce', 4, '4p', false, 95, ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop']),
('Appartement T3 meublé à Plateau', 550000, 'Abidjan Plateau', 'Centre Ville', 3, '3p', true, 85, ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop']),
('Bureau commercial à Le Plateau', 800000, 'Abidjan Plateau', 'Zone Administrative', 1, 'bureau', true, 60, ARRAY['https://images.unsplash.com/photo-1497366216548-375f703aeb75?q=80&w=1600&auto=format&fit=crop']),
('Villa de luxe à Abidjan 2 Plateaux', 1200000, 'Abidjan Plateau', '2 Plateaux', 5, 'villa', true, 350, ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop']),
('Studio étudiant à Cocody', 120000, 'Cocody', 'Université', 1, 'studio', false, 28, ARRAY['https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop']),
('3 pièces à Koumassi Sogefiha', 280000, 'Koumassi', 'Sogefiha', 3, '3p', false, 70, ARRAY['https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop']),
('Penthouse meublé à Cocody', 1500000, 'Cocody', 'Riviera Palmeraie', 4, 'autre', true, 280, ARRAY['https://images.unsplash.com/photo-1613977257363-707d9e18ca9d?q=80&w=1600&auto=format&fit=crop']),
('2 pièces à Attécoubé', 220000, 'Attécoubé', 'Abobodoumé', 2, '2p', false, 52, ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop']),
('Villa 5 pièces à Grand-Bassam', 600000, 'Grand-Bassam', 'Quartier France', 5, 'villa', false, 180, ARRAY['https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?q=80&w=1600&auto=format&fit=crop']),
('Studio moderne à Port-Bouët', 130000, 'Port-Bouët', 'Vridi', 1, 'studio', true, 32, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop']),
('3 pièces meublé à Anyama', 250000, 'Anyama', 'M''Pouto', 3, '3p', true, 68, ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop']),
('2 pièces à Songon', 180000, 'Songon', 'PK 18', 2, '2p', false, 48, ARRAY['https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop']),
('Villa de prestige à Assinie', 2000000, 'Assinie', 'Mafia', 6, 'villa', true, 450, ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop']),
('4 pièces à Jacqueville', 320000, 'Jacqueville', 'Centre', 4, '4p', false, 88, ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop']),
('Appartement T2 meublé à Marcory', 300000, 'Marcory', 'Biétry', 2, '2p', true, 58, ARRAY['https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop']),
('5 pièces à Yopougon Niangon', 420000, 'Yopougon', 'Niangon', 5, '4p', false, 110, ARRAY['https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?q=80&w=1600&auto=format&fit=crop']),
('Bureau de prestige à Le Plateau', 950000, 'Abidjan Plateau', 'Zone Financière', 2, 'bureau', true, 85, ARRAY['https://images.unsplash.com/photo-1497366216548-375f703aeb75?q=80&w=1600&auto=format&fit=crop']),
('3 pièces à Adjamé', 260000, 'Adjamé', 'Gare', 3, '3p', false, 72, ARRAY['https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop']),
('Duplex de luxe à Cocody', 1100000, 'Cocody', 'Riviera Golf', 4, 'duplex', true, 240, ARRAY['https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop']);
