"use client"

import { useState, useEffect } from "react";
import { Box, Tabs, Tab, } from "@mui/material";
import { useRouter } from "next/navigation";


const CenterTabs = () => {
    // 导航栏下方标签显示子分类
    const [subcategories, setSubcategories] = useState([]);
    // 跟踪当前标签点击位置
    const [value, setValue] = useState(false);

    const router = useRouter();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const selectedSlug = subcategories[newValue]?.slug;
        if (selectedSlug) {
            router.push(`/content/${selectedSlug.toLowerCase()}`); // Redirect to a new page with the slug in the URL
        }
    };

    useEffect(() => {
        fetchSubcategories();
    }, []);
    const fetchSubcategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/subcategory`);
            const data = await res.json();
            setSubcategories(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Box sx={{
                width: '100%',
                bgcolor: 'background.paper',
            }}>
                <Tabs value={value} onChange={handleChange} variant="scrollable"
                    sx={{ "& .MuiTabs-indicator": { display: "none" }, }}
                >
                    {subcategories.map((tab) => (
                        <Tab
                            key={tab._id}
                            label={tab.name}
                            sx={{
                                "&:hover": { color: "#000" },
                                fontSize: "14px",
                            }} />
                    ))}
                </Tabs>
            </Box>
        </>
    )
}

export default CenterTabs;