-- CreateTable
CREATE TABLE "ValidStudent" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValidStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ValidStudent_studentId_key" ON "ValidStudent"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ValidStudent_email_key" ON "ValidStudent"("email");

-- CreateIndex
CREATE INDEX "ValidStudent_studentId_email_idx" ON "ValidStudent"("studentId", "email");
