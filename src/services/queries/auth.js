// src/services/queries/auth.js
// TanStack Query hooks and mutations for authentication

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginEndpoint, registerEndpoint, getUserInfoEndpoint } from "../endpoints/auth";

/**
 * Login mutation using TanStack Query
 * 
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, data, etc.
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await loginEndpoint(credentials);
      return response;
    },
    onSuccess: (data) => {
      // Invalidate and refetch any queries that depend on auth state
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["auth", "user"], data.user);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

/**
 * Register mutation using TanStack Query
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await registerEndpoint(userData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
};

/**
 * Get user info query using TanStack Query
 * 
 * @param {string} token - Authentication token
 * @param {Object} options - Query options (enabled, etc.)
 */
export const useUserInfoQuery = (token, options = {}) => {
  return useQuery({
    queryKey: ["user", "info"],
    queryFn: () => getUserInfoEndpoint(token),
    enabled: !!token && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
};

