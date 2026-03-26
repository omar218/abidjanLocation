'use client';

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import ImageUploader from '../../components/ImageUploader';

type PropertyType = '2p' | '3p' | '4p' | 'villa' | 'bureau' | 'autre';

interface PropertyFormData {
  title: string;
  price_xof: string;
  commune: string;
  quartier: string;
  rooms: string;
  type: PropertyType;
  furnished: boolean;
  surface_m2: string;
  images: string[];
}

function PropertyForm() {
  const router = useRouter();
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
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleImagesChange = useCallback((files: File[]) => {
    setImageFiles(files);
    // Créer des URLs pour la prévisualisation
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: imageUrls
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Valider les données
      if (!formData.title || !formData.price_xof || !formData.commune || !formData.quartier || !formData.surface_m2) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Créer un objet FormData pour gérer les fichiers
      const formDataToSend = new FormData();
      
      // Ajouter les champs du formulaire
      Object.entries({
        ...formData,
        price_xof: parseInt(formData.price_xof, 10),
        rooms: parseInt(formData.rooms, 10),
        surface_m2: parseInt(formData.surface_m2, 10),
        images: JSON.stringify(formData.images) // Envoyer les URLs en tant que chaîne JSON
      }).forEach(([key, value]) => {
        formDataToSend.append(key, value as string);
      });
      
      // Ajouter les fichiers d'images
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`image_${index}`, file);
      });
      
      // Ici, vous devriez envoyer les données à votre API
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formDataToSend,
        // Ne pas définir le header 'Content-Type', il sera défini automatiquement avec la bonne boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de l\'annonce');
      }
      
      // Rediriger vers la page d'accueil ou la page de l'annonce créée
      const result = await response.json();
      router.push(`/properties/${result.id}`);

      // Exemple d'appel API (à décommenter et adapter selon votre configuration backend)
      /*
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de la propriété');
      }

      // Rediriger vers la page de succès ou rafraîchir les données
      router.push('/dashboard?success=true');
      */
      
      alert('Propriété ajoutée avec succès!');
      // Réinitialiser le formulaire après soumission réussie
      setFormData({
        title: '',
        price_xof: '',
        commune: '',
        quartier: '',
        rooms: '2',
        type: '2p',
        furnished: false,
        surface_m2: '',
        images: ['']
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Ajouter une nouvelle propriété</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titre de l'annonce *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ex: 2 pièces à Yopougon Sideci"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price_xof" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="surface_m2" className="block text-sm font-medium text-gray-700">
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

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="proprietaire">
      <PropertyForm />
    </ProtectedRoute>
  );
}