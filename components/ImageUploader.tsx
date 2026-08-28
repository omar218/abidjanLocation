'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload } from 'lucide-react';

/**
 * Interface des propriétés du composant ImageUploader.
 */
interface ImageUploaderProps {
  onImagesChange: (images: File[]) => void; // Callback déclenché lors de la modification des fichiers sélectionnés
  maxFiles?: number; // Nombre maximum de fichiers autorisés (par défaut 10)
}

/**
 * Composant ImageUploader : Zone de téléversement d'images avec glisser-déposer (Drag and Drop).
 * Gère la prévisualisation locale, la validation des types/tailles de fichiers et la suppression d'images.
 */
export default function ImageUploader({ onImagesChange, maxFiles = 10 }: ImageUploaderProps) {
  // Liste des fichiers File sélectionnés
  const [files, setFiles] = useState<File[]>([]);
  // URLs d'objets blob pour la prévisualisation
  const [previews, setPreviews] = useState<string[]>([]);

  /**
   * Gestionnaire exécuté lors de la sélection ou du dépôt de fichiers.
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limiter le nombre de nouveaux fichiers pour ne pas dépasser la limite maximale
    const newFiles = acceptedFiles.slice(0, maxFiles - files.length);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    onImagesChange([...files, ...newFiles]);
  }, [files, maxFiles, onImagesChange]);

  /**
   * Supprime une image de la sélection et révoque l'URL de prévisualisation pour éviter les fuites mémoire.
   */
  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    onImagesChange(newFiles);
    
    // Libération de la mémoire allouée à l'objet URL blob supprimé
    URL.revokeObjectURL(previews[index]);
  };

  // Configuration du hook react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'] // Formats d'images acceptés
    },
    maxFiles,
    maxSize: 5 * 1024 * 1024, // Limite de 5 Mo par fichier
  });

  return (
    <div className="space-y-4">
      {/* Zone de dropzone interactive */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive 
              ? 'Déposez les images ici...' 
              : 'Glissez-déposez des images ici, ou cliquez pour sélectionner'}
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, WEBP (max. 5MB, max {maxFiles} images)
          </p>
        </div>
      </div>

      {/* Grille d'aperçu des images téléversées */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={preview}
                  alt={`Prévisualisation ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bouton de suppression de l'image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Supprimer l'image"
              >
                <X className="h-4 w-4" />
              </button>
              {/* Nom du fichier ou libellé */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center truncate">
                {files[index]?.name || 'Image ' + (index + 1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

