
export interface Plan {
  id: number;
  name: string;
  price: number;
  cpu: number;
  ram: number;
  storage: number;
  backups: number;
  description: string;
  features?: string[];
}
