import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete all pod memberships first (foreign key constraint)
  const deletedMemberships = await prisma.podMembership.deleteMany()
  console.log(`Deleted ${deletedMemberships.count} pod memberships`)
  
  // Delete all pods
  const deletedPods = await prisma.pod.deleteMany()
  console.log(`Deleted ${deletedPods.count} pods`)
}

main()
  .then(() => console.log('✅ Done!'))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
