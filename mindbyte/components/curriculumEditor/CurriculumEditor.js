"use client"


import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import AddIcon from '@mui/icons-material/Add';
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



import {
    Box,
    Button,
    TextField,
    Typography,
    Modal,
    IconButton,
} from "@mui/material"

import Sidebar from "../sidebar/Sidebar";

import { useSearchParams } from "next/navigation";

const CurriculumEditor = () => {

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


    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box
                sx={{
                    flex: 1,
                    marginLeft: "64px",
                    transition: "margin-left 0.25s ease",
                }}>
                <Box
                    sx={{
                        padding: "16px",
                        backgroundColor: "purple",
                        textAlign: "center",
                        mb: 4,
                        mt: 0,

                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            color: "black",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                        }}
                    >
                        {contentTitle}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        padding: "16px",
                        margin: "0 auto",
                        backgroundColor: "green",
                        maxWidth: "800px",

                    }}
                >
                    {curriculum && curriculum?.map((section, sectionIndex) => (
                        <Box
                            key={section?.idIndex || section?._id}
                            sx={{
                                backgroundColor: "brown",
                                padding: "16px",
                                margin: "0 auto",
                                marginBottom: "16px",
                                borderRadius: "4px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                width: "100%",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "16px",
                                }}>

                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "black",
                                        marginBottom: "16px",
                                        textTransform: "uppercase",
                                        letterSpacing: "1.5px",
                                    }}>
                                    <DescriptionIcon sx={{
                                        marginRight: "8px",
                                        color: "black",

                                    }} />
                                    Section {sectionIndex + 1}:  {section.title}
                                </Typography>

                                <Box>

                                    <IconButton>
                                        <AddIcon
                                            sx={{
                                                color: "black",
                                            }}
                                        />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => startEditing("section", sectionIndex)}
                                    >
                                        <EditIcon
                                            sx={{
                                                color: "black",
                                            }}
                                        />
                                    </IconButton>


                                    <IconButton
                                        onClick={() => handleDeleteSection(section?._id)}
                                    >
                                        <DeleteIcon
                                            sx={{
                                                color: "black",
                                            }}
                                        />
                                    </IconButton>

                                </Box>
                            </Box>

                            {

                                editing && editing.type === "section" && editing.sectionIndex === sectionIndex &&
                                <Box
                                    sx={{
                                        marginTop: "16px",
                                    }}
                                >
                                    <TextField
                                        label="Edit Section"
                                        value={editSectionValue}
                                        onChange={(e) => setEditSectionValue(e.target.value)}
                                        fullWidth
                                        sx={{
                                            backgroundColor: "white",
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleCancelEdit}
                                            sx={{
                                                marginRight: "8px",
                                                textTransform: "none",
                                                color: "black",
                                                backgroundColor: "purple",
                                            }}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveEdit}
                                            sx={{
                                                marginRight: "8px",
                                                textTransform: "none",
                                                color: "black",
                                                backgroundColor: "purple",
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </Box>

                                </Box>

                            }

                            <Box

                                sx={{
                                    marginTop: "16px",

                                }}>
                                {section?.lectures?.map((lecture, lectureIndex) => (
                                    <Box
                                        key={lecture?.idIndex || lecture?._id}
                                        sx={{
                                            backgroundColor: "yellow",
                                            padding: "16px",
                                            margin: "0 auto",
                                            marginBottom: "8px",
                                            borderRadius: "4px",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: "black",
                                                    fontWeight: "bold",
                                                    marginBottom: "8px"
                                                }}
                                            >
                                                Lecture {lectureIndex + 1} :  {" "}{lecture?.title}
                                            </Typography>

                                            <Box>
                                                <IconButton
                                                    onClick={() => handleOpenModal(lecture, sectionIndex)}
                                                >
                                                    {
                                                        lecture?.content ? (
                                                            <LibraryAddCheckIcon
                                                                sx={{
                                                                    color: "black",

                                                                }}
                                                            />
                                                        ) : (<NotesIcon
                                                            sx={{
                                                                color: "black",


                                                            }}
                                                        />)
                                                    }
                                                </IconButton>

                                                {/* Video */}
                                                <IconButton>
                                                    {
                                                        lecture?.videoUrl ? (
                                                            <OndemandVideoIcon
                                                                sx={{
                                                                    color: "black",

                                                                }}
                                                            />
                                                        ) : (<PersonalVideoIcon
                                                            sx={{
                                                                color: "black",


                                                            }}
                                                        />)
                                                    }
                                                </IconButton>

                                                {/* Edit */}
                                                <IconButton
                                                    onClick={() => startEditing("lecture", sectionIndex, lectureIndex)}
                                                >
                                                    <EditIcon

                                                        sx={{
                                                            color: "black"
                                                        }}
                                                    />
                                                </IconButton>

                                                {/* Delete */}
                                                <IconButton
                                                    onClick={() => handleDeleteLecture(sectionIndex, lecture?._id)}

                                                >
                                                    <DeleteIcon

                                                        sx={{
                                                            color: "black"
                                                        }}
                                                    />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        {
                                            editing && editing.type === "lecture" && editing.sectionIndex === sectionIndex
                                            && editing.lectureIndex === lectureIndex && (
                                                <Box
                                                    sx={{
                                                        marginTop: "16px",
                                                    }}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        value={editLectureValue || ""}
                                                        onChange={(e) => setEditLectureValue(e.target.value)}

                                                    />

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'flex-end',
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            onClick={handleCancelEdit}
                                                        >Cancel</Button>

                                                        <Button
                                                            variant="contained"
                                                            onClick={handleSaveEdit}
                                                        >Save</Button>
                                                    </Box>

                                                </Box>
                                            )
                                        }
                                    </Box>

                                ))}
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        color: "black",
                                        backgroundColor: "white",
                                    }}
                                    onClick={() => handleAddLecture(sectionIndex)}
                                >
                                    Add lectures

                                </Button>
                            </Box>

                        </Box>

                    ))}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddSection}
                        sx={{
                            marginTop: "16px",
                            color: "black",
                            backgroundColor: "white",
                            textTransform: "none",
                        }}
                    >
                        Add Section
                    </Button>

                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%,-50%)",
                                width: "80%",
                                backgroundColor: "white",
                                color: "black",
                                padding: "5px",

                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 3,

                                }}
                            >Edit Lecture {" "} : {currentLecture?.title} </Typography>

                            <MdEditor
                                value={content}
                                style={{

                                    height: "80vh",

                                }}
                                onChange={({ text }) => setContent(text)}
                                renderHTML={(text) => md.render(text)}

                                placeholder="write your content here"
                                onImageUpload={(file) => imageUpload(file)}
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    mt: 3,
                                    justifyContent: "flex-end",
                                }}

                            >
                                <Button
                                    variant="contained"
                                    onClick={handleCloseModal}
                                    sx={{
                                        marginRight: "8px",
                                    }}
                                >Cancel</Button>

                                <Button
                                    variant="outline"
                                    onClick={handleSaveContent}
                                    sx={{
                                        marginRight: "8px",
                                    }}
                                >Save</Button>

                            </Box>

                        </Box>
                    </Modal>
                </Box>
            </Box>
        </Box>
    )
}


export default CurriculumEditor