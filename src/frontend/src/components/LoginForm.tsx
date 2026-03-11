import { useState } from "react";
import { Building2, User, HeartPulse, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  loginRole: "hospital" | "patient";
  onBack: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  isActorReady: boolean;
  error: string | null;
}

export default function LoginForm({
  loginRole,
  onBack,
  onLogin,
  isLoading,
  isActorReady,
  error,
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isHospital = loginRole === "hospital";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(username.trim(), password);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "oklch(0.22 0.07 258)" }}
    >
      <div className="w-full max-w-md animate-fade-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
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

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "oklch(1 0 0 / 0.06)",
            border: "1px solid oklch(1 0 0 / 0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: isHospital
                  ? "oklch(0.55 0.12 195 / 0.2)"
                  : "oklch(0.62 0.14 192 / 0.15)",
              }}
            >
              {isHospital ? (
                <Building2
                  className="w-5 h-5"
                  style={{ color: "oklch(0.78 0.1 192)" }}
                />
              ) : (
                <User
                  className="w-5 h-5"
                  style={{ color: "oklch(0.75 0.1 192)" }}
                />
              )}
            </div>
            <div>
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ color: "oklch(0.97 0.005 240)" }}
              >
                {isHospital ? "Hospital Login" : "Patient Login"}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.6 0.04 255)" }}>
                {isHospital
                  ? "Sign in to manage patient records"
                  : "Sign in to view your medical records"}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-xs font-medium tracking-wide uppercase"
                style={{ color: "oklch(0.65 0.04 255)" }}
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isHospital ? "Enter hospital username" : "Enter your username"}
                required
                className="h-11 text-sm"
                style={{
                  background: "oklch(1 0 0 / 0.06)",
                  border: "1px solid oklch(1 0 0 / 0.15)",
                  color: "oklch(0.97 0.005 240)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-medium tracking-wide uppercase"
                style={{ color: "oklch(0.65 0.04 255)" }}
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-11 text-sm pr-10"
                  style={{
                    background: "oklch(1 0 0 / 0.06)",
                    border: "1px solid oklch(1 0 0 / 0.15)",
                    color: "oklch(0.97 0.005 240)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: "oklch(0.75 0.03 255)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "oklch(0.57 0.24 27 / 0.15)",
                  border: "1px solid oklch(0.57 0.24 27 / 0.3)",
                  color: "oklch(0.85 0.12 25)",
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !isActorReady || !username || !password}
              className="w-full h-11 text-sm font-semibold"
              style={{
                background: "oklch(0.55 0.12 195)",
                color: "oklch(0.98 0 0)",
              }}
            >
              {!isActorReady ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                `Sign In as ${isHospital ? "Hospital Staff" : "Patient"}`
              )}
            </Button>
          </form>

          {/* Default credentials hint for hospital */}
          {isHospital && (
            <div
              className="mt-5 px-4 py-3 rounded-lg"
              style={{
                background: "oklch(1 0 0 / 0.04)",
                border: "1px solid oklch(1 0 0 / 0.08)",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "oklch(0.5 0.04 255)" }}
              >
                <span className="font-medium" style={{ color: "oklch(0.6 0.04 255)" }}>
                  Default admin credentials:{" "}
                </span>
                <span className="font-mono">admin</span> /{" "}
                <span className="font-mono">admin123</span>
              </p>
            </div>
          )}
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="mt-5 flex items-center gap-2 text-sm mx-auto hover:opacity-80 transition-opacity"
          style={{ color: "oklch(0.55 0.04 255)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>
      </div>
    </div>
  );
}
