-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);
