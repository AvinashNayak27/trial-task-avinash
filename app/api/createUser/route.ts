import prisma from "@/lib/prisma";
import type { NextRequest } from 'next/server';
import { SHA256 } from "crypto-js";

async function createUser(email: string, password: string, address: string) {
    return prisma.user.create({
        data: {
            email,
            password,
            address,
        },
    });
}

async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}


export async function POST(req: NextRequest) {
    try {
        const { email, password, address } = await req.json();
        if (!email || !password || !address) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'User already exists' }), {
                status: 400, // Bad Request
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const hashedPassword = SHA256(password).toString();

        const user = await createUser(email, hashedPassword, address);
        return new Response(JSON.stringify(user), {
            status: 201, // Created
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 500, // Internal Server Error
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}