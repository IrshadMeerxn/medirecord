// Free backend implementation using REST API

export interface PatientRecord {
  patientName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  allergies: string;
  notes: string;
  doctorName: string;
  recordDate: bigint;
}

export type AuthResult = {
  __kind__: "ok";
  ok: {
    role: string;
    doctorName: string;
  };
} | {
  __kind__: "err";
  err: string;
};

export type PatientAuthResult = {
  __kind__: "ok";
  ok: {
    role: string;
    recordId: bigint;
  };
} | {
  __kind__: "err";
  err: string;
};

export interface backendInterface {
  addDoctor(username: string, password: string): Promise<boolean>;
  changePatientCredentials(recordId: bigint, newUsername: string, newPassword: string): Promise<boolean>;
  createDefaultAdmin(): Promise<void>;
  createPatientRecord(patientRecord: PatientRecord, patientUsername: string, patientPassword: string): Promise<bigint>;
  deletePatientRecord(recordId: bigint): Promise<boolean>;
  getAllPatientRecords(): Promise<Array<{
    recordId: bigint;
    record: PatientRecord;
  }>>;
  getPatientRecord(recordId: bigint): Promise<PatientRecord | null>;
  hospitalLogin(username: string, password: string): Promise<AuthResult>;
  patientLogin(username: string, password: string): Promise<PatientAuthResult>;
  updatePatientRecord(recordId: bigint, updatedRecord: PatientRecord): Promise<boolean>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Custom JSON stringifier that handles BigInt
function stringifyWithBigInt(obj: any): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

export class Backend implements backendInterface {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Handle BigInt serialization in request body
    let body = options?.body;
    if (body && typeof body === 'string') {
      try {
        const parsed = JSON.parse(body);
        body = stringifyWithBigInt(parsed);
      } catch {
        // If parsing fails, use original body
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async hospitalLogin(username: string, password: string): Promise<AuthResult> {
    return this.request<AuthResult>('/hospital-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async patientLogin(username: string, password: string): Promise<PatientAuthResult> {
    return this.request<PatientAuthResult>('/patient-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async createPatientRecord(
    patientRecord: PatientRecord,
    patientUsername: string,
    patientPassword: string
  ): Promise<bigint> {
    // Convert BigInt to string for JSON serialization
    const recordToSend = {
      ...patientRecord,
      recordDate: patientRecord.recordDate.toString()
    };
    
    const id = await this.request<number>('/patient-records', {
      method: 'POST',
      body: JSON.stringify({ 
        patientRecord: recordToSend, 
        patientUsername, 
        patientPassword 
      }),
    });
    return BigInt(id);
  }

  async getAllPatientRecords(): Promise<Array<{ recordId: bigint; record: PatientRecord }>> {
    return this.request<Array<{ recordId: bigint; record: PatientRecord }>>('/patient-records');
  }

  async getPatientRecord(recordId: bigint): Promise<PatientRecord | null> {
    return this.request<PatientRecord | null>(`/patient-records/${recordId}`);
  }

  async updatePatientRecord(recordId: bigint, updatedRecord: PatientRecord): Promise<boolean> {
    return this.request<boolean>(`/patient-records/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify({ updatedRecord }),
    });
  }

  async deletePatientRecord(recordId: bigint): Promise<boolean> {
    return this.request<boolean>(`/patient-records/${recordId}`, {
      method: 'DELETE',
    });
  }

  async changePatientCredentials(
    recordId: bigint,
    newUsername: string,
    newPassword: string
  ): Promise<boolean> {
    return this.request<boolean>(`/patient-credentials/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify({ newUsername, newPassword }),
    });
  }

  async addDoctor(username: string, password: string): Promise<boolean> {
    return this.request<boolean>('/doctors', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async createDefaultAdmin(): Promise<void> {
    // Admin is created automatically on server startup
    return Promise.resolve();
  }
}

export function createActor(): Backend {
  return new Backend();
}

export interface CreateActorOptions {}

export function createActorWithConfig(options?: CreateActorOptions): Promise<backendInterface> {
  return Promise.resolve(new Backend());
}
