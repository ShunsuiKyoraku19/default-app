// tipos básicos pra não dar erro no TS
declare module 'expo-sqlite' {
  export interface SQLiteDatabase {
    execAsync(source: string): Promise<void>;
    getFirstAsync<T>(source: string, ...params: unknown[]): Promise<T | null>;
    getAllAsync<T>(source: string, ...params: unknown[]): Promise<T[]>;
    runAsync(source: string, ...params: unknown[]): Promise<{ lastInsertRowId: number; changes: number }>;
    closeAsync(): Promise<void>;
  }

  export function openDatabaseAsync(
    databaseName: string,
    options?: Record<string, unknown>,
    directory?: string
  ): Promise<SQLiteDatabase>;
}
