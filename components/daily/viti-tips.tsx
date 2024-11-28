"use client";

import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Tip {
  league: string;
  date: string;
  match: string;
  score: string;
  tip: string;
  confidence: string;
}

export function VitiProfessionalBets() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/vitibet"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch tips");
        }
        const data = await response.json();
        setTips(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  const getConfidenceBadge = (confidence: string) => {
    const confidenceLevel = parseFloat(confidence);
    if (confidenceLevel >= 80) {
      return <Badge className="bg-green-800">Banker</Badge>;
    } else if (confidenceLevel >= 60) {
      return <Badge className="bg-green-300">High</Badge>;
    } else {
      return <Badge className="bg-blue-400">Play Double Chance</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">Loading tips...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-red-500">Error: {error}</CardContent>
      </Card>
    );
  }

  return (
    <>
    <div className="py-3">
                <Card className="p-5">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Viti Professional Bets
        </CardTitle>
                </Card>
            </div>
            <Card className="w-full">
      <CardHeader>
       
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Professional soccer tips curated by Mobet.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>League</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tips.map((tip, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">{tip.league}</TableCell>
                <TableCell>{tip.date}</TableCell>
                <TableCell>{tip.match}</TableCell>
                <TableCell>{tip.score}</TableCell>
                <TableCell>{tip.tip}</TableCell>
                <TableCell className="text-right">
                  {getConfidenceBadge(tip.confidence)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-right font-medium">
                Total Matches: {tips.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
    </>
 
  );
}
