import { PrismaClient } from "@prisma/client";
import { connect } from "http2";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function main() {
    try{
        await prisma.$connect();
    }catch(err){
        return Error("接続に失敗しました");
    }
}

export const GET = async(req: Request, res: NextResponse) => {
    try{
        await main();
        const posts = await prisma.post.findMany();
        return NextResponse.json({message: "Success", posts}, {status: 200});
    }catch(err){
        return NextResponse.json({message: "Error", err}, {status: 500});
    }finally{
        await prisma.$disconnect();
    }
} 

export const POST = async(req: Request, res: NextResponse) => {
    try{
        const {title, description} = await req.json();
        await main();
        const posts = await prisma.post.create({data:{title, description}});
        return NextResponse.json({message: "Success", posts}, {status: 201});
    }catch(err){
        return NextResponse.json({message: "Error", err}, {status: 500});
    }finally{
        await prisma.$disconnect();
    }
} 