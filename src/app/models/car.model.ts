export type CarStatus = 'available' | 'reserved' | 'hidden';

export interface Car {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  mileage: number;
  price: number;
  fuel: string;
  transmission: string;
  power?: string;
  engine?: string;
  description: string;
  equipment?: string[];
  status: CarStatus;
  featured: boolean;
  images: string[];
}
