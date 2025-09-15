import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Demo } from '../../demos/demo.entity';

@Entity('check_runs')
export class CheckRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  demoId: string;

  @ManyToOne(() => Demo, { eager: true })
  @JoinColumn({ name: 'demoId' })
  demo: Demo;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date;

  @Column({ type: 'varchar', length: 50, default: 'running' })
  status: 'running' | 'completed' | 'failed';

  @Column({ type: 'boolean', default: true })
  isAccessible: boolean;

  @Column({ type: 'int', nullable: true })
  responseTime: number;

  @Column({ type: 'int', nullable: true })
  statusCode: number;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
