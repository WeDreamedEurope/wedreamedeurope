import { useEffect } from "react"





export default function Test(){



    useEffect(() => {
        alert(`I Am Test`)
    }, [])
    return <h2 className="text-2xl font-semibold text-yellow-50">I Am Test</h2>
}