'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';

/**
 * Types de biens immobiliers acceptés.
 */
type PropertyType = '2p' | '3p' | '4p' | 'villa' | 'bureau' | 'autre';

/**
 * Interface des données du formulaire d'ajout de bien.
 */
interface PropertyFormData {
  title: string;          // Titre de l'annonce
  price_xof: string;      // Prix en XOF (saisie sous forme de chaîne)
  commune: string;        // Nom de la commune
  quartier: string;       // Nom du quartier
  rooms: string;          // Nombre de pièces
  type: PropertyType;     // Typologie du bien
  furnished: boolean;     // Indicateur meublé / non meublé
  surface_m2: string;     // Superficie en m²
  images: string[];       // URLs temporaires d'aperçu des images
}

/**
 * Composant formulaire permettant à un propriétaire d'enregistrer une nouvelle annonce immobilière.
 * Gère les champs textuels, numériques, les listes déroulantes et l'envoi multipart (FormData) avec images.
 */
function PropertyForm() {
  const router = useRouter();

  // État des données du formulaire
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    price_xof: '',
    commune: '',
    quartier: '',
    rooms: '2',
    type: '2p',
    furnished: false,
    surface_m2: '',
    images: []
  });
  
  // Fichiers d'images bruts sélectionnés
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // État de chargement lors de la soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Message d'erreur éventuel
  const [error, setError] = useState<string | null>(null);

  /**
   * Gestionnaire universel pour la mise à jour des champs du formulaire.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  /**
   * Gestionnaire de mise à jour des images sélectionnées par l'ImageUploader.
   */
  const handleImagesChange = useCallback((files: File[]) => {
    setImageFiles(files);
    // Création d'URLs temporaires locales pour l'aperçu
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: imageUrls
    }));
  }, []);

  /**
   * Soumission du formulaire : validation, construction du FormData et envoi vers l'API /api/properties.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation des champs obligatoires
      if (!formData.title || !formData.price_xof || !formData.commune || !formData.quartier || !formData.surface_m2) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Construction de l'objet FormData pour envoyer texte et fichiers binaires
      const formDataToSend = new FormData();
      
      // Ajout des métadonnées du formulaire
      Object.entries({
        ...formData,
        price_xof: parseInt(formData.price_xof, 10),
        rooms: parseInt(formData.rooms, 10),
        surface_m2: parseInt(formData.surface_m2, 10),
        images: JSON.stringify(formData.images)
      }).forEach(([key, value]) => {
        formDataToSend.append(key, value as string);
      });
      
      // Ajout des fichiers d'images binaires
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`image_${index}`, file);
      });
      
      // Appel de l'API de création d'annonce
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de l\'annonce');
      }
      
      alert('Propriété ajoutée avec succès !');

      // Réinitialisation du formulaire
      setFormData({
        title: '',
        price_xof: '',
        commune: '',
        quartier: '',
        rooms: '2',
        type: '2p',
        furnished: false,
        surface_m2: '',
        images: []
      });
      setImageFiles([]);

      // Redirection vers la page de recherche pour constater l'ajout
      router.push('/search');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8">Ajouter une nouvelle propriété:</h1>
      
      {/* Affichage des erreurs éventuelles */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Champ Titre */}
        <div>
          <label htmlFor="title" className="block text-base font-medium text-gray-700 mb-2">
            Titre de l'annonce *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3"
            placeholder="Ex: 2 pièces à Yopougon Sideci"
            required
          />
        </div>

        {/* Loyer et Surface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price_xof" className="block text-base font-medium text-gray-700 mb-2">
              Prix (FCFA) *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">FCFA</span>
              </div>
              <input
                type="number"
                id="price_xof"
                name="price_xof"
                value={formData.price_xof}
                onChange={handleChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-md"
                placeholder="200000"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="surface_m2" className="block text-base font-medium text-gray-700 mb-2">
              Surface (m²) *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="surface_m2"
                name="surface_m2"
                value={formData.surface_m2}
                onChange={handleChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="50"
                min="1"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">m²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commune et Quartier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="commune" className="block text-sm font-medium text-gray-700">
              Commune *
            </label>
            <input
              type="text"
              id="commune"
              name="commune"
              value={formData.commune}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: Yopougon"
              required
            />
          </div>

          <div>
            <label htmlFor="quartier" className="block text-sm font-medium text-gray-700">
              Quartier *
            </label>
            <input
              type="text"
              id="quartier"
              name="quartier"
              value={formData.quartier}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: Sideci"
              required
            />
          </div>
        </div>

        {/* Nombre de pièces et Type de bien */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
              Nombre de pièces *
            </label>
            <select
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'pièce' : 'pièces'}
                </option>
              ))}
              <option value="7+">7+ pièces</option>
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type de bien *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="2p">2 pièces</option>
              <option value="3p">3 pièces</option>
              <option value="4p">4 pièces</option>
              <option value="villa">Villa</option>
              <option value="bureau">Bureau</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>

        {/* Option Meublé */}
        <div className="flex items-center">
          <input
            id="furnished"
            name="furnished"
            type="checkbox"
            checked={formData.furnished}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="furnished" className="ml-2 block text-sm text-gray-900">
            Meublé
          </label>
        </div>

        {/* Bouton de soumission */}
        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enregistrement...' : 'Publier l\'annonce'}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Page Dashboard (Tableau de bord propriétaire).
 * Protégée par le composant `ProtectedRoute` : accessible uniquement aux utilisateurs avec le rôle "proprietaire".
 */
export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole={['proprietaire', 'agence', 'admin']}>
      <PropertyForm />
    </ProtectedRoute>
  );
}