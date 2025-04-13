// formation.ts
export interface Formation {
  id: number;
  titre: string;
  description?: string;
  date_creation: string;  // Date en format ISO 8601
  etat: string; // Par défaut "en attente"
  type: string;
}
