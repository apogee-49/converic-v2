"use client"

import * as React from "react"
import type { Id } from "@/../convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { MetaSection } from "./styling/MetaSection"
import type { Settings } from "./styling/types"
import { LayoutSection } from "./styling/LayoutSection"

interface Props {
  pageId: Id<"landingPages">
}

type Section = "meta" | "layout";

const DEFAULTS: Settings = {
  meta: { title: "", description: "", keywords: [], indexed: true },
  layout: { favicon: "", primaryColor: "#111827", secondaryColor: "#6B7280", buttonRadius: "medium" },
};

const normalizeStyling = (raw: any): Settings => {
  const { meta = {}, layout = {} } = raw ?? {};
  return {
    meta: {
      title: meta.title ?? DEFAULTS.meta.title,
      description: meta.description ?? DEFAULTS.meta.description,
      keywords: Array.isArray(meta.keywords) ? meta.keywords : DEFAULTS.meta.keywords,
      indexed: typeof meta.indexed === "boolean" ? meta.indexed : DEFAULTS.meta.indexed,
    },
    layout: {
      favicon: layout.favicon ?? DEFAULTS.layout.favicon,
      primaryColor: layout.primaryColor ?? DEFAULTS.layout.primaryColor,
      secondaryColor: layout.secondaryColor ?? DEFAULTS.layout.secondaryColor,
      buttonRadius:
        layout.buttonRadius === "none" || layout.buttonRadius === "medium" || layout.buttonRadius === "full"
          ? layout.buttonRadius
          : DEFAULTS.layout.buttonRadius,
    },
  };
};

export default function PageStyling({ pageId }: Props) {
  const page = useQuery(api.landingPages.getPage, { landingPageId: pageId });
  const updatePage = useMutation(api.landingPages.update);

  const [settings, setSettings] = React.useState<Settings | null>(null);

  React.useEffect(() => {
    if (page) {
      setSettings(normalizeStyling(page.styling));
    }
  }, [page]);

  const baseline = normalizeStyling(page?.styling);
  const isLoading = !settings;

  const hasMetaChanges = settings && baseline ? settings.meta !== baseline.meta : false;
  const hasLayoutChanges = settings && baseline ? settings.layout !== baseline.layout : false;

  const [savingStatus, setSavingStatus] = React.useState<Record<Section, boolean>>({ meta: false, layout: false });

  const saveChanges = async (section: Section): Promise<void> => {
    if (settings) {
      setSavingStatus((prev) => ({ ...prev, [section]: true }));
      try {
        await updatePage({ landingPageId: pageId, styling: settings });
      } finally {
        setSavingStatus((prev) => ({ ...prev, [section]: false }));
      }
    }
  };

  if (!settings) return null;

  return (
    <div className="flex flex-col gap-4 md:gap-10 py-2">
      <MetaSection
        settings={settings}
        setSettings={setSettings}
        isLoading={isLoading}
        onSave={() => saveChanges("meta")}
        isSaving={savingStatus.meta}
        hasChanges={hasMetaChanges}
      />

      <LayoutSection
        settings={settings}
        setSettings={setSettings}
        isLoading={isLoading}
        onSave={() => saveChanges("layout")}
        isSaving={savingStatus.layout}
        hasChanges={hasLayoutChanges}
      />
    </div>
  );
}