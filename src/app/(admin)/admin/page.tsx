import { AppShell } from '@/components/layout/app-shell'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AppShell />
    </Suspense>
  )
}