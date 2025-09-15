import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Demo } from '../demos/demo.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, default: 'active' })
  status: 'active' | 'inactive' | 'banned';

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  demoCount: number;

  @OneToMany(() => Demo, demo => demo.vendor)
  demos: Demo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
