"use client";

import { Box, Typography, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useRouter } from "next/navigation";

export default function SubscriptionAd() {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
        borderRadius: "10px",
        p: 2.5,
      }}
    >
      {/* 标题 */}
      <Typography
        sx={{
          fontSize: "14px",
          color: "#ffffff",
          mb: 1,
        }}
      >
        You're viewing the free version.
      </Typography>

      {/* 描述 */}
      <Typography
        sx={{
          fontSize: "13px",
          color: "#d1d5db",
          lineHeight: 1.6,
          mb: 2,
        }}
      >
        Upgrade to remove ads and unlock full course access.
      </Typography>

      {/* CTA */}
      <Button
        size="small"
        onClick={() => router.push("/Subscribe")}
        sx={{
          textTransform: "none",
          fontWeight: 700,
          fontSize: "13px",
          letterSpacing: "0.06em",
          bgcolor: "#fbbf24",
          color: "#111827",
          borderRadius: "20px",
          px: 1.5,
          py: 0.5,
          minWidth: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          "&:hover": { bgcolor: "#f59e0b" },
        }}
      >
        <StarIcon sx={{ fontSize: 14, color: "#111827" }} />
        Upgrade →
      </Button>
    </Box>
  );
}