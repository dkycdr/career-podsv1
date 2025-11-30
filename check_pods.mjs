import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const pods = await prisma.pod.findMany()
console.log('Total pods:', pods.length)
pods.forEach(p => console.log(`- ${p.name}`))
await prisma.$disconnect()
