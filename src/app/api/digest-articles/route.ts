import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { digestId: string }}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if((!params || !params.digestId) && !session){

    return NextResponse.json({
      error: "No digestId or userId provided/authorized"
    });
  }

  try{
    const allDigests = await prisma.digestArticle.findMany({
      where: {
        id: params.digestId,
        userId: session?.user.id,
      },
    });

    return allDigests;
  } catch (err) {
    console.error(err);

    return NextResponse.json({
      error: err instanceof Error ? err.message : "Unknown error trying to fetch articles",
    });
  }
}