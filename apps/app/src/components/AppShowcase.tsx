"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Wallet, Zap, Database, Brain, Sparkles, Paperclip, Link2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { useAppKit, useAppKitAccount, useWalletInfo } from "@reown/appkit/react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { useClientMounted } from "@/hooks/useClientMount";
import { useAction } from "convex/react";
import { api } from "@convex/_generated/api";

interface NodeItem {
	id: string;
	label: string;
	icon: React.ReactNode;
	x: number;
	y: number;
	details: string[];
}

interface CursorItem {
	id: string;
	username: string;
	color: string;
}

interface AppShowcaseProps {
	title?: string;
	subtitle?: string;
	inputPlaceholder?: string;
}

export const AppShowcase: React.FC<AppShowcaseProps> = ({
	title = "Build with nodes. Keep the proof.",
	subtitle = "Click together data, RAG, and inference. 0G anchors your history and verifies results.",
	inputPlaceholder = "Describe your pipeline…",
}) => {
	const [inputValue, setInputValue] = useState("");
	const [nodeStates, setNodeStates] = useState<Record<string, boolean>>({});
	const canvasRef = useRef<HTMLDivElement | null>(null);
	const [canvasWidth, setCanvasWidth] = useState<number>(0);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

	const cursor1X = useMotionValue(200);
	const cursor1Y = useMotionValue(150);
	const cursor2X = useMotionValue(600);
	const cursor2Y = useMotionValue(150);

	const springCursor1X = useSpring(cursor1X, { stiffness: 120, damping: 28, mass: 0.9 });
	const springCursor1Y = useSpring(cursor1Y, { stiffness: 120, damping: 28, mass: 0.9 });
	const springCursor2X = useSpring(cursor2X, { stiffness: 120, damping: 28, mass: 0.9 });
	const springCursor2Y = useSpring(cursor2Y, { stiffness: 120, damping: 28, mass: 0.9 });

	const cursors: readonly [CursorItem, CursorItem] = [
		{ id: "alex", username: "Alex", color: "#FF6B6B" },
		{ id: "sarah", username: "Sarah", color: "#4ECDC4" },
	] as const;

	const nodes: NodeItem[] = useMemo(() => [
		{ id: "data", label: "Data Sources", icon: <Database className="w-6 h-6" />, x: 150, y: 120, details: ["Vector Database", "Document Store", "Knowledge Graph", "Real-time Streams"] },
		{ id: "rag", label: "RAG Pipeline", icon: <Zap className="w-6 h-6" />, x: 400, y: 80, details: ["Retrieval System", "Context Ranking", "Query Processing", "Embedding Search"] },
		{ id: "inference", label: "AI Inference", icon: <Brain className="w-6 h-6" />, x: 600, y: 120, details: ["Language Model", "Response Generation", "Quality Scoring", "Output Validation"] },
	], []);

	useEffect(() => {
		const updateWidth = () => {
			if (canvasRef.current) setCanvasWidth(canvasRef.current.clientWidth);
		};
		updateWidth();
		const ro = new ResizeObserver(() => updateWidth());
		if (canvasRef.current) ro.observe(canvasRef.current);
		window.addEventListener("resize", updateWidth);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", updateWidth);
		};
	}, []);

	const scaledNodes: NodeItem[] = useMemo(() => {
		const width = canvasWidth || 660;
		const usable = Math.max(width - 120, 0);
		const baseUsable = 540;
		const scale = Math.min(usable / baseUsable, 1);
		return nodes.map((n) => {
			const baseLeft = n.x - 60;
			const scaledLeft = baseLeft * (Number.isFinite(scale) ? scale : 1);
			const scaledX = scaledLeft + 60;
			return { ...n, x: scaledX };
		});
	}, [canvasWidth, nodes]);

	useEffect(() => {
		const first = scaledNodes[0];
		const third = scaledNodes[2];
		if (first && third) {
			cursor1X.set(first.x);
			cursor1Y.set(first.y);
			cursor2X.set(third.x);
			cursor2Y.set(third.y);
		}
	}, [scaledNodes, cursor1X, cursor1Y, cursor2X, cursor2Y]);

	useEffect(() => {
		let alexIndex = 0;
		let sarahIndex = 0;

		const alexTargets = [
			{ x: scaledNodes[0]?.x ?? 150, y: scaledNodes[0]?.y ?? 120 },
			{ x: scaledNodes[1]?.x ?? 400, y: scaledNodes[1]?.y ?? 80 },
			{ x: scaledNodes[2]?.x ?? 600, y: scaledNodes[2]?.y ?? 120 },
		];
		const sarahTargets = [
			{ x: scaledNodes[2]?.x ?? 600, y: scaledNodes[2]?.y ?? 120 },
			{ x: scaledNodes[0]?.x ?? 150, y: scaledNodes[0]?.y ?? 120 },
			{ x: scaledNodes[1]?.x ?? 400, y: scaledNodes[1]?.y ?? 80 },
		];

		const interval = setInterval(() => {
			const alexTarget = alexTargets[alexIndex] ?? { x: 150, y: 120 };
			cursor1X.set(alexTarget.x + Math.random() * 40 - 20);
			cursor1Y.set(alexTarget.y + Math.random() * 40 - 20);
			const safeIndex = nodes.length > 0 ? alexIndex % nodes.length : 0;
			const currentNode = nodes[safeIndex];
			if (currentNode) {
				setNodeStates((prev) => ({ ...prev, [currentNode.id]: true }));
				setTimeout(() => setNodeStates((prev) => ({ ...prev, [currentNode.id]: false })), 1800);
			}
			alexIndex = (alexIndex + 1) % alexTargets.length;

			setTimeout(() => {
				const sarahTarget = sarahTargets[sarahIndex] ?? { x: 600, y: 120 };
				cursor2X.set(sarahTarget.x + Math.random() * 40 - 20);
				cursor2Y.set(sarahTarget.y + Math.random() * 40 - 20);
				sarahIndex = (sarahIndex + 1) % sarahTargets.length;
			}, 1200);
		}, 3400);

		return () => clearInterval(interval);
	}, [cursor1X, cursor1Y, cursor2X, cursor2Y, nodes, scaledNodes]);

	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();
	useWalletInfo();
	const mounted = useClientMounted();
	const canAsk = mounted && isConnected;
	const askAgent = useAction(api.agent.askAgent);
	const [threadId, setThreadId] = useState<string | undefined>(undefined);
	const [agentReply, setAgentReply] = useState<string>("");

	const { data: ensName } = useEnsName({
		address: address as `0x${string}` | undefined,
		chainId: 1,
		query: { enabled: Boolean(address) }
	});

	const { data: ensAvatar } = useEnsAvatar({
		name: ensName ?? undefined,
		chainId: 1,
		query: { enabled: Boolean(ensName) }
	});

	const handleConnectWallet = () => {
		open();
	};

	const handleAsk = async () => {
		if (!inputValue.trim()) return;
		const res = await askAgent({ prompt: inputValue, threadId });
		setAgentReply(res.text);
		if (!threadId && res.threadId) setThreadId(res.threadId as string);
	};

	const shortenAddress = (addr?: string) => {
		if (!addr) return "";
		return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
	};

	const handleAttachClick = () => fileInputRef.current?.click();
	const handleLinkUrl = () => toast("Add URL", { description: "Linking external URLs is coming soon.", duration: 2500 });
	const handlePasteText = () => toast("Paste text", { description: "A quick paste modal is coming soon.", duration: 2500 });

	const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : [];
		setAttachedFiles(files);
		if (files.length > 0) {
			toast("Files attached", { description: `${files.length} file${files.length > 1 ? "s" : ""} selected`, duration: 2500 });
		}
	};

	return (
		<div className="relative min-h-screen bg-background overflow-hidden">
			<div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,hsl(var(--foreground)/0.25),hsl(var(--foreground)/0.85))]" />
			<div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_hsl(var(--accent)/0.25),_transparent_60%)]" />

			<div className="relative z-[5] container mx-auto pl-4 pr-8 md:pr-16 lg:pr-24 xl:pr-32 py-20">
				<div className="flex justify-between items-center mb-20">
					<motion.div className="text-2xl font-semibold text-foreground brand-underline" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
						merke.am
					</motion.div>

					<motion.div className="relative z-[10] flex items-center gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
						<ModeToggle />
						{mounted && isConnected ? (
							<Button variant="outline" onClick={handleConnectWallet} className="flex items-center gap-2 border-border/60">
								{ensAvatar ? (
									<span className="w-5 h-5 rounded-full overflow-hidden inline-flex items-center justify-center bg-muted">
										<Image src={ensAvatar} alt="ENS avatar" width={20} height={20} />
									</span>
								) : (
									<Wallet className="w-4 h-4" />
								)}
								<span className="text-sm">{ensName || shortenAddress(address)}</span>
							</Button>
						) : (
							<Button variant="outline" onClick={handleConnectWallet} className="flex items-center gap-2 border-border/60">
								<Wallet className="w-4 h-4" />
								Connect Wallet
							</Button>
						)}
					</motion.div>
				</div>

				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-8">
						<motion.h1 className="text-5xl lg:text-7xl font-semibold leading-tight tracking-tight text-foreground font-brand-serif" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, ease: "easeOut" }}>
							{title}
						</motion.h1>

						<motion.p className="text-lg md:text-xl text-foreground/90 max-w-2xl leading-7 md:leading-8 tracking-normal font-brand-sans lining-nums" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}>
							{subtitle}
						</motion.p>

						<motion.form
							onSubmit={(e) => {
								e.preventDefault();
								if (canAsk) {
									void handleAsk();
								} else {
									void handleConnectWallet();
								}
							}}
							className="w-full max-w-2xl mx-auto"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1.0, delay: 0.35, ease: "easeOut" }}
						>
							<div className="relative">
								<div className="relative isolate flex items-center gap-3 rounded-full border border-border bg-background px-3 py-2">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button type="button" aria-label="Add context" className="relative grid h-9 w-9 place-items-center rounded-full bg-accent/20 ring-1 ring-border focus:outline-none">
												<Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
												{attachedFiles.length > 0 && (
													<span className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 rounded-full bg-[hsl(var(--accent))] text-[10px] leading-4 text-primary-foreground text-center">
														{attachedFiles.length}
													</span>
												)}
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" side="bottom" sideOffset={8} className="w-56">
											<DropdownMenuLabel>Add context</DropdownMenuLabel>
											<DropdownMenuItem onClick={handleAttachClick} className="gap-2">
												<Paperclip className="h-4 w-4" />
												Upload files…
											</DropdownMenuItem>
											<DropdownMenuItem onClick={handleLinkUrl} className="gap-2">
												<Link2 className="h-4 w-4" />
												Link URL…
											</DropdownMenuItem>
											<DropdownMenuItem onClick={handlePasteText} className="gap-2">
												<FileText className="h-4 w-4" />
												Paste text…
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem disabled className="gap-2">
												<Database className="h-4 w-4" />
												Connect data source (soon)
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
									<Input
										type="text"
										placeholder={inputPlaceholder}
										value={inputValue}
										onChange={(e) => {
											setInputValue(e.target.value);
										}}
										className="flex-1 bg-transparent border-0 h-10 px-2 py-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground text-sm font-brand-sans"
									/>
									<input ref={fileInputRef} type="file" multiple onChange={handleFilesChange} className="sr-only" accept=".txt,.md,.pdf,.json,.csv,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp" />
									<Button type="submit" disabled={!inputValue.trim() && attachedFiles.length === 0} className="rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)] disabled:bg-[hsl(var(--accent)/0.35)] disabled:text-[hsl(var(--accent-foreground))] disabled:opacity-100">
										{canAsk ? "Ask Agent" : "Connect wallet to ask"}
									</Button>
								</div>
							</div>
						</motion.form>
						{agentReply && (
							<div className="mt-4 text-sm text-foreground/90">{agentReply}</div>
						)}
					</div>

					<div ref={canvasRef} className="relative h-96 lg:h-[500px]">
						<svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
							{scaledNodes.map((node, index) => {
								const nextNode = scaledNodes[index + 1];
								if (!nextNode) return null;
								return (
									<motion.line key={`${node.id}-${nextNode.id}`} x1={node.x} y1={node.y} x2={nextNode.x} y2={nextNode.y} stroke="hsl(var(--foreground))" strokeWidth="1.6" strokeOpacity="0.2" strokeDasharray="5,5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3.2, delay: index * 0.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} />
								);
							})}
						</svg>

						{scaledNodes.map((node, index) => (
							<motion.div key={node.id} className="absolute" style={{ left: node.x - 60, top: node.y - 40, zIndex: 2 }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 160, damping: 20 }}>
								<div className="relative">
									<motion.div className="w-24 h-24 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm" whileHover={{ scale: 1.05 }} animate={nodeStates[node.id] ? { borderColor: "hsl(var(--foreground))" } : {}}>
										<div className="text-foreground">{node.icon}</div>
									</motion.div>
									<div className="text-center mt-3 text-sm font-medium text-foreground font-brand-sans">{node.label}</div>
									<motion.div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-background border border-border rounded-lg shadow-md overflow-hidden" initial={{ opacity: 0, scale: 0.96, y: -6 }} animate={nodeStates[node.id] ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: -6 }} transition={{ duration: 0.2, ease: "easeOut" }} style={{ pointerEvents: "none" }}>
										{node.details.map((detail, detailIndex) => (
											<motion.div key={`${node.id}-detail-${detailIndex}`} className="px-4 py-2 text-sm font-semibold text-foreground border-b border-border/50 last:border-b-0 font-brand-sans" initial={{ opacity: 0, x: -10 }} animate={nodeStates[node.id] ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.18, delay: detailIndex * 0.08, ease: "easeOut" }}>
												{detail}
											</motion.div>
										))}
									</motion.div>
								</div>
							</motion.div>
						))}

						<motion.div className="absolute pointer-events-none" style={{ x: springCursor1X, y: springCursor1Y, zIndex: 4 }}>
							<div className="relative">
								<motion.div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: cursors[0].color }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
								<motion.div className="absolute inset-0 w-6 h-6 rounded-full" style={{ backgroundColor: cursors[0].color + "40" }} animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
								<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-primary-foreground whitespace-nowrap shadow-sm" style={{ backgroundColor: cursors[0].color }}>
									{cursors[0].username}
								</div>
							</div>
						</motion.div>

						<motion.div className="absolute pointer-events-none" style={{ x: springCursor2X, y: springCursor2Y, zIndex: 4 }}>
							<div className="relative">
								<motion.div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: cursors[1].color }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
								<motion.div className="absolute inset-0 w-6 h-6 rounded-full" style={{ backgroundColor: cursors[1].color + "40" }} animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
								<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-primary-foreground whitespace-nowrap shadow-sm" style={{ backgroundColor: cursors[1].color }}>
									{cursors[1].username}
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppShowcase;
