'use client'

import dynamic from 'next/dynamic'

const DualWalkway = dynamic(() => import('./DualWalkway'), {
  ssr: false,
})

export default function DualWalkwayLazy() {
  return <DualWalkway />
}
