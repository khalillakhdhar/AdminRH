import { Service } from "./service";
import { User } from "./user";

export interface Demande {
  id: number;
  date: Date;
  description?: string;
  id_user?: number;
  id_service?: number;
  id_userNavigation?: User;
  id_serviceNavigation?: Service;
}
