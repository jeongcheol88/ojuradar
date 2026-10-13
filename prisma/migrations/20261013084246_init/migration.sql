-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "budgetMin" INTEGER NOT NULL,
    "budgetMax" INTEGER NOT NULL,
    "workType" TEXT NOT NULL,
    "estimatedHoursMin" INTEGER NOT NULL,
    "estimatedHoursMax" INTEGER NOT NULL,
    "tags" TEXT[],
    "summary" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_category_idx" ON "jobs"("category");

-- CreateIndex
CREATE INDEX "jobs_source_idx" ON "jobs"("source");

-- CreateIndex
CREATE INDEX "jobs_isActive_idx" ON "jobs"("isActive");
