/**
 * Client-only wrapper for the scroll story's canvas. Only the WebGL scene is
 * behind ssr:false — the captions and headings stay server rendered in
 * ThreeActStory.tsx.
 */
'use client'

import dynamic from 'next/dynamic'

export default dynamic(
  () => import('./ThreeActStoryScene').then((m) => m.ThreeActStoryScene),
  { ssr: false },
)
