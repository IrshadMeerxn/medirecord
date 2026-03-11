import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import HospitalDashboard from "./components/HospitalDashboard";
import CreateRecordForm from "./components/CreateRecordForm";
import PatientRecordView from "./components/PatientRecordView";
import { useActor } from "./hooks/useActor";
import { useHospitalLogin, usePatientLogin } from "./hooks/useQueries";

// ─── App state types ──────────────────────────────────────────────────────────
type AppView =
  | { page: "landing" }
  | { page: "hospital-login" }
  | { page: "patient-login" }
  | { page: "hospital-dashboard"; doctorName: string }
  | { page: "hospital-create-record"; doctorName: string }
  | { page: "hospital-view-record"; doctorName: string; recordId: bigint }
  | { page: "patient-record"; recordId: bigint }
  | { page: "public-record"; recordId: bigint };

function AppContent() {
  const [view, setView] = useState<AppView>({ page: "landing" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const { actor, isFetching } = useActor();
  const hasHandledRecordView = useRef(false);

  const hospitalLoginMutation = useHospitalLogin();
  const patientLoginMutation = usePatientLogin();

  // Initialize default admin on first load
  useEffect(() => {
    if (actor) {
      actor.createDefaultAdmin().catch(() => {
        // Silently ignore — admin may already exist
      });
    }
  }, [actor]);

  // Handle ?record=<recordId> query param — show public record view on scan
  useEffect(() => {
    if (!actor || hasHandledRecordView.current) return;

    const recordParam = new URLSearchParams(window.location.search).get("record");
    if (!recordParam) return;

    hasHandledRecordView.current = true;

    try {
      const recordId = BigInt(recordParam);
      setView({ page: "public-record", recordId });
    } catch {
      toast.error("Invalid record link.");
    } finally {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [actor]);

  const handleHospitalLogin = async (username: string, password: string) => {
    setLoginError(null);
    try {
      const result = await hospitalLoginMutation.mutateAsync({ username, password });
      if (result.__kind__ === "ok") {
        setView({
          page: "hospital-dashboard",
          doctorName: result.ok.doctorName || username,
        });
        toast.success(`Welcome back, ${result.ok.doctorName || username}!`);
      } else {
        setLoginError(result.err || "Invalid credentials");
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    }
  };

  const handlePatientLogin = async (username: string, password: string) => {
    setLoginError(null);
    try {
      const result = await patientLoginMutation.mutateAsync({ username, password });
      if (result.__kind__ === "ok") {
        setView({
          page: "patient-record",
          recordId: result.ok.recordId,
        });
        toast.success("Welcome! Your medical records are ready.");
      } else {
        setLoginError(result.err || "Invalid credentials");
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    }
  };

  const goToLanding = () => {
    setLoginError(null);
    setView({ page: "landing" });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (view.page === "landing") {
    return (
      <LandingPage
        onHospitalLogin={() => {
          setLoginError(null);
          setView({ page: "hospital-login" });
        }}
        onPatientLogin={() => {
          setLoginError(null);
          setView({ page: "patient-login" });
        }}
      />
    );
  }

  if (view.page === "hospital-login") {
    return (
      <LoginForm
        loginRole="hospital"
        onBack={goToLanding}
        onLogin={handleHospitalLogin}
        isLoading={hospitalLoginMutation.isPending}
        isActorReady={!!actor && !isFetching}
        error={loginError}
      />
    );
  }

  if (view.page === "patient-login") {
    return (
      <LoginForm
        loginRole="patient"
        onBack={goToLanding}
        onLogin={handlePatientLogin}
        isLoading={patientLoginMutation.isPending}
        isActorReady={!!actor && !isFetching}
        error={loginError}
      />
    );
  }

  if (view.page === "hospital-dashboard") {
    return (
      <HospitalDashboard
        doctorName={view.doctorName}
        onLogout={goToLanding}
        onCreateRecord={() =>
          setView({ page: "hospital-create-record", doctorName: view.doctorName })
        }
        onViewRecord={(recordId) =>
          setView({
            page: "hospital-view-record",
            doctorName: view.doctorName,
            recordId,
          })
        }
      />
    );
  }

  if (view.page === "hospital-create-record") {
    return (
      <CreateRecordForm
        doctorName={view.doctorName}
        onBack={() =>
          setView({ page: "hospital-dashboard", doctorName: view.doctorName })
        }
        onSuccess={(recordId) =>
          setView({
            page: "hospital-view-record",
            doctorName: view.doctorName,
            recordId,
          })
        }
      />
    );
  }

  if (view.page === "hospital-view-record") {
    return (
      <PatientRecordView
        recordId={view.recordId}
        isHospitalView={true}
        onBack={() =>
          setView({ page: "hospital-dashboard", doctorName: view.doctorName })
        }
        onDeleted={() =>
          setView({ page: "hospital-dashboard", doctorName: view.doctorName })
        }
      />
    );
  }

  if (view.page === "patient-record") {
    return (
      <PatientRecordView
        recordId={view.recordId}
        isHospitalView={false}
        onBack={goToLanding}
      />
    );
  }

  if (view.page === "public-record") {
    return (
      <PatientRecordView
        recordId={view.recordId}
        isHospitalView={false}
        onBack={goToLanding}
      />
    );
  }

  // Fallback
  return (
    <LandingPage
      onHospitalLogin={() => setView({ page: "hospital-login" })}
      onPatientLogin={() => setView({ page: "patient-login" })}
    />
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <Toaster richColors position="top-right" />
    </>
  );
}
