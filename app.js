const express = require('express');
const fs = require('fs');

const app = express();

const PATH_ARCHIVO = __dirname + '/deportes.json'

app.listen(3000, () => {
  console.log('El servidor está inicializado en el puerto 3000');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/agregar', async (req, res) => {
  try {
    const deportes = await leerJson();
    const deporte = {
      nombre: req.query.nombre,
      precio: req.query.precio,
    };
    console.log(deporte);
    if (deporte.nombre == undefined || deporte.precio == undefined) {
      throw new Error("Uno de los parametros está vacío");
    }
    deportes.push(deporte);
    await guardarJson(deportes);
    res.send('Deporte agregado correctamente');
  } catch (e) {
    console.log('ERROR al agregar deporte: ', e);
    res.send('No fue posible agregar el deporte, intenta nuevamente');
  }
});

app.get('/deportes', async (req, res) => {
  const deportes = await leerJson();
  res.send({ deportes: deportes });
});

app.get('/editar', async (req, res) => {
  try {
    let deportes = await leerJson();
    const nombre_deporte = req.query.nombre;
    const precio_deporte = req.query.precio
    if (precio_deporte == undefined) {
      throw new Error("El precio está vacío");
    }
    deportes = deportes.map((deporte) => {
      if (deporte.nombre == nombre_deporte) {
        deporte.precio = precio_deporte;
      }
      return deporte;
    });
    await guardarJson(deportes);
    res.send('Deporte editado correctamente');
  } catch (e) {
    console.log('ERROR al eliminar deporte: ', e);
    res.send('No fue posible editar el deporte, intenta nuevamente');
  }
});

app.get('/eliminar', async (req, res) => {
  try {
    let deportes = await leerJson();
    const nombre_deporte = req.query.nombre;
    deportes = deportes.filter((deporte) => deporte.nombre != nombre_deporte);
    await guardarJson(deportes);
    res.send('Deporte eliminado correctamente');
  } catch (e) {
    console.log('ERROR al eliminar deporte: ', e);
    res.send('No fue posible eliminar el deporte, intenta nuevamente');
  }
});

async function leerJson() {
  try {
    const datos = fs.readFileSync(PATH_ARCHIVO);
    const json = JSON.parse(datos);
    return json;
  } catch(e) {
    console.log('ERROR al leer archivo: ', e);
    return [];
  }
}

async function guardarJson(deportes) {
  const datos = JSON.stringify(deportes);
  await fs.writeFileSync(PATH_ARCHIVO, datos, 'utf8');
}