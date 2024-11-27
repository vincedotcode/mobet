"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { redisHelper } from "@/lib/redis"; // Adjust path based on your file structure

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
    const [tips, setTips] = useState<SoccerTip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    const CACHE_KEY = "soccer_tips";
    const CACHE_TTL = 60 * 60 * 24; // 24 hours

    // Fetch tips: Check Redis first, then call API if Redis data is missing or expired
    useEffect(() => {
        const fetchTips = async () => {
            try {
                setLoading(true);
                setError(null);

                // Attempt to fetch data from Redis
                const cachedTips = await redisHelper.get<SoccerTip[]>(CACHE_KEY);
                if (cachedTips) {
                    console.log("Using cached data");
                    setTips(cachedTips);
                    return;
                }

                // If no data in Redis, call the API
                console.log("Fetching data from API");
                const response = await fetch("/api/soccer-tips");
                if (!response.ok) {
                    throw new Error("Failed to fetch data from API");
                }
                const data = await response.json();

                if (data.success) {
                    setTips(data.data);

                    // Store the fetched data in Redis with an expiration time
                    await redisHelper.set(CACHE_KEY, data.data, CACHE_TTL);
                } else {
                    throw new Error(data.message || "Unknown error occurred");
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    const filteredAndSortedTips = useMemo(() => {
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
                    <CardTitle className="text-lg">Mobet Generated Tips</CardTitle>
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
