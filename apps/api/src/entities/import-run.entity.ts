import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vendor } from './vendor.entity';

export interface ImportTotals {
  found: number;
  new: number;
  ignored: number;
  errors: number;
}

export type ImportSource = 'csv' | 'parsing';

@Entity('import_runs')
export class ImportRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  finishedAt: Date;

  @Column('jsonb', { default: { found: 0, new: 0, ignored: 0, errors: 0 } })
  totals: ImportTotals;

  @Column('text', { nullable: true })
  log: string;

  @Column({
    type: 'enum',
    enum: ['csv', 'parsing'],
    default: 'csv',
  })
  source: ImportSource;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Vendor, vendor => vendor.importRuns)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;
}
