"use client"

import { Box, Button, Typography, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

const MultimediaCard = () => {
  const router = useRouter();

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>

      {/* 两张卡片并排 */}
      <Grid container spacing={2}>

        {/* 卡片1 */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>

            {/* 左：图片 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <img
                src="/images/c-java.jpg"
                alt="Create Course"
                style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
              />
            </Grid>

            {/* 右：文字 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                Create an Engaging Course
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Whether you've been teaching for years or are teaching for the first time,
                you can make an engaging course.
              </Typography>
              <Button
                variant="text"
                sx={{ color: "blueviolet", textTransform: "none", fontWeight: "bold" }}
                onClick={() => router.push("/dashboard/admin/create/content")}
              >
                Get Started
              </Button>
            </Grid>

          </Grid>
        </Grid>

        {/* 卡片2 */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container spacing={2}>

            {/* 左：图片 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <img
                src="/images/c-java.jpg"
                alt="Create Content"
                style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
              />
            </Grid>

            {/* 右：文字 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                Create an Engaging Content
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Whether you've been teaching for years or are teaching for the first time,
                you can make an engaging course.
              </Typography>
              <Button
                variant="text"
                sx={{ color: "blueviolet", textTransform: "none", fontWeight: "bold" }}
                onClick={() => router.push("/dashboard/admin/create/content")}
              >
                Get Started
              </Button>
            </Grid>

          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default MultimediaCard;