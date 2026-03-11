import { Building2, User, Shield, HeartPulse, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onHospitalLogin: () => void;
  onPatientLogin: () => void;
}

export default function LandingPage({
  onHospitalLogin,
  onPatientLogin,
}: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.22 0.07 258)" }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.55 0.12 195)" }}
          >
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "oklch(0.97 0.005 240)" }}
          >
            MediRecord
          </span>
        </div>
        <div
          className="text-xs px-3 py-1 rounded-full"
          style={{
            background: "oklch(0.55 0.12 195 / 0.15)",
            color: "oklch(0.78 0.1 192)",
            border: "1px solid oklch(0.55 0.12 195 / 0.3)",
          }}
        >
          Secure Medical Records Platform
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Decorative background rings */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 pointer-events-none"
            style={{
              background: "radial-gradient(circle, oklch(0.62 0.14 192) 0%, transparent 70%)",
            }}
          />

          {/* Main hero content */}
          <div className="relative z-10 text-center mb-16 animate-fade-slide-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "oklch(0.55 0.12 195 / 0.12)",
                color: "oklch(0.78 0.1 192)",
                border: "1px solid oklch(0.55 0.12 195 / 0.25)",
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              HIPAA-Compliant Record Management
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold mb-5 tracking-tight leading-tight"
              style={{ color: "oklch(0.97 0.005 240)" }}
            >
              Medical Records,
              <br />
              <span style={{ color: "oklch(0.62 0.14 192)" }}>
                Secured & Accessible
              </span>
            </h1>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: "oklch(0.7 0.03 255)" }}
            >
              A unified platform for healthcare providers and patients.
              Manage, access, and share medical records with confidence.
            </p>
          </div>

          {/* Login cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto animate-fade-slide-up delay-200">
            {/* Hospital Login Card */}
            <button
              type="button"
              onClick={onHospitalLogin}
              className="group relative rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
              style={{
                background: "oklch(1 0 0 / 0.06)",
                border: "1px solid oklch(1 0 0 / 0.12)",
                backdropFilter: "blur(16px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "oklch(0.55 0.12 195 / 0.15)";
                e.currentTarget.style.border = "1px solid oklch(0.55 0.12 195 / 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "oklch(1 0 0 / 0.06)";
                e.currentTarget.style.border = "1px solid oklch(1 0 0 / 0.12)";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                style={{ background: "oklch(0.55 0.12 195 / 0.2)" }}
              >
                <Building2
                  className="w-6 h-6"
                  style={{ color: "oklch(0.78 0.1 192)" }}
                />
              </div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "oklch(0.97 0.005 240)" }}
              >
                Hospital Login
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.65 0.03 255)" }}
              >
                For healthcare professionals. Manage patient records,
                create diagnoses, and set patient access credentials.
              </p>
              <div
                className="mt-5 flex items-center gap-2 text-xs font-medium"
                style={{ color: "oklch(0.62 0.14 192)" }}
              >
                <span>Access dashboard</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </button>

            {/* Patient Login Card */}
            <button
              type="button"
              onClick={onPatientLogin}
              className="group relative rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
              style={{
                background: "oklch(1 0 0 / 0.06)",
                border: "1px solid oklch(1 0 0 / 0.12)",
                backdropFilter: "blur(16px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "oklch(0.62 0.14 192 / 0.1)";
                e.currentTarget.style.border = "1px solid oklch(0.62 0.14 192 / 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "oklch(1 0 0 / 0.06)";
                e.currentTarget.style.border = "1px solid oklch(1 0 0 / 0.12)";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "oklch(0.62 0.14 192 / 0.15)" }}
              >
                <User
                  className="w-6 h-6"
                  style={{ color: "oklch(0.75 0.1 192)" }}
                />
              </div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "oklch(0.97 0.005 240)" }}
              >
                Patient Login
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.65 0.03 255)" }}
              >
                For patients. View your personal medical records, diagnoses,
                and treatment information provided by your doctor.
              </p>
              <div
                className="mt-5 flex items-center gap-2 text-xs font-medium"
                style={{ color: "oklch(0.75 0.1 192)" }}
              >
                <span>View my records</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-fade-slide-up delay-400">
            {[
              { icon: Shield, label: "End-to-End Encrypted" },
              { icon: Lock, label: "Role-Based Access" },
              { icon: HeartPulse, label: "QR-Code Record Access" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs"
                style={{ color: "oklch(0.55 0.04 255)" }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: "oklch(0.55 0.12 195)" }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 text-center">
        <p className="text-xs" style={{ color: "oklch(0.45 0.04 258)" }}>
          © 2026. Built with{" "}
          <span style={{ color: "oklch(0.65 0.18 25)" }}>♥</span> using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.55 0.12 195)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
