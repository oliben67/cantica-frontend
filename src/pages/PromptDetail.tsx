import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GitFork, Loader2, MessageSquare, Star, Tag } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addComment,
  deleteComment,
  getPrompt,
  getVersion,
  listBranches,
  listComments,
  listStargazers,
  listTags,
  listVersions,
  starPrompt,
  unstarPrompt,
} from "@/lib/api";
import { cn, relativeTime } from "@/lib/utils";

export function PromptDetail() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const ns = namespace!;
  const n = name!;
  const qc = useQueryClient();

  const { data: prompt, isLoading: loadingPrompt } = useQuery({
    queryKey: ["prompt", ns, n],
    queryFn: () => getPrompt(ns, n),
  });
  const { data: latest } = useQuery({
    queryKey: ["version", ns, n, "latest"],
    queryFn: () => getVersion(ns, n, "latest"),
    enabled: !!prompt,
  });
  const { data: versions } = useQuery({
    queryKey: ["versions", ns, n],
    queryFn: () => listVersions(ns, n),
    enabled: !!prompt,
  });
  const { data: tags } = useQuery({
    queryKey: ["tags", ns, n],
    queryFn: () => listTags(ns, n),
    enabled: !!prompt,
  });
  const { data: branches } = useQuery({
    queryKey: ["branches", ns, n],
    queryFn: () => listBranches(ns, n),
    enabled: !!prompt,
  });
  const { data: stargazers } = useQuery({
    queryKey: ["stargazers", ns, n],
    queryFn: () => listStargazers(ns, n),
    enabled: !!prompt,
  });
  const { data: comments } = useQuery({
    queryKey: ["comments", ns, n],
    queryFn: () => listComments(ns, n),
    enabled: !!prompt,
  });

  const isStarred = (stargazers ?? []).some((s) => s.namespace === "local");

  const starMutation = useMutation({
    mutationFn: async () => { await (isStarred ? unstarPrompt(ns, n) : starPrompt(ns, n)); },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stargazers", ns, n] });
      qc.invalidateQueries({ queryKey: ["prompt", ns, n] });
    },
  });

  const [commentBody, setCommentBody] = useState("");
  const commentMutation = useMutation({
    mutationFn: (body: string) => addComment(ns, n, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", ns, n] });
      setCommentBody("");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComment(ns, n, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", ns, n] }),
  });

  if (loadingPrompt) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={24} className="animate-spin text-violet-500" />
      </div>
    );
  }
  if (!prompt) return <p className="text-center py-24 text-zinc-500">Prompt not found.</p>;

  const tagMap = Object.fromEntries((tags ?? []).map((t) => [t.sha, t.name]));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-500">
            <Link to={`/${ns}`} className="hover:text-violet-600 dark:hover:text-violet-400">{ns}</Link>
            {" / "}
          </p>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{prompt.name}</h1>
          {prompt.description && (
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">{prompt.description}</p>
          )}
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {prompt.tags.map((t) => (
                <Link
                  key={t}
                  to={`/?tag=${t}`}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900"
                >
                  <Tag size={10} /> {t}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => starMutation.mutate()}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors",
              isStarred
                ? "bg-violet-600 border-violet-600 text-white hover:bg-violet-700"
                : "border-zinc-200 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-600"
            )}
          >
            <Star size={14} className={isStarred ? "fill-current" : ""} />
            {isStarred ? "Starred" : "Star"}
            <span className="ml-1 text-xs opacity-70">{prompt.star_count}</span>
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-500">
            <GitFork size={14} /> {prompt.fork_count}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content */}
          {latest && (
            <section>
              <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                Latest version <span className="font-mono normal-case">({latest.sha.slice(0, 7)})</span>
              </h2>
              <pre className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                {latest.content}
              </pre>
            </section>
          )}

          {/* Comments */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <MessageSquare size={14} />
              Comments ({comments?.length ?? 0})
            </h2>
            <div className="space-y-3 mb-4">
              {(comments ?? []).map((c) => (
                <div key={c.id} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{c.author}</span>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>{relativeTime(c.created_at)}</span>
                      <button
                        onClick={() => deleteMutation.mutate(c.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{c.body}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Leave a comment…"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && commentBody.trim()) {
                    e.preventDefault();
                    commentMutation.mutate(commentBody.trim());
                  }
                }}
              />
              <button
                onClick={() => commentBody.trim() && commentMutation.mutate(commentBody.trim())}
                disabled={!commentBody.trim() || commentMutation.isPending}
                className="px-3 py-2 text-sm rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                Post
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 text-sm">
          {/* Branches */}
          {(branches ?? []).length > 0 && (
            <div>
              <h3 className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-xs mb-2">Branches</h3>
              <ul className="space-y-1">
                {(branches ?? []).map((b) => (
                  <li key={b.name} className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {b.name} <span className="text-zinc-400">{b.head_sha.slice(0, 7)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {(tags ?? []).length > 0 && (
            <div>
              <h3 className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-xs mb-2">Tags</h3>
              <ul className="space-y-1">
                {(tags ?? []).map((t) => (
                  <li key={t.name} className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {t.name} <span className="text-zinc-400">{t.sha.slice(0, 7)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Version history */}
          {(versions ?? []).length > 0 && (
            <div>
              <h3 className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-xs mb-2">History</h3>
              <ul className="space-y-2">
                {(versions ?? []).slice(0, 10).map((v) => (
                  <li key={v.sha} className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
                    <p className="font-mono text-xs text-violet-600 dark:text-violet-400">
                      {v.sha.slice(0, 7)}
                      {tagMap[v.sha] && (
                        <span className="ml-1 text-[10px] bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-1 rounded">
                          {tagMap[v.sha]}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{v.message}</p>
                    <p className="text-xs text-zinc-400">{relativeTime(v.created_at)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
