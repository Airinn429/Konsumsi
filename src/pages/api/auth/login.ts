// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    console.log('🔐 Login attempt:', { username, password: '***' });

    if (!username || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ 
        success: false,
        error: 'Username dan password harus diisi' 
      });
    }

    // Cari user berdasarkan username DAN password
    const user = await prisma.user.findFirst({
      where: { 
        username,
        password, // Validasi password (simple string comparison)
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log('👤 User found:', user ? 'Yes' : 'No');

    // Jika user tidak ditemukan atau password salah
    if (!user) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({
        success: false,
        error: 'Username atau password salah',
      });
    }

    console.log('✅ Login successful:', user.username);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Terjadi kesalahan server' 
    });
  }
}
