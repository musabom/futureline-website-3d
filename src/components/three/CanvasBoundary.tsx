/**
 * CanvasBoundary — renders `fallback` if the WebGL scene fails to mount.
 *
 * This is the React replacement for the prototype's
 * `initWebGL().catch(() => initParticles())`. Context creation can fail for
 * reasons that have nothing to do with our code — no GPU, a blocklisted
 * driver, too many live contexts on the page, or WebGL disabled outright —
 * and a hero that renders nothing at all is a much worse outcome than a
 * simpler animation.
 *
 * Must be a class component: error boundaries have no hooks equivalent.
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
    // Worth surfacing: this means real visitors are seeing the fallback.
    console.warn('[CanvasBoundary] WebGL scene failed, using fallback:', error, info)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
