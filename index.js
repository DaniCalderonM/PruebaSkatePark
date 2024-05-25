// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const { nuevoSkater, getSkaters, getSkater, actualizarSkater, statusSkater, eliminarSkater } = require('./consultas/consultas.js');
const PORT = 3000;
const secretKey = "ClaveMuySecreta";

// Server
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(__dirname + "/public"));
app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: "El tamaño de la imagen supera el límite permitido",
    })
);

app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
    })
);

app.set("view engine", "handlebars");


// Rutas asociadas a los handlebars
app.get("/", async (req, res) => {
    try {
        const respuesta = await getSkaters();
        res.render("Home", { respuesta });
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.get("/registro", (req, res) => {
    res.render("Registro");
});

app.get("/login", (req, res) => {
    res.render("Login");
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const respuesta = await getSkater(email, password);
        if (!respuesta) {
            return res.status(404).send("Usuario no encontrado");
        }

        // Si se encuentra el usuario, generar un token JWT
        const token = jwt.sign(skater, secretKey);
        res.status(200).send(token);
    } catch (error) {
        // Si ocurre algún error, enviar un mensaje de error
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

app.get("/perfil", (req, res) => {
    const { token } = req.query
    jwt.verify(token, secretKey, (err, skater) => {
        if (err) {
            res.status(500).send({
                error: `Algo salió mal...`,
                message: err.message,
                code: 500
            })
        } else {
            res.render("Perfil", { skater });
        }
    })
});


app.get("/Admin", async (req, res) => {
    try {
        res.render("Admin", { skaters });
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});


// API REST de Skaters

app.get("/skaters", async (req, res) => {
    try {
        const respuesta = await getSkaters();
        console.log("valor de respuesta: ", respuesta)
        res.status(200).send(respuesta);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e.message}`,
            code: 500
        })
    };
});

app.post("/skaters", async (req, res) => {
    const { email, nombre, password, anos_experiencia, especialidad } = req.body;
    const { foto } = req.files;
console.log("ruta post skaters:", "email:",email, "nombre:", nombre, "password:", password, "años:", anos_experiencia, "especialidad:", especialidad )
console.log("foto: ", foto);
    // Verificar si se cargó una foto
    if (!foto) {
        return res.status(400).send("No se encontró ninguna imagen en la solicitud");
    }

    try {
        // Llamar a la función nuevoSkater con los datos del skater
        const respuesta = await nuevoSkater(email, nombre, password, anos_experiencia, especialidad, foto);
        console.log("respuesta post skaters: ", respuesta)
        // Obtener el nombre de la foto y la ruta donde se almacenará
        const { name } = foto;
        const pathPhoto = `/uploads/${name}`;

        // Mover la foto al directorio de uploads
        foto.mv(`${__dirname}/public${pathPhoto}`);

        // Agregar la ruta de la foto al skater
        respuesta.foto = pathPhoto;

        // Redireccionar a la página de inicio
        res.status(201).redirect("/");
    } catch (error) {
        console.error("Error al agregar skater:", error);
        res.status(500).send({
            error: `Algo salió mal... ${error.message}`,
            code: 500
        });
    }
});

app.put("/skaters", async (req, res) => {
    const { id, nombre, anos_experiencia, especialidad } = req.body;
    console.log("Valor del body: ", id, nombre, anos_experiencia, especialidad);
    try {
        const respuesta = await actualizarSkater(id, nombre, anos_experiencia, especialidad);
        //console.log("respuesta:", respuesta)
        res.status(200).send(respuesta);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.put("/skaters/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        console.log("Valor de estado recibido por body: ", estado)
        const respuesta = await statusSkater(id, estado);
        //console.log("respuesta:", respuesta)
        res.status(200).send(respuesta);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.delete("/skaters/:id", async (req, res) => {
    try {
        const { id } = req.params
        const respuesta = await eliminarSkater(id);
        if (typeof respuesta !== "string") {
            res.status(200).send(respuesta);
        } else {
            res.status(400).send("No existe este Skater");
        }
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

