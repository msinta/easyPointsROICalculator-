import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import type { UserSession } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
  initialMode?: "participant" | "admin";
}

export function LoginModal({ open, onClose, onLogin, initialMode = "participant" }: Props) {
  const [mode, setMode] = useState<"participant" | "admin">(initialMode);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setName("");
    setCode("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "admin") {
      if (code === import.meta.env.VITE_ADMIN_PIN) {
        onLogin({ type: "admin" });
        onClose();
        reset();
      } else {
        setError("Incorrect admin PIN.");
      }
    } else {
      const { data, error: err } = await supabase
        .from("participants")
        .select("id, name, access_code")
        .eq("name", name.trim())
        .eq("access_code", code.trim())
        .single();

      if (err || !data) {
        setError("Name or code not found. Ask the pool admin to add you.");
      } else {
        onLogin({ type: "participant", id: data.id, name: data.name });
        onClose();
        reset();
      }
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); reset(); } }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{mode === "admin" ? "⚙️ Admin Login" : "👤 Sign In"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {mode === "participant" && (
            <div className="space-y-1.5">
              <Label>Your Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Smith"
                required
                autoFocus
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>{mode === "admin" ? "Admin PIN" : "Access Code"}</Label>
            <Input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={mode === "admin" ? "Enter admin PIN" : "Your 4-digit code"}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? "Checking…" : "Sign In"}
          </Button>
        </form>
        <button
          type="button"
          className="text-xs text-gray-400 hover:text-gray-600 hover:underline mt-1"
          onClick={() => {
            setMode(mode === "admin" ? "participant" : "admin");
            reset();
          }}
        >
          {mode === "admin" ? "← Participant login" : "Admin? Click here"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
