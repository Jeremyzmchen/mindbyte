"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

const ads = [
    { image: '/images/ads1.png', link: 'https://github.com/Jeremyzmchen', title: 'Ad Title 1', desc: 'Ad description 1' },
    { image: '/images/ads2.png', link: 'https://github.com/Jeremyzmchen', title: 'Ad Title 2', desc: 'Ad description 2' },
    { image: '/images/ads3.png', link: 'https://github.com/Jeremyzmchen', title: 'Ad Title 3', desc: 'Ad description 3' },
];

const Advertisement = () => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [showAd, setShowAd] = useState(true);

    // 广告位手机端电脑端主题央视切换
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // 定时器，广告图片轮播
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleCloseAd = (e) => {
        e.stopPropagation();
        setShowAd(false);
    };

    const handleAdClick = () => {
        const currentAd = ads[currentAdIndex];
        // 广告链接跳转
        if (currentAd?.link) window.open(currentAd.link, '_blank');
    };

    if (!showAd) return null;

    return (
        <Box
            onClick={handleAdClick}
            sx={{
                position: 'relative',
                width: isMobile ? '85%' : '250px',
                height: isMobile ? '250px' : '400px',
                margin: 'auto',
                marginTop: '20px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
            }}
        >
            {/* 广告图片 */}
            <Image
                src={ads[currentAdIndex].image}
                alt={`Ad ${currentAdIndex + 1}`}
                fill
                style={{ objectFit: 'cover' }}
            />

            {/* 关闭按钮 */}
            <IconButton
                onClick={handleCloseAd}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    zIndex: 1,
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* 广告文字 */}
            <Box sx={{ position: 'absolute', bottom: 16, left: 16, color: '#fff', zIndex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {ads[currentAdIndex].title}
                </Typography>
                <Typography variant="body2">
                    {ads[currentAdIndex].desc}
                </Typography>
            </Box>
        </Box>
    );
};

export default Advertisement;