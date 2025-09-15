import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from '../../vendors/vendor.entity';

@Entity('import_runs')
export class ImportRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @ManyToOne(() => Vendor, { eager: true })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date;

  @Column({ type: 'varchar', length: 50, default: 'running' })
  status: 'running' | 'completed' | 'failed';

  @Column({ type: 'int', default: 0 })
  totalFound: number;

  @Column({ type: 'int', default: 0 })
  totalNew: number;

  @Column({ type: 'int', default: 0 })
  totalIgnored: number;

  @Column({ type: 'int', default: 0 })
  totalErrors: number;

  @Column({ type: 'text', nullable: true })
  log: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
