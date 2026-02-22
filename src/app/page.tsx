"use client";

import { useState } from "react";
import { scanWebsite, ScanResponse, PageResult } from "@/lib/api";

function ScoreCircle({ score, grade }: { score: number; grade: string }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const gradeColor =
    grade === "A"
      ? "text-jj-green"
      : grade === "B"
      ? "text-jj-blue-light"
      : grade === "C"
      ? "text-jj-accent"
      : grade === "D"
      ? "text-jj-orange"
      : "text-jj-red";

  const strokeColor =
    grade === "A"
      ? "#10b981"
      : grade === "B"
      ? "#60a5fa"
      : grade === "C"
      ? "#f59e0b"
      : grade === "D"
      ? "#f97316"
      : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#2a3450"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-score-fill"
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${gradeColor}`}>{score}</span>
          <span className="text-jj-muted text-sm">/100</span>
        </div>
      </div>
      <span className={`text-2xl font-bold ${gradeColor}`}>Grade {grade}</span>
    </div>
  );
}

function CheckItem({ text, type }: { text: string; type: "pass" | "issue" }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${
        type === "pass"
          ? "bg-jj-green/10 border border-jj-green/20"
          : "bg-jj-red/10 border border-jj-red/20"
      }`}
    >
      <span className="mt-0.5 flex-shrink-0">
        {type === "pass" ? "\u2705" : text.startsWith("\u26a0") ? "\u26a0\ufe0f" : "\u274c"}
      </span>
      <span className="text-sm text-jj-text">
        {text.replace(/^[\u2705\u274c\u26a0\ufe0f\s]+/, "")}
      </span>
    </div>
  );
}

function PageCard({
  result,
  index,
}: {
  result: PageResult;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const scoreColor =
    result.score >= 90
      ? "text-jj-green"
      : result.score >= 80
      ? "text-jj-blue-light"
      : result.score >= 70
      ? "text-jj-accent"
      : result.score >= 60
      ? "text-jj-orange"
      : "text-jj-red";

  return (
    <div
      className="bg-jj-card border border-jj-border rounded-xl overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-jj-border/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className={`text-2xl font-bold ${scoreColor} flex-shrink-0`}>
            {result.score}
          </span>
          <div className="text-left min-w-0">
            <p className="text-jj-text font-medium truncate">
              {result.title || "Geen titel"}
            </p>
            <p className="text-jj-muted text-sm truncate">{result.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-jj-muted text-sm">{result.load_ms}ms</span>
          <span
            className={`transform transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            {"\u25bc"}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-jj-border p-4 space-y-3">
          {result.passed.length > 0 && (
            <div>
              <h4 className="text-jj-green font-semibold text-sm mb-2">
                Geslaagd ({result.passed.length})
              </h4>
              <div className="space-y-2">
                {result.passed.map((item, i) => (
                  <CheckItem key={i} text={item} type="pass" />
                ))}
              </div>
            </div>
          )}
          {result.issues.length > 0 && (
            <div>
              <h4 className="text-jj-red font-semibold text-sm mb-2">
                Problemen ({result.issues.length})
              </h4>
              <div className="space-y-2">
                {result.issues.map((item, i) => (
                  <CheckItem key={i} text={item} type="issue" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScanLoading() {
  const tips = [
    "Paginas ophalen...",
    "HTML analyseren...",
    "Meta tags controleren...",
    "Laadtijden meten...",
    "Links checken...",
    "Score berekenen...",
  ];
  const [tipIndex, setTipIndex] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2500);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-jj-border rounded-full" />
        <div className="absolute inset-0 border-4 border-jj-blue border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-jj-text text-lg font-medium">Website scannen...</p>
        <p className="text-jj-muted text-sm mt-1">{tips[tipIndex]}</p>
      </div>
      <div className="w-64 h-2 bg-jj-card rounded-full overflow-hidden scan-loading">
        <div className="h-full bg-jj-blue/30 rounded-full" />
      </div>
      <p className="text-jj-muted text-xs">
        Dit kan 15-30 seconden duren afhankelijk van de website
      </p>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let scanUrl = url.trim();
    if (!scanUrl.startsWith("http")) {
      scanUrl = "https://" + scanUrl;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const data = await scanWebsite(scanUrl);
      if (data.pages_crawled === 0) {
        setError(
          "Kon geen paginas ophalen van deze URL. Controleer of de website bereikbaar is."
        );
      } else {
        setResult(data);
      }
    } catch {
      setError(
        "Er ging iets mis bij het scannen. Probeer het opnieuw of controleer de URL."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-jj-border bg-jj-navy/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-jj-text tracking-wide">
              {"janssens & janssens"}
            </h1>
            <p className="text-xs text-jj-muted tracking-widest uppercase">
              webservices
            </p>
          </div>
          <span className="text-xs text-jj-muted border border-jj-border rounded-full px-3 py-1">
            SEO Health Checker
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-jj-text mb-3">
            Hoe gezond is uw website?
          </h2>
          <p className="text-jj-muted max-w-xl mx-auto">
            Voer uw URL in en ontvang een gedetailleerd SEO-rapport met scores,
            problemen en aanbevelingen om uw online zichtbaarheid te verbeteren.
          </p>
        </div>

        <form
          onSubmit={handleScan}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-jj-muted">
                {"\ud83d\udd0d"}
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.voorbeeld.be"
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 bg-jj-card border border-jj-border rounded-xl text-jj-text placeholder:text-jj-muted/50 focus:outline-none focus:border-jj-blue focus:ring-1 focus:ring-jj-blue transition-all disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-8 py-4 bg-jj-blue hover:bg-jj-blue-light text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-jj-blue/25 cursor-pointer"
            >
              {loading ? "Bezig..." : "Scan"}
            </button>
          </div>
        </form>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-jj-red/10 border border-jj-red/30 rounded-xl text-jj-red text-center">
            {error}
          </div>
        )}

        {loading && <ScanLoading />}

        {result && !loading && (
          <div className="space-y-8 animate-fade-up">
            <div className="bg-jj-card border border-jj-border rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ScoreCircle
                  score={result.overall_score}
                  grade={result.grade}
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-jj-text mb-2">
                    {"Resultaat voor "}
                    <span className="text-jj-blue">{result.url}</span>
                  </h3>
                  <p className="text-jj-muted mb-4">
                    {result.pages_crawled} {"pagina's gescand"}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-jj-green/15 text-jj-green text-sm rounded-full border border-jj-green/20">
                      {result.results.reduce(
                        (sum, r) => sum + r.passed.length,
                        0
                      )}{" "}
                      checks geslaagd
                    </span>
                    <span className="px-3 py-1 bg-jj-red/15 text-jj-red text-sm rounded-full border border-jj-red/20">
                      {result.results.reduce(
                        (sum, r) => sum + r.issues.length,
                        0
                      )}{" "}
                      problemen gevonden
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {result.top_issues.length > 0 && (
              <div className="bg-jj-card border border-jj-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-jj-text mb-4">
                  {"⚡ Meest voorkomende problemen"}
                </h3>
                <div className="space-y-3">
                  {result.top_issues.slice(0, 5).map((issue, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm text-jj-text">{issue.issue}</span>
                      <span className="flex-shrink-0 px-2 py-0.5 bg-jj-red/15 text-jj-red text-xs rounded-full">
                        {issue.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-jj-text mb-4">
                {"📄 Resultaten per pagina"}
              </h3>
              <div className="space-y-3">
                {result.results.map((pageResult, i) => (
                  <PageCard key={i} result={pageResult} index={i} />
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="bg-jj-card border border-jj-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-jj-text mb-4">
                  {"💡 Aanbevelingen"}
                </h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-jj-blue/10 border border-jj-blue/20 rounded-lg"
                    >
                      <span className="text-jj-blue flex-shrink-0 mt-0.5">
                        {"\u2192"}
                      </span>
                      <span className="text-sm text-jj-text">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center py-8 bg-jj-card border border-jj-border rounded-2xl">
              <p className="text-jj-muted mb-2">
                Hulp nodig bij het oplossen van deze problemen?
              </p>
              <a
                href="https://www.janssens-janssens-webservices.be/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-jj-blue hover:bg-jj-blue-light text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-jj-blue/25"
              >
                {"Neem contact op met Janssens & Janssens"}
              </a>
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">{"\ud83d\udd0d"}</p>
            <p className="text-jj-muted">
              Voer een URL in om te beginnen met scannen
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-jj-border mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-jj-muted text-sm">
            {"© 2026 Janssens & Janssens Webservices"}
          </p>
          <a
            href="https://www.janssens-janssens-webservices.be/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-jj-blue text-sm hover:text-jj-blue-light transition-colors"
          >
            www.janssens-janssens-webservices.be
          </a>
        </div>
      </footer>
    </div>
  );
}
