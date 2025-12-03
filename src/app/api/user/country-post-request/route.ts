import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {country} = body

        console.log(country)

        return NextResponse.json({
            success: true,
            pays: country
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}