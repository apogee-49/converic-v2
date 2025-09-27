"use client"

import * as React from "react"
import { z } from "zod"
import { useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateDialogProps {
  label?: string
}

const schema = z.object({
  slug: z
    .string()
    .min(1, "Slug ist erforderlich")
    .regex(/^[a-z0-9-]+$/i, "Nur Buchstaben, Zahlen und Bindestriche"),
  title: z.string().min(1, "Titel ist erforderlich"),
})

export default function CreateDialog({ label = "Neue Landingpage" }: CreateDialogProps) {
  const createLanding = useMutation(api.landingPages.create)
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({ slug: "", title: "" })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  const { success, error } = schema.safeParse(form);

  if (!success) {
    const errs = error.issues.reduce((acc, { path, message }) => {
      acc[path[0] as string] = message;
      return acc;
    }, {} as Record<string, string>);
    setErrors(errs);
    return;
  }

  setErrors({});
  setIsSubmitting(true);

  try {
    await createLanding({ slug: form.slug, title: form.title, settings: {}, customDomain: null });
    setForm({ slug: "", title: "" });
    setOpen(false);
  } catch (err) {
    setErrors({ slug: (err as Error).message });
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Landingpage erstellen</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 pt-2">
          <div className="grid gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
              placeholder="z. B. my-landing"
            />
            {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              placeholder="Titel der Landingpage"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Erstelle…" : "Erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

