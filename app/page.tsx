'use client'
import { Button } from "@/components/ui/button"

export default function Home() {
  const alertMe = () => {
    alert("Hello");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Button onClick={alertMe}>Hello</Button>
    </div>
  );
}
