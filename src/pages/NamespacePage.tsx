import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { listCollections, listPrompts } from "@/lib/api";
import { PromptCard } from "@/components/PromptCard";
import { relativeTime } from "@/lib/utils";

export function NamespacePage() {
  const { namespace } = useParams<{ namespace: string }>();
  const ns = namespace!;

  const { data: prompts, isLoading: loadingPrompts } = useQuery({
    queryKey: ["prompts", ns],
    queryFn: () => listPrompts({ namespace: ns }),
  });

  const { data: collections, isLoading: loadingCollections } = useQuery({
    queryKey: ["collections", ns],
    queryFn: () => listCollections(ns),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-2xl font-bold text-violet-700 dark:text-violet-300">
          {ns[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{ns}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {prompts?.length ?? 0} prompt{prompts?.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Prompts */}
      <section>
        <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Prompts</h2>
        {loadingPrompts ? (
          <Loader2 size={20} className="animate-spin text-violet-500" />
        ) : !prompts?.length ? (
          <p className="text-sm text-zinc-400">No prompts yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {prompts.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </section>

      {/* Collections */}
      <section>
        <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Collections</h2>
        {loadingCollections ? (
          <Loader2 size={20} className="animate-spin text-violet-500" />
        ) : !collections?.length ? (
          <p className="text-sm text-zinc-400">No collections yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <Link
                key={c.id}
                to={`/collections/${c.namespace}/${c.name}`}
                className="block p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-400 dark:hover:border-violet-600 transition-colors"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</h3>
                {c.description && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{c.description}</p>
                )}
                <p className="text-xs text-zinc-400 mt-2">{relativeTime(c.created_at)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
