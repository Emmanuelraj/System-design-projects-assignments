-- CreateTable
CREATE TABLE "public"."Todo" (
    "todoId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("todoId")
);
