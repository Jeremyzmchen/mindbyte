"use client";

import { useState } from "react";
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, IconButton, Tooltip, Divider, Menu, MenuItem } from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import GridViewIcon from "@mui/icons-material/GridView";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

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
    { key: "overview",     label: "Overview",     icon: GridViewIcon,      route: null },
    { key: "subscription", label: "Subscription", icon: StarBorderIcon,    route: null },
    { key: "courses",      label: "Courses",      icon: MenuBookIcon,      route: null },
    { key: "billing",      label: "Billing",      icon: ReceiptLongIcon,   route: null },
    { key: "profile",      label: "Profile",      icon: PersonOutlineIcon, route: "/dashboard/user/profile" },
];

const fixS3Url = (url) => {
    if (!url) return url;
    return url.replace(
        /^https:\/\/(.+?)\.s3\.([^.]+)\.amazonaws\.com\/(.+)$/,
        "https://s3.$2.amazonaws.com/$1/$3"
    );
};

export default function DashboardSidebar({ active, onChange, user }) {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const sidebarWidth = collapsed ? 64 : 300;

    return (
        <Box sx={{
            width: sidebarWidth,
            flexShrink: 0,
            bgcolor: C.bg,
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            position: "sticky",
            top: 0,
            transition: "width 0.25s ease",
            overflow: "hidden",
            zIndex: 100,
        }}>
            {/* Logo + collapse button */}
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "space-between",
                px: collapsed ? 1.5 : 2,
                py: 3,
                minHeight: 72,
                borderBottom: "1px solid #e5e7eb",
            }}>
                {!collapsed && (
                    <Box onClick={() => router.push("/")} sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
                        <Box sx={{ width: 28, height: 28, bgcolor: C.logo_bg, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>M</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1 }}>MindByte</Typography>
                            <Typography sx={{ fontSize: 10, color: C.label, lineHeight: 1.4 }}>User Dashboard</Typography>
                        </Box>
                    </Box>
                )}
                {collapsed && (
                    <Box onClick={() => router.push("/")} sx={{ width: 28, height: 28, bgcolor: C.logo_bg, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Typography sx={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>M</Typography>
                    </Box>
                )}
                {!collapsed && (
                    <Tooltip title="Collapse sidebar" placement="right">
                        <IconButton onClick={() => setCollapsed(true)} size="small" sx={{ color: C.icon, "&:hover": { bgcolor: C.hover_bg } }}>
                            <MenuOpenIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Expand button when collapsed */}
            {collapsed && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                    <Tooltip title="Expand sidebar" placement="right">
                        <IconButton onClick={() => setCollapsed(false)} size="small" sx={{ color: C.icon, "&:hover": { bgcolor: C.hover_bg } }}>
                            <MenuIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Nav items */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", px: 1, }}>
                <List disablePadding>
                    {navItems.map(({ key, label, icon: Icon, route }) => {
                        const isActive = active === key;
                        return (
                            <Tooltip key={key} title={collapsed ? label : ""} placement="right">
                                <ListItem
                                    onClick={() => route ? router.push(route) : onChange(key)}
                                    sx={{
                                        borderRadius: "8px",
                                        mb: 0.5,
                                        cursor: "pointer",
                                        px: 1.5,
                                        py: 1,
                                        justifyContent: collapsed ? "center" : "flex-start",
                                        bgcolor: isActive ? C.active_bg : "transparent",
                                        borderLeft: isActive ? `3px solid ${C.active_border}` : "3px solid transparent",
                                        "&:hover": { bgcolor: isActive ? C.active_bg : C.hover_bg },
                                        transition: "background-color 0.15s ease",
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 34, color: isActive ? C.active_icon : C.icon }}>
                                        <Icon fontSize="small" />
                                    </ListItemIcon>
                                    {!collapsed && (
                                        <ListItemText
                                            primary={label}
                                            primaryTypographyProps={{
                                                fontSize: 14,
                                                fontWeight: isActive ? 600 : 400,
                                                color: isActive ? C.active_text : C.text,
                                            }}
                                        />
                                    )}
                                </ListItem>
                            </Tooltip>
                        );
                    })}
                </List>
            </Box>

            {/* User avatar + menu */}
            <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : 1.5,
                    px: 1.5,
                    py: 1.5,
                    justifyContent: collapsed ? "center" : "flex-start",
                    cursor: "pointer",
                    borderTop: "1px solid #e5e7eb",
                    "&:hover": { bgcolor: C.hover_bg },
                }}
            >
                <Avatar
                    src={fixS3Url(user?.image)}
                    sx={{ width: 32, height: 32, bgcolor: "#374151", fontSize: 13, flexShrink: 0 }}
                >
                    {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                {!collapsed && (
                    <Box flexGrow={1} overflow="hidden">
                        <Typography fontSize={13} fontWeight={600} color="#141b2b" noWrap>
                            {user?.name ?? "User"}
                        </Typography>
                        <Typography fontSize={11} color={C.label} noWrap>
                            {user?.email ?? ""}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                transformOrigin={{ horizontal: "left", vertical: "bottom" }}
                PaperProps={{
                    sx: { minWidth: 200, borderRadius: "8px", boxShadow: "0px 12px 32px rgba(20,27,43,0.10)", border: "1px solid #e5e7eb" }
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography fontWeight={600} fontSize={14} color="#141b2b">{user?.name}</Typography>
                    <Typography fontSize={12} color={C.label}>{user?.email}</Typography>
                </Box>
                <Divider sx={{ borderColor: "#e5e7eb" }} />
                <MenuItem onClick={() => { router.push("/"); setAnchorEl(null); }} sx={{ py: 1, fontSize: 14, color: C.text }}>Home</MenuItem>
                <Divider sx={{ borderColor: "#e5e7eb" }} />
                <MenuItem onClick={() => { signOut({ callbackUrl: "/" }); setAnchorEl(null); }} sx={{ py: 1, fontSize: 14, color: "#ef4444" }}>
                    Sign out
                </MenuItem>
            </Menu>
        </Box>
    );
}
