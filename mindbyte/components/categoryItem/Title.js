"use client";

import { Box, Typography, Divider, useTheme, useMediaQuery } from "@mui/material";
import { format } from "date-fns";
import Share from "./Share";

const Title = ({ content }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const date = content?.date ? new Date(content.date) : null;
    const formattedDate = date && !isNaN(date) ? format(date, "dd MMM, yyyy") : null;

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ fontWeight: 700, color: "#111827", lineHeight: 1.3, mb: 1.5 }}
            >
                {content?.title || "Untitled"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {formattedDate && (
                    <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
                        Last updated: {formattedDate}
                    </Typography>
                )}
                <Share />
            </Box>

            <Divider sx={{ mt: 2, borderColor: "#e5e7eb" }} />
        </Box>
    );
};

export default Title;
