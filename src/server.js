const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers_db');

dotenv.config();
const app = express();
const schema = makeExecutableSchema({ typeDefs, resolvers });

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.lxydy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
//const uri = `mongodb://localhost:27017/${process.env.MONGO_DB}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    if (err) {
        console.error(err.message);
        process.exit(0);
    }

    const collection = client.db('magireco-api').collection('charaList');

    app.use(
        '/',
        graphqlHTTP({
            schema: schema,
            graphiql: true,
            context: { collection }
        })
    );

    app.get('/update', () => {
        const updateScript = spawn('python', ['script1.py']);
        // in close event we are sure that stream from child process is closed
        updateScript.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            // send data to browser
            res.send('Update completed.');
        });
    });

    let server = app.listen(process.env.PORT, () =>
        console.log(`expressed graphql server running on localhost:${process.env.PORT}/`)
    );

    const exitHandler = () => {
        server.close(() => {
            console.log('server closed');
            client.close(false, () => {
                console.log('mongo connection closed');
                process.exit(0);
            });
        });
    };

    process.on('exit', exitHandler);
    process.on('SIGTERM', exitHandler);
});
