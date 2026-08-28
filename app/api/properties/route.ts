import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import listingsMock from '@/data/listings.json';

/**
 * Route API : GET /api/properties
 * Récupère la liste des biens immobiliers depuis Supabase (avec fallback vers listings.json).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commune = searchParams.get('commune');
    const type = searchParams.get('type');
    const ownerId = searchParams.get('owner_id');

    const supabase = createServerSupabaseClient();
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (commune) query = query.eq('commune', commune);
    if (type) query = query.eq('type', type);
    if (ownerId) query = query.eq('owner_id', ownerId);

    const { data: properties, error } = await query;

    // Si Supabase renvoie des données avec succès
    if (!error && properties && properties.length > 0) {
      return NextResponse.json({ properties, source: 'supabase' }, { status: 200 });
    }

    // Fallback vers les données JSON locales
    return NextResponse.json({ properties: listingsMock, source: 'local' }, { status: 200 });
  } catch (error) {
    console.error('Erreur récupération propriétés:', error);
    return NextResponse.json({ properties: listingsMock, source: 'fallback' }, { status: 200 });
  }
}

/**
 * Route API : POST /api/properties
 * Permet l'enregistrement d'un nouveau bien immobilier :
 * 1. Téléverse les images vers le Storage Supabase (bucket `property-images`) ou localement en fallback.
 * 2. Insère l'annonce dans la table `properties` de Supabase et met à jour le fichier local.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files: File[] = [];
    const formDataEntries: Record<string, any> = {};

    // Séparation des fichiers d'images et des champs textuels
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        files.push(value);
      } else {
        formDataEntries[key] = value;
      }
    }

    const imageUrls: string[] = [];
    const supabase = createServerSupabaseClient();
    const isSupabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    );

    // 1. Gestion du téléversement des images
    for (const file of files) {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${uuidv4()}.${fileExt}`;
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);

      let uploadedToSupabase = false;

      if (isSupabaseConfigured) {
        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(`properties/${fileName}`, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: true,
            });

          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('property-images')
              .getPublicUrl(`properties/${fileName}`);

            if (publicUrl) {
              imageUrls.push(publicUrl);
              uploadedToSupabase = true;
            }
          }
        } catch (storageErr) {
          console.warn('Erreur Supabase Storage, basculement en local:', storageErr);
        }
      }

      // Si non téléversé sur Supabase, sauvegarde locale dans public/uploads
      if (!uploadedToSupabase) {
        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
          await mkdir(uploadsDir, { recursive: true });
          const filePath = path.join(uploadsDir, fileName);
          await writeFile(filePath, buffer);
          imageUrls.push(`/uploads/${fileName}`);
        } catch (localWriteErr) {
          console.error('Erreur écriture locale:', localWriteErr);
        }
      }
    }

    // Si aucune image n'a été fournie, utiliser une image par défaut
    const finalImages = imageUrls.length > 0 
      ? imageUrls 
      : ["https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop"];

    // Récupérer l'utilisateur connecté via Supabase Auth pour l'associer à l'annonce
    let ownerId: string | null = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      ownerId = user?.id || null;
    } catch {
      // Utilisateur anonyme ou session mock
    }

    const newPropertyData = {
      id: uuidv4(),
      title: String(formDataEntries.title || 'Logement à louer'),
      price_xof: parseInt(formDataEntries.price_xof, 10) || 0,
      commune: String(formDataEntries.commune || 'Abidjan'),
      quartier: String(formDataEntries.quartier || 'Centre'),
      rooms: parseInt(formDataEntries.rooms, 10) || 1,
      type: String(formDataEntries.type || '2p'),
      furnished: formDataEntries.furnished === 'true' || formDataEntries.furnished === true,
      surface_m2: formDataEntries.surface_m2 ? parseInt(formDataEntries.surface_m2, 10) : null,
      images: finalImages,
      owner_id: ownerId,
    };

    // 2. Insertion dans Supabase Table `properties`
    let insertedInSupabase = false;
    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error: insertError } = await supabase
          .from('properties')
          .insert(newPropertyData)
          .select()
          .single();

        if (!insertError && inserted) {
          insertedInSupabase = true;
        } else if (insertError) {
          console.warn('Avertissement insertion Supabase:', insertError.message);
        }
      } catch (dbErr) {
        console.warn('Erreur connexion DB Supabase:', dbErr);
      }
    }

    // 3. Toujours synchroniser le fichier local data/listings.json pour cohérence
    try {
      const listingsPath = path.join(process.cwd(), 'data', 'listings.json');
      const rawData = await readFile(listingsPath, 'utf-8');
      const listings = JSON.parse(rawData);
      listings.unshift(newPropertyData);
      await writeFile(listingsPath, JSON.stringify(listings, null, 2));
    } catch (fsErr) {
      console.warn('Erreur écriture fichier JSON local:', fsErr);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Annonce créée avec succès', 
        id: newPropertyData.id,
        storedIn: insertedInSupabase ? 'supabase' : 'local'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la création de l\'annonce' },
      { status: 500 }
    );
  }
}
