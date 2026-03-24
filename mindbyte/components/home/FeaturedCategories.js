"use client"

import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const FeaturedCategories = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/homepage/categorywithsubs`);
                const data = await res.json();

                // 按主分类聚合，统计子分类数量
                const map = {};
                (data || []).forEach((item) => {
                    if (!item.categoryId || !item.subcategoryId) return;
                    const id = item.categoryId._id;
                    if (!map[id]) {
                        map[id] = {
                            name: item.categoryId.name,
                            slug: item.categoryId.slug,
                            count: 0,
                        };
                    }
                    map[id].count += 1;
                });

                setCategories(Object.values(map).slice(0, 8));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Box sx={{ px: { xs: 3, md: 10 }, py: { xs: 7, md: 10 }, backgroundColor: "#f9fafb" }}>
            <Box sx={{ mb: 6 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.10em", mb: 1 }}>
                    Browse by Topic
                </Typography>
                <Typography sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
                    Explore Categories
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress sx={{ color: "#111827" }} size={28} />
                </Box>
            ) : categories.length === 0 ? (
                <Typography sx={{ color: "#9ca3af", fontSize: 14 }}>No categories available yet.</Typography>
            ) : (
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
                    gap: 2,
                }}>
                    {categories.map((cat) => (
                        <Box
                            key={cat.slug}
                            onClick={() => router.push(`/content/${cat.slug}`)}
                            sx={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                p: 3,
                                cursor: "pointer",
                                transition: "box-shadow 0.15s ease, border-color 0.15s ease",
                                "&:hover": {
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    borderColor: "#d1d5db",
                                },
                            }}
                        >
                            <Typography sx={{ fontSize: 22, mb: 1.5 }}>📂</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827", mb: 0.5 }}>
                                {cat.name}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
                                {cat.count} {cat.count === 1 ? "subcategory" : "subcategories"}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default FeaturedCategories;
