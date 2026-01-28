"use client"

import { getRetrievingRecipes } from "@/lib/queries/recipes"
import { useEffect, useState } from "react"

export default function SavedRecipes() {
    const [recipes, setRecipes] = useState<string[]>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<unknown>()

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true)
                setRecipes(await getRetrievingRecipes())
                setIsLoading(false)
            } catch(error) {
                setError(error ?? "An error has occurred")
                setIsLoading(false)
            }
        })()
    }, [])

    if(isLoading){
        return <p>Now loading</p>
    }

    if(error){
        return <p>{JSON.stringify(error)}</p>
    }

    console.log(recipes)
    return (
        <>
        hello
        {JSON.stringify(recipes)}
        </>
    )
}

