-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);
