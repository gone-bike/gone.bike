import express from 'express'
import morgan from 'morgan'
import { handler as astroSsrHandler } from './dist/server/entry.mjs';
import serveIndex from 'serve-index'
const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

const app = express();

app.use(morgan('combined'))

app.use(express.static('./dist/client/'))
app.use('/tmp', express.static('./public/tmp/'))


// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/exports', express.static('/data'), serveIndex('/data', {'icons': true}))
// app.use('/ftp', express.static('public/ftp'), serveIndex('public/ftp', {'icons': true}))


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

