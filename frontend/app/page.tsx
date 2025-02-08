'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

      router.push("/login"); // Redirect unauthenticated users to login
    
}
