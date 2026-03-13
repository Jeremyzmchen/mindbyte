"use client"

import React, { useState, useEffect } from "react";
import {
    Box, Modal, TextField, Typography,
    Button, Divider, IconButton,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloseIcon from "@mui/icons-material/Close";
import ReCAPTCHA from "react-google-recaptcha";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

// reCAPTCHA浮窗
const CaptchaProtectionPopup = () => {
    const [hovered, setHovered] = useState(false);

    return (
        <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                backgroundColor: "rgb(33, 179, 255)",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                zIndex: 9999,
            }}
        >
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzHPIg1vi9om7i-Uo1drOVBBytptqaXrqtZWr8Q_PGyWsmTy2QSUSrOGd9S27Ma3fNroA&usqp=CAU"
                alt="reCAPTCHA logo"
                style={{ height: "60px", padding: "10px" }}
            />
            Protected by Google reCAPTCHA.
            {hovered && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                    <a
                        href="https://policies.google.com/privacy?hl=en"
                        style={{ color: "#fff" }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Privacy Policy
                    </a>
                </Typography>
            )}
        </Box>
    );
};


const LoginModal = ({ open, handleClose, defaultTab = 0 }) => {

    // 当前模式：0 = 登录，1 = 注册
    const [activeTab, setActiveTab] = useState(defaultTab);

    // 每次弹窗打开时同步外部传入的 defaultTab
    useEffect(() => {
        if (open) setActiveTab(defaultTab);
    }, [open, defaultTab]);

    // 表单数据
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        organization: "",
    });

    // 表单验证错误
    const [errors, setErrors] = useState({});

    // 提交加载状态
    const [loading, setLoading] = useState(false);

    // reCAPTCHA token
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    // 表单输入变化
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // 输入时清除对应字段的错误提示
        setErrors({ ...errors, [e.target.name]: "" });
    };

    // 注册表单验证
    const validateRegisterForm = () => {
        const errs = {};
        if (!form.name) errs.name = "Name is required";
        if (!form.email) errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
        if (!form.organization) errs.organization = "Organization is required";
        if (!recaptchaToken) errs.recaptcha = "Please complete the reCAPTCHA";
        return errs;
    };

    // 登录表单验证
    const validateLoginForm = () => {
        const errs = {};
        if (!form.email) errs.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
        return errs;
    };

    // 注册提交
    const handleRegister = async (e) => {
        e.preventDefault();
        const validationErrors = validateRegisterForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, recaptchaToken }),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result?.msg);
                setRecaptchaToken(null);

                // 注册成功后自动登录
                await signIn("credentials", {
                    redirect: false,
                    email: form.email,
                    password: form.password,
                });
                handleClose();
            } else {
                toast.error(result?.err);
            }
        } catch {
            toast.error("Error connecting to the server!");
        } finally {
            setLoading(false);
        }
    };

    // 登录提交
    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validateLoginForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: form.email,
                password: form.password,
            });
            if (!result.ok) {
                toast.error(result?.error);
            } else {
                toast.success("Login successfully");
                handleClose();
            }
        } catch {
            toast.error("Error connecting to the server!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        width: "100%",
                        maxWidth: 480,
                        margin: "auto",
                        mt: "6%",
                        p: 4,
                        borderRadius: 3,
                        boxShadow: 24,
                        outline: "none",
                    }}
                >
                    {/* 关闭按钮 */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* 标题 */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: "#000" }}>
                            {activeTab === 0 ? "Welcome back." : "Start Building."}
                        </Typography>
                        <Typography variant="h5" sx={{ color: "#aaa" }}>
                            {activeTab === 0 ? "Log in to your account" : "Create free account"}
                        </Typography>
                    </Box>

                    {/* 第三方登录按钮：Google + GitHub */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Button
                            variant="outlined"
                            startIcon={<GoogleIcon sx={{ color: "#db4437" }} />}
                            onClick={() => signIn("google")}
                            sx={{
                                color: "#000",
                                borderColor: "#e0e0e0",
                                textTransform: "none",
                                fontSize: 15,
                                fontWeight: 500,
                                borderRadius: 2,
                                py: 1.2,
                                "&:hover": { borderColor: "#000", backgroundColor: "#fafafa" },
                            }}
                        >
                            Continue with Google
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<GitHubIcon sx={{ color: "#000" }} />}
                            onClick={() => signIn("github")}
                            sx={{
                                color: "#000",
                                borderColor: "#e0e0e0",
                                textTransform: "none",
                                fontSize: 15,
                                fontWeight: 500,
                                borderRadius: 2,
                                py: 1.2,
                                "&:hover": { borderColor: "#000", backgroundColor: "#fafafa" },
                            }}
                        >
                            Continue with GitHub
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2.5, color: "#aaa", fontSize: 13 }}>OR</Divider>

                    {/* 邮箱密码表单 */}
                    <Box
                        component="form"
                        onSubmit={activeTab === 1 ? handleRegister : handleLogin}
                        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                    >
                        {/* 仅注册时显示姓名 */}
                        {activeTab === 1 && (
                            <TextField
                                fullWidth label="Name" name="name"
                                value={form.name} onChange={handleChange}
                                error={!!errors.name} helperText={errors.name}
                                size="small"
                            />
                        )}

                        {/* 邮箱 */}
                        <TextField
                            fullWidth label="Email" name="email"
                            value={form.email} onChange={handleChange}
                            error={!!errors.email} helperText={errors.email}
                            size="small"
                        />

                        {/* 密码 */}
                        <TextField
                            fullWidth label="Password" name="password" type="password"
                            value={form.password} onChange={handleChange}
                            error={!!errors.password} helperText={errors.password}
                            size="small"
                        />

                        {/* 仅注册时显示机构 */}
                        {activeTab === 1 && (
                            <TextField
                                fullWidth label="Institution/Organization" name="organization"
                                value={form.organization} onChange={handleChange}
                                error={!!errors.organization} helperText={errors.organization}
                                size="small"
                            />
                        )}

                        {/* 仅注册时显示 reCAPTCHA */}
                        {activeTab === 1 && (
                            <>
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                    onChange={setRecaptchaToken}
                                />
                                {errors.recaptcha && (
                                    <Typography color="error" variant="body2">
                                        {errors.recaptcha}
                                    </Typography>
                                )}
                            </>
                        )}

                        {/* 提交按钮 */}
                        <Button
                            fullWidth type="submit" variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff",
                                fontWeight: 600,
                                textTransform: "none",
                                fontSize: 15,
                                borderRadius: 2,
                                py: 1.2,
                                boxShadow: "none",
                                "&:hover": { backgroundColor: "#222", boxShadow: "none" },
                            }}
                        >
                            {loading
                                ? activeTab === 0 ? "Logging in..." : "Creating account..."
                                : activeTab === 0 ? "Continue with email" : "Create account"
                            }
                        </Button>
                    </Box>

                    {/* 切换登录/注册 */}
                    <Typography variant="body2" align="center" sx={{ mt: 2, color: "#666" }}>
                        {activeTab === 0 ? "Don't have an account? " : "Already have an account? "}
                        <span
                            onClick={() => { setActiveTab(activeTab === 0 ? 1 : 0); setErrors({}); }}
                            style={{ color: "#000", fontWeight: 600, cursor: "pointer" }}
                        >
                            {activeTab === 0 ? "Get started" : "Log in"}
                        </span>
                    </Typography>

                    {/* 隐私政策标签 */}
                    <Typography variant="body2" align="center" sx={{ mt: 1.5, color: "#aaa", fontSize: 12 }}>
                        By continuing, you agree to our Privacy Policy & Terms of Service
                    </Typography>
                </Box>
            </Modal>

            {recaptchaToken && <CaptchaProtectionPopup />}
        </>
    );
};

export default LoginModal;