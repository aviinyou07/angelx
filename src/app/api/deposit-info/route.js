// pages/api/deposit-info/index.js
import prisma from '@/lib/prisma'; // default export

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.depositInfo.findMany();
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch deposit info" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
