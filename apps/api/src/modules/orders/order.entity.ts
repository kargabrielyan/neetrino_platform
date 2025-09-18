import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Demo } from '../demos/demo.entity';

export enum OrderStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DISCUSSION = 'discussion',
  IN_WORK = 'in_work',
  READY = 'ready',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  customerPhone: string;

  @Column({ type: 'uuid' })
  demoId: string;

  @ManyToOne(() => Demo, { eager: true })
  @JoinColumn({ name: 'demoId' })
  demo: Demo;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'varchar', length: 50, default: OrderStatus.NEW })
  status: OrderStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  assignedTo: string;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
