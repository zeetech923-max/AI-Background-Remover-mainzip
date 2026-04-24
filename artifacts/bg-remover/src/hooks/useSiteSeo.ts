import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

let cache: Record<string, string> | null = null;
let pending: Promise<Record<string, string>> | null = null;

export function useSiteSeo() {
  const [settings, setSettings] = useState<Record<string, string>>(cache ?? {});

  useEffect(() => {
    if (cache) return;
    if (!pending) {
      pending = adminApi
        .getSettings()
        .then((r) => {
          cache = r.settings;
          return r.settings;
        })
        .catch(() => ({} as Record<string, string>));
    }
    pending.then((s) => setSettings(s));
  }, []);

  const formatTitle = (pageTitle?: string) => {
    if (!pageTitle) return settings.site_default_title || settings.site_name || "BGRemover AI";
    const tpl = settings.site_title_template;
    if (tpl && tpl.includes("%s")) return tpl.replace("%s", pageTitle);
    if (settings.site_name) return `${pageTitle} | ${settings.site_name}`;
    return pageTitle;
  };

  return { settings, formatTitle };
}
