import { useState } from "react";
import {
  HeartPulse,
  LogOut,
  Plus,
  Search,
  User,
  Calendar,
  Stethoscope,
  ChevronRight,
  Loader2,
  FileX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllPatientRecords } from "../hooks/useQueries";

interface HospitalDashboardProps {
  doctorName: string;
  onLogout: () => void;
  onCreateRecord: () => void;
  onViewRecord: (recordId: bigint) => void;
}

function formatDate(timestamp: bigint): string {
  try {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function HospitalDashboard({
  doctorName,
  onLogout,
  onCreateRecord,
  onViewRecord,
}: HospitalDashboardProps) {
  const [search, setSearch] = useState("");
  const { data: records, isLoading } = useAllPatientRecords(true);

  const filtered = (records ?? []).filter((r) => {
    const q = search.toLowerCase();
    return (
      r.record.patientName.toLowerCase().includes(q) ||
      r.record.diagnosis.toLowerCase().includes(q) ||
      r.record.doctorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.97 0.005 240)" }}>
      {/* Top Nav */}
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

        <div className="flex items-center gap-4">
          <div
            className="hidden md:flex items-center gap-2 text-sm"
            style={{ color: "oklch(0.65 0.04 255)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: "oklch(0.55 0.12 195 / 0.2)",
                color: "oklch(0.78 0.1 192)",
              }}
            >
              {doctorName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium" style={{ color: "oklch(0.82 0.03 255)" }}>
              Dr. {doctorName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-2 text-xs"
            style={{ color: "oklch(0.6 0.04 255)" }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "oklch(0.18 0.04 255)" }}
            >
              Patient Records
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "oklch(0.5 0.04 255)" }}>
              {isLoading
                ? "Loading records..."
                : `${filtered.length} record${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <Button
            onClick={onCreateRecord}
            className="gap-2 text-sm font-semibold h-10 px-5"
            style={{
              background: "oklch(0.28 0.08 255)",
              color: "oklch(0.97 0.005 240)",
            }}
          >
            <Plus className="w-4 h-4" />
            Create New Record
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "oklch(0.6 0.04 255)" }}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, diagnosis, or doctor..."
            className="pl-9 h-11 text-sm"
            style={{
              background: "oklch(1 0 0)",
              border: "1px solid oklch(0.88 0.02 240)",
            }}
          />
        </div>

        {/* Records list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => `skel-${i}`).map((key) => (
              <Skeleton key={key} className="h-20 rounded-xl w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{
              background: "oklch(1 0 0)",
              border: "1px solid oklch(0.88 0.02 240)",
            }}
          >
            <FileX
              className="w-12 h-12 mb-3"
              style={{ color: "oklch(0.8 0.03 255)" }}
            />
            <h3
              className="text-base font-semibold mb-1"
              style={{ color: "oklch(0.35 0.04 255)" }}
            >
              {search ? "No matching records" : "No patient records yet"}
            </h3>
            <p className="text-sm mb-5" style={{ color: "oklch(0.55 0.03 255)" }}>
              {search
                ? "Try a different search term"
                : "Create the first patient record to get started"}
            </p>
            {!search && (
              <Button
                onClick={onCreateRecord}
                size="sm"
                className="gap-2"
                style={{ background: "oklch(0.28 0.08 255)", color: "white" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Create First Record
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(({ recordId, record }) => (
              <button
                key={recordId.toString()}
                type="button"
                onClick={() => onViewRecord(recordId)}
                className="w-full text-left rounded-xl px-5 py-4 transition-all duration-200 hover:shadow-md group"
                style={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.88 0.02 240)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid oklch(0.55 0.12 195 / 0.35)";
                  e.currentTarget.style.background = "oklch(0.97 0.01 200)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid oklch(0.88 0.02 240)";
                  e.currentTarget.style.background = "oklch(1 0 0)";
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-semibold text-sm"
                    style={{
                      background: "oklch(0.28 0.08 255 / 0.1)",
                      color: "oklch(0.28 0.08 255)",
                    }}
                  >
                    {record.patientName.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: "oklch(0.18 0.04 255)" }}
                      >
                        {record.patientName}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono"
                        style={{
                          background: "oklch(0.94 0.04 195)",
                          color: "oklch(0.32 0.1 195)",
                          border: "1px solid oklch(0.78 0.08 195)",
                        }}
                      >
                        #{recordId.toString()}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4 mt-1 text-xs flex-wrap"
                      style={{ color: "oklch(0.55 0.03 255)" }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        DOB: {record.dateOfBirth}
                      </span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        {record.diagnosis || "No diagnosis"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Dr. {record.doctorName}
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p
                        className="text-xs font-medium"
                        style={{ color: "oklch(0.4 0.04 255)" }}
                      >
                        {formatDate(record.recordDate)}
                      </p>
                      <Badge
                        className="mt-0.5 text-xs"
                        style={{
                          background: "oklch(0.9 0.06 155)",
                          color: "oklch(0.3 0.1 155)",
                        }}
                      >
                        {record.gender}
                      </Badge>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: "oklch(0.7 0.04 255)" }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

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
