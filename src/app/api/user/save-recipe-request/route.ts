import { NextRequest, NextResponse } from "next/server";
import { recipeContentSchema, RecipeSchema  } from "@/lib/validations/user-choices";



export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        console.log("body", body)
        const recipeContentSchemaValidation = recipeContentSchema.safeParse(body)

        if(!recipeContentSchemaValidation.success) {
            return NextResponse.json({
                error: recipeContentSchemaValidation.error.issues
            }, {status: 400})
        }

    const menuContent  = recipeContentSchemaValidation.data

    console.log("menu saved", menuContent)

        return NextResponse.json({
            message: "recipe added to your favorites"

        }, {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 500 }
          );
    }
}