"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SoccerTip {
  category: string; // "Best Football Tip for Today" or "Win Accumulator Tip for Today"
  league: string;
  time: string;
  match: string;
  tip: string;
  odd: string;
}

export default function FootballTips() {
  const [tips, setTips] = useState<SoccerTip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/vista"); // Connect to your API
        if (!response.ok) {
          throw new Error(`Failed to fetch tips: ${response.statusText}`);
        }
        const data = await response.json();
        setTips(data.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-center">Loading football tips...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-center text-red-500">Error: {error}</CardContent>
      </Card>
    );
  }

  // Filter tips by category
  const bestFootballTips = tips.filter((tip) => tip.category === "Best Football Tip for Today");
  const winAccumulatorTips = tips.filter((tip) => tip.category === "Win Accumulator Tip for Today");

  return (
    <div className="py-5">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Football Tips</CardTitle>
        </CardHeader>
      </Card>

      {/* Best Football Tip for Today */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Best Football Tip for Today</CardTitle>
        </CardHeader>
        <CardContent>
          {bestFootballTips.length > 0 ? (
            <Table>
              <TableCaption>Curated tips for the best football games today.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>League</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Odd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bestFootballTips.map((tip, index) => (
                  <TableRow key={index}>
                    <TableCell>{tip.league}</TableCell>
                    <TableCell>{tip.time}</TableCell>
                    <TableCell>{tip.match}</TableCell>
                    <TableCell>{tip.tip}</TableCell>
                    <TableCell>{tip.odd}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No tips available for "Best Football Tip for Today".</p>
          )}
        </CardContent>
      </Card>

      {/* Win Accumulator Tip for Today */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Win Accumulator Tip for Today</CardTitle>
        </CardHeader>
        <CardContent>
          {winAccumulatorTips.length > 0 ? (
            <Table>
              <TableCaption>Curated accumulator tips for today.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>League</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Odd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {winAccumulatorTips.map((tip, index) => (
                  <TableRow key={index}>
                    <TableCell>{tip.league}</TableCell>
                    <TableCell>{tip.time}</TableCell>
                    <TableCell>{tip.match}</TableCell>
                    <TableCell>{tip.tip}</TableCell>
                    <TableCell>{tip.odd}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No tips available for "Win Accumulator Tip for Today".</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
