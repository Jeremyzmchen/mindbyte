"use client"

import React, { useState } from "react";

const fixS3Url = (url) => {
    if (!url) return url;
    return url.replace(
        /^https:\/\/(.+?)\.s3\.([^.]+)\.amazonaws\.com\/(.+)$/,
        'https://s3.$2.amazonaws.com/$1/$3'
    );
};
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// Material UI 组件
import {
    AppBar, Box, IconButton,
    Toolbar, Typography, Divider,
    Menu, MenuItem,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Drawer from "@mui/material/Drawer";

// Material UI 图标
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// 自定义组件
import SignInButton from "@/components/loginModal/signInButton";

// 导航栏主菜单项
const menuItems = ["Courses", "Tutorials", "Practice", "Interview Prep"];

const Navbar = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    // 移动端抽屉开关
    const [drawerOpen, setDrawerOpen] = useState(false);

    // 头像下拉菜单
    // anchorEl 记录点击的元素位置，Menu 根据这个位置定位
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: "#fff",
                color: "#000",
                borderBottom: "1px solid #e0e0e0",
            }}
        >
            <Toolbar sx={{ height: 70, px: { xs: 2, md: 4 } }}>

                {/* Logo（左对齐） */}
                <Box
                    onClick={() => router.push("/")}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        flexShrink: 0,
                    }}
                >
                    <img src="/images/logo.png" alt="logo" style={{ width: 36, height: 36 }} />
                    <Typography fontWeight="bold" fontSize={18}>mindbyte</Typography>
                </Box>

                {/* 桌面端：居中菜单项（md以上显示） */}
                <Box
                    display={{ xs: "none", md: "flex" }}
                    alignItems="center"
                    justifyContent="center"
                    flexGrow={1}
                    gap={4}
                >
                    {menuItems.map((item, index) => (
                        <Typography
                            key={index}
                            onClick={() => router.push(`/${item.toLowerCase().replace(" ", "-")}`)}
                            sx={{
                                cursor: "pointer",
                                color: "#555",
                                fontSize: 18,
                                "&:hover": { color: "#000" },
                            }}
                        >
                            {item}
                        </Typography>
                    ))}
                </Box>

                {/* 桌面端：右侧区域（md以上显示） */}
                <Box display={{ xs: "none", md: "flex" }} alignItems="center" gap={1.5} flexShrink={0}>
                    {status === "authenticated" ? (
                        // 已登录：显示头像，点击弹出下拉菜单
                        <img
                            src={fixS3Url(session?.user?.image) ?? "/images/avatar.png"}
                            alt="User Avatar"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                cursor: "pointer",
                            }}
                            onClick={handleAvatarClick}
                        />
                    ) : (
                        // 未登录：Log in + Get started
                        <>
                            <SignInButton defaultTab={0} />
                            <SignInButton defaultTab={1} />
                        </>
                    )}
                </Box>

                {/* 移动端：头像（已登录）+ 汉堡图标（md以下显示） */}
                <Box display={{ xs: "flex", md: "none" }} ml="auto" alignItems="center" gap={1}>
                    {status === "authenticated" && (
                        <img
                            src={fixS3Url(session?.user?.image) ?? "/images/avatar.png"}
                            alt="User Avatar"
                            style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                cursor: "pointer",
                            }}
                            onClick={handleAvatarClick}
                        />
                    )}
                    <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#000" }}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Toolbar>

            {/* 头像菜单 */}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                // 菜单相对于头像的定位：右下角展开
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                    sx: {
                        minWidth: 220,
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                        mt: 0.5,
                    }
                }}
            >
                {/* 用户信息区域 */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                    <Typography fontWeight="bold" fontSize={15}>
                        {session?.user?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#aaa", fontSize: 13 }}>
                        {session?.user?.email}
                    </Typography>
                </Box>

                {/* 菜单项 */}
                <MenuItem
                    onClick={() => { router.push("/profile"); handleMenuClose(); }}
                    sx={{ py: 1.2, fontSize: 14 }}
                >
                    Profile
                </MenuItem>
                <MenuItem
                    onClick={() => { router.push("/settings"); handleMenuClose(); }}
                    sx={{ py: 1.2, fontSize: 14 }}
                >
                    Settings
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        router.push(
                            session?.user?.role === "admin"
                                ? "/dashboard/admin"
                                : "/dashboard/user"
                        );
                        handleMenuClose();
                    }}
                    sx={{ py: 1.2, fontSize: 14 }}
                >
                    Dashboard
                </MenuItem>

                <Divider />

                {/* 退出登录 */}
                <MenuItem
                    onClick={() => { signOut(); handleMenuClose(); }}
                    sx={{ py: 1.2, fontSize: 14, color: "#e53935" }}
                >
                    Sign out
                </MenuItem>
            </Menu>

            {/* 移动端全屏抽屉 */}
            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                anchor="top"
                slotProps={{
                    paper: { sx: { width: "100%", backgroundColor: "#fff" } }
                }}
            >
                {/* 抽屉顶部：Logo + 关闭按钮 */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        height: 70,
                        borderBottom: "1px solid #e0e0e0",
                    }}
                >
                    <Box
                        onClick={() => { router.push("/"); setDrawerOpen(false); }}
                        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                    >
                        <img src="/images/logo.png" alt="logo" style={{ width: 36, height: 36 }} />
                        <Typography fontWeight="bold" fontSize={18}>mindbyte</Typography>
                    </Box>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#000" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* 抽屉菜单列表 */}
                <List sx={{ px: 1 }}>
                    {menuItems.map((text, index) => (
                        <React.Fragment key={index}>
                            <ListItem
                                onClick={() => {
                                    router.push(`/${text.toLowerCase().replace(" ", "-")}`);
                                    setDrawerOpen(false);
                                }}
                                sx={{
                                    cursor: "pointer",
                                    py: 2,
                                    px: 2,
                                    color: "#333",
                                    "&:hover": { backgroundColor: "#f5f5f5", borderRadius: 1 },
                                }}
                            >
                                <Typography fontSize={16}>{text}</Typography>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>

                {/* 抽屉底部：登录状态判断 */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 3,
                        py: 3,
                        borderTop: "1px solid #e0e0e0",
                        mt: 1,
                        gap: 2,
                    }}
                >
                    {status === "authenticated" ? (
                        // 已登录：显示用户信息 + 退出按钮
                        <Box sx={{ width: "100%" }}>
                            <Typography fontWeight="bold">{session?.user?.name}</Typography>
                            <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
                                {session?.user?.email}
                            </Typography>
                            <Box
                                onClick={() => { signOut(); setDrawerOpen(false); }}
                                sx={{
                                    width: "100%",
                                    py: 1.5,
                                    textAlign: "center",
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    fontSize: 15,
                                }}
                            >
                                Sign out
                            </Box>
                        </Box>
                    ) : (
                        // 未登录：Log in + Get started
                        <>
                            <SignInButton defaultTab={0} />
                            <SignInButton defaultTab={1} />
                        </>
                    )}
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;