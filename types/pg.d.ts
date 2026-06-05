// Type shim for 'pg' — avoids requiring @types/pg at build time
declare module 'pg' {
  export interface PoolConfig {
    connectionString?: string
    ssl?: boolean | { rejectUnauthorized?: boolean }
    max?: number
    idleTimeoutMillis?: number
    connectionTimeoutMillis?: number
  }

  export interface QueryResult<T = Record<string, unknown>> {
    rows: T[]
    rowCount: number | null
    command: string
    fields: Array<{ name: string }>
  }

  export interface PoolClient {
    query<T = Record<string, unknown>>(sql: string, values?: unknown[]): Promise<QueryResult<T>>
    release(): void
  }

  export class Pool {
    constructor(config?: PoolConfig)
    connect(): Promise<PoolClient>
    end(): Promise<void>
  }
}
