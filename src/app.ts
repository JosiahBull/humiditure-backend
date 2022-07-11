import express from 'express';
import path from 'path';
import { NodeHandler } from './modules/node';

function main() {
    const app = express();
    const port = 3000;

    app.locals.values = {};

    app.use('/static', express.static(path.join(__dirname, '../static')));
    app.use('/dashboard', express.static(path.join(__dirname, '../static/dashboard.html')));

    app.use(express.json());

    app.get('/nodes', (_, res) => {
        res.send(app.locals.values.keys());
    });

    // Node for collecting data from a sensor
    app.get('/node/:id', (req, res) => {
        const node_id = req.params.id;
        const node = app.locals.values.get(node_id);
        if (node) {
            res.send(node.getValue());
        } else {
            res.status(404).send('not found');
        }
    });

    app.post('/node/:id', (req, res) => {
        const node_id = req.params.id;

        let node = app.locals.values.get(node_id);
        if (!node) {
            node = NodeHandler(node_id);
            res.status(201);
        }
        node.setValue(req.body.value);
        app.locals.set(node_id, node);

        res.send('ok');
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}


main();
