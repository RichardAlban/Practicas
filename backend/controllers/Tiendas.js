import User from "../models/UserModel.js";
import { Op } from "sequelize";
import Tiendas from "../models/TiendaModel.js";
export const getTiendas = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Tiendas.findAll({
                attributes: ['uuid', 'name', 'referencia', 'horaInicio', 'horaFin', 'estado'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Tiendas.findAll({
                attributes: ['uuid', 'name', 'referencia', 'horaInicio', 'horaFin', 'estado'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getTiendaById = async (req, res) => {
    try {
        const tienda = await Tiendas.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!tienda) return res.status(404).json({ msg: "Datos no encontrados" });
        let response;
        if (req.role === "admin") {
            response = await Tiendas.findOne({
                attributes: ['uuid', 'name', 'referencia', 'horaInicio', 'horaFin', 'estado'],
                where: {
                    id: tienda.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Tiendas.findOne({
                attributes: ['uuid', 'name', 'referencia', 'horaInicio', 'horaFin', 'estado'],
                where: {
                    [Op.and]: [{ id: tienda.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createTienda = async (req, res) => {
    const { name, referencia, horaInicio, horaFin, estado } = req.body;
    try {
        await Tiendas.create({
            name,
            referencia,
            horaInicio,
            horaFin,
            estado,
            userId: req.userId
        });
        res.status(201).json({ msg: "Tienda creada con éxito" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateTienda = async (req, res) => {
    try {
        const tienda = await Tiendas.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!tienda) return res.status(404).json({ msg: "Datos no encontrados" });
        const { name, referencia, horaInicio, horaFin, estado } = req.body;
        if (req.role === "admin") {
            await Tiendas.update({ name, referencia, horaInicio, horaFin, estado }, {
                where: {
                    id: tienda.id
                }
            });
        } else {
            if (req.userId !== tienda.userId) return res.status(403).json({ msg: "Akses terlarang" });
            await Tiendas.update({ name, referencia, horaInicio, horaFin, estado }, {
                where: {
                    [Op.and]: [{ id: tienda.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Tienda actualizada con éxito" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteTienda = async (req, res) => {
    try {
        const tienda = await Tiendas.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!tienda) return res.status(404).json({ msg: "Datos no encontrados" });
        if (req.role === "admin") {
            await Tiendas.destroy({
                where: {
                    id: tienda.id
                }
            });
        } else {
            if (req.userId !== tienda.userId) return res.status(403).json({ msg: "Acceso prohibido" });
            await Tiendas.destroy({
                where: {
                    [Op.and]: [{ id: tienda.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Tienda eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
