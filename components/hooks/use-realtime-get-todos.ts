import { useRealtimeSubscription } from "./use-realtime-subscription";

// hooks/useRealtimeGetTodos.ts
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  // ... other fields as needed
}

interface UseRealtimeGetTodosOptions {
  onTodosChange?: () => void;
  userId?: string;
  enabled?: boolean;
}

export function useRealtimeGetTodos({
  onTodosChange,
  userId,
  enabled = true,
}: UseRealtimeGetTodosOptions = {}) {
  return useRealtimeSubscription<Todo>({
    table: 'todos',
    event: '*',
    filter: userId ? `user_id=eq.${userId}` : undefined,
    onChange: () => {
      onTodosChange?.();
    },
    channelName: `todos-${userId || 'all'}`,
    enabled,
  });
}
