import { GitFork, Star, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { cn, relativeTime } from "@/lib/utils";
import type { Prompt } from "@/types";

interface Props {
  prompt: Prompt;
  className?: string;
}

export function PromptCard({ prompt, className }: Props) {
  return (
    <Link
      to={`/prompts/${prompt.namespace}/${prompt.name}`}
      className={cn(
        "block rounded-xl border border-zinc-200 dark:border-zinc-800 p-4",
        "hover:border-violet-400 dark:hover:border-violet-600 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <Link
              to={`/${prompt.namespace}`}
              className="hover:text-violet-600 dark:hover:text-violet-400"
              onClick={(e) => e.stopPropagation()}
            >
              {prompt.namespace}
            </Link>
          </p>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {prompt.name}
          </h3>
          {prompt.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
              {prompt.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Star size={13} />
            {prompt.star_count}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={13} />
            {prompt.fork_count}
          </span>
        </div>
      </div>

      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {prompt.tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
            >
              <Tag size={10} />
              {t}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3">
        updated {relativeTime(prompt.updated_at)}
      </p>
    </Link>
  );
}
