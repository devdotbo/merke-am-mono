'use client'

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit, useAppKitTheme } from '@reown/appkit/react'
import React, { type ReactNode, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import AuthBridge from './AuthBridge'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
	name: 'merke.am',
	description: 'merke.am dApp',
	url: 'http://localhost:3000', // origin must match your domain & subdomain
	icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
export const modal = createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks,
	metadata,
	features: {
		analytics: true // Optional - defaults to your Cloud configuration
	},
	// Prefer CSS variable overrides in globals.css for AppKit theming
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
	const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

	// Convex client for browser; URL inferred from env
	const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string, { verbose: false })

	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
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
