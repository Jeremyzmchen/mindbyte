"use client"

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), { ssr: false });
const Profile = dynamic(() => import("@/components/admin/profile/Profile"), { ssr: false });

const ProfileCreate = () => {
    return (
        <>
            <Profile />
            <Sidebar />
        </>
    )
}
export default ProfileCreate;