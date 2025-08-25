// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { InfoList } from "@/components/InfoList";
import { ActionButtonList } from "@/components/ActionButtonList";
import Image from 'next/image';
import { Button } from "@repo/ui/button";

export default function Home() {

  return (
    <div className={"pages"}>
      <Image src="/reown.svg" alt="Reown" width={150} height={150} priority />
      <h1>AppKit Wagmi Next.js App Router Example</h1>

      <ConnectButton />
      <Button appName="AppKit Example">Workspace UI Button</Button>
      <ActionButtonList />
      <div className="advice">
        <p>
          This projectId only works on localhost. <br/>Go to <a href="https://cloud.reown.com" target="_blank" rel="noreferrer" className="link-button">Reown Cloud</a> to get your own.
        </p>
      </div>
      <InfoList />
    </div>
  );
}