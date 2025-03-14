import type { Request, Response } from 'express-serve-static-core';
import {
    createProductoSrv,
    getListaProductoSrv,
    getProductoSrv,
    deleteProductoSrv,
    updateProductoSrv
} from "../services/producto.service";

export const createProductoCtrl = async ({ body }: Request, res: Response) => {
    try {
        const response = await createProductoSrv(body);
        res.status(200).json({ msg: 200, data: response, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};


export const getListaProductoCtrl = async (req: Request, res: Response) => {
    try {
        const response = await getListaProductoSrv();
        res.status(200).json({ msg: "Ejecución correcta", data: response, success: true });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getProductoCtrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const response = await createProductoSrv(Number(id));
        res.status(200).json({ msg: 200, data: response, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

export const deleteProductoCtrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await deleteProductoSrv(parseInt(id));
        res.status(200).json({ msg: 200, data: response, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

export const updateProductoCtrl = async ({ body }: Request, res: Response) => {
    try {
        const response = await createProductoSrv(body);
        res.status(200).json({ msg: 200, data: response, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};