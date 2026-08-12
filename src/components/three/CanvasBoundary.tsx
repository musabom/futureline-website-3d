/**
 * CanvasBoundary — renders `fallback` if a WebGL scene fails to mount.
 *
 * WebGL context creation fails for real reasons: blocklisted drivers, GPU
 * process crashes, too many live contexts on one page, headless/CI browsers.
 * A thrown error inside <Canvas> would otherwise take down the whole route,
 * so each scene gets its own boundary and degrades to a static visual.
 *
 * Must be a class component — React has no hook equivalent of
 * componentDidCatch.
 */
'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  failed: boolean
}

export class CanvasBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface it — a silently missing hero is worse than a noisy console.
    console.warn('[CanvasBoundary] WebGL scene failed, showing fallback:', error, info)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
