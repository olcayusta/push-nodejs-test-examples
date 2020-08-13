const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const pg = require('pg');

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'qa',
    password: '123456'
});

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

const publicVapidKey = 'BO2o-qUJJEbSYGL7BcPlHAtEU0cPdW5OGrAJcm-swR4GYZl6_OK7lFGrQaHXtQtlHMG6V5f72hU_ug6kg4A_voo';
const privateVapidKey = 'glgPrZhddpbdw-1R2T4ju7a3QCJCxORIUZS5fXPYQHI';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

let subscribe = null;

app.get('/article', (req, res) => {
    const title = 'Hello Push!';
    const sql = `INSERT INTO articles (title) VALUES ($1) RETURNING id`;
    pool.query(sql, [title]).then(value => {
        console.log('Veri kaydedildi!');
        res.status(201).json({});
        const payload = JSON.stringify({title: 'Push Test2'});
        webpush.sendNotification(subscribe, payload).catch(err => console.log(err));
    }).catch(err => {
        console.log(err);
    })
});

app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    const name = 'Olcay';

    console.log(subscription);
    console.log(subscription.endpoint);

    subscribe = subscription;

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({title: 'Push Test'});

    // Pass object into sendNotification
    webpush.sendNotification(subscription, payload).catch(err => console.log(err))

});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))
