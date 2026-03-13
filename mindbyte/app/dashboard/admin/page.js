"use client"

import { Box, Typography } from '@mui/material';
import Sidebar from "@/components/sidebar/Sidebar";
import { useState } from "react";

const AdminDashboardPage = () => {
    // 和 Sidebar 共享折叠状态，控制主内容区的左边距
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Box sx={{ display: "flex" }}>

            {/* Sidebar 接收 collapsed 状态和切换函数 */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* 主内容区，左边距跟着 Sidebar 宽度变化 */}
            <Box
                component="main"
                sx={{
                    marginLeft: collapsed ? "64px" : "260px",
                    transition: "margin-left 0.25s ease",
                    flexGrow: 1,
                    minHeight: "100vh",
                    backgroundColor: "#fff",
                    p: 4,
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '2.5rem',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                            backgroundImage: 'linear-gradient(45deg, #FF6F61, #FF8C00)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block',
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                </Box>

                {/* 这里放 Dashboard 内容组件 */}

            </Box>
        </Box>
    );
};

export default AdminDashboardPage;