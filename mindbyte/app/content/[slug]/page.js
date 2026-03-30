"use client"

import { use, useState, useEffect } from "react";
import ContentDisplay from "@/components/contentDisplay/ContentDisplay"


// Next.js15之后要求异步解析params，用promise
const ContentViewPage = ({ params: promiseParams }) => {
    const params = use(promiseParams)
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!params?.slug) return;

        const fetchContent = async () => {
            try {
                setLoading(true)
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/content/${params.slug}`, {
                    method: "GET",
                })
                if (!res.ok) {
                    throw new Error("Error fetching content")
                }
                const data = await res.json()
                setContent(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchContent()
    }, [params]);

    if (error) {
        return <p>Error: {error}</p>
    }

    return (
        <>
            <ContentDisplay content={content} loading={loading} slug={params?.slug} />
        </>
    )
}

export default ContentViewPage