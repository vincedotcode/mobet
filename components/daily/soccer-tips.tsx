"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";

interface SoccerTip {
    time: string;
    league: string;
    match: string;
    tip: string;
    odds: number;
    result?: string;
}

export default function SoccerTipsViewer() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof SoccerTip>("time");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [tips, setTips] = useState<SoccerTip[]>([]); // Default to an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    // Fetch tips from API
    useEffect(() => {
        const fetchTips = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("/api/soccer-tips");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                console.log("this is the tips", data)
                setTips(data.data || []); // Fallback to an empty array if data.tips is undefined
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    const filteredAndSortedTips = useMemo(() => {
        // Ensure tips is always an array and filter safely
        return (tips || [])
            .filter(
                (tip) =>
                    tip.match.toLowerCase().includes(search.toLowerCase()) ||
                    tip.league.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                const aValue = a[sortBy];
                const bValue = b[sortBy];
                if (aValue === undefined && bValue === undefined) return 0;
                if (aValue === undefined) return sortOrder === "asc" ? 1 : -1;
                if (bValue === undefined) return sortOrder === "asc" ? -1 : 1;
                if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
    }, [tips, search, sortBy, sortOrder]);

    const handleSort = (column: keyof SoccerTip) => {
        if (column === sortBy) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    return (
        <div className="my-2">
            <div className="py-3">
                <Card className="p-5">
                    <CardTitle className="text-lg">Soccer Tips</CardTitle>
                </Card>
            </div>
            <Card className="overflow-hidden backdrop-blur-sm transition-all duration-300">
                <div className="p-4 flex justify-between items-center">
                    <Input
                        placeholder="Search matches or leagues..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={sortBy} onValueChange={(value) => handleSort(value as keyof SoccerTip)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="time">Time</SelectItem>
                            <SelectItem value="league">League</SelectItem>
                            <SelectItem value="odds">Odds</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">{error}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-24">Time</TableHead>
                                    <TableHead className="w-24">League</TableHead>
                                    <TableHead className="w-64">Match</TableHead>
                                    <TableHead className="w-32">Tips</TableHead>
                                    <TableHead className="w-24">Odds</TableHead>
                                    <TableHead className="w-24">Result</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedTips.map((tip, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                        <TableCell className="font-medium">{tip.time}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="animate-in fade-in-50 duration-300">
                                                {tip.league}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{tip.match}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="animate-in fade-in-50 duration-300">
                                                {tip.tip}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{tip.odds}</TableCell>
                                        <TableCell>
                                            {tip.result ? (
                                                <Badge
                                                    variant={tip.result === "Won" ? "default" : "destructive"}
                                                    className="animate-in fade-in-50 duration-300"
                                                >
                                                    {tip.result}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="animate-in fade-in-50 duration-300">
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </Card>
        </div>
    );
}
