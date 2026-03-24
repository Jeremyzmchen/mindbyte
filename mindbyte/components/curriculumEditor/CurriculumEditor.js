"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import NotesIcon from '@mui/icons-material/Notes';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import 'react-markdown-editor-lite/lib/index.css';
import hljs from "highlight.js";
import 'highlight.js/styles/monokai.css';

import { imageUpload } from "../editFunctions/Upload";
import ReactPlayer from "react-player";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
    Box, Button, TextField, Typography, Modal, IconButton,
} from "@mui/material"

import Sidebar from "../sidebar/Sidebar";
import { useSearchParams, useRouter } from "next/navigation";

const DRAG_TYPE_SECTION = "SECTION";
const DRAG_TYPE_LECTURE = "LECTURE";

// 单条 lecture 行，带拖拽
const LectureRow = ({
    lecture, lectureIndex, sectionIndex,
    editing, editLectureValue, setEditLectureValue,
    handleCancelEdit, handleSaveEdit, startEditing,
    handleOpenModal, handleOpenVideoModal, handleDeleteLecture,
    moveLecture, onDrop,
    btnPrimary, btnSecondary, inputFocus,
    sectionLength,
}) => {
    const ref = useRef(null);
    const [dropSide, setDropSide] = useState(null); // "top" | "bottom"

    const [{ isDragging }, drag, preview] = useDrag({
        type: DRAG_TYPE_LECTURE,
        item: { sectionIndex, lectureIndex },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const [, drop] = useDrop({
        accept: DRAG_TYPE_LECTURE,
        hover(item, monitor) {
            if (!ref.current) return;
            // 只处理同一 section 内的拖拽
            if (item.sectionIndex !== sectionIndex) return;
            if (item.lectureIndex === lectureIndex) { setDropSide(null); return; }

            const hoverRect = ref.current.getBoundingClientRect();
            const clientY = monitor.getClientOffset()?.y ?? 0;
            const mid = hoverRect.top + hoverRect.height / 2;
            setDropSide(clientY < mid ? "top" : "bottom");

            const targetIndex = clientY < mid ? lectureIndex : lectureIndex + 1;
            const fromIndex = item.lectureIndex;
            const adjusted = fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
            if (fromIndex !== adjusted) {
                moveLecture(sectionIndex, fromIndex, adjusted);
                item.lectureIndex = adjusted;
            }
        },
        drop() {
            setDropSide(null);
            onDrop("lecture", sectionIndex);
        },
        collect(monitor) {
            if (!monitor.isOver()) setDropSide(null);
        },
    });

    preview(drop(ref));

    const isEditing = editing?.type === "lecture"
        && editing.sectionIndex === sectionIndex
        && editing.lectureIndex === lectureIndex;

    return (
        <Box ref={ref} sx={{ opacity: isDragging ? 0.35 : 1 }}>
            <Box sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: 1.25,
                borderTop: dropSide === "top" ? "2px solid #111827" : "2px solid transparent",
                borderBottom: dropSide === "bottom"
                    ? "2px solid #111827"
                    : lectureIndex < sectionLength - 1 ? "1px solid #f3f4f6" : "1px solid transparent",
                "&:hover .lecture-actions": { opacity: 1 },
                "&:hover .drag-handle": { opacity: 1 },
            }}>
                {/* 拖拽手柄 */}
                <Box
                    ref={drag}
                    className="drag-handle"
                    sx={{
                        opacity: 0, cursor: "grab", display: "flex", alignItems: "center",
                        mr: 0.5, color: "#9ca3af", transition: "opacity 0.15s",
                        "&:active": { cursor: "grabbing" },
                    }}
                >
                    <DragIndicatorIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}>
                    {lecture?.videoUrl
                        ? <OndemandVideoIcon sx={{ fontSize: 18, color: "#111827" }} />
                        : <PersonalVideoIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                    }
                    <Typography sx={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
                        {lecture?.title}
                    </Typography>
                </Box>

                <Box className="lecture-actions" sx={{ display: "flex", opacity: 0, transition: "opacity 0.15s ease" }}>
                    <IconButton size="small" onClick={() => handleOpenModal(lecture, sectionIndex)}
                        sx={{ color: lecture?.content ? "#111827" : "#9ca3af", "&:hover": { backgroundColor: "#f3f4f6", color: "#111827" } }}>
                        {lecture?.content ? <LibraryAddCheckIcon fontSize="small" /> : <NotesIcon fontSize="small" />}
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenVideoModal(lecture, sectionIndex)}
                        sx={{ color: lecture?.videoUrl ? "#111827" : "#9ca3af", "&:hover": { backgroundColor: "#f3f4f6", color: "#111827" } }}>
                        {lecture?.videoUrl ? <OndemandVideoIcon fontSize="small" /> : <PersonalVideoIcon fontSize="small" />}
                    </IconButton>
                    <IconButton size="small" onClick={() => startEditing("lecture", sectionIndex, lectureIndex)}
                        sx={{ color: "#9ca3af", "&:hover": { color: "#111827", backgroundColor: "#f3f4f6" } }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteLecture(sectionIndex, lecture?._id)}
                        sx={{ color: "#9ca3af", "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" } }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {isEditing && (
                <Box sx={{ py: 1.5 }}>
                    <TextField fullWidth value={editLectureValue || ""}
                        onChange={(e) => setEditLectureValue(e.target.value)} sx={inputFocus} />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
                        <Button onClick={handleCancelEdit} sx={btnSecondary}>Cancel</Button>
                        <Button onClick={handleSaveEdit} sx={btnPrimary}>Save</Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

// 单个 section 卡片，带拖拽
const SectionCard = ({
    section, sectionIndex,
    editing, editSectionValue, setEditSectionValue,
    editLectureValue, setEditLectureValue,
    handleCancelEdit, handleSaveEdit, startEditing,
    handleDeleteSection, handleAddLecture,
    handleOpenModal, handleOpenVideoModal, handleDeleteLecture,
    moveSection, moveLecture, onDrop,
    btnPrimary, btnSecondary, inputFocus,
    curriculum,
}) => {
    const ref = useRef(null);
    const [dropSide, setDropSide] = useState(null);

    const [{ isDragging }, drag, preview] = useDrag({
        type: DRAG_TYPE_SECTION,
        item: { sectionIndex },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const [, drop] = useDrop({
        accept: DRAG_TYPE_SECTION,
        hover(item, monitor) {
            if (!ref.current || item.sectionIndex === sectionIndex) {
                setDropSide(null);
                return;
            }
            const hoverRect = ref.current.getBoundingClientRect();
            const clientY = monitor.getClientOffset()?.y ?? 0;
            const mid = hoverRect.top + hoverRect.height / 2;
            setDropSide(clientY < mid ? "top" : "bottom");

            const targetIndex = clientY < mid ? sectionIndex : sectionIndex + 1;
            const fromIndex = item.sectionIndex;
            const adjusted = fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
            if (fromIndex !== adjusted) {
                moveSection(fromIndex, adjusted);
                item.sectionIndex = adjusted;
            }
        },
        drop() {
            setDropSide(null);
            onDrop("section");
        },
        collect(monitor) {
            if (!monitor.isOver()) setDropSide(null);
        },
    });

    preview(drop(ref));

    const isEditingSection = editing?.type === "section" && editing.sectionIndex === sectionIndex;

    return (
        <Box
            ref={ref}
            sx={{
                opacity: isDragging ? 0.35 : 1,
                borderTop: dropSide === "top" ? "2px solid #111827" : "2px solid transparent",
                borderBottom: dropSide === "bottom" ? "2px solid #111827" : "2px solid transparent",
                borderRadius: "12px",
                mb: 2.5,
            }}
        >
            <Box sx={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                overflow: "hidden",
            }}>
                {/* section 头部 */}
                <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    px: 3, py: 1.75,
                    backgroundColor: "#f9fafb",
                    "&:hover .section-drag": { opacity: 1 },
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* section 拖拽手柄 */}
                        <Box
                            ref={drag}
                            className="section-drag"
                            sx={{
                                opacity: 0, cursor: "grab", display: "flex", alignItems: "center",
                                color: "#9ca3af", transition: "opacity 0.15s",
                                "&:active": { cursor: "grabbing" },
                            }}
                        >
                            <DragIndicatorIcon sx={{ fontSize: 18 }} />
                        </Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Section {String(sectionIndex + 1).padStart(2, "0")}
                        </Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
                            {section.title}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                        <IconButton size="small" onClick={() => startEditing("section", sectionIndex)}
                            sx={{ color: "#9ca3af", "&:hover": { color: "#111827", backgroundColor: "#f3f4f6" } }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteSection(section?._id)}
                            sx={{ color: "#9ca3af", "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" } }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* section 编辑框 */}
                {isEditingSection && (
                    <Box sx={{ px: 3, py: 2, borderTop: "1px solid #f3f4f6" }}>
                        <TextField label="Section Title" value={editSectionValue}
                            onChange={(e) => setEditSectionValue(e.target.value)} fullWidth sx={inputFocus} />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
                            <Button onClick={handleCancelEdit} sx={btnSecondary}>Cancel</Button>
                            <Button onClick={handleSaveEdit} sx={btnPrimary}>Save</Button>
                        </Box>
                    </Box>
                )}

                {/* lectures */}
                <Box sx={{ px: 3, py: 1.5 }}>
                    {section?.lectures?.map((lecture, lectureIndex) => (
                        <LectureRow
                            key={lecture?.idIndex || lecture?._id}
                            lecture={lecture}
                            lectureIndex={lectureIndex}
                            sectionIndex={sectionIndex}
                            editing={editing}
                            editLectureValue={editLectureValue}
                            setEditLectureValue={setEditLectureValue}
                            handleCancelEdit={handleCancelEdit}
                            handleSaveEdit={handleSaveEdit}
                            startEditing={startEditing}
                            handleOpenModal={handleOpenModal}
                            handleOpenVideoModal={handleOpenVideoModal}
                            handleDeleteLecture={handleDeleteLecture}
                            moveLecture={moveLecture}
                            onDrop={onDrop}
                            btnPrimary={btnPrimary}
                            btnSecondary={btnSecondary}
                            inputFocus={inputFocus}
                            sectionLength={section.lectures.length}
                        />
                    ))}

                    <Button onClick={() => handleAddLecture(sectionIndex)}
                        sx={{ mt: 1, color: "#374151", fontWeight: 600, textTransform: "none", fontSize: 13, px: 0, "&:hover": { backgroundColor: "transparent", opacity: 0.7 } }}>
                        + Add Lecture
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

// 主组件
const CurriculumEditor = () => {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search");

    const [curriculum, setCurriculum] = useState([]);
    const [contentTitle, setContentTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const [editSectionValue, setEditSectionValue] = useState("");
    const [editLectureValue, setEditLectureValue] = useState("");
    const [editing, setEditing] = useState(null);
    const [deletingLecture, setDeletingLecture] = useState(null);
    const [deletingSection, setDeletingSection] = useState("");

    const fetchCurriculum = async (searchId) => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculumDetail/${searchId}`);
            const data = await res.json();
            setCurriculum(data?.sections || []);
            setContentTitle(data?.title);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (search) fetchCurriculum(search); }, [search]);
    useEffect(() => { setMounted(true); }, []);

    // section 在前端重排
    const moveSection = useCallback((fromIndex, toIndex) => {
        setCurriculum((prev) => {
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    }, []);

    // lecture 在前端重排
    const moveLecture = useCallback((sectionIndex, fromIndex, toIndex) => {
        setCurriculum((prev) => {
            const next = prev.map((s) => ({ ...s, lectures: [...s.lectures] }));
            const [moved] = next[sectionIndex].lectures.splice(fromIndex, 1);
            next[sectionIndex].lectures.splice(toIndex, 0, moved);
            return next;
        });
    }, []);

    // 拖拽结束后把新顺序同步到后端
    const handleDrop = useCallback(async (type, sectionIndex) => {
        if (type === "section") {
            const sectionIds = curriculum.map((s) => s._id.toString());
            await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/reorder`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ search, sectionIds }),
            });
        } else if (type === "lecture") {
            const section = curriculum[sectionIndex];
            const lectureIds = section.lectures.map((l) => l._id.toString());
            await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/reorder`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ search, sectionId: section._id, lectureIds }),
            });
        }
    }, [curriculum, search]);

    const handleAddSection = async () => {
        const idIndex = uuidv4();
        const newSection = { idIndex, title: "New Section", lectures: [] };
        setCurriculum((prev) => [...prev, newSection]);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newSection, search }),
            });
            if (res.ok) {
                const { newAddedSection } = await res.json();
                setCurriculum((prev) => prev.map((s) => s.idIndex === idIndex ? newAddedSection : s));
            } else {
                setCurriculum((prev) => prev.filter((s) => s?.idIndex !== idIndex));
            }
        } catch (error) {
            setCurriculum((prev) => prev.filter((s) => s?.idIndex !== idIndex));
        }
    };

    const handleDeleteSection = async (sectionId) => {
        setDeletingSection(sectionId);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/${sectionId}?search=${search}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setTimeout(() => {
                setCurriculum((prev) => prev.filter((s) => s._id !== sectionId));
                setDeletingLecture(null);
            }, 1000);
        }
    };

    const startEditing = (type, sectionIndex, lectureIndex = null) => {
        setEditing({ type, sectionIndex, lectureIndex });
        if (type === "section") setEditSectionValue(curriculum[sectionIndex]?.title);
        else if (type === "lecture") setEditLectureValue(curriculum[sectionIndex]?.lectures[lectureIndex]?.title);
    };

    const handleCancelEdit = () => { setEditing(null); setEditSectionValue(""); setEditLectureValue(""); };

    const handleSaveEdit = async () => {
        if (editing.type === "section") {
            const updatedSection = { ...curriculum[editing.sectionIndex], title: editSectionValue };
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/${updatedSection?._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updatedSection, search }),
            });
            if (res.ok) {
                setCurriculum((prev) => prev.map((s, i) => i === editing.sectionIndex ? { ...s, title: editSectionValue } : s));
            }
        } else if (editing.type === "lecture") {
            const updatedLecture = { ...curriculum[editing.sectionIndex]?.lectures[editing.lectureIndex], title: editLectureValue };
            const sectionId = curriculum[editing.sectionIndex]?._id;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/${updatedLecture?._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updatedLecture, sectionId, search }),
            });
            if (res.ok) {
                setCurriculum((prev) => prev.map((s, si) =>
                    si === editing.sectionIndex ? {
                        ...s,
                        lectures: s.lectures.map((l, li) => li === editing.lectureIndex ? { ...l, title: editLectureValue } : l),
                    } : s
                ));
            }
        }
        handleCancelEdit();
    };

    const handleAddLecture = async (sectionIndex) => {
        const lectureId = uuidv4();
        const newLecture = { idIndex: lectureId, title: "New Lecture" };
        const sectionId = curriculum[sectionIndex]?._id;
        setCurriculum((prev) => prev.map((s, i) => i === sectionIndex ? { ...s, lectures: [...s.lectures, newLecture] } : s));
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newLecture, sectionId, search }),
        });
        if (res.ok) {
            const savedLecture = await res.json();
            setCurriculum((prev) => prev.map((s, i) => i === sectionIndex ? {
                ...s,
                lectures: s.lectures.map((l) => l.idIndex === lectureId ? { ...l, _id: savedLecture._id } : l),
            } : s));
        } else {
            setCurriculum((prev) => prev.map((s, i) => i === sectionIndex ? {
                ...s, lectures: s.lectures.filter((l) => l.idIndex !== lectureId),
            } : s));
        }
    };

    const handleDeleteLecture = async (sectionIndex, lectureId) => {
        setDeletingLecture({ sectionIndex, lectureId });
        const sectionId = curriculum[sectionIndex]?._id;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/${lectureId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sectionId, search }),
        });
        if (res.ok) {
            setTimeout(() => {
                setCurriculum((prev) => prev.map((s, i) => i === sectionIndex ? {
                    ...s, lectures: s.lectures.filter((l) => l?._id !== lectureId),
                } : s));
                setDeletingLecture(null);
            }, 1000);
        }
    };

    const [openModal, setOpenModal] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [content, setContent] = useState("");
    const [currentSectionIndex, setCurrentSectionIndex] = useState(null);

    const handleOpenModal = (lecture, sectionIndex) => {
        setCurrentSectionIndex(sectionIndex);
        setCurrentLecture(lecture);
        setContent(lecture?.content || "");
        setOpenModal(true);
    };
    const handleCloseModal = () => { setOpenModal(false); setCurrentLecture(null); setContent(""); setCurrentSectionIndex(null); };

    const md = new MarkdownIt({
        highlight: (str, lang) => {
            const language = lang && hljs.getLanguage(lang) ? lang : "js";
            try {
                const highlighted = hljs.highlight(language, str, true).value;
                return `<pre class="hljs"><code>${highlighted}</code></pre>`;
            } catch { return ""; }
        }
    });

    const handleSaveContent = async () => {
        const sectionId = curriculum[currentSectionIndex]?._id;
        const lectureItem = { ...currentLecture, content };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/content/${lectureItem?._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sectionId, lectureItem, search }),
        });
        if (res.ok) {
            toast.success("Content Updated");
            setCurriculum((prev) => prev.map((s) => ({
                ...s, lectures: s.lectures.map((l) => l?._id === currentLecture?._id ? { ...l, content } : l),
            })));
        } else {
            toast.error("Content Update Failed");
        }
        handleCloseModal();
    };

    const [videoUrl, setVideoUrl] = useState("");
    const [openVideoModal, setOpenVideoModal] = useState(false);

    const handleOpenVideoModal = (lecture, sectionIndex) => {
        setCurrentSectionIndex(sectionIndex);
        setCurrentLecture(lecture);
        setVideoUrl(lecture?.videoUrl || "");
        setOpenVideoModal(true);
    };
    const handleCloseVideoModal = () => { setOpenVideoModal(false); setCurrentLecture(null); setVideoUrl(""); setCurrentSectionIndex(null); };

    const handleSaveVideoContent = async () => {
        const sectionId = curriculum[currentSectionIndex]?._id;
        const lectureItem = { ...currentLecture, videoUrl };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/content/${lectureItem?._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sectionId, lectureItem, search }),
        });
        if (res.ok) {
            toast.success("Video content updated");
            setCurriculum((prev) => prev.map((s) => ({
                ...s, lectures: s.lectures.map((l) => l?._id === currentLecture?._id ? { ...l, videoUrl } : l),
            })));
        } else {
            toast.error("Video content update failed");
        }
        handleCloseVideoModal();
    };

    const btnPrimary = {
        background: "#111827", color: "#fff", fontWeight: 600, textTransform: "none",
        borderRadius: "8px", boxShadow: "none", "&:hover": { opacity: 0.85 },
    };
    const btnSecondary = { color: "#6b7280", fontWeight: 500, textTransform: "none", borderRadius: "8px" };
    const inputFocus = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "8px", backgroundColor: "#fff",
            "&.Mui-focused fieldset": { borderColor: "#111827" },
            "&:hover fieldset": { borderColor: "#374151" },
        },
        "& label.Mui-focused": { color: "#111827" },
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
                <Sidebar />
                <Box sx={{ flex: 1, marginLeft: "64px" }}>

                    {/* 顶부 标题栏 */}
                    <Box sx={{
                        px: 5, py: 2.5, backgroundColor: "#fff",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex", alignItems: "center", gap: 2,
                    }}>
                        <IconButton onClick={() => router.back()} size="small"
                            sx={{ color: "#6b7280", "&:hover": { color: "#111827", backgroundColor: "#f3f4f6" }, mr: 0.5 }}>
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.25 }}>
                                Content Structure
                            </Typography>
                            <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
                                {contentTitle || "Curriculum Editor"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* 内容区 */}
                    <Box sx={{ maxWidth: 780, mx: "auto", px: 3, py: 5 }}>

                        {curriculum?.map((section, sectionIndex) => (
                            <SectionCard
                                key={section?.idIndex || section?._id}
                                section={section}
                                sectionIndex={sectionIndex}
                                editing={editing}
                                editSectionValue={editSectionValue}
                                setEditSectionValue={setEditSectionValue}
                                editLectureValue={editLectureValue}
                                setEditLectureValue={setEditLectureValue}
                                handleCancelEdit={handleCancelEdit}
                                handleSaveEdit={handleSaveEdit}
                                startEditing={startEditing}
                                handleDeleteSection={handleDeleteSection}
                                handleAddLecture={handleAddLecture}
                                handleOpenModal={handleOpenModal}
                                handleOpenVideoModal={handleOpenVideoModal}
                                handleDeleteLecture={handleDeleteLecture}
                                moveSection={moveSection}
                                moveLecture={moveLecture}
                                onDrop={handleDrop}
                                btnPrimary={btnPrimary}
                                btnSecondary={btnSecondary}
                                inputFocus={inputFocus}
                                curriculum={curriculum}
                            />
                        ))}

                        {/* Add Section */}
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <Button
                                onClick={handleAddSection}
                                sx={{
                                    border: "2px dashed #d1d5db",
                                    color: "#374151", fontWeight: 600, textTransform: "none",
                                    borderRadius: "10px", px: 4, py: 1.25,
                                    "&:hover": { border: "2px dashed #374151", backgroundColor: "#f3f4f6" },
                                }}
                            >
                                + Add Section
                            </Button>
                        </Box>

                        {/* Content Modal */}
                        <Modal open={openModal} onClose={handleCloseModal}>
                            <Box sx={{
                                position: "absolute", top: "50%", left: "50%",
                                transform: "translate(-50%,-50%)",
                                width: "85%", maxWidth: 900,
                                backgroundColor: "#fff", borderRadius: "14px",
                                boxShadow: "0px 12px 32px rgba(20,27,43,0.12)",
                                border: "1px solid #e5e7eb", p: 3,
                            }}>
                                <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#111827", mb: 2.5 }}>
                                    Edit Content: <span style={{ color: "#374151", fontWeight: 400 }}>{currentLecture?.title}</span>
                                </Typography>
                                <MdEditor
                                    value={content}
                                    style={{ height: "70vh", borderRadius: "8px" }}
                                    onChange={({ text }) => setContent(text)}
                                    renderHTML={(text) => md.render(text)}
                                    placeholder="Write your content here..."
                                    onImageUpload={(file) => imageUpload(file)}
                                />
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                                    <Button onClick={handleCloseModal} sx={btnSecondary}>Cancel</Button>
                                    <Button onClick={handleSaveContent} sx={btnPrimary}>Save</Button>
                                </Box>
                            </Box>
                        </Modal>

                        {/* Video Modal */}
                        <Modal open={openVideoModal} onClose={handleCloseVideoModal}>
                            <Box sx={{
                                position: "absolute", top: "50%", left: "50%",
                                transform: "translate(-50%,-50%)",
                                width: "80%", maxWidth: 800,
                                backgroundColor: "#fff", borderRadius: "14px",
                                boxShadow: "0px 12px 32px rgba(20,27,43,0.12)",
                                border: "1px solid #e5e7eb", p: 3,
                            }}>
                                <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#111827", mb: 2.5 }}>
                                    Edit Video: <span style={{ color: "#374151", fontWeight: 400 }}>{currentLecture?.title}</span>
                                </Typography>
                                <TextField
                                    label="Video URL"
                                    variant="outlined"
                                    fullWidth
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    sx={inputFocus}
                                />
                                {mounted && videoUrl ? (
                                    <Box sx={{ mt: 2, height: "50vh", borderRadius: "8px", overflow: "hidden" }}>
                                        <ReactPlayer url={videoUrl} controls={true} width="100%" height="100%" playing={false} />
                                    </Box>
                                ) : (
                                    <Box sx={{ mt: 2, py: 5, textAlign: "center", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                                        <Typography sx={{ color: "#9ca3af", fontSize: 14 }}>Enter a video URL above to preview</Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                                    <Button onClick={handleCloseVideoModal} sx={btnSecondary}>Cancel</Button>
                                    <Button onClick={handleSaveVideoContent} sx={btnPrimary}>Save</Button>
                                </Box>
                            </Box>
                        </Modal>
                    </Box>
                </Box>
            </Box>
        </DndProvider>
    );
};

export default CurriculumEditor;
