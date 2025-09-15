import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Demo } from './demo.entity';

@Entity('media_sets')
export class MediaSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true })
  demoId: string;

  @Column({ nullable: true })
  lcpUrl: string;

  @Column({ nullable: true })
  shot375Url: string;

  @Column({ nullable: true })
  shot768Url: string;

  @Column({ nullable: true })
  shot1280Url: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @OneToOne(() => Demo, demo => demo.mediaSet)
  @JoinColumn({ name: 'demoId' })
  demo: Demo;
}
