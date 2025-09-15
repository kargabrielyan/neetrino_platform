// Базовые типы для Neetrino Platform

export interface Vendor {
  id: string;
  name: string;
  baseUrl: string;
  isActive: boolean;
  connector: {
    mode: 'css' | 'api' | 'sitemap';
    params: Record<string, any>;
  };
  limits: {
    concurrency: number;
    delayMs: number;
    userAgent: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  category?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Demo {
  id: string;
  vendorId: string;
  themeId?: string;
  name?: string;
  url: string;
  urlCanonical: string;
  state: 'active' | 'draft' | 'deleted';
  firstSeenAt: Date;
  lastSeenAt: Date;
  firstFailedAt?: Date;
  lastOkAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportRun {
  id: string;
  vendorId: string;
  startedAt: Date;
  finishedAt?: Date;
  totals: {
    found: number;
    new: number;
    ignored: number;
    errors: number;
  };
  log: string;
}

export interface CheckRun {
  id: string;
  demoId: string;
  startedAt: Date;
  finishedAt?: Date;
  result: {
    status?: number;
    timeout?: boolean;
    error?: string;
  };
  ok: boolean;
  note?: string;
}

export interface MediaSet {
  id: string;
  demoId: string;
  lcpUrl?: string;
  shot375Url?: string;
  shot768Url?: string;
  shot1280Url?: string;
  createdAt: Date;
}

// API Response типы
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Фича-флаги
export interface FeatureFlags {
  PARSING_ENABLED: boolean;
  CHECKING_ENABLED: boolean;
  MEDIA_GENERATION_ENABLED: boolean;
}
