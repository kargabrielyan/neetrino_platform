import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { Demo } from './demo.entity';

@Entity('themes')
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  category: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('uuid')
  vendorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Vendor, vendor => vendor.themes)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @OneToMany(() => Demo, demo => demo.theme)
  demos: Demo[];
}
