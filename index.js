// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const fs = require("fs");
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const { nuevoSkater, getSkaters, getSkater, actualizarSkater, statusSkater, eliminarSkater } = require('./consultas/consultas.js');
const PORT = 3000;
const secretKey = "ClaveMuySecreta";

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Definiendo como carpeta publica a public
app.use(express.static(__dirname + "/public"));

// Configuracion de expressFileUpload
app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: "El tamaño de la imagen supera el límite permitido",
    })
);

// Definimos rutas de bootstrap
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

// Configuramos el motor de plantillas
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
    })
);
// Definimos handlebars como motor de plantillas
app.set("view engine", "handlebars");

// Rutas asociadas a los handlebars
app.get("/", async (req, res) => {
    try {
        const skaters = await getSkaters();
        res.render("Home", { skaters });
    } catch (e) {
        return res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        })
    };
});

// Ruta registro
app.get("/registro", (req, res) => {
    res.render("Registro");
});

// Ruta get.login
app.get("/login", (req, res) => {
    res.render("Login");
});

// Ruta post.login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const skater = await getSkater(email, password);

        if (typeof skater === "object") {
            const token = jwt.sign(skater, secretKey, { expiresIn: '1m' });
            console.log("Valor variable token ruta post/login: ", token)
            return res.status(200).send(token);
        } else {
            console.log("error: ", skater);
            return res.status(404).send(skater);
        }
    } catch (e) {
        console.error("error ruta post/login: ", e.message);
        return res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        });
    }
});

// Ruta perfil
app.get("/perfil", (req, res) => {
    const token = req.query.token
    //console.log("Valor variable token ruta get/perfil: ", token)
    jwt.verify(token, secretKey, (err, skater) => {
        if (err) {
            console.log("valor de err: " + err)
            if (err.name == 'TokenExpiredError') {
                // Token expirado
                return res.status(403).send(`
            <h1>¡Usuario no autorizado! - Acceso Denegado</h1>
            <p><b><u>El token ha expirado: ${err.message} (${err.expiredAt.toString().slice(16, 24)} hrs)</u></b></p>`);
            } else {
                // Token invalido
                return res.status(403).send(`
            <h1>¡Usuario no autorizado! - Acceso Denegado</h1>
            <p><b><u>El token es invalido: ${err.message}</u></b></p>`);
            }
        } else {
            res.render("Perfil", { skater });
        }
    })
});

// Ruta Admin
app.get("/Admin", async (req, res) => {
    try {
        const skaters = await getSkaters();
        res.render("Admin", { skaters });
    } catch (e) {
        return res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        })
    };
});


// API REST de Skaters
// Ruta get skaters
app.get("/skaters", async (req, res) => {
    try {
        const respuesta = await getSkaters();
        //console.log("valor de respuesta: ", respuesta)
        res.status(200).send(respuesta);
    } catch (e) {
        return res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        })
    };
});

// Ruta post skaters
app.post("/skaters", async (req, res) => {
    try {
        const { email, nombre, password, anos_experiencia, especialidad } = req.body;
        const { foto } = req.files;
        // console.log("ruta post skaters:", "email:", email, "nombre:", nombre, "password:", password, "años:", anos_experiencia, "especialidad:", especialidad);
        // console.log("foto: ", foto);

        // Verificar si se cargó una foto
        if (!foto) {
            return res.status(400).send("No se encontró ninguna imagen en la solicitud");
        }
        const respuesta = await nuevoSkater(email, nombre, password, anos_experiencia, especialidad, foto.name);
        console.log("respuesta post skaters: ", respuesta);

        // Obtener la ruta donde se almacenara la foto
        const rutaImagen = `/uploads/${foto.name}`;

        // Mover la foto al directorio de uploads
        foto.mv(`./public${rutaImagen}`);

        // Redireccionar a la página de inicio
        res.status(201).redirect("/");
    } catch (e) {
        console.error("Error al agregar skater:", error.message);
        return res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        });
    }
});

// Ruta put skaters
app.put("/skaters", async (req, res) => {
    const { id, nombre, anos_experiencia, especialidad } = req.body;
    //console.log("Valor del body: ", id, nombre, anos_experiencia, especialidad);
    try {
        const respuesta = await actualizarSkater(id, nombre, anos_experiencia, especialidad);
        //console.log("respuesta:", respuesta)
        res.status(200).send(respuesta);
    } catch (e) {
        return res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        })
    };
});

// Ruta put skaters/status/:id
app.put("/skaters/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        //console.log("Valor de estado recibido por body: ", estado)
        const respuesta = await statusSkater(id, estado);
        //console.log("respuesta:", respuesta)
        res.status(200).send(respuesta);
    } catch (e) {
        return res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        })
    };
});

// Ruta delete skaters/:id
app.delete("/skaters/:id", async (req, res) => {
    try {
        const { id } = req.params
        const skater = await eliminarSkater(id);
        if (typeof skater !== "string") {
            const imagen = `./public/uploads/${skater.foto}`;
            fs.unlinkSync(imagen);
            console.log(`Imagen del skater con id ${id} eliminada correctamente`);
            res.status(200).send(skater);
        } else {
            return res.status(400).send("No existe este Skater");
        }
    } catch (e) {
        return res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        })
    };
});