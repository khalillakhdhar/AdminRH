import { Cours } from "./Cours";

export interface Formation {
  id?: number;
  titre: string;
  description?: string;
  date_creation?: string;
  etat?: string;
  type?: string;
  cours?: Cours[]; // 👈 Ajout ici
}
