import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Vendor } from './vendor.entity';

export type ImportSource = 'csv' | 'parsing';

@Entity('staging_imports')
@Index(['vendorId', 'urlCanonical'])
export class StagingImport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column()
  brand: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  url: string;

  @Column()
  urlCanonical: string;

  @Column({
    type: 'enum',
    enum: ['csv', 'parsing'],
    default: 'csv',
  })
  source: ImportSource;

  @CreateDateColumn()
  importedAt: Date;

  // Relations
  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;
}
