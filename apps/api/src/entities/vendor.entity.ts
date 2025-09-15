import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Demo } from './demo.entity';
import { Theme } from './theme.entity';
import { ImportRun } from './import-run.entity';

export interface ConnectorConfig {
  type: 'css' | 'api' | 'sitemap';
  params: {
    seedUrls?: string[];
    selectors?: {
      cardSelector?: string;
      linkSelector?: string;
      nameSelector?: string;
    };
    apiEndpoint?: string;
    apiHeaders?: Record<string, string>;
    sitemapUrl?: string;
    urlPattern?: string;
  };
}

export interface VendorLimits {
  concurrency: number;
  delayMs: number;
  userAgent: string;
}

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  baseUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  connectorConfig: ConnectorConfig;

  @Column('jsonb', { default: { concurrency: 3, delayMs: 1000, userAgent: 'NeetrinoBot/1.0' } })
  limits: VendorLimits;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Demo, demo => demo.vendor)
  demos: Demo[];

  @OneToMany(() => Theme, theme => theme.vendor)
  themes: Theme[];

  @OneToMany(() => ImportRun, importRun => importRun.vendor)
  importRuns: ImportRun[];
}
