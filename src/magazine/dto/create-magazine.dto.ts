export class CreateMagazineDto {
  name: string;
  category: string;
  type: 'pdf' | 'images' | 'video';
  status: 'free' | 'paid';
  amount?: number;
}
