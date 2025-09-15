import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { Theme } from './theme.entity';
import { MediaSet } from './media-set.entity';

export type DemoState = 'active' | 'draft' | 'deleted';

@Entity('demos')
@Index(['vendorId', 'urlCanonical'], { unique: true })
export class Demo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vendorId: string;

  @Column('uuid', { nullable: true })
  themeId: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  url: string;

  @Column()
  urlCanonical: string;

  @Column({
    type: 'enum',
    enum: ['active', 'draft', 'deleted'],
    default: 'active',
  })
  state: DemoState;

  @CreateDateColumn()
  firstSeenAt: Date;

  @UpdateDateColumn()
  lastSeenAt: Date;

  @Column({ nullable: true })
  firstFailedAt: Date;

  @Column({ nullable: true })
  lastOkAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Vendor, vendor => vendor.demos)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @ManyToOne(() => Theme, theme => theme.demos, { nullable: true })
  @JoinColumn({ name: 'themeId' })
  theme: Theme;

  @OneToOne(() => MediaSet, mediaSet => mediaSet.demo, { nullable: true })
  mediaSet: MediaSet;
}
