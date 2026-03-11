import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { PatientRecord } from "../backend.d";

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Wait up to ~5 s for the actor to become available, polling every 500 ms. */
async function waitForActor(
  getActor: () => ReturnType<typeof useActor>["actor"],
  retries = 10,
  delayMs = 500
): Promise<NonNullable<ReturnType<typeof useActor>["actor"]>> {
  for (let i = 0; i < retries; i++) {
    const a = getActor();
    if (a) return a;
    await new Promise((res) => setTimeout(res, delayMs));
  }
  throw new Error("Connection timeout. Please refresh and try again.");
}

export function useHospitalLogin() {
  const { actor } = useActor();
  // Keep a ref-like closure so the polling helper always sees the latest actor
  const actorRef = { current: actor };
  actorRef.current = actor;

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const resolvedActor = actorRef.current
        ? actorRef.current
        : await waitForActor(() => actorRef.current);
      return resolvedActor.hospitalLogin(username, password);
    },
  });
}

export function usePatientLogin() {
  const { actor } = useActor();
  const actorRef = { current: actor };
  actorRef.current = actor;

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const resolvedActor = actorRef.current
        ? actorRef.current
        : await waitForActor(() => actorRef.current);
      return resolvedActor.patientLogin(username, password);
    },
  });
}

// ─── Records ──────────────────────────────────────────────────────────────────

export function useAllPatientRecords(enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allPatientRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPatientRecords();
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 30_000,
  });
}

export function usePatientRecord(recordId: bigint | null, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["patientRecord", recordId?.toString()],
    queryFn: async () => {
      if (!actor || recordId === null) return null;
      return actor.getPatientRecord(recordId);
    },
    enabled: !!actor && !isFetching && enabled && recordId !== null,
    staleTime: 30_000,
  });
}

export function useCreatePatientRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      patientRecord,
      patientUsername,
      patientPassword,
    }: {
      patientRecord: PatientRecord;
      patientUsername: string;
      patientPassword: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPatientRecord(
        patientRecord,
        patientUsername,
        patientPassword
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPatientRecords"] });
    },
  });
}

export function useUpdatePatientRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recordId,
      updatedRecord,
    }: {
      recordId: bigint;
      updatedRecord: PatientRecord;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePatientRecord(recordId, updatedRecord);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allPatientRecords"] });
      queryClient.invalidateQueries({
        queryKey: ["patientRecord", variables.recordId.toString()],
      });
    },
  });
}

export function useDeletePatientRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recordId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePatientRecord(recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPatientRecords"] });
    },
  });
}

export function useChangePatientCredentials() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      recordId,
      newUsername,
      newPassword,
    }: {
      recordId: bigint;
      newUsername: string;
      newPassword: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.changePatientCredentials(recordId, newUsername, newPassword);
    },
  });
}

export function useCreateDefaultAdmin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createDefaultAdmin();
    },
  });
}
