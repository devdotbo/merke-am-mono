import Link from 'next/link';

export default function DemoIndexPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Demos</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <Link href="/demo/flow" className="text-primary underline">
            React Flow demo
          </Link>
        </li>
      </ul>
    </div>
  );
}


