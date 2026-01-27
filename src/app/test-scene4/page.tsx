'use client'

import dynamic from 'next/dynamic'

const Scene4 = dynamic(() => import('@/components/canvas/Scene4'), {
  ssr: false,
  loading: () => <div style={{ background: '#0D0D0D', height: '100vh' }} />,
})

export default function TestScene4Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#0D0D0D' }}>
      <Scene4 />
    </main>
  )
}