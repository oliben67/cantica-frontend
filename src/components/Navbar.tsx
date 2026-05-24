import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate(`/?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100 shrink-0">
          <BookOpen size={20} className="text-violet-600" />
          Cantica
        </Link>

        <form onSubmit={submit} className="flex-1 max-w-sm">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search prompts…"
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Browse</Link>
          <Link to="/collections" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Collections</Link>
        </nav>
      </div>
    </header>
  );
}
