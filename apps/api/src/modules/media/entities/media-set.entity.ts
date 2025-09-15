import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Demo } from '../../demos/demo.entity';

@Entity('media_sets')
export class MediaSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  demoId: string;

  @OneToOne(() => Demo, { eager: true })
  @JoinColumn({ name: 'demoId' })
  demo: Demo;

  @Column({ type: 'varchar', length: 500, nullable: true })
  lcpUrl: string; // Large Contentful Paint poster

  @Column({ type: 'varchar', length: 500, nullable: true })
  shot375Url: string; // Mobile screenshot (375px)

  @Column({ type: 'varchar', length: 500, nullable: true })
  shot768Url: string; // Tablet screenshot (768px)

  @Column({ type: 'varchar', length: 500, nullable: true })
  shot1280Url: string; // Desktop screenshot (1280px)

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string; // Small thumbnail

  @Column({ type: 'json', nullable: true })
  metadata: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    generatedAt?: Date;
    generator?: string;
  };

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'generating' | 'completed' | 'failed';

  @Column({ type: 'text', nullable: true })
  error: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
