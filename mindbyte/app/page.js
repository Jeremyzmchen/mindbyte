"use client"

import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("../components/navbar/Navbar"), {
    ssr: false,
});

export default function Page() {
    return (
        <>
            <Navbar />
        </>
    );
}