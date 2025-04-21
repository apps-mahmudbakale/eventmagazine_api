// magazine.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Magazine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ enum: ['pdf', 'images', 'video'] })
  type: string;

  @Column({ enum: ['free', 'paid'] })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;
}