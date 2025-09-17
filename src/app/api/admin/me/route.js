import { verifyAdminToken } from "@/lib/adminAuth";
import Prisma from "@/lib/prisma";


export default async function handler(req, res) {
  const decoded = verifyAdminToken(req);
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
  if (!admin) return res.status(401).json({ error: "Unauthorized" });

  res.status(200).json({ admin: { id: admin.id, email: admin.email } });
}
