import { toast } from "@/components/ui/sonner";

export function toastSuccess(message: string, description?: string) {
  toast.success(`✅ ${message}`, { description });
}

export function toastError(message?: string) {
  toast.error(`🌧️ ${message ?? "Sin conexión. Intenta de nuevo"}`);
}

export function toastCoins(amount: number) {
  toast.success(`🪙 +${amount} monedas`, {
    description: "Sigue creciendo tu jardín",
  });
}

export function toastGrowth(plantName: string) {
  toast.success(`🌱 ¡${plantName} ha crecido!`, {
    description: "Tu planta ha subido de nivel",
  });
}

export function toastHarvest() {
  toast.success("🌾 ¡Cosecha lista!", {
    description: "Tus recompensas han sido reclamadas",
  });
}
