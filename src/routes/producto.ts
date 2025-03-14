import { Router } from "express";
import {
  createProductoCtrl,
  getListaProductoCtrl,
  getProductoCtrl,
  deleteProductoCtrl,
  updateProductoCtrl,
} from "../controllers/producto.controller";
const router = Router();

router.post("/", createProductoCtrl);

router.get("/list", getListaProductoCtrl);

router.get("/only/:id", getProductoCtrl);

router.delete("/:id", deleteProductoCtrl);

router.put("/", updateProductoCtrl);

export { router };