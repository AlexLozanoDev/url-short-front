"use client";

import { useAuth } from "@/features/auth/context/auth-context";
import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { urlService } from "@/services/url.service";
import { LinkItem, LinkStatsResponse } from "@/types/urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart2, ExternalLink, Copy, Check, Plus } from "lucide-react";

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

  // Estado para modal/vista de estadísticas
  const [selectedStats, setSelectedStats] = useState<LinkStatsResponse | null>(
    null,
  );
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchMyLinks = async (currentPage: number = 1) => {
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
  };

  useEffect(() => {
    fetchMyLinks();
  }, []);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await urlService.shortenUrl({
        targetURL: targetUrl,
        alias: customAlias.trim() ? customAlias.trim() : null,
      });

      setTargetUrl("");
      setCustomAlias("");
      setSuccessMessage("¡Enlace creado exitosamente!");
      fetchMyLinks(); // Recargar la lista
    } catch (err: any) {
      setError(err.message || "Error al crear el enlace");
    }
  };

  const handleViewStats = async (code: string) => {
    try {
      setLoadingStats(true);
      const response = await urlService.getLinkStats(code);
      setSelectedStats(response.data);
    } catch (err: any) {
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
    <main className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col p-6 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />

      <div className="max-w-4xl w-full mx-auto mt-8 flex flex-col gap-8">
        {/* Bienvenida */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Panel de Control
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Bienvenido,{" "}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {user?.email}
            </span>
          </p>
        </div>

        {/* Formulario de creación de enlaces */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Acortar nuevo enlace</h2>
          <form onSubmit={handleCreateLink} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                type="url"
                placeholder="https://tu-url-larga.com/ejemplo"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                required
                className="flex-1"
              />
              <Input
                type="text"
                placeholder="Alias personalizado (opcional)"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="md:w-64"
              />
              <Button type="submit" className="gap-2">
                <Plus className="w-4 h-4" /> Acortar
              </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {successMessage && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </p>
            )}
          </form>
        </div>

        {/* Listado de Enlaces */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Tus Enlaces Creados</h2>

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
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {window.location.host}/{link.code}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {link.isCustomAlias && (
                        <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
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
                      <span className="font-bold">{link.totalClicks}</span>{" "}
                      clics
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewStats(link.code)}
                        className="gap-1.5"
                      >
                        <BarChart2 className="w-4 h-4" /> Estadísticas
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Estadísticas Seleccionadas */}
        {selectedStats && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  Estadísticas para: /{selectedStats.code}
                </h3>
                <p className="text-xs text-zinc-500">
                  URL Destino: {selectedStats.targetUrl}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStats(null)}
              >
                Cerrar
              </Button>
            </div>

            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">
                Total de clics históricos:
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {selectedStats.totalClicksAllTime}
              </span>
            </div>

            <h4 className="text-sm font-semibold mt-2">
              Últimos accesos registrados:
            </h4>
            {selectedStats.stats.length === 0 ? (
              <p className="text-xs text-zinc-500">
                Aún no hay clics registrados en este enlace.
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                {selectedStats.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="py-2 flex justify-between items-center"
                  >
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {new Date(stat.clickedAt).toLocaleString()}
                    </span>
                    <span
                      className="text-zinc-400 truncate max-w-xs"
                      title={stat.userAgent || ""}
                    >
                      {stat.userAgent || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
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
    </main>
  );
}
