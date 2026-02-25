const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://web-production-7ce2b.up.railway.app";

export interface PageResult {
  url: string;
  status: number;
  load_ms: number;
  score: number;
  passed: string[];
  issues: string[];
  title: string;
  h1: string;
}

export interface TopIssue {
  issue: string;
  count: number;
}

export interface ScanResponse {
  url: string;
  pages_crawled: number;
  overall_score: number;
  grade: string;
  results: PageResult[];
  top_issues: TopIssue[];
  recommendations: string[];
}

export async function scanWebsite(url: string): Promise<ScanResponse> {
  const response = await fetch(`${API_URL}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Scan failed: ${response.statusText}`);
  }

  return response.json();
}