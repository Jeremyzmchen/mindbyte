"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

const Advertisement = ({ adData = [] }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [showAd, setShowAd] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (adData.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adData.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [adData]);

    if (!showAd || adData.length === 0) return null;

    return (
        <Box
            onClick={() => adData[currentAdIndex]?.link && window.open(adData[currentAdIndex].link, '_blank')}
            sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                maxHeight: '300px',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.02)' },
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                bgcolor: '#fff',
            }}
        >
            <Image
                src={adData[currentAdIndex].image}
                alt={adData[currentAdIndex].title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1200px) 100vw, 25vw"
            />

            {/* 关闭按钮 */}
            <IconButton
                onClick={(e) => { e.stopPropagation(); setShowAd(false); }}
                sx={{
                    position: 'absolute', top: 8, right: 8,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(4px)',
                    color: '#fff',
                    padding: '4px',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            {/* 文字遮罩 */}
            <Box sx={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: '20px 10px 10px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: '#fff',
                zIndex: 1
            }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                    {adData[currentAdIndex].title}
                </Typography>
            </Box>
        </Box>
    );
};

export default Advertisement;