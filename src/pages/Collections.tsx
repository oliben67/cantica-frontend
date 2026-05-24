import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { listCollections } from "@/lib/api";
import { relativeTime } from "@/lib/utils";

export function Collections() {
  const [params, setParams] = useSearchParams();
  const ns = params.get("namespace") ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["collections", ns],
    queryFn: () => listCollections(ns || undefined),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Collections</h1>
        <input
          value={ns}
          onChange={(e) => {
            setParams(e.target.value ? { namespace: e.target.value } : {});
          }}
          placeholder="Filter by namespace…"
          className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-violet-500" />
        </div>
      ) : !data?.length ? (
        <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">No collections found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((c) => (
            <Link
              key={c.id}
              to={`/collections/${c.namespace}/${c.name}`}
              className="block p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-400 dark:hover:border-violet-600 transition-colors"
            >
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">
                <Link
                  to={`/${c.namespace}`}
                  className="hover:text-violet-600 dark:hover:text-violet-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  {c.namespace}
                </Link>
              </p>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</h3>
              {c.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{c.description}</p>
              )}
              <p className="text-xs text-zinc-400 mt-2">{relativeTime(c.created_at)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
