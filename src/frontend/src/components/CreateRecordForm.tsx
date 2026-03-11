import { useState } from "react";
import {
  HeartPulse,
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  Copy,
  User,
  Stethoscope,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePatientRecord } from "../hooks/useQueries";
import type { PatientRecord } from "../backend.d";
import { toast } from "sonner";

interface CreateRecordFormProps {
  doctorName: string;
  onBack: () => void;
  onSuccess: (recordId: bigint) => void;
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "oklch(0.28 0.08 255 / 0.1)" }}
      >
        <Icon className="w-4 h-4" style={{ color: "oklch(0.28 0.08 255)" }} />
      </div>
      <div>
        <h3
          className="text-sm font-semibold"
          style={{ color: "oklch(0.18 0.04 255)" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 255)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

interface SuccessBannerProps {
  recordId: bigint;
  patientUsername: string;
  patientPassword: string;
  onViewRecord: () => void;
  onCreateAnother: () => void;
}

function SuccessBanner({
  recordId,
  patientUsername,
  patientPassword,
  onViewRecord,
  onCreateAnother,
}: SuccessBannerProps) {
  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`));
  };

  return (
    <div
      className="rounded-2xl p-8 animate-fade-slide-up"
      style={{
        background: "oklch(0.92 0.06 155 / 0.15)",
        border: "1px solid oklch(0.65 0.15 155 / 0.3)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "oklch(0.65 0.15 155 / 0.15)" }}
        >
          <CheckCircle2
            className="w-6 h-6"
            style={{ color: "oklch(0.5 0.15 155)" }}
          />
        </div>
        <div>
          <h3
            className="text-lg font-bold"
            style={{ color: "oklch(0.3 0.1 155)" }}
          >
            Record Created Successfully
          </h3>
          <p className="text-sm" style={{ color: "oklch(0.45 0.08 155)" }}>
            Patient credentials have been set
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{
            background: "oklch(1 0 0 / 0.5)",
            border: "1px solid oklch(0.65 0.15 155 / 0.2)",
          }}
        >
          <div>
            <p className="data-label mb-0.5">Record ID</p>
            <p
              className="text-sm font-bold font-mono"
              style={{ color: "oklch(0.28 0.08 255)" }}
            >
              #{recordId.toString()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => copy(recordId.toString(), "Record ID")}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: "oklch(1 0 0 / 0.5)",
              border: "1px solid oklch(0.65 0.15 155 / 0.2)",
            }}
          >
            <div>
              <p className="data-label mb-0.5">Username</p>
              <p
                className="text-sm font-semibold font-mono"
                style={{ color: "oklch(0.28 0.08 255)" }}
              >
                {patientUsername}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copy(patientUsername, "Username")}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: "oklch(1 0 0 / 0.5)",
              border: "1px solid oklch(0.65 0.15 155 / 0.2)",
            }}
          >
            <div>
              <p className="data-label mb-0.5">Password</p>
              <p
                className="text-sm font-semibold font-mono"
                style={{ color: "oklch(0.28 0.08 255)" }}
              >
                {patientPassword}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copy(patientPassword, "Password")}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onViewRecord}
          className="flex-1 text-sm font-semibold"
          style={{ background: "oklch(0.28 0.08 255)", color: "white" }}
        >
          View Patient Record
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCreateAnother}
          className="flex-1 text-sm"
        >
          Create Another
        </Button>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        className="text-xs font-medium tracking-wide uppercase"
        style={{ color: "oklch(0.5 0.04 255)" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "oklch(0.57 0.24 27)" }}>
            *
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}

export default function CreateRecordForm({
  doctorName,
  onBack,
  onSuccess,
}: CreateRecordFormProps) {
  const [form, setForm] = useState({
    patientName: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    allergies: "",
    notes: "",
    doctorName: doctorName,
    patientUsername: "",
    patientPassword: "",
  });

  const [createdRecordId, setCreatedRecordId] = useState<bigint | null>(null);
  const [createdCreds, setCreatedCreds] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const createRecord = useCreatePatientRecord();

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const patientRecord: PatientRecord = {
      patientName: form.patientName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      bloodType: form.bloodType,
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      medications: form.medications,
      allergies: form.allergies,
      notes: form.notes,
      doctorName: form.doctorName,
      recordDate: BigInt(Date.now()),
    };

    try {
      const recordId = await createRecord.mutateAsync({
        patientRecord,
        patientUsername: form.patientUsername,
        patientPassword: form.patientPassword,
      });
      setCreatedRecordId(recordId);
      setCreatedCreds({
        username: form.patientUsername,
        password: form.patientPassword,
      });
      toast.success("Patient record created!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create record");
    }
  };

  const inputStyle = {
    background: "oklch(1 0 0)",
    border: "1px solid oklch(0.88 0.02 240)",
    color: "oklch(0.18 0.04 255)",
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.97 0.005 240)" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between"
        style={{
          background: "oklch(0.22 0.07 258)",
          borderBottom: "1px solid oklch(1 0 0 / 0.08)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.55 0.12 195)" }}
          >
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-base font-bold tracking-tight"
            style={{ color: "oklch(0.97 0.005 240)" }}
          >
            MediRecord
          </span>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
          style={{ color: "oklch(0.65 0.04 255)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-7">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "oklch(0.18 0.04 255)" }}
          >
            Create Patient Record
          </h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.5 0.04 255)" }}>
            Fill in the patient details and set login credentials
          </p>
        </div>

        {createdRecordId !== null && createdCreds !== null ? (
          <SuccessBanner
            recordId={createdRecordId}
            patientUsername={createdCreds.username}
            patientPassword={createdCreds.password}
            onViewRecord={() => onSuccess(createdRecordId)}
            onCreateAnother={() => {
              setCreatedRecordId(null);
              setCreatedCreds(null);
              setForm({
                patientName: "",
                dateOfBirth: "",
                gender: "",
                bloodType: "",
                diagnosis: "",
                treatment: "",
                medications: "",
                allergies: "",
                notes: "",
                doctorName: doctorName,
                patientUsername: "",
                patientPassword: "",
              });
            }}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Patient Information */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.88 0.02 240)",
              }}
            >
              <SectionHeader
                icon={User}
                title="Patient Information"
                subtitle="Basic patient demographics"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormField label="Full Name" required>
                    <Input
                      value={form.patientName}
                      onChange={(e) => update("patientName", e.target.value)}
                      placeholder="Patient's full name"
                      required
                      style={inputStyle}
                    />
                  </FormField>
                </div>
                <FormField label="Date of Birth" required>
                  <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => update("dateOfBirth", e.target.value)}
                    required
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="Gender" required>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => update("gender", v)}
                  >
                    <SelectTrigger style={inputStyle}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Blood Type">
                  <Select
                    value={form.bloodType}
                    onValueChange={(v) => update("bloodType", v)}
                  >
                    <SelectTrigger style={inputStyle}>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                        <SelectItem key={bt} value={bt}>
                          {bt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Section 2: Medical Details */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.88 0.02 240)",
              }}
            >
              <SectionHeader
                icon={Stethoscope}
                title="Medical Details"
                subtitle="Clinical information and treatment plan"
              />
              <div className="space-y-4">
                <FormField label="Diagnosis" required>
                  <Input
                    value={form.diagnosis}
                    onChange={(e) => update("diagnosis", e.target.value)}
                    placeholder="Primary diagnosis"
                    required
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="Treatment Plan">
                  <Textarea
                    value={form.treatment}
                    onChange={(e) => update("treatment", e.target.value)}
                    placeholder="Describe the treatment plan..."
                    rows={3}
                    style={inputStyle}
                  />
                </FormField>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Medications">
                    <Textarea
                      value={form.medications}
                      onChange={(e) => update("medications", e.target.value)}
                      placeholder="List medications..."
                      rows={3}
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField label="Allergies">
                    <Textarea
                      value={form.allergies}
                      onChange={(e) => update("allergies", e.target.value)}
                      placeholder="Known allergies..."
                      rows={3}
                      style={inputStyle}
                    />
                  </FormField>
                </div>
                <FormField label="Doctor's Notes">
                  <Textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Additional clinical notes..."
                    rows={4}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="Doctor Name" required>
                  <Input
                    value={form.doctorName}
                    onChange={(e) => update("doctorName", e.target.value)}
                    placeholder="Attending doctor's name"
                    required
                    style={inputStyle}
                  />
                </FormField>
              </div>
            </div>

            {/* Section 3: Patient Login Credentials */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "oklch(0.97 0.03 255 / 0.5)",
                border: "1px solid oklch(0.55 0.12 195 / 0.2)",
              }}
            >
              <SectionHeader
                icon={KeyRound}
                title="Patient Login Credentials"
                subtitle="Set the username and password for the patient's login"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Username" required>
                  <Input
                    value={form.patientUsername}
                    onChange={(e) => update("patientUsername", e.target.value)}
                    placeholder="Choose a username"
                    required
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="Password" required>
                  <Input
                    type="text"
                    value={form.patientPassword}
                    onChange={(e) => update("patientPassword", e.target.value)}
                    placeholder="Choose a password"
                    required
                    style={inputStyle}
                  />
                </FormField>
              </div>
              <p
                className="text-xs mt-3"
                style={{ color: "oklch(0.5 0.04 255)" }}
              >
                Share these credentials with the patient so they can access their records.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pb-8">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="shrink-0"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRecord.isPending}
                className="flex-1 gap-2 font-semibold"
                style={{
                  background: "oklch(0.28 0.08 255)",
                  color: "oklch(0.97 0.005 240)",
                }}
              >
                {createRecord.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Record...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Record & Set Patient Login
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
