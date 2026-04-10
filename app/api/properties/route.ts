import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    const formData = await request.formData();
    const files: File[] = [];
    const formDataEntries: Record<string, any> = {};

    // Extraire les fichiers et les autres champs du formulaire
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        files.push(value);
      } else {
        formDataEntries[key] = value;
      }
    }

    // Traiter les images
    const imageUrls: string[] = [];
    
    for (const file of files) {
      // Générer un nom de fichier unique
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      
      // Convertir le fichier en buffer
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      // Écrire le fichier sur le disque
      await writeFile(filePath, buffer);
      
      // Ajouter l'URL de l'image
      imageUrls.push(`/uploads/${fileName}`);
    }

    // Lire le fichier listings.json existant
    const listingsPath = path.join(process.cwd(), 'data', 'listings.json');
    const listingsData = await readFile(listingsPath, 'utf-8');
    const listings = JSON.parse(listingsData);

    // Créer la nouvelle propriété
    const newProperty = {
      id: uuidv4(),
      title: formDataEntries.title,
      price_xof: parseInt(formDataEntries.price_xof),
      commune: formDataEntries.commune,
      quartier: formDataEntries.quartier,
      rooms: parseInt(formDataEntries.rooms),
      type: formDataEntries.type,
      furnished: formDataEntries.furnished === 'true',
      surface_m2: parseInt(formDataEntries.surface_m2),
      images: imageUrls.length > 0 ? imageUrls : ["https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop"]
    };

    // Ajouter la nouvelle propriété à la liste
    listings.push(newProperty);

    // Sauvegarder le fichier listings.json mis à jour
    await writeFile(listingsPath, JSON.stringify(listings, null, 2));

    return NextResponse.json(
      { success: true, message: 'Annonce créée avec succès', id: newProperty.id },
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
