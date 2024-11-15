import { Button } from '@/components/ui/button'
import { SignIn } from '@clerk/nextjs'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
    return (
        
        <div className="h-screen">
            <div className="flex items-center justify-center flex-col">
                <div className="self-start mb-16 mt-3 flex justify-between w-full">
                    <Link href="/">
                        <Button className="mx-3">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>
                <SignIn />
            </div>
        </div>
    )
}

