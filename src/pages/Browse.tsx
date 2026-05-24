import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { listPrompts } from "@/lib/api";
import { PromptCard } from "@/components/PromptCard";

const VISIBILITIES = ["public", "private", "unlisted", "team"] as const;

export function Browse() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const tag = params.get("tag") ?? "";
  const model = params.get("model") ?? "";
  const visibility = params.get("visibility") ?? "";

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["prompts", q, tag, model, visibility],
    queryFn: () =>
      listPrompts({
        q: q || undefined,
        tag: tag || undefined,
        model: model || undefined,
        visibility: visibility || undefined,
      }),
  });

  function set(key: string, value: string) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Browse prompts</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="w-full sm:w-52 shrink-0 space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Tag
            </label>
            <input
              value={tag}
              onChange={(e) => set("tag", e.target.value)}
              placeholder="e.g. python"
              className="mt-1 w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Model hint
            </label>
            <input
              value={model}
              onChange={(e) => set("model", e.target.value)}
              placeholder="e.g. gpt-4"
              className="mt-1 w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => set("visibility", e.target.value)}
              className="mt-1 w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">All</option>
              {VISIBILITIES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          {(q || tag || model || visibility) && (
            <button
              onClick={() => setParams({})}
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          {q && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Search results for <span className="font-medium text-zinc-700 dark:text-zinc-300">"{q}"</span>
            </p>
          )}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-violet-500" />
            </div>
          ) : !prompts?.length ? (
            <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">No prompts found.</p>
          ) : (
            <div className="grid gap-3">
              {prompts.map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
