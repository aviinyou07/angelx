-- CreateTable
CREATE TABLE "public"."DepositInfo" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepositInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepositInfo_network_key" ON "public"."DepositInfo"("network");
