import React from 'react'

/**
 * Editor layout - no navigation, full screen editor
 */
export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen overflow-hidden">{children}</div>
}

