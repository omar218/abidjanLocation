/**
 * Formate un montant numérique en devise Franc CFA (XOF) au format français.
 * Exemple : 150000 -> "150 000 F CFA" ou "150 000 XOF" (sans décimales).
 * 
 * @param value - Montant à formater
 * @returns Chaîne formatée avec le symbole monétaire
 */
export function formatXOF(value: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value)
}

/**
 * Normalise une chaîne de caractères pour faciliter la recherche textuelle insensible à la casse et aux accents.
 * Convertit le texte en minuscules, décompose les caractères accentués (NFD) et supprime les signes diacritiques.
 * Exemple : "Riviera Éden" -> "riviera eden"
 * 
 * @param str - Chaîne à normaliser
 * @returns Chaîne nettoyée et normalisée
 */
export function normalize(str: string) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

