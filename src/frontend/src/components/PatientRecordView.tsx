import { useState, useEffect, useRef } from "react";
import {
  HeartPulse,
  ArrowLeft,
  Edit2,
  Trash2,
  KeyRound,
  Loader2,
  Calendar,
  User,
  Stethoscope,
  AlertTriangle,
  FileText,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePatientRecord,
  useUpdatePatientRecord,
  useDeletePatientRecord,
  useChangePatientCredentials,
} from "../hooks/useQueries";
import type { PatientRecord } from "../backend.d";
import { toast } from "sonner";

declare global {
  interface Window {
    QRCode: {
      new (el: HTMLElement, opts: object): void;
    };
  }
}

interface PatientRecordViewProps {
  recordId: bigint;
  isHospitalView: boolean;
  onBack: () => void;
  onDeleted?: () => void;
}

function QRCodeSection({ recordId }: { recordId: bigint }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const value = `${window.location.origin}/?record=${recordId.toString()}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const doRender = (c: HTMLDivElement, v: string) => {
      c.innerHTML = "";
      if (window.QRCode) {
        const qrDiv = document.createElement("div");
        c.appendChild(qrDiv);
        new window.QRCode(qrDiv, {
          text: v,
          width: 140,
          height: 140,
          colorDark: "#1a2a4a",
          colorLight: "#ffffff",
          correctLevel: 2,
        });
      } else {
        c.innerHTML = `<div style="width:140px;height:140px;background:#e8f4f8;display:flex;align-items:center;justify-content:center;border-radius:8px;"><span style="font-size:9px;color:#6b8aaa;text-align:center;padding:8px;font-family:monospace;">${v}</span></div>`;
      }
    };

    if (!document.querySelector('script[data-qr="1"]')) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.setAttribute("data-qr", "1");
      script.onload = () => doRender(container, value);
      document.head.appendChild(script);
    } else if (window.QRCode) {
      doRender(container, value);
    } else {
      const interval = setInterval(() => {
        if (window.QRCode) {
          clearInterval(interval);
          doRender(container, value);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [value]);

  return (
    <div
      className="flex flex-col items-center py-8 px-6 rounded-2xl mb-6"
      style={{
        background: "oklch(0.28 0.08 255)",
        border: "1px solid oklch(0.38 0.1 255)",
      }}
    >
      <div
        className="text-xs font-medium tracking-widest uppercase mb-4"
        style={{ color: "oklch(0.62 0.14 192)" }}
      >
        Patient QR Code
      </div>
      <div
        className="p-3 rounded-xl mb-4"
        style={{ background: "oklch(1 0 0)" }}
      >
        <div ref={containerRef} style={{ width: 140, height: 140 }} />
      </div>
      <p
        className="text-xs font-mono text-center"
        style={{ color: "oklch(0.65 0.04 255)" }}
      >
        Record #{recordId.toString()}
      </p>
      <p
        className="text-xs mt-2 text-center"
        style={{ color: "oklch(0.5 0.04 255)" }}
      >
        Scan to view patient record
      </p>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="data-label mb-1">{label}</p>
      <p
        className={`text-sm ${mono ? "font-mono" : "font-medium"}`}
        style={{ color: "oklch(0.22 0.05 255)" }}
      >
        {value || <span style={{ color: "oklch(0.7 0.02 255)" }}>—</span>}
      </p>
    </div>
  );
}

function formatDate(timestamp: bigint): string {
  try {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function PatientRecordView({
  recordId,
  isHospitalView,
  onBack,
  onDeleted,
}: PatientRecordViewProps) {
  const { data: record, isLoading } = usePatientRecord(recordId, true);
  const updateRecord = useUpdatePatientRecord();
  const deleteRecord = useDeletePatientRecord();
  const changeCredentials = useChangePatientCredentials();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCredDialog, setShowCredDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editForm, setEditForm] = useState<Partial<PatientRecord>>({});

  const startEditing = () => {
    if (!record) return;
    setEditForm({ ...record });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const updateField = (field: keyof PatientRecord, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!record || !editForm) return;
    const updated: PatientRecord = {
      ...record,
      ...editForm,
    };
    try {
      await updateRecord.mutateAsync({ recordId, updatedRecord: updated });
      setIsEditing(false);
      toast.success("Record updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update record");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecord.mutateAsync(recordId);
      toast.success("Record deleted");
      onDeleted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete record");
    }
  };

  const handleChangeCreds = async () => {
    try {
      await changeCredentials.mutateAsync({
        recordId,
        newUsername: newUsername.trim(),
        newPassword,
      });
      setShowCredDialog(false);
      setNewUsername("");
      setNewPassword("");
      toast.success("Patient credentials updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update credentials");
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
        className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between gap-4"
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

        <div className="flex items-center gap-2">
          {isHospitalView && !isEditing && record && (
            <>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={startEditing}
                className="gap-1.5 text-xs"
                style={{ color: "oklch(0.75 0.03 255)" }}
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowCredDialog(true)}
                className="gap-1.5 text-xs"
                style={{ color: "oklch(0.75 0.03 255)" }}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Credentials
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-1.5 text-xs"
                style={{ color: "oklch(0.65 0.18 25)" }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </>
          )}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity ml-2"
            style={{ color: "oklch(0.65 0.04 255)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : !record ? (
          <div className="text-center py-20">
            <FileText
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: "oklch(0.7 0.03 255)" }}
            />
            <p className="text-lg font-semibold" style={{ color: "oklch(0.35 0.04 255)" }}>
              Record not found
            </p>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            {/* QR Code */}
            <QRCodeSection recordId={recordId} />

            {/* Record ID header */}
            <div className="flex items-center justify-between">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-mono font-medium"
                style={{
                  background: "oklch(0.94 0.04 195)",
                  color: "oklch(0.32 0.1 195)",
                  border: "1px solid oklch(0.78 0.08 195)",
                }}
              >
                Record #{recordId.toString()}
              </span>
              <Badge
                className="text-xs"
                style={{
                  background: "oklch(0.9 0.06 155)",
                  color: "oklch(0.3 0.1 155)",
                }}
              >
                {record.gender}
              </Badge>
            </div>

            {isEditing ? (
              /* Edit Mode */
              <div className="space-y-5">
                {/* Edit: Personal Info */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.02 240)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4" style={{ color: "oklch(0.28 0.08 255)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "oklch(0.18 0.04 255)" }}>
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Full Name</Label>
                      <Input
                        value={editForm.patientName ?? ""}
                        onChange={(e) => updateField("patientName", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Date of Birth</Label>
                      <Input
                        type="date"
                        value={editForm.dateOfBirth ?? ""}
                        onChange={(e) => updateField("dateOfBirth", e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Gender</Label>
                      <Select value={editForm.gender ?? ""} onValueChange={(v) => updateField("gender", v)}>
                        <SelectTrigger style={inputStyle}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Blood Type</Label>
                      <Select value={editForm.bloodType ?? ""} onValueChange={(v) => updateField("bloodType", v)}>
                        <SelectTrigger style={inputStyle}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                            <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Edit: Medical */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.02 240)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope className="w-4 h-4" style={{ color: "oklch(0.28 0.08 255)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "oklch(0.18 0.04 255)" }}>
                      Medical Details
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Diagnosis</Label>
                      <Input value={editForm.diagnosis ?? ""} onChange={(e) => updateField("diagnosis", e.target.value)} style={inputStyle} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Treatment</Label>
                      <Textarea value={editForm.treatment ?? ""} onChange={(e) => updateField("treatment", e.target.value)} rows={3} style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Medications</Label>
                        <Textarea value={editForm.medications ?? ""} onChange={(e) => updateField("medications", e.target.value)} rows={3} style={inputStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Allergies</Label>
                        <Textarea value={editForm.allergies ?? ""} onChange={(e) => updateField("allergies", e.target.value)} rows={3} style={inputStyle} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Notes</Label>
                      <Textarea value={editForm.notes ?? ""} onChange={(e) => updateField("notes", e.target.value)} rows={4} style={inputStyle} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>Doctor Name</Label>
                      <Input value={editForm.doctorName ?? ""} onChange={(e) => updateField("doctorName", e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Edit actions */}
                <div className="flex gap-3 pb-8">
                  <Button type="button" variant="outline" onClick={cancelEditing} className="gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={updateRecord.isPending}
                    className="flex-1 gap-2 font-semibold"
                    style={{ background: "oklch(0.28 0.08 255)", color: "white" }}
                  >
                    {updateRecord.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {updateRecord.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-5">
                {/* Personal Info */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.02 240)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <User className="w-4 h-4" style={{ color: "oklch(0.28 0.08 255)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "oklch(0.18 0.04 255)" }}>
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                      <InfoBlock label="Full Name" value={record.patientName} />
                    </div>
                    <InfoBlock label="Date of Birth" value={record.dateOfBirth} />
                    <InfoBlock label="Gender" value={record.gender} />
                    <InfoBlock label="Blood Type" value={record.bloodType} mono />
                  </div>
                </div>

                {/* Medical Details */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.02 240)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <Stethoscope className="w-4 h-4" style={{ color: "oklch(0.28 0.08 255)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "oklch(0.18 0.04 255)" }}>
                      Medical Details
                    </h3>
                  </div>
                  <div className="space-y-5">
                    <InfoBlock label="Diagnosis" value={record.diagnosis} />
                    <InfoBlock label="Treatment Plan" value={record.treatment} />
                    <div className="grid grid-cols-2 gap-5">
                      <InfoBlock label="Medications" value={record.medications} />
                      <InfoBlock label="Allergies" value={record.allergies} />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {record.notes && (
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.02 240)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4" style={{ color: "oklch(0.28 0.08 255)" }} />
                      <h3 className="text-sm font-semibold" style={{ color: "oklch(0.18 0.04 255)" }}>
                        Doctor's Notes
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.3 0.04 255)" }}>
                      {record.notes}
                    </p>
                  </div>
                )}

                {/* Record Info */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "oklch(0.97 0.01 240)",
                    border: "1px solid oklch(0.88 0.02 240)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4" style={{ color: "oklch(0.5 0.04 255)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "oklch(0.4 0.04 255)" }}>
                      Record Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoBlock label="Attending Physician" value={`Dr. ${record.doctorName}`} />
                    <InfoBlock label="Record Date" value={formatDate(record.recordDate)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: "oklch(0.65 0.18 25)" }} />
              Delete Patient Record
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this patient record? This action cannot be undone.
              The patient will also lose access to their login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="gap-2"
              style={{ background: "oklch(0.57 0.24 27)", color: "white" }}
            >
              {deleteRecord.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change credentials dialog */}
      <Dialog open={showCredDialog} onOpenChange={setShowCredDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" style={{ color: "oklch(0.28 0.08 255)" }} />
              Change Patient Credentials
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>
                New Username
              </Label>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide" style={{ color: "oklch(0.5 0.04 255)" }}>
                New Password
              </Label>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCredDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleChangeCreds}
              disabled={!newUsername || !newPassword || changeCredentials.isPending}
              style={{ background: "oklch(0.28 0.08 255)", color: "white" }}
            >
              {changeCredentials.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Update Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs" style={{ color: "oklch(0.7 0.02 255)" }}>
          © 2026. Built with{" "}
          <span style={{ color: "oklch(0.65 0.18 25)" }}>♥</span> using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.5 0.1 195)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
