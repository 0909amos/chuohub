import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Note,
  PastPaper,
  Quiz,
  QuizAttempt,
  Task,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export type { Note, PastPaper, Quiz, Task, UserProfile, QuizAttempt };

export function useAllNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePastPapersBySubject(subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<PastPaper[]>({
    queryKey: ["papers", subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPastPapersBySubject(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useAllQuizzes() {
  const { actor, isFetching } = useActor();
  return useQuery<Quiz[]>({
    queryKey: ["quizzes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuizzes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTasks() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      return actor.getTasks(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useQuizAttempts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<QuizAttempt[]>({
    queryKey: ["quiz-attempts"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      return actor.getUserQuizAttempts(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      dueDate: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addTask(data.title, data.description, data.dueDate);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      taskId: string;
      title: string;
      description: string;
      dueDate: string;
      isDone: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTask(
        data.taskId,
        data.title,
        data.description,
        data.dueDate,
        data.isDone,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useRecordQuizAttempt() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      quizId: string;
      score: number;
      total: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.recordQuizAttempt(
        data.quizId,
        BigInt(data.score),
        BigInt(data.total),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quiz-attempts"] }),
  });
}

export function usePostQuestion() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      body: string;
      subject: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.postQuestion(data.title, data.body, data.subject);
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const items = [
        {
          productName: "ChuoHub Premium",
          priceInCents: BigInt(500),
          quantity: BigInt(1),
          currency: "USD",
          productDescription: "Unlimited access to all premium content",
        },
      ];
      const origin = window.location.origin;
      return actor.createCheckoutSession(
        items,
        `${origin}/home`,
        `${origin}/profile`,
      );
    },
  });
}
