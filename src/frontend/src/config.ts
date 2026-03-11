import {
  createActorWithConfig as createBackendActor,
  type backendInterface,
  type CreateActorOptions,
} from "./backend";

export async function createActorWithConfig(
  options?: CreateActorOptions,
): Promise<backendInterface> {
  return createBackendActor(options);
}
