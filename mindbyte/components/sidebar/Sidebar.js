"use client"

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Box, Typography, List, ListItem,
    ListItemIcon, ListItemText,
    IconButton, Menu, MenuItem, Divider, Tooltip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/GridView";
import SchoolIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const fixS3Url = (url) => {
    if (!url) return url;
    return url.replace(
        /^https:\/\/(.+?)\.s3\.([^.]+)\.amazonaws\.com\/(.+)$/,
        'https://s3.$2.amazonaws.com/$1/$3'
    );
};

// 颜色常量 — Charcoal Minimal
const C = {
    bg: "#ffffff",
    active_bg: "#f3f4f6",
    active_border: "#111827",
    active_text: "#111827",
    active_icon: "#111827",
    text: "#374151",
    icon: "#9ca3af",
    hover_bg: "#f9fafb",
    label: "#9ca3af",
    logo_bg: "#111827",
};

const navItems = [
    { text: "Dashboard",  icon: <DashboardIcon fontSize="small" />,    link: "/dashboard/admin" },
    { text: "Courses",    icon: <SchoolIcon fontSize="small" />,        link: "/dashboard/admin/content" },
    { text: "Categories", icon: <CategoryIcon fontSize="small" />,      link: "/dashboard/admin/create/category" },
    { text: "Users",      icon: <GroupIcon fontSize="small" />,         link: "/dashboard/admin/alluser" },
    { text: "Profile",    icon: <PersonOutlineIcon fontSize="small" />, link: "/dashboard/admin/profile" },
];

const bottomItems = [
    { text: "Settings", icon: <SettingsIcon fontSize="small" />, link: "/settings" },
    { text: "Help",     icon: <HelpOutlineIcon fontSize="small" />, link: "/help" },
];

const SidebarItem = ({ item, collapsed, active, onClick }) => (
    <Tooltip title={collapsed ? item.text : ""} placement="right">
        <ListItem
            onClick={() => onClick(item.link)}
            sx={{
                borderRadius: "8px",
                mb: 0.5,
                cursor: "pointer",
                px: collapsed ? 1.5 : 1.5,
                py: 1,
                justifyContent: collapsed ? "center" : "flex-start",
                position: "relative",
                backgroundColor: active ? C.active_bg : "transparent",
                borderLeft: active ? `3px solid ${C.active_border}` : "3px solid transparent",
                "&:hover": { backgroundColor: active ? C.active_bg : C.hover_bg },
                transition: "background-color 0.15s ease",
            }}
        >
            <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 34, color: active ? C.active_icon : C.icon }}>
                {item.icon}
            </ListItemIcon>
            {!collapsed && (
                <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: active ? 600 : 400,
                        color: active ? C.active_text : C.text,
                    }}
                />
            )}
        </ListItem>
    </Tooltip>
);

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const [collapsed, setCollapsed] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleNavigate = (link) => router.push(link);

    const sidebarWidth = collapsed ? 64 : 220;

    return (
        <Box
            sx={{
                width: sidebarWidth,
                height: "100vh",
                backgroundColor: C.bg,
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 100,
                transition: "width 0.25s ease",
                overflow: "hidden",
            }}
        >
            {/* ── Logo + 折叠按钮 ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "space-between",
                    px: collapsed ? 1.5 : 2,
                    py: 1.5,
                    minHeight: 56,
                }}
            >
                {!collapsed && (
                    <Box
                        onClick={() => router.push("/")}
                        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                    >
                        <Box
                            sx={{
                                width: 28, height: 28,
                                backgroundColor: C.logo_bg,
                                borderRadius: "6px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>M</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1 }}>MindByte</Typography>
                            <Typography sx={{ fontSize: 10, color: C.label, lineHeight: 1.4 }}>Learning Portal</Typography>
                        </Box>
                    </Box>
                )}

                {collapsed && (
                    <Box
                        onClick={() => router.push("/")}
                        sx={{
                            width: 28, height: 28,
                            backgroundColor: C.logo_bg,
                            borderRadius: "6px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>M</Typography>
                    </Box>
                )}

                {!collapsed && (
                    <Tooltip title="Collapse sidebar" placement="right">
                        <IconButton
                            onClick={() => setCollapsed(true)}
                            size="small"
                            sx={{ color: C.icon, "&:hover": { backgroundColor: C.hover_bg } }}
                        >
                            <MenuOpenIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* 折叠时展开按钮 */}
            {collapsed && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                    <Tooltip title="Expand sidebar" placement="right">
                        <IconButton
                            onClick={() => setCollapsed(false)}
                            size="small"
                            sx={{ color: C.icon, "&:hover": { backgroundColor: C.hover_bg } }}
                        >
                            <MenuIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* ── 主导航 ── */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", px: 1 }}>
                {!collapsed && (
                    <Typography sx={{ px: 1.5, pb: 0.5, pt: 1, fontSize: 11, fontWeight: 600, color: C.label, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Main Menu
                    </Typography>
                )}
                <List disablePadding>
                    {navItems.map((item, i) => (
                        <SidebarItem
                            key={i}
                            item={item}
                            collapsed={collapsed}
                            active={pathname === item.link || (item.link !== "/dashboard/admin" && pathname?.startsWith(item.link))}
                            onClick={handleNavigate}
                        />
                    ))}
                </List>
            </Box>

            {/* ── 底部导航 ── */}
            <Box sx={{ px: 1, pb: 1 }}>
                <List disablePadding>
                    {bottomItems.map((item, i) => (
                        <SidebarItem
                            key={i}
                            item={item}
                            collapsed={collapsed}
                            active={pathname === item.link}
                            onClick={handleNavigate}
                        />
                    ))}
                </List>
            </Box>

            {/* ── 用户状态栏 ── */}
            <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : 1.5,
                    px: collapsed ? 1.5 : 1.5,
                    py: 1.5,
                    justifyContent: collapsed ? "center" : "flex-start",
                    cursor: "pointer",
                    borderTop: `1px solid #e5e7eb`,
                    "&:hover": { backgroundColor: C.hover_bg },
                }}
            >
                <img
                    src={fixS3Url(session?.user?.image) ?? "/images/avatar.png"}
                    alt="avatar"
                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                {!collapsed && (
                    <Box flexGrow={1} overflow="hidden">
                        <Typography fontSize={13} fontWeight={600} color="#141b2b" noWrap>
                            {session?.user?.name ?? "User"}
                        </Typography>
                        <Typography fontSize={11} color={C.label} noWrap>
                            {session?.user?.email ?? ""}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* ── 头像下拉菜单 ── */}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                transformOrigin={{ horizontal: "left", vertical: "bottom" }}
                PaperProps={{
                    sx: { minWidth: 220, borderRadius: "10px", boxShadow: "0px 12px 32px rgba(20,27,43,0.10)", border: "1px solid #e5e7eb" }
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography fontWeight={600} fontSize={14} color="#141b2b">{session?.user?.name}</Typography>
                    <Typography fontSize={12} color={C.label}>{session?.user?.email}</Typography>
                </Box>
                <Divider sx={{ borderColor: "#e5e7eb" }} />
                <MenuItem onClick={() => { router.push("/dashboard/admin/profile"); setAnchorEl(null); }} sx={{ py: 1, fontSize: 14, color: C.text }}>Profile</MenuItem>
                <MenuItem onClick={() => { router.push("/settings"); setAnchorEl(null); }} sx={{ py: 1, fontSize: 14, color: C.text }}>Settings</MenuItem>
                <MenuItem onClick={() => { router.push("/dashboard/admin"); setAnchorEl(null); }} sx={{ py: 1, fontSize: 14, color: C.text }}>Dashboard</MenuItem>
                <Divider sx={{ borderColor: "#e5e7eb" }} />
                <MenuItem onClick={() => { signOut({ callbackUrl: "/" }); setAnchorEl(null); }} sx={{ py: 1, fontSize: 14, color: "#ef4444" }}>
                    Sign out
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Sidebar;
