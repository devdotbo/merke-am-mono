'use client'

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit, useAppKitTheme } from '@reown/appkit/react'
import React, { type ReactNode, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: 'next-reown-appkit',
  description: 'next-reown-appkit',
  url: 'https://github.com/0xonerb/next-reown-appkit-ssr', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: 'system',
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  // Prefer CSS variable overrides in globals.css for AppKit theming
})

function AppKitThemeSync() {
  const { theme, systemTheme } = useTheme()
  const kitTheme = useAppKitTheme()

  useEffect(() => {
    const resolved = theme === 'system' ? systemTheme : theme
    const mode = resolved === 'dark' ? 'dark' : 'light'
    // Guard in case API surface changes
    if (kitTheme && typeof (kitTheme as any).setThemeMode === 'function') {
      ;(kitTheme as any).setThemeMode(mode)
    }
  }, [theme, systemTheme, kitTheme])

  return null
}

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <AppKitThemeSync />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
