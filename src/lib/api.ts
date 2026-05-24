import type {
  Branch,
  Collection,
  CollectionDetail,
  Comment,
  Prompt,
  Star,
  Tag,
  Version,
} from "@/types";

const BASE = "/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ------------------------------------------------------------------ //
// Prompts                                                              //
// ------------------------------------------------------------------ //

export interface ListPromptsParams {
  q?: string;
  namespace?: string;
  tag?: string;
  model?: string;
  visibility?: string;
}

export function listPrompts(params: ListPromptsParams = {}): Promise<Prompt[]> {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null) as [string, string][]
  ).toString();
  return request<Prompt[]>(`/prompts${qs ? `?${qs}` : ""}`);
}

export function getPrompt(namespace: string, name: string): Promise<Prompt> {
  return request<Prompt>(`/prompts/${namespace}/${name}`);
}

// ------------------------------------------------------------------ //
// Versions                                                             //
// ------------------------------------------------------------------ //

export function listVersions(namespace: string, name: string): Promise<Version[]> {
  return request<Version[]>(`/prompts/${namespace}/${name}/versions`);
}

export function getVersion(namespace: string, name: string, ref: string): Promise<Version> {
  return request<Version>(`/prompts/${namespace}/${name}/versions/${ref}`);
}

// ------------------------------------------------------------------ //
// Tags & Branches                                                      //
// ------------------------------------------------------------------ //

export function listTags(namespace: string, name: string): Promise<Tag[]> {
  return request<Tag[]>(`/prompts/${namespace}/${name}/tags`);
}

export function listBranches(namespace: string, name: string): Promise<Branch[]> {
  return request<Branch[]>(`/prompts/${namespace}/${name}/branches`);
}

// ------------------------------------------------------------------ //
// Stars                                                                //
// ------------------------------------------------------------------ //

export function starPrompt(namespace: string, name: string): Promise<Star> {
  return request<Star>(`/prompts/${namespace}/${name}/star`, { method: "POST" });
}

export function unstarPrompt(namespace: string, name: string): Promise<void> {
  return request<void>(`/prompts/${namespace}/${name}/star`, { method: "DELETE" });
}

export function listStargazers(namespace: string, name: string): Promise<Star[]> {
  return request<Star[]>(`/prompts/${namespace}/${name}/stargazers`);
}

// ------------------------------------------------------------------ //
// Comments                                                             //
// ------------------------------------------------------------------ //

export function listComments(
  namespace: string,
  name: string,
  version_sha?: string
): Promise<Comment[]> {
  const qs = version_sha ? `?version_sha=${version_sha}` : "";
  return request<Comment[]>(`/prompts/${namespace}/${name}/comments${qs}`);
}

export function addComment(
  namespace: string,
  name: string,
  body: string,
  version_sha?: string
): Promise<Comment> {
  return request<Comment>(`/prompts/${namespace}/${name}/comments`, {
    method: "POST",
    body: JSON.stringify({ body, version_sha }),
  });
}

export function deleteComment(namespace: string, name: string, id: string): Promise<void> {
  return request<void>(`/prompts/${namespace}/${name}/comments/${id}`, { method: "DELETE" });
}

// ------------------------------------------------------------------ //
// Collections                                                          //
// ------------------------------------------------------------------ //

export function listCollections(namespace?: string): Promise<Collection[]> {
  const qs = namespace ? `?namespace=${namespace}` : "";
  return request<Collection[]>(`/collections${qs}`);
}

export function getCollection(namespace: string, name: string): Promise<CollectionDetail> {
  return request<CollectionDetail>(`/collections/${namespace}/${name}`);
}
