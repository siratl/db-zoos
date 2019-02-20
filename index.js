const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3',
  },
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
//********************************** ZOOS ENDPOINTS ****************************/

// **************** LIST ALL ZOOS **************//
server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** LIST SPECIFIC ZOO **************//
server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoos = await db('zoos')
      .where({ id: req.params.id })
      .first();
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** CREATE ZOO **************//
const errors = {
  '19': 'A unique name is REQUIRED, No duplicate name allowed.',
};
server.post('/api/zoos', async (req, res) => {
  try {
    const [id] = await db('zoos').insert(req.body);
    const animal = await db('zoos')
      .where({ id })
      .first();

    res.status(201).json({ message: 'Sucessfully added.', animal });
  } catch (error) {
    const message = errors[error.errno] || 'Constraint Violation!';
    res.status(500).json({ message });
  }
});

// **************** UPDATE ZOO **************//
server.put('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const animal = await db('zoos')
        .where({ id: req.params.id })
        .first();
      res.status(201).json({ message: 'Sucessfully Updated.', animal });
    } else {
      res.status(404).json({
        message: `Object with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** DELETE ZOO **************//
server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).json({ message: 'Sucessfully Deleted.' });
    } else {
      res.status(404).json({
        message: `Object with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//********************************** BEARS ENDPOINTS ****************************/
// **************** LIST ALL BEARS **************//
server.get('/api/bears', async (req, res) => {
  try {
    const bears = await db('bears');
    res.status(200).json(bears);
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** LIST SPECIFIC BEAR **************//
server.get('/api/bears/:id', async (req, res) => {
  try {
    const bears = await db('bears')
      .where({ id: req.params.id })
      .first();
    res.status(200).json(bears);
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** CREATE BEAR **************//
server.post('/api/bears', async (req, res) => {
  try {
    const [id] = await db('bears').insert(req.body);
    const animal = await db('bears')
      .where({ id })
      .first();

    res.status(201).json({ message: 'Sucessfully added.', animal });
  } catch (error) {
    const message = errors[error.errno] || 'Constraint Violation!';
    res.status(500).json({ message });
  }
});

// **************** UPDATE BEAR **************//
server.put('/api/bears/:id', async (req, res) => {
  try {
    const count = await db('bears')
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const animal = await db('bears')
        .where({ id: req.params.id })
        .first();
      res.status(201).json({ message: 'Sucessfully Updated.', animal });
    } else {
      res.status(404).json({
        message: `Object with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** DELETE BEAR **************//
server.delete('/api/bears/:id', async (req, res) => {
  try {
    const count = await db('bears')
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).json({ message: 'Sucessfully Deleted.' });
    } else {
      res.status(404).json({
        message: `Object with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
