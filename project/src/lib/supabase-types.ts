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
      cards: {
        Row: {
          id: string
          content: string
          created_at: string
          user_id: string
          share_id: string
        }
        Insert: {
          id?: string
          content: string
          created_at?: string
          user_id: string
          share_id: string
        }
        Update: {
          id?: string
          content?: string
          created_at?: string
          user_id?: string
          share_id?: string
        }
      }
    }
  }
}