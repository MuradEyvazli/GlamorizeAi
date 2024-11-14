'use client'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

export default function UserInfo() {
    const { data: session } = useSession()
    
    return (
        <div className="grid place-items-center h-screen ">

            <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6 rounded-lg">
                <div>
                    Name: <span className="font-bold">{session?.user?.name}</span>
                </div>
                <div>Email: <span className="font-bold">{session?.user?.email}</span></div>
                <button onClick={() => signOut()} className="px-4 py-2 rounded bg-red-600 text-white mt-4">Log Out</button>
            </div>
        </div>
    )
}