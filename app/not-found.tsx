import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Image src="/logo.svg" alt="Logo" width={150} height={150} className="mb-6" />
      
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-lg text-gray-500 mb-4">File not found</p>
      
      <Link href="/">
        <span className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
          Go back home
        </span>
      </Link>
    </div>
  );
}
