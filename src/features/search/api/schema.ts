import { z } from "zod";

/**
 * GitHub's hard limit: the Search API only returns the first 1,000 results
 * for any query, no matter what `total_count` says.
 */
export const GITHUB_SEARCH_RESULT_CAP = 1000;

const ownerSchema = z.object({
  login: z.string(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
});

export const repositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  updated_at: z.string(),
  owner: ownerSchema,
});

export const searchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(repositorySchema),
});

export type Repository = z.infer<typeof repositorySchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;