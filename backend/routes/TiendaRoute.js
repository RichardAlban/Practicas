import express from "express";
import {
    getTiendas,
    getTiendaById,
    createTienda,
    updateTienda,
    deleteTienda, 
} from "../controllers/Tiendas.js";

import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();


router.get('/tiendas',verifyUser, getTiendas);
router.get('/tiendas/:id',verifyUser, getTiendaById);
router.post('/tiendas',verifyUser, createTienda);
router.patch('/tiendas/:id',verifyUser, updateTienda);
router.delete('/tiendas/:id',verifyUser, deleteTienda);


export default router;