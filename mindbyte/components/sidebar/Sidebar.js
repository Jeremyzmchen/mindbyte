"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Box, Typography, List, ListItem,
    ListItemIcon, ListItemText, Divider,
    IconButton, Collapse, Menu, MenuItem, Tooltip,
} from "@mui/material";

// 图标
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import GridViewIcon from "@mui/icons-material/GridView";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CategoryIcon from "@mui/icons-material/Category";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BoltIcon from "@mui/icons-material/Bolt";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";


// 菜单数据
const mainItems = [
    { text: "Home",      icon: <HomeIcon />,         link: "/" },
    { text: "Search",    icon: <SearchIcon />,        link: "/search" },
    { text: "Resources", icon: <SettingsIcon />,      link: "/resources" },
];

const projectItems = [
    { text: "All Courses",    icon: <GridViewIcon />,       link: "/dashboard/admin" },
    { text: "Starred",        icon: <StarBorderIcon />,     link: "/dashboard/admin/starred" },
    { text: "Created by me",  icon: <PersonOutlineIcon />,  link: "/dashboard/admin/create/course" },
    { text: "All Users",      icon: <GroupIcon />,          link: "/dashboard/admin/alluser" },
];

const recentItems = [
    { text: "Create Course",      icon: <SchoolIcon />,   link: "/dashboard/admin/create/course" },
    { text: "Create Tutorial",    icon: <MenuBookIcon />, link: "/dashboard/admin/create/content" },
    { text: "Create Category",    icon: <CategoryIcon />, link: "/dashboard/admin/create/category" },
    { text: "Create SubCategory", icon: <CategoryIcon />, link: "/dashboard/admin/create/subcategory" },
    { text: "Create Category with SubCategory", icon: <CategoryIcon />, link: "/dashboard/admin/create/categorywithsubs" },
];

// 单个菜单项
// collapsed 时只显示图标，展开时显示图标+文字
const SidebarItem = ({ item, onClick, collapsed }) => (
    <Tooltip title={collapsed ? item.text : ""} placement="right">
        <ListItem
            onClick={() => onClick(item.link)}
            sx={{
                borderRadius: 2,
                mb: 0.5,
                cursor: "pointer",
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1 : 2,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
            }}
        >
            <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 36, color: "#555" }}>
                {item.icon}
            </ListItemIcon>
            {!collapsed && (
                <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: 14, color: "#333" }}
                />
            )}
        </ListItem>
    </Tooltip>
);

// 分组标题（折叠时隐藏）
const SectionLabel = ({ label, collapsed }) => {
    if (collapsed) return <Divider sx={{ my: 1, borderColor: "#ebe8e3" }} />;
    return (
        <Typography
            variant="caption"
            sx={{ px: 2, py: 1, color: "#aaa", fontWeight: 600, display: "block" }}
        >
            {label}
        </Typography>
    );
};


// Sidebar 主组件
const Sidebar = () => {
    const router = useRouter();
    const { data: session } = useSession();

    // 折叠/展开状态
    const [collapsed, setCollapsed] = useState(true);

    // 顶部用户名下拉
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    // 底部头像菜单
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleNavigate = (link) => router.push(link);

    // 折叠时宽度 64px，展开时 260px
    const sidebarWidth = collapsed ? 64 : 260;

    return (
        <Box
            sx={{
                width: sidebarWidth,
                height: "100vh",
                backgroundColor: "#f9f5f0",
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid #ebe8e3",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 100,
                transition: "width 0.25s ease",
                overflow: "hidden",
            }}
        >
            {/* ── 顶部：Logo + 折叠按钮 ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "space-between",
                    px: collapsed ? 1 : 2,
                    py: 1.5,
                }}
            >
                {/* Logo（折叠时只显示图标） */}
                {!collapsed && (
                    <Box
                        onClick={() => router.push("/")}
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    >
                        <img src="/images/logo.png" alt="logo" style={{ width: 32, height: 32 }} />
                    </Box>
                )}

                {/* 折叠/展开按钮 */}
                <Tooltip title={collapsed ? "Open sidebar" : "Close sidebar"} placement="right">
                    <IconButton
                        onClick={() => {
                            setCollapsed(!collapsed);
                            setUserDropdownOpen(false);
                        }}
                        size="small"
                        sx={{ color: "#888", "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" } }}
                    >
                        {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* ── 用户名下拉（展开时显示）── */}
            {!collapsed && (
                <Box sx={{ px: 2, mb: 1 }}>
                    <Box
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#fff",
                            borderRadius: 2,
                            px: 1.5, py: 1,
                            cursor: "pointer",
                            border: "1px solid #ebe8e3",
                            "&:hover": { backgroundColor: "#f5f0ea" },
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box
                                sx={{
                                    width: 28, height: 28,
                                    borderRadius: 1,
                                    backgroundColor: "#c0392b",
                                    color: "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, fontWeight: "bold", flexShrink: 0,
                                }}
                            >
                                {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                            </Box>
                            <Typography fontSize={14} fontWeight={500} color="#333" noWrap>
                                {session?.user?.name ?? "My Workspace"}
                            </Typography>
                        </Box>
                        <KeyboardArrowDownIcon
                            sx={{
                                fontSize: 18, color: "#aaa",
                                transition: "transform 0.2s",
                                transform: userDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                                flexShrink: 0,
                            }}
                        />
                    </Box>

                    {/* 下拉内容（暂时为空） */}
                    <Collapse in={userDropdownOpen}>
                        <Box
                            sx={{
                                mt: 1, p: 2,
                                backgroundColor: "#fff",
                                borderRadius: 2,
                                border: "1px solid #ebe8e3",
                            }}
                        >
                            <Typography fontSize={13} color="#aaa">Coming soon...</Typography>
                        </Box>
                    </Collapse>
                </Box>
            )}

            {/* 折叠时显示用户首字母头像 */}
            {collapsed && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                    <Box
                        sx={{
                            width: 32, height: 32,
                            borderRadius: 1,
                            backgroundColor: "#c0392b",
                            color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 14, fontWeight: "bold", cursor: "pointer",
                        }}
                        onClick={() => setCollapsed(false)}
                    >
                        {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </Box>
                </Box>
            )}

            {/* ── 菜单内容（可滚动）── */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", px: 1 }}>

                <List disablePadding>
                    {mainItems.map((item, i) => (
                        <SidebarItem key={i} item={item} onClick={handleNavigate} collapsed={collapsed} />
                    ))}
                </List>

                <SectionLabel label="Projects" collapsed={collapsed} />
                <List disablePadding>
                    {projectItems.map((item, i) => (
                        <SidebarItem key={i} item={item} onClick={handleNavigate} collapsed={collapsed} />
                    ))}
                </List>

                {/* 新建按钮 */}
                <Tooltip title={collapsed ? "Create new" : ""} placement="right">
                    <ListItem
                        onClick={() => handleNavigate("/dashboard/admin/create/course")}
                        sx={{
                            borderRadius: 2, mb: 0.5, cursor: "pointer",
                            justifyContent: collapsed ? "center" : "flex-start",
                            px: collapsed ? 1 : 2,
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 36, color: "#aaa" }}>
                            <AddIcon />
                        </ListItemIcon>
                        {!collapsed && (
                            <ListItemText
                                primary="Create new"
                                primaryTypographyProps={{ fontSize: 14, color: "#aaa" }}
                            />
                        )}
                    </ListItem>
                </Tooltip>

                <SectionLabel label="Recents" collapsed={collapsed} />
                <List disablePadding>
                    {recentItems.map((item, i) => (
                        <SidebarItem key={i} item={item} onClick={handleNavigate} collapsed={collapsed} />
                    ))}
                </List>
            </Box>

            {/* ── 底部卡片区（展开时显示）── */}
            {!collapsed && (
                <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                    {/* 卡片1：升级 Pro */}
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #ebe8e3",
                            borderRadius: 2,
                            p: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f5f0ea" },
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <BoltIcon sx={{ fontSize: 18, color: "#f5a623" }} />
                            <Typography fontSize={13} fontWeight={500}>Upgrade to Pro</Typography>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: "#7c3aed",
                                color: "#fff",
                                fontSize: 12, fontWeight: 600,
                                px: 1.5, py: 0.5, borderRadius: 1.5,
                            }}
                        >
                            Pro
                        </Box>
                    </Box>

                    {/* 卡片2：分享 */}
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #ebe8e3",
                            borderRadius: 2,
                            p: 1.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f5f0ea" },
                        }}
                    >
                        <GroupIcon sx={{ fontSize: 18, color: "#555" }} />
                        <Box>
                            <Typography fontSize={13} fontWeight={500}>Share Platform</Typography>
                            <Typography fontSize={11} color="#aaa">Invite your friends</Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            <Divider sx={{ borderColor: "#ebe8e3" }} />

            {/* ── 底部用户状态栏 ── */}
            <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : 1.5,
                    p: collapsed ? 1 : 1.5,
                    justifyContent: collapsed ? "center" : "flex-start",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                }}
            >
                <img
                    src={session?.user?.image ?? "/images/avatar.png"}
                    alt="avatar"
                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                {!collapsed && (
                    <Box flexGrow={1} overflow="hidden">
                        <Typography fontSize={13} fontWeight={500} color="#333" noWrap>
                            {session?.user?.name ?? "User"}
                        </Typography>
                        <Typography fontSize={11} color="#aaa" noWrap>
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
                slotProps={{
                    sx: { minWidth: 220, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }
                }}
            >
                <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                    <Typography fontWeight="bold" fontSize={15}>{session?.user?.name}</Typography>
                    <Typography variant="body2" sx={{ color: "#aaa", fontSize: 13 }}>{session?.user?.email}</Typography>
                </Box>
                <MenuItem onClick={() => { router.push("/profile"); setAnchorEl(null); }} sx={{ py: 1.2, fontSize: 14 }}>Profile</MenuItem>
                <MenuItem onClick={() => { router.push("/settings"); setAnchorEl(null); }} sx={{ py: 1.2, fontSize: 14 }}>Settings</MenuItem>
                <MenuItem onClick={() => { router.push("/dashboard/admin"); setAnchorEl(null); }} sx={{ py: 1.2, fontSize: 14 }}>Dashboard</MenuItem>
                <Divider />
                <MenuItem onClick={() => { signOut({ callbackUrl: "/" }); setAnchorEl(null); }} sx={{ py: 1.2, fontSize: 14, color: "#e53935" }}>
                    Sign out
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Sidebar;