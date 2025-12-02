// Database entity types
export interface Profile {
  id: string;
  nickname?: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}


export interface I_TODO_STATE {
  todos: any[];
  selectedTodo: any;
}

// API types
export interface DeleteAccountRequest {
  userId: string;
}

export interface DeleteAccountResponse {
  success?: boolean;
  error?: string;
}

// Toast options type
export interface ToastOptions {
  title?: string;
  description?: string;
  richColors?: boolean;
  position?:
    | "top-center"
    | "top-left"
    | "top-right"
    | "bottom-center"
    | "bottom-left"
    | "bottom-right";
  duration?: number;
}

// Supabase Session type
export interface SupabaseSession {
  user: {
    id: string;
    email?: string;
    phone?: string;
    [key: string]: unknown;
  };
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
}
