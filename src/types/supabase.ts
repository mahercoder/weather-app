export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      search_history: {
        Row: {
          id: string
          created_at: string
          location: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          location: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          location?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {}
    Enums: {}
  }
}