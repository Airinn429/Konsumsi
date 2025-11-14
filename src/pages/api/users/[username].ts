// src/pages/api/users/[username].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Invalid username' });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
