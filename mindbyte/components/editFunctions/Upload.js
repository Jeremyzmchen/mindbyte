import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";


export const imageUpload = (file) => {

    return new Promise((resolve, reject) => {

        Resizer.imageFileResizer(
            file,
            1280, 720,
            "JPEG",
            100, 0,
            async (uri) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/upload`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            image: uri,
                        }),
                    })

                    if (res.ok) {
                        const data = await res.json()
                        resolve(data?.url)
                    } else {
                        reject(new Error("image upload failed"))
                        toast.error("Image Upload Failed")
                    }

                } catch (error) {
                    reject(error)
                    toast.error("Unexpected error occured")
                }

            },
            "base64",
        )
    })
}