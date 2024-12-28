import { useState } from "react";
import Image from "next/image";
import "../app/globals.css";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface FormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    // Handle login logic here
    alert(`Logging in with email: ${email}`);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4">
          <Image
            className="dark:invert"
            src="/logo.svg"
            alt="Next.js logo"
            width={50}
            height={50}
            priority
          />
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h1 className="text-lg font-bold text-center sm:text-left">Login</h1>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="rounded-full bg-blue-500 text-white px-6 py-2 font-semibold hover:bg-blue-600 transition-colors"
          >
            Log In
          </button>
        </form>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </Link>
      </footer>
    </div>
  );
}
