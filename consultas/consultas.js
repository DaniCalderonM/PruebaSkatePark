const pool = require("../config/db.js");
const tabla = 'skaters';
let mensaje;

// Agregar un nuevo skater
const nuevoSkater = async (email, nombre, password, anos_experiencia, especialidad, foto) => {
    try {
        // Validar que ingresen todos los campos, tanto en el formulario como por thunder o postman
        if (!email || !nombre || !password || !anos_experiencia || !especialidad) {
            mensaje = "Debe ingresar todos los campos: email, nombre, password, anos_experiencia y especialidad";
            console.log(mensaje);
            return mensaje;
        } else {
            // Validar que no exista el usuario en la bbdd
            const consulta = {
                text: `SELECT * FROM ${tabla} WHERE email = $1 AND nombre = $2`,
                values: [email, nombre]
            }

            const verificar = await pool.query(consulta);
            if (verificar.rows != 0) {
                mensaje = "El Skater ya existe en la base de datos"
                console.log(mensaje)
                return mensaje;
            }
        }

        const consulta = {
            text: ` INSERT INTO ${tabla} (email, nombre, password, anos_experiencia, especialidad, foto, estado) values ($1, $2, $3, $4, $5, $6, false) RETURNING *`,
            values: [email, nombre, password, anos_experiencia, especialidad, foto],
        };
        const resultado = await pool.query(consulta);
        if (resultado.rows == 0) {
            mensaje = "No se pudo agregar al nuevo Skater";
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`Skater con nombre: ${nombre} agregado correctamente. ${JSON.stringify(resultado.rows[0])}`);
            return resultado.rows[0];
        }
    } catch (error) {
        return error.message;
    }
}

// Mostrar todos los skaters
const getSkaters = async () => {
    try {
        const consulta = {
            rowMode: "array",
            text: `SELECT * FROM ${tabla}`
        };
        const resultado = await pool.query(consulta);

        if (resultado.rows == 0) {
            mensaje = "No se encontraron skaters";
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`El registro actual de skaters es ${JSON.stringify(resultado.rows)}`);
            return resultado.rows;
        }
    } catch (error) {
        return error.message;
    }
};

// Consultar por un skater
const getSkater = async (email, password) => {
    try {
        // Verificar si se proporcionó el campo rut
        if (!email || !password) {
            mensaje = "Debe ingresar un email y un password";
            console.log(mensaje);
            return mensaje;
        }

        const consulta = {
            text: `SELECT * FROM ${tabla} WHERE email = $1 AND password = $2`,
            values: [email, password]
        };

        const res = await pool.query(consulta);

        // Verificar si se encontro algun skater con el id consultado
        if (res.rows.length == 0) {
            mensaje = "No existe el skater consultado"
            console.log(mensaje)
            return mensaje;
        } else {
            console.log("Skater consultado: ", res.rows[0]);
            return res.rows[0];
        }
    } catch (error) {
        return error.message;
    }
}

// Actualizar un skater
const actualizarSkater = async (id, nombre, anos_experiencia, especialidad) => {
    try {
        //Validar que ingresen todos los campos (si se ejecuta en thunder o en postman)
        if (!id || !nombre || !anos_experiencia || !especialidad) {
            mensaje = "Debe ingresar todos los campos: nombre, anos_experiencia, especialidad";
            console.log(mensaje);
            return mensaje;
        }
        const consulta = {
            text: `UPDATE ${tabla} SET nombre = $1, anos_experiencia = $2, especialidad = $3 WHERE id = $4 RETURNING *`,
            values: [nombre, anos_experiencia, especialidad, id]
        };
        const resultado = await pool.query(consulta);

        if (resultado.rows == 0) {
            mensaje = "No se pudo actualizar al skater, ya que no existe"
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`Skater con nombre: ${nombre} actualizado correctamente.`);
            return resultado.rows[0];
        }
    } catch (error) {
        return error.message;
    }
};

// Actualizar el estado de un skater
const statusSkater = async (id, estado) => {
    try {
        //Validar que ingresen todos los campos (si se ejecuta en thunder o en postman)
        if (!id || !estado) {
            mensaje = "Debe ingresar todos los campos: id y estado";
            console.log(mensaje);
            return mensaje;
        }
        const consulta = {
            text: `UPDATE ${tabla} SET estado = $1 WHERE id = $2 RETURNING *`,
            values: [estado, id]
        };
        const resultado = await pool.query(consulta);

        if (resultado.rows == 0) {
            mensaje = "No se pudo actualizar el estado del skater, ya que no existe"
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`Skater con id: ${id} actualizado correctamente.`);
            return resultado.rows[0];
        }
    } catch (error) {
        return error.message;
    }
};

// Eliminar un skater
const eliminarSkater = async (id) => {
    try {
        //Validar que ingresen el campo id si se ejecuta en thunder o en postman
        if (!id) {
            mensaje = "Debe ingresar el campo id";
            console.log(mensaje);
            return mensaje;
        }
        const consulta = {
            text: `DELETE FROM ${tabla} WHERE id = $1 RETURNING *`,
            values: [id],
        };
        const resultado = await pool.query(consulta);

        if (resultado.rows == 0) {
            mensaje = "No se pudo eliminar al skater, ya que no existe"
            console.log(mensaje);
            return mensaje;
        } else {
            console.log(`Skater con id: ${id} eliminado correctamente.`);
            return resultado.rows[0];
        }
    } catch (error) {
        return error.message;
    }
};


module.exports = { nuevoSkater, getSkaters, getSkater, actualizarSkater, statusSkater, eliminarSkater };
