// src/services/queries/splits.js
// TanStack Query hooks and mutations for splits

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSplitsEndpoint,
  getSplitByIdEndpoint,
  createSplitEndpoint,
} from "../endpoints/splits";

/**
 * Get all splits query using TanStack Query
 * 
 * @param {Object} options - Query options (enabled, etc.)
 * @returns {Object} Query object with data, isLoading, error, etc.
 */
export const useSplitsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["splits"],
    queryFn: async () => {
      const response = await getSplitsEndpoint();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
};

/**
 * Get split by ID query using TanStack Query
 * 
 * @param {string|number} id - Split ID
 * @param {Object} options - Query options (enabled, etc.)
 */
export const useSplitByIdQuery = (id, options = {}) => {
  return useQuery({
    queryKey: ["splits", id],
    queryFn: () => getSplitByIdEndpoint(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
};

/**
 * Create split mutation using TanStack Query
 * 
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, data, etc.
 */
export const useCreateSplitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (splitData) => {
      const response = await createSplitEndpoint(splitData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch splits list
      queryClient.invalidateQueries({ queryKey: ["splits"] });
    },
    onError: (error) => {
      console.error("Create split error:", error);
    },
  });
};

