-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_submitterId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_updatedById_fkey";

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_submitterId_projectId_fkey" FOREIGN KEY ("submitterId", "projectId") REFERENCES "ProjectUser"("userId", "projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_updatedById_projectId_fkey" FOREIGN KEY ("updatedById", "projectId") REFERENCES "ProjectUser"("userId", "projectId") ON DELETE RESTRICT ON UPDATE CASCADE;
