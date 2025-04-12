import { useLoading } from '@/context/LoadingContext';
import { ProgressSpinner } from 'primereact/progressspinner'

export default function LoadingComponent() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
        <ProgressSpinner />
    </div>
  )
}
