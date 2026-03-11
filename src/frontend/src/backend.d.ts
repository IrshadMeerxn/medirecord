import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface PatientRecord {
    bloodType: string;
    dateOfBirth: string;
    treatment: string;
    recordDate: bigint;
    diagnosis: string;
    medications: string;
    gender: string;
    notes: string;
    patientName: string;
    doctorName: string;
    allergies: string;
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
