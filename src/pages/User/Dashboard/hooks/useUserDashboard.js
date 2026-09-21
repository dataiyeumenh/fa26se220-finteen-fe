import { useWorkspace } from '@/features/workspace/useWorkspace'
export default function useUserDashboard() {
  const { actor } = useWorkspace()
  return { user: actor, loading: false, error: '', stats: [], continueLessons: [], achievements: [] }
}
