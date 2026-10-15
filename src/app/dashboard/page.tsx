/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/features/auth/context/auth-context";
import Header from "@/components/layout/Header";
import { useCallback, useEffect, useState } from "react";
import { urlService } from "@/services/url.service";
import { LinkItem, LinkStatsResponse } from "@/types/urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart2, ExternalLink, Copy, Check } from "lucide-react";
import { useShortenUrl } from "@/hooks/use-shorten-url";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RESERVED_WORDS = [
  "dashboard",
  "auth",
  "login",
  "register",
  "api",
  "admin",
  "stats",
  "auth/login",
  "auth/register",
];

function validateCustomAlias(alias: string): string | null {
  if (!alias) return null;
  const alphaNumRegex = /^[0-9a-zA-Z]+$/;
  if (!alphaNumRegex.test(alias)) {
    return "Alias de URL no permitido";
  }
  const normalized = alias.toLowerCase().trim();
  if (RESERVED_WORDS.includes(normalized)) {
    return "Alias de URL no permitido";
  }

  return null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { shorten } = useShortenUrl();
  const [aliasError, setAliasError] = useState<string | null>(null);

  const [selectedStats, setSelectedStats] = useState<LinkStatsResponse | null>(
    null,
  );
  const [, setLoadingStats] = useState(false);

  const fetchMyLinks = useCallback(async (currentPage: number = 1) => {
    try {
      setLoading(true);
      const response = await urlService.getMyLinks(currentPage, 10);
      setLinks(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(response.data.page || 1);
    } catch (error) {
      console.error("Error al cargar enlaces:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyLinks();
  }, [fetchMyLinks]);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const trimmedAlias = customAlias.trim() ? customAlias.trim() : null;

    if (trimmedAlias) {
      const validationError = validateCustomAlias(trimmedAlias);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      const result = await shorten(
        targetUrl,
        customAlias.trim() ? customAlias.trim() : null,
      );

      if (result?.success) {
        setTargetUrl("");
        setCustomAlias("");
        setSuccessMessage("¡Enlace creado exitosamente!");
        fetchMyLinks();
      }
    } catch (err: any) {
      setError(err.message || "Error al crear el enlace");
    }
  };

  const handleViewStats = async (code: string) => {
    try {
      setLoadingStats(true);
      const response = await urlService.getLinkStats(code);
      setSelectedStats(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      alert("No se pudieron cargar las estadísticas");
    } finally {
      setLoadingStats(false);
    }
  };

  const copyToClipboard = (code: string) => {
    const fullUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#E9E9E9] dark:bg-[#161616] text-zinc-900 flex flex-col p-6 dark:text-zinc-100">
      <Header />
      <div className="max-w-4xl w-full mx-auto mt-8 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {user?.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleCreateLink} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="url"
              placeholder="https://tu-url-larga.com/ejemplo"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
              className="bg-[#d7d7d7] border-0 focus-visible:ring-1 focus-visible:ring-zinc-700 text-[#191919] placeholder:text-zinc-600 px-6 rounded-sm max-w-xl h-10 self-center dark:text-[#e9e9e9]"
            />
            <div className="flex flex-col gap-1 w-full max-w-xl">
              <Input
                type="text"
                placeholder="Alias personalizado (opcional)"
                value={customAlias}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomAlias(val);
                  setAliasError(validateCustomAlias(val));
                }}
                className={`bg-[#d7d7d7] border-0 focus-visible:ring-1 focus-visible:ring-zinc-700 text-[#191919] placeholder:text-zinc-600 px-6 rounded-sm max-w-xl h-10 self-center dark:text-[#e9e9e9] ${
                  aliasError
                    ? "border border-red-500 focus-visible:ring-red-500"
                    : "border-0"
                }`}
              />
            </div>
            <Button
              type="submit"
              className="gap-2 font-passion rounded-sm h-auto"
              disabled={!!aliasError}
            >
              Acortar
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          )}
        </form>

        {loading ? (
          <p className="text-sm text-zinc-500">Cargando enlaces...</p>
        ) : links.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Aún no has creado ningún enlace.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {links.map((link) => (
              <div
                key={link.code}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/${link.code}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-zinc-800 dark:text-zinc-200 hover:underline flex items-center gap-1"
                    >
                      {window.location.host}/{link.code}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {link.isCustomAlias && (
                      <span className="text-xs bg-green-600 text-green-200 dark:bg-green-950 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                        Personalizado
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-md"
                    title={link.targetUrl}
                  >
                    {link.targetUrl}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <span className="font-bold">{link.totalClicks}</span> clics
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewStats(link.code)}
                      className="gap-1.5"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(link.code)}
                      title="Copiar enlace"
                    >
                      {copiedCode === link.code ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Dialog
          open={!!selectedStats}
          onOpenChange={(open) => {
            if (!open) setSelectedStats(null);
          }}
        >
          <DialogContent className="sm:max-w-lg  p-6 rounded-2xl">
            {selectedStats && (
              <>
                <DialogHeader className="flex flex-row gap-10 items-center">
                  <div>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      {window.location.host}/{selectedStats.code}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-zinc-500 truncate max-w-sm">
                      {selectedStats.targetUrl}
                    </DialogDescription>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold">
                      {selectedStats.totalClicksAllTime}
                    </span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Clics
                    </span>
                  </div>
                </DialogHeader>

                <div className="flex flex-col gap-5 mt-2">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Accesos registrados:
                    </h4>

                    {selectedStats.stats.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-4 text-center bg-zinc-50 dark:bg-zinc-800/20 rounded-lg">
                        Aún no hay clics registrados en este enlace.
                      </p>
                    ) : (
                      <div className="max-h-64 overflow-y-auto flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800 text-xs pr-1">
                        {selectedStats.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="py-2.5 flex justify-between items-center"
                          >
                            <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                              {new Date(stat.clickedAt).toLocaleString()}
                            </span>
                            <span
                              className="text-zinc-400 dark:text-zinc-500 truncate max-w-50"
                              title={stat.userAgent || ""}
                            >
                              {stat.userAgent || "N/A"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => fetchMyLinks(page - 1)}
          >
            Anterior
          </Button>
          <span className="text-xs text-zinc-500">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => fetchMyLinks(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </main>
  );
}
