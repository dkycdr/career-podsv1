import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Check all pods
const allPods = await prisma.pod.findMany({ include: { memberships: true } })
console.log('=== ALL PODS ===')
console.log(`Total pods: ${allPods.length}`)
allPods.forEach(p => {
  console.log(`Pod: ${p.name} (id: ${p.id})`)
  console.log(`  Members: ${p.memberships.length}`)
  p.memberships.forEach(m => console.log(`    - userId: ${m.userId}`))
})

// Check for current user
const currentUserId = 'cmikn0vey0000m9rczftxjz5q'
const userPods = await prisma.pod.findMany({
  where: {
    memberships: {
      some: { userId: currentUserId }
    }
  }
})
console.log(`\n=== PODS FOR USER ${currentUserId} ===`)
console.log(`Total: ${userPods.length}`)
userPods.forEach(p => console.log(`- ${p.name}`))

await prisma.$disconnect()
