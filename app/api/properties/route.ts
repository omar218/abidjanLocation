import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
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
      const buffer = Buffer.from(bytes);
      
      // Écrire le fichier sur le disque
      await writeFile(filePath, buffer);
      
      // Ajouter l'URL de l'image
      imageUrls.push(`/uploads/${fileName}`);
    }

    // Ici, vous devriez enregistrer les données dans votre base de données
    // Par exemple :
    // const property = await prisma.property.create({
    //   data: {
    //     ...JSON.parse(formDataEntries.images),
    //     images: imageUrls,
    //     // autres champs...
    //   },
    // });

    // Pour l'instant, on retourne simplement une réponse de succès
    return NextResponse.json(
      { success: true, message: 'Annonce créée avec succès', id: '123' },
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
