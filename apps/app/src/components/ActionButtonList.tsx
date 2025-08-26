'use client'
import { useDisconnect, useAppKit, useAppKitNetwork  } from '@reown/appkit/react'
import { networks } from '@/config'

export const ActionButtonList = () => {
    const { disconnect } = useDisconnect();
    const { open } = useAppKit();
    const { switchNetwork } = useAppKitNetwork();

    const handleDisconnect = async () => {
      try {
        await disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
        throw error;
      }
    }
  return (
    <div>
        <button onClick={() => { void open(); }}>Open</button>
        <button onClick={() => { void handleDisconnect(); }}>Disconnect</button>
        <button onClick={() => { void switchNetwork(networks[1]!); }}>Switch</button>
    </div>
  )
}
