"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, TextField, Typography, Button, Alert, CircularProgress } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const C = {
    bg: "#f9fafb",
    card: "#ffffff",
    primary: "#111827",
    text: "#111827",
    text_secondary: "#6b7280",
    label: "#9ca3af",
    border: "#e5e7eb",
};

const inputSx = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: C.card,
        borderRadius: "8px",
        "& fieldset": { borderColor: C.border },
        "&:hover fieldset": { borderColor: "#374151" },
        "&.Mui-focused fieldset": { borderColor: C.primary },
    },
    "& label.Mui-focused": { color: C.primary },
};

export default function UserProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [organization, setOrganization] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverMsg, setServerMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status]);

    useEffect(() => {
        if (status !== "authenticated") return;
        fetch("/api/user/profile")
            .then((r) => r.json())
            .then((data) => {
                setName(data.name || "");
                setEmail(data.email || "");
                setOrganization(data.organization || "");
                setAvatarPreview(data.image || "");
            });
    }, [status]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 本地预览
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);

        // 立即上传到 S3
        setUploading(true);
        setServerMsg("");
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const res = await fetch("/api/user/profile/upload-avatar", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setIsSuccess(true);
                setServerMsg("Avatar updated successfully.");
            } else {
                setIsSuccess(false);
                setServerMsg(data.error || "Error uploading avatar");
            }
        } catch {
            setIsSuccess(false);
            setServerMsg("Error uploading avatar");
        } finally {
            setUploading(false);
        }
    };

    const validate = () => {
        const errs = {};
        if (!name) errs.name = "Name is required";
        if (password && password !== confirmPassword) errs.confirmPassword = "Passwords don't match";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMsg("");
        if (!validate()) return;
        setSaving(true);
        try {
            const body = { name, organization };
            if (password) body.password = password;
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) {
                setIsSuccess(true);
                setServerMsg("Profile updated successfully.");
                setPassword("");
                setConfirmPassword("");
            } else {
                setIsSuccess(false);
                setServerMsg(data.err || "Error updating profile");
            }
        } catch {
            setIsSuccess(false);
            setServerMsg("Error updating profile");
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress sx={{ color: "#111827" }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: C.bg }}>
            <DashboardSidebar active="profile" onChange={(key) => router.push(`/dashboard/user${key === "overview" ? "" : `/${key}`}`)} user={session?.user} />

            <Box sx={{ flex: 1, p: { xs: 4, md: 6 } }}>
                <Box sx={{ mb: 5 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.label, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
                        Account
                    </Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                        Edit Profile
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: C.text_secondary, mt: 0.5 }}>
                        Update your personal information and password.
                    </Typography>
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        maxWidth: 520,
                        backgroundColor: C.card,
                        borderRadius: "8px",
                        border: `1px solid ${C.border}`,
                        p: { xs: 3, md: 4 },
                    }}
                >
                    {/* Avatar */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
                        <Box sx={{ position: "relative", mb: 1.5 }}>
                            <Box sx={{
                                width: 96, height: 96, borderRadius: "12px", overflow: "hidden",
                                bgcolor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center",
                                border: `2px solid ${C.border}`,
                            }}>
                                {avatarPreview
                                    ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <Typography sx={{ fontSize: 32 }}>👤</Typography>
                                }
                            </Box>
                            <Box component="label" sx={{
                                position: "absolute", bottom: -8, right: -8,
                                width: 28, height: 28, borderRadius: "50%",
                                bgcolor: C.primary, display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", border: "2px solid #fff",
                            }}>
                                <CameraAltIcon sx={{ fontSize: 14, color: "#fff" }} />
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </Box>
                        </Box>
                        <Typography sx={{ fontSize: 13, color: C.label }}>
                            {uploading ? "Uploading..." : "Click the camera icon to change photo"}
                        </Typography>
                    </Box>

                    {/* Fields */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <TextField label="Full Name" fullWidth value={name} onChange={(e) => setName(e.target.value)}
                            error={!!errors.name} helperText={errors.name} sx={inputSx} />
                        <TextField label="Email Address" fullWidth value={email} disabled sx={inputSx} />
                        <TextField label="Organization" fullWidth value={organization} onChange={(e) => setOrganization(e.target.value)} sx={inputSx} />
                        <TextField label="New Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)}
                            helperText="Leave blank to keep current password" sx={inputSx} />
                        <TextField label="Confirm Password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!errors.confirmPassword} helperText={errors.confirmPassword} sx={inputSx} />
                    </Box>

                    {serverMsg && (
                        <Alert severity={isSuccess ? "success" : "error"} sx={{ mt: 2.5, borderRadius: "8px" }}>
                            {serverMsg}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        disabled={saving}
                        sx={{
                            mt: 3,
                            bgcolor: "#111827", color: "#fff",
                            fontWeight: 600, textTransform: "none",
                            borderRadius: "8px", py: 1.5, fontSize: 15,
                            "&:hover": { opacity: 0.9 },
                            "&.Mui-disabled": { bgcolor: "#6b7280", color: "#fff" },
                        }}
                    >
                        {saving ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Save Changes"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
