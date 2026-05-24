import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getCollection } from "@/lib/api";
import { PromptCard } from "@/components/PromptCard";
import { relativeTime } from "@/lib/utils";

export function CollectionDetail() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const ns = namespace!;
  const n = name!;

  const { data, isLoading } = useQuery({
    queryKey: ["collection", ns, n],
    queryFn: () => getCollection(ns, n),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={24} className="animate-spin text-violet-500" />
      </div>
    );
  }
  if (!data) return <p className="text-center py-24 text-zinc-500">Collection not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <p className="text-sm text-zinc-500">
          <Link to={`/${ns}`} className="hover:text-violet-600 dark:hover:text-violet-400">{ns}</Link>
          {" / collections"}
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{data.name}</h1>
        {data.description && (
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">{data.description}</p>
        )}
        <p className="text-xs text-zinc-400 mt-2">Created {relativeTime(data.created_at)}</p>
      </div>

      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          {data.items.length} prompt{data.items.length !== 1 ? "s" : ""}
        </p>
        {data.items.length === 0 ? (
          <p className="text-sm text-zinc-400">This collection is empty.</p>
        ) : (
          <div className="grid gap-3">
            {data.items.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
