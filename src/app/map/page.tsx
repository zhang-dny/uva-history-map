import { Suspense } from 'react'
import PublicMapClient from '@/components/map/PublicMapClient'

export const dynamic = 'force-dynamic'

export default function PublicMapPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <PublicMapClient />
    </Suspense>
  )
}