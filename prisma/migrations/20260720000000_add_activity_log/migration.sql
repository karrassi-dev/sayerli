CREATE TABLE "activity_logs" (
    "id"           TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "userNom"      TEXT NOT NULL,
    "action"       TEXT NOT NULL,
    "entityType"   TEXT NOT NULL,
    "entityId"     TEXT,
    "entityRef"    TEXT,
    "metadata"     JSONB,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "activity_logs_entrepriseId_idx" ON "activity_logs"("entrepriseId");
CREATE INDEX "activity_logs_userId_idx"       ON "activity_logs"("userId");
CREATE INDEX "activity_logs_createdAt_idx"    ON "activity_logs"("createdAt");
