export interface Prompt {
  id: string;
  namespace: string;
  name: string;
  description: string;
  tags: string[];
  model_hints: string[];
  license: string;
  visibility: "public" | "private" | "unlisted" | "team";
  variables: VariableSchema[];
  star_count: number;
  fork_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
}

export interface VariableSchema {
  name: string;
  type: string;
  description: string;
  default: unknown;
  required: boolean;
}

export interface Version {
  sha: string;
  prompt_id: string;
  branch: string;
  parent_sha: string | null;
  message: string;
  author: string;
  content: string;
  variables: VariableSchema[];
  created_at: string;
  tags: string[];
}

export interface Branch {
  name: string;
  prompt_id: string;
  head_sha: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  name: string;
  prompt_id: string;
  sha: string;
  created_at: string;
}

export interface Star {
  id: string;
  namespace: string;
  prompt_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  prompt_id: string;
  version_sha: string | null;
  author: string;
  body: string;
  created_at: string;
}

export interface Collection {
  id: string;
  namespace: string;
  name: string;
  description: string;
  created_at: string;
}

export interface CollectionDetail extends Collection {
  items: Prompt[];
}
