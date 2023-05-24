import express from 'express'
import morgan from 'morgan'
import { handler as astroSsrHandler } from './dist/server/entry.mjs';
const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

const app = express();

app.use(morgan('combined'))

app.use(express.static('./dist/client/'))

app.use(astroSsrHandler);

app.use((req, res, next) => {
    res
      .status(404)
      .setHeader("Content-Type", "text/html")
      .sendFile(__dirname +  '/src/pages/404.astro')

})

app.listen( 3000 , '0.0.0.0', () => {
    console.log("server started")
})

