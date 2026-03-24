"use client"

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";  // ✅ 新增

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import NotesIcon from '@mui/icons-material/Notes';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import 'react-markdown-editor-lite/lib/index.css';
import hljs from "highlight.js";
import 'highlight.js/styles/monokai.css';

import { imageUpload } from "../editFunctions/Upload";

import ReactPlayer from "react-player";

import {
    Box,
    Button,
    TextField,
    Typography,
    Modal,
    IconButton,
} from "@mui/material"

import Sidebar from "../sidebar/Sidebar";

import { useSearchParams, useRouter } from "next/navigation";

const CurriculumEditor = () => {
    const [mounted, setMounted] = useState(false)

    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get("search")

    const [curriculum, setCurriculum] = useState([])
    const [contentTitle, setContentTitle] = useState("")
    const [loading, setLoading] = useState(false)

    const [sections, setSections] = useState([]);

    const [editSectionValue, setEditSectionValue] = useState("")
    const [editLectureValue, setEditLectureValue] = useState("")
    const [editing, setEditing] = useState(null)
    const [deletingLecture, setDeletingLecture] = useState(null)
    const [deletingSection, setDeletingSection] = useState("")


    const fetchCurriculum = async (searchId) => {
        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculumDetail/${searchId}`)
            const data = await res.json();
            console.log("curriculum data", data);
            setCurriculum(data?.sections || []);
            setContentTitle(data?.title);
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (search) {
            fetchCurriculum(search);
        }
    }, [search])

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleAddSection = async () => {
        const idIndex = uuidv4()
        const newSection = {
            idIndex,
            title: "New Section",
            lectures: [],
        }

        setCurriculum((prevSections) => [...prevSections, newSection])

        const data = {
            newSection,
            search,
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                const { newAddedSection } = await res.json()
                setCurriculum((prevSections) => prevSections.map((section) => section.idIndex === idIndex ? newAddedSection : section))
            } else {
                console.log("Failed to add sections")
                setCurriculum((prevSections) => prevSections.filter((section) => section?.idIndex !== idIndex))
            }
        } catch (error) {
            console.log("Failed to add sections", error)
            setCurriculum((prevSections) => prevSections.filter((section) => section?.idIndex !== idIndex))
        }
    }

    const handleDeleteSection = async (sectionId) => {
        setDeletingSection(sectionId);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/${sectionId}?search=${search}`, {
            method: "DELETE",
        })

        if (res.ok) {
            setTimeout(() => {
                setCurriculum((prevSections =>

                    prevSections.filter((section) => section._id !== sectionId)
                ))

                setDeletingLecture(null)
            }, 1000)
        } else {
            console.log("Failed to delete section")

        }
    }


    const startEditing = (type, sectionIndex, lectureIndex = null) => {
        setEditing({
            type,
            sectionIndex,
            lectureIndex
        })
        if (type === "section") {
            setEditSectionValue(curriculum[sectionIndex]?.title)

        } else if (type === "lecture") {
            setEditLectureValue(curriculum[sectionIndex]?.lectures[lectureIndex]?.title)
        }
    }

    const handleCancelEdit = () => {

        setEditing(null)
        setEditSectionValue("")
        setEditLectureValue("")
    }

    const handleSaveEdit = async () => {

        if (editing.type === "section") {
            const updatedSection = {
                ...curriculum[editing.sectionIndex],
                title: editSectionValue
            }

            const data = {
                updatedSection,
                search,
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/${updatedSection?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setCurriculum((prevSections) =>
                    prevSections.map((section, index) =>
                        index === editing.sectionIndex ? { ...section, title: editSectionValue } : section
                    )
                )
            } else {
                console.log("Failed to update section")
            }
        } else if (editing.type === "lecture") {
            const updatedLecture = {
                ...curriculum[editing.sectionIndex]?.lectures[editing.lectureIndex],
                title: editLectureValue
            }

            const sectionId = curriculum[editing.sectionIndex]?._id;


            const data = {
                updatedLecture,
                sectionId,
                search,
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/${curriculum[editing.sectionIndex]?.lectures[editing.lectureIndex]?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setCurriculum((prevSections) =>
                    prevSections.map((section, sectionIndex) =>
                        sectionIndex === editing.sectionIndex
                            ? {
                                ...section,
                                lectures: section.lectures.map((lecture, lectureIndex) =>
                                    lectureIndex === editing.lectureIndex ? { ...lecture, title: editLectureValue } : lecture
                                ),
                            } : section
                    )
                )
            } else {
                console.log("Failed to update lecture")
            }

        }

        handleCancelEdit()
    }

    const handleAddLecture = async (sectionIndex) => {
        const lectureId = uuidv4()
        const newLecture = {
            idIndex: lectureId,
            title: "New Lecture",
        }

        const sectionId = curriculum[sectionIndex]?._id

        setCurriculum((prevSections) =>
            prevSections.map((section, index) => index === sectionIndex ? {
                ...section,
                lectures: [...section.lectures, newLecture],
            } : section)
        );



        const data = {
            newLecture,
            sectionId,
            search,
        };


        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (res.ok) {
            const savedLecture = await res.json();
            setCurriculum((prevSections) =>
                prevSections.map((section, index) =>
                    index === sectionIndex ? {
                        ...section,
                        lectures: section.lectures.map((lecture) =>
                            lecture.idIndex === lectureId ? { ...lecture, _id: savedLecture._id } : lecture
                        ),
                    } : section
                )
            )
            console.log("Lecture added successfully")
        } else {
            console.log("Failed to add lecture")
            setCurriculum((prevSections) =>
                prevSections.map((section, index) =>
                    index === sectionIndex ? {
                        ...section,
                        lectures: section.lectures.filter((lecture) => lecture.idIndex !== lectureId),
                    } : section
                )
            )
        }
    }

    const handleDeleteLecture = async (sectionIndex, lectureId) => {
        setDeletingLecture({ sectionIndex, lectureId })
        const sectionId = curriculum[sectionIndex]?._id;

        const data = {
            sectionId,
            search,
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/${lectureId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (res.ok) {
            setTimeout(() => {
                setCurriculum((prevSections) =>
                    prevSections.map((section, index) =>
                        index === sectionIndex ? {
                            ...section,
                            lectures: section.lectures.filter((lecture) => lecture?._id !== lectureId),
                        } : section
                    )
                );


                setDeletingLecture(null);

            }, 1000);
        } else {
            console.log("Failed to delete lecture")
        }
    }



    const [openModal, setOpenModal] = useState(false)
    const [currentLecture, setCurrentLecture] = useState(null)
    const [content, setContent] = useState("")
    const [currentSectionIndex, setCurrentSectionIndex] = useState(null)

    const handleOpenModal = (lecture, sectionIndex) => {
        setCurrentSectionIndex(sectionIndex)
        setCurrentLecture(lecture)
        setContent(lecture?.content || "")
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setCurrentLecture(null)
        setContent("")
        setCurrentSectionIndex(null)
    }

    const md = new MarkdownIt({

        highlight: (str, lang) => {
            const language = lang && hljs.getLanguage(lang) ? lang : "js"

            try {
                const highlightedCode = hljs.highlight(language, str, true).value
                return `
                <pre class="hljs">
                <code>${highlightedCode}</code>
                </pre>
                `
            } catch (error) {
                return ""
            }
        }
    })

    const handleSaveContent = async () => {
        const sectionId = curriculum[currentSectionIndex]?._id
        const lectureItem = {
            ...currentLecture,
            content,
        }

        const data = {
            sectionId,
            lectureItem,
            search,
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/content/${lectureItem?._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (res.ok) {
            toast.success("Content Updated")
            setCurriculum((prevSections) => prevSections.map((section) => ({
                ...section,
                lectures: section?.lectures.map((lecture) => (
                    lecture?._id === currentLecture?._id ? { ...lecture, content } : lecture
                ))
            })))
        } else {
            toast.error("Content Update Failed")
            console.log("Failed to update lecture content")
        }

        handleCloseModal()
    }

    const [videoUrl, setVideoUrl] = useState("")
    const [openVideoModal, setOpenVideoModal] = useState(false)
    const handleOpenVideoModal = (lecture, sectionIndex) => {
        setCurrentSectionIndex(sectionIndex);
        setCurrentLecture(lecture);
        setVideoUrl(lecture?.videoUrl || "");
        setOpenVideoModal(true);
    };

    const handleCloseVideoModal = () => {
        setOpenVideoModal(false)
        setCurrentLecture(null)
        setVideoUrl("")
        setCurrentSectionIndex(null)
    }

    const handleSaveVideoContent = async () => {
        console.log("videoUrl value:", videoUrl) 
        console.log("currentLecture:", currentLecture)
        const sectionId = curriculum[currentSectionIndex]?._id
        const lectureItem = {
            ...currentLecture,
            videoUrl,
        }

        const data = {
            sectionId,
            lectureItem,
            search,
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/section/lecture/content/${lectureItem?._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (res.ok) {
            toast.success("Video content Upload")
            setCurriculum((prevSections) => prevSections.map((section) => ({
                ...section,
                lectures: section?.lectures.map((lecture) => (
                    lecture?._id === currentLecture?._id ? { ...lecture, videoUrl } : lecture
                ))
            })))
        } else {
            toast.error("Video content Update Failed")
            console.log("Failed to update lecture video content")
        }

        handleCloseVideoModal()
    }

    const btnPrimary = {
        background: "#111827",
        color: "#fff", fontWeight: 600, textTransform: "none",
        borderRadius: "8px", boxShadow: "none",
        "&:hover": { opacity: 0.85 },
    }
    const btnSecondary = {
        color: "#6b7280", fontWeight: 500, textTransform: "none",
        borderRadius: "8px",
    }
    const inputFocus = {
        "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#fff", "&.Mui-focused fieldset": { borderColor: "#111827" }, "&:hover fieldset": { borderColor: "#374151" } },
        "& label.Mui-focused": { color: "#111827" },
    }

    return (
        <Box sx={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            <Sidebar />
            <Box sx={{ flex: 1, marginLeft: "64px" }}>

                {/* ── 顶部标题栏 ── */}
                <Box sx={{
                    px: 5, py: 2.5,
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex", alignItems: "center", gap: 2,
                }}>
                    <IconButton
                        onClick={() => router.back()}
                        size="small"
                        sx={{ color: "#6b7280", "&:hover": { color: "#111827", backgroundColor: "#f3f4f6" }, mr: 0.5 }}
                    >
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

                {/* ── 内容区 ── */}
                <Box sx={{ maxWidth: 780, mx: "auto", px: 3, py: 5 }}>

                    {curriculum && curriculum?.map((section, sectionIndex) => (
                        <Box
                            key={section?.idIndex || section?._id}
                            sx={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                mb: 2.5,
                                overflow: "hidden",
                            }}
                        >
                            {/* Section 头部 */}
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                px: 3, py: 1.75,
                                backgroundColor: "#f9fafb",
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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

                            {/* Section 编辑框 */}
                            {editing && editing.type === "section" && editing.sectionIndex === sectionIndex && (
                                <Box sx={{ px: 3, py: 2, borderTop: "1px solid #f3f4f6" }}>
                                    <TextField label="Section Title" value={editSectionValue}
                                        onChange={(e) => setEditSectionValue(e.target.value)} fullWidth sx={inputFocus} />
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
                                        <Button onClick={handleCancelEdit} sx={btnSecondary}>Cancel</Button>
                                        <Button onClick={handleSaveEdit} sx={btnPrimary}>Save</Button>
                                    </Box>
                                </Box>
                            )}

                            {/* Lectures */}
                            <Box sx={{ px: 3, py: 1.5 }}>
                                {section?.lectures?.map((lecture, lectureIndex) => (
                                    <Box key={lecture?.idIndex || lecture?._id}>
                                        <Box sx={{
                                            display: "flex", justifyContent: "space-between", alignItems: "center",
                                            py: 1.25,
                                            borderBottom: lectureIndex < section.lectures.length - 1 ? "1px solid #f3f4f6" : "none",
                                            "&:hover .lecture-actions": { opacity: 1 },
                                        }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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

                                        {/* Lecture 编辑框 */}
                                        {editing && editing.type === "lecture" && editing.sectionIndex === sectionIndex && editing.lectureIndex === lectureIndex && (
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
                                ))}

                                {/* Add Lecture */}
                                <Button startIcon={<AddIcon />} onClick={() => handleAddLecture(sectionIndex)}
                                    sx={{ mt: 1, color: "#374151", fontWeight: 600, textTransform: "none", fontSize: 13, px: 0, "&:hover": { backgroundColor: "transparent", opacity: 0.7 } }}>
                                    + Add Lecture
                                </Button>
                            </Box>
                        </Box>
                    ))}

                    {/* Add Section */}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Button
                            startIcon={<AddIcon />}
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

                    {/* ── Content Modal ── */}
                    <Modal open={openModal} onClose={handleCloseModal}>
                        <Box sx={{
                            position: "absolute", top: "50%", left: "50%",
                            transform: "translate(-50%,-50%)",
                            width: "85%", maxWidth: 900,
                            backgroundColor: "#fff",
                            borderRadius: "14px",
                            boxShadow: "0px 12px 32px rgba(20,27,43,0.12)",
                            border: "1px solid #e5e7eb",
                            p: 3,
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

                    {/* ── Video Modal ── */}
                    <Modal open={openVideoModal} onClose={handleCloseVideoModal}>
                        <Box sx={{
                            position: "absolute", top: "50%", left: "50%",
                            transform: "translate(-50%,-50%)",
                            width: "80%", maxWidth: 800,
                            backgroundColor: "#fff",
                            borderRadius: "14px",
                            boxShadow: "0px 12px 32px rgba(20,27,43,0.12)",
                            border: "1px solid #e5e7eb",
                            p: 3,
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
    )
}


export default CurriculumEditor