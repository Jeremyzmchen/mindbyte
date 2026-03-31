"use client";

import React, { useState, useEffect } from 'react';
import {
    Modal, Box, IconButton, Typography, List, ListItem, 
    ListItemIcon, ListItemText, Snackbar, SnackbarContent, Tooltip
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RedditIcon from '@mui/icons-material/Reddit';
import CheckIcon from '@mui/icons-material/Check';

import {
    EmailShareButton, FacebookShareButton, XShareButton,
    TelegramShareButton, LinkedinShareButton, WhatsappShareButton, RedditShareButton,
} from 'react-share';

const SocialShareModal = () => {
    const [open, setOpen] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href || '');
        }
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setSnackbarOpen(true);
                setOpen(false); // 复制后自动关闭
            });
    };

    const socialIcons = [
        { label: 'Copy link', icon: <LinkIcon />, onClick: handleCopyLink },
        { label: 'Facebook', icon: <FacebookIcon />, component: FacebookShareButton },
        { label: 'X (Twitter)', icon: <TwitterIcon />, component: XShareButton },
        { label: 'LinkedIn', icon: <LinkedInIcon />, component: LinkedinShareButton },
        { label: 'WhatsApp', icon: <WhatsAppIcon />, component: WhatsappShareButton },
        { label: 'Telegram', icon: <TelegramIcon />, component: TelegramShareButton },
        { label: 'Reddit', icon: <RedditIcon />, component: RedditShareButton },
        { label: 'Email', icon: <EmailIcon />, component: EmailShareButton },
    ];

    return (
        <>
            <Tooltip title="Share this article" arrow>
                <IconButton
                    size="medium"
                    sx={{
                        bgcolor: "#f9fafb",
                        color: "#111827",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                        "&:hover": { bgcolor: "#f3f4f6" }
                    }}
                    onClick={() => setOpen(true)}
                >
                    <ShareIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Tooltip>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 320, bgcolor: '#fff', borderRadius: '12px',
                    boxShadow: 24, p: 3, outline: 'none'
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                        Share Article
                    </Typography>
                    <List sx={{ pt: 0 }}>
                        {socialIcons.map((item, index) => (
                            <ListItem 
                                key={index} 
                                disablePadding
                                sx={{ 
                                    borderRadius: '8px', mb: 0.5,
                                    '&:hover': { bgcolor: '#f9fafb' } 
                                }}
                            >
                                {item.component ? (
                                    <item.component url={currentUrl} style={{ width: '100%', display: 'flex', padding: '10px 16px' }}>
                                        <ListItemIcon sx={{ minWidth: 40, color: '#374151' }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                                    </item.component>
                                ) : (
                                    <Box onClick={item.onClick} sx={{ width: '100%', display: 'flex', padding: '10px 16px', cursor: 'pointer' }}>
                                        <ListItemIcon sx={{ minWidth: 40, color: '#374151' }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                                    </Box>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Modal>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <SnackbarContent sx={{ bgcolor: '#111827' }} message="Link copied!" />
            </Snackbar>
        </>
    );
};

export default SocialShareModal;