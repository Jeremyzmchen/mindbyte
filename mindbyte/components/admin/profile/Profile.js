"use client"

import { useState, useEffect } from "react"
import { Box, TextField, Typography, Button, Alert, CircularProgress } from "@mui/material"
import CameraAltIcon from "@mui/icons-material/CameraAlt"

const C = {
    bg: "#f9fafb",
    card: "#ffffff",
    primary: "#111827",
    text: "#111827",
    text_secondary: "#6b7280",
    label: "#9ca3af",
    border: "#e5e7eb",
}

const inputSx = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: C.card,
        borderRadius: "8px",
        "& fieldset": { borderColor: C.border },
        "&:hover fieldset": { borderColor: "#374151" },
        "&.Mui-focused fieldset": { borderColor: C.primary },
    },
    "& label.Mui-focused": { color: C.primary },
}

const Profile = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [avatar, setAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState("")
    const [errors, setErrors] = useState({})
    const [serverMsg, setServerMsg] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [uploading, setUploading] = useState(false)

    const validateForm = () => {
        const errs = {}
        if (!name) errs.name = "Name is required"
        if (!email) errs.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email is invalid"
        if (!password) errs.password = "Password is required"
        if (password !== confirmPassword) errs.confirmPassword = "Passwords don't match"
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    useEffect(() => { fetchUserData() }, [])

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/profile`)
            if (!response.ok) throw new Error("Failed to fetch")
            const data = await response.json()
            setName(data?.name)
            setEmail(data?.email)
            setAvatar(data?.image)
        } catch (error) {
            console.log(error)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(file)
            const reader = new FileReader()
            reader.onloadend = () => setAvatarPreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const handleAvatarSubmit = async () => {
        if (!avatar || typeof avatar === "string") {
            setServerMsg("Please select a new image first")
            setIsSuccess(false)
            return
        }
        setUploading(true)
        const formData = new FormData()
        formData.append("avatar", avatar)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/profile/upload-avatar`, {
                method: "POST",
                body: formData,
            })
            const data = await response.json()
            if (response.status === 200) {
                setIsSuccess(true)
                setServerMsg(data?.message)
            } else {
                setIsSuccess(false)
                setServerMsg(data?.error)
            }
        } catch {
            setIsSuccess(false)
            setServerMsg("Error uploading avatar")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerMsg("")
        if (!validateForm()) return
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })
            const data = await response.json()
            if (response.status === 200) {
                setIsSuccess(true)
                setServerMsg(data?.message)
            } else {
                setIsSuccess(false)
                setServerMsg(data?.error)
                setPassword("")
                setConfirmPassword("")
            }
        } catch {
            setIsSuccess(false)
            setServerMsg("Error updating profile")
        }
    }

    const displayAvatar = avatarPreview || (typeof avatar === "string" ? avatar : null)

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, backgroundColor: C.bg, minHeight: "100vh" }}>
            {/* ── 页面标题 ── */}
            <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
                    Management
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                    Edit Your Profile
                </Typography>
                <Typography sx={{ fontSize: 14, color: C.text_secondary, mt: 0.5 }}>
                    Update your administrative credentials and appearance
                </Typography>
            </Box>

            {/* ── 表单卡片 ── */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 520,
                    mx: "auto",
                    backgroundColor: C.card,
                    borderRadius: "14px",
                    border: `1px solid ${C.border}`,
                    p: { xs: 3, md: 4 },
                }}
            >
                {/* 头像 */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
                    <Box sx={{ position: "relative", mb: 1.5 }}>
                        <Box
                            sx={{
                                width: 96, height: 96,
                                borderRadius: "12px",
                                overflow: "hidden",
                                backgroundColor: "#f3f4f6",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                border: `2px solid ${C.border}`,
                            }}
                        >
                            {displayAvatar ? (
                                <img src={displayAvatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <Typography sx={{ fontSize: 32 }}>👤</Typography>
                            )}
                        </Box>
                        <Box
                            component="label"
                            sx={{
                                position: "absolute", bottom: -8, right: -8,
                                width: 28, height: 28,
                                borderRadius: "50%",
                                backgroundColor: C.primary,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                                border: "2px solid #fff",
                            }}
                        >
                            <CameraAltIcon sx={{ fontSize: 14, color: "#fff" }} />
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Box>
                    </Box>
                    <Typography
                        component="label"
                        htmlFor="avatar-upload"
                        sx={{ fontSize: 13, fontWeight: 600, color: C.primary, cursor: "pointer" }}
                    >
                        Change Photo
                    </Typography>
                </Box>

                {/* 表单字段 */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField label="Full Name" fullWidth value={name} onChange={(e) => setName(e.target.value)}
                        error={!!errors.name} helperText={errors.name} sx={inputSx} />
                    <TextField label="Email Address" fullWidth value={email} onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email} helperText={errors.email} sx={inputSx} />
                    <TextField label="New Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password} helperText={errors.password} sx={inputSx} />
                    <TextField label="Confirm Password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword} helperText={errors.confirmPassword} sx={inputSx} />
                </Box>

                {/* 头像按钮组 */}
                <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
                    <Button
                        component="label"
                        fullWidth
                        sx={{
                            backgroundColor: "#f9fafb", color: C.text, fontWeight: 600,
                            textTransform: "none", borderRadius: "8px", py: 1.25,
                            border: `1px solid ${C.border}`,
                            "&:hover": { backgroundColor: "#f3f4f6" },
                        }}
                    >
                        Select Avatar
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                    <Button
                        fullWidth
                        onClick={handleAvatarSubmit}
                        disabled={uploading}
                        sx={{
                            backgroundColor: "#f9fafb", color: C.text, fontWeight: 600,
                            textTransform: "none", borderRadius: "8px", py: 1.25,
                            border: `1px solid ${C.border}`,
                            "&:hover": { backgroundColor: "#f3f4f6" },
                        }}
                    >
                        {uploading ? <CircularProgress size={18} sx={{ color: C.primary }} /> : "Update Avatar"}
                    </Button>
                </Box>

                {serverMsg && (
                    <Alert severity={isSuccess ? "success" : "error"} sx={{ mt: 2.5, borderRadius: "8px" }}>
                        {serverMsg}
                    </Alert>
                )}

                {/* 保存按钮 */}
                <Button
                    type="submit"
                    fullWidth
                    sx={{
                        mt: 3,
                        background: "#111827",
                        color: "#fff", fontWeight: 600, textTransform: "none",
                        borderRadius: "8px", py: 1.5, fontSize: 15,
                        boxShadow: "none", "&:hover": { opacity: 0.9 },
                    }}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    )
}

export default Profile
