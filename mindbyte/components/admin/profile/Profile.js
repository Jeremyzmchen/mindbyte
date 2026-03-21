"use client"

import { useState, useEffect } from "react"
import { Box, TextField, Typography, Button, Alert } from "@mui/material"
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

    // 表单验证
    const validateForm = () => {
        const errs = {}
        if (!name) errs.name = "Name is required"
        if (!email) errs.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email is invalid"
        if (!password) errs.password = "Password is required"
        if (password !== confirmPassword) errs.confirmPassword = "Password doesn't match"
        setErrors(errs)
        return Object.keys(errs).length === 0;
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/profile`)
            if (!response.ok) {
                throw new Error("Failed to fetch user;s data")
            }

            const data = await response.json();
            setName(data?.name)
            setEmail(data?.email)
            setAvatar(data?.image)
        } catch (error) {
            console.log("Failed to fetch user's data", error)
        }
    }

    // 选择图片时预览
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    }

    // 上传头像到 S3
    const handleAvatarSubmit = async () => {
        if (!avatar) {
            setServerMsg("Please select an image first");
            setIsSuccess(false);
            return;
        }

        const formData = new FormData();
        formData.append("avatar", avatar);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/admin/profile/upload-avatar`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            if (response.status === 200) {
                setIsSuccess(true);
                setServerMsg(data?.message);
            } else {
                setIsSuccess(false);
                setServerMsg(data?.error);
            }
        } catch (error) {
            setIsSuccess(false);
            setServerMsg("Error uploading avatar");
        }
    }

    // 更新用户资料
    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerMsg('');

        if (!validateForm()) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/admin/profile`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                }
            );
            const data = await response.json();
            if (response.status === 200) {
                setIsSuccess(true);
                setServerMsg(data?.message);
            } else {
                setIsSuccess(false);
                setServerMsg(data?.error);
                setPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            setIsSuccess(false);
            setServerMsg("Error updating profile");
        }
    }

    return (
        <Box sx={{
            backgroundImage: "url(/images/bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "20px",
        }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    maxWidth: 500,
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    marginTop: "30px",
                    padding: "40px",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Profile Content
                </Typography>

                {/* 头像预览 */}
                {avatarPreview && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
                        />
                    </Box>
                )}

                <TextField
                    label="Name" variant="outlined" fullWidth
                    value={name} onChange={(e) => setName(e.target.value)}
                    error={!!errors.name} helperText={errors.name}
                />
                <TextField
                    label="Email" variant="outlined" fullWidth
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email} helperText={errors.email}
                />
                <TextField
                    label="Password" type="password" variant="outlined" fullWidth
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password} helperText={errors.password}
                />
                <TextField
                    label="Confirm Password" type="password" variant="outlined" fullWidth
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errors.confirmPassword} helperText={errors.confirmPassword}
                />

                {/* 选择图片 + 上传头像 */}
                <Button component="label" sx={{ backgroundColor: "white" }}>
                    Select Avatar
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>

                <Button
                    onClick={handleAvatarSubmit}
                    sx={{ backgroundColor: "white" }}
                >
                    Update Avatar
                </Button>

                {/* 提示信息 */}
                {serverMsg && (
                    <Alert severity={isSuccess ? "success" : "error"}>
                        {serverMsg}
                    </Alert>
                )}

                <Button type="submit" sx={{ backgroundColor: "white" }}>
                    Update Profile
                </Button>

            </Box>
        </Box>
    )
}

export default Profile;