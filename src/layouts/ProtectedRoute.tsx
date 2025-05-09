import { setAuthToken } from "@/axios/apiClient"
import { useEffect } from "react"

export default function ProtectedRoute({children}: {children: React.ReactNode}) {

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token) {
            window.location.href = '/login'
            return
        }
        setAuthToken(token)
    }, [])

    return (
        <>
            {children}
        </>
    )
}