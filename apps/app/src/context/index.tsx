'use client'

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit'
import { useAppKitTheme } from '@reown/appkit/react'
import { ReownAuthentication } from '@reown/appkit-siwx'
import React, { type ReactNode, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { cookieToInitialState, WagmiProvider } from 'wagmi'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import AuthBridge from './AuthBridge'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
	name: 'merke.am',
	description: 'merke.am dApp',
	url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002',
	icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
if (!projectId) {
	console.error('AppKit projectId is missing. Set NEXT_PUBLIC_PROJECT_ID')
}

export const modal = createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks,
	metadata,
	features: {
		analytics: true // Optional - defaults to your Cloud configuration
	},
	// Prefer CSS variable overrides in globals.css for AppKit theming
	siwx: new ReownAuthentication()
})

function AppKitThemeSync() {
	const { theme, systemTheme } = useTheme()
	const kitTheme = useAppKitTheme() as unknown as { setThemeMode?: (mode: 'light' | 'dark') => void } | null

	useEffect(() => {
		const resolved = theme === 'system' ? systemTheme : theme
		const mode: 'light' | 'dark' = resolved === 'dark' ? 'dark' : 'light'
		if (kitTheme?.setThemeMode) {
			kitTheme.setThemeMode(mode)
		}
	}, [theme, systemTheme, kitTheme])

	return null
}

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
	const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

	// Convex client for browser; URL inferred from env
	const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string, { verbose: false })

	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
			<ConvexAuthProvider client={convex}>
				<QueryClientProvider client={queryClient}>
					<AuthBridge />
					<AppKitThemeSync />
					{children}
				</QueryClientProvider>
			</ConvexAuthProvider>
		</WagmiProvider>
	)
}

export default ContextProvider
