"use client"

import { Grid, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

const CourseCard = () => {
    const router = useRouter();
    return (
        <Box>
            <Grid
                container
                spacing={2}
                sx={{
                    padding: { xs: 2, sm: 4 },
                    alignItems: "center",
                }}
            >
                {/* 左侧部分展示内容图片 */}
                <Grid
                    size={{ xs: 12, sm: 4 }}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src="/images/c-js.jpg"
                        alt="Create an Course"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            objectFit: "contain",
                        }}
                    />
                </Grid>

                {/* 右侧展示文字内容描述 */}
                <Grid
                    size={{ xs: 12, sm: 8 }}
                    sx={{
                        textAlign: { xs: "center", sm: "left" },
                    }}
                >
                    {/* Title */}
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                            color: "black",
                            marginBottom: "12px",
                        }}
                    >
                        Course Title
                    </Typography>

                    {/* 内容描述 */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: "black",
                            fontSize: "16px",
                            marginBottom: "20px",
                        }}
                    >
                        On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, 
                        that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, 
                        which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, 
                        when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. 
                    </Typography>

                    {/* 跳转按钮 */}
                    <Button
                        variant="text"
                        sx={{
                            color: "blueviolet",
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                        onClick={() => router.push("/dashboard/admin/create/content")}
                    >
                        Get Started
                    </Button>
                </Grid>
                
            </Grid>

        </Box>
    );
};

export default CourseCard;