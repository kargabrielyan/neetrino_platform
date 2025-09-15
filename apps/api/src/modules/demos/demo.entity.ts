import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';

@Entity('demos')
export class Demo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  normalizedUrl: string;

  @Column({ type: 'varchar', length: 100, default: 'active' })
  status: 'active' | 'draft' | 'deleted';

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subcategory: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  screenshotUrl: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  lastCheckedAt: Date;

  @Column({ type: 'boolean', default: true })
  isAccessible: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'uuid' })
  vendorId: string;

  @ManyToOne(() => Vendor, { eager: true })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
