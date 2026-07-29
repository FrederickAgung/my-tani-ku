'use client'
import { Suspense } from 'react'
import KatalogContent from './content'

export default function KatalogPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    }>
      <KatalogContent />
    </Suspense>
  )
}
