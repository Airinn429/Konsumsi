// src/pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username dan password harus diisi",
      });
    }

    // Ambil user
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        role: true,
        password: true,
        id: true,
        username: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Username atau password salah",
      });
    }

    // VALIDASI PASSWORD HASH
const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: "Username atau password salah",
      });
    }

    // Hapus password
    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      user: safeUser,
    });

  } catch (error) {
    console.error("🔥 Login Error:", error);

    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server",
    });
  }
}
