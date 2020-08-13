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

const dummyDb = { subscription: null } //dummy in memory store

const saveToDatabase = async subscription => {
    // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
    // Here you should be writing your db logic to save it.
    dummyDb.subscription = subscription
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {

    //Method to save the subscription to Database

})

// Set static path
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

const publicVapidKey = 'BO2o-qUJJEbSYGL7BcPlHAtEU0cPdW5OGrAJcm-swR4GYZl6_OK7lFGrQaHXtQtlHMG6V5f72hU_ug6kg4A_voo';
const privateVapidKey = 'glgPrZhddpbdw-1R2T4ju7a3QCJCxORIUZS5fXPYQHI';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

app.post('/subscribe', async (req, res) => {
    const subscription = req.body;

    const name = 'Olcay';

    await saveToDatabase(subscription);

    // Send 201 - resource created
    res.json({ message: 'success' });

    // Create payload
    const payload = JSON.stringify({title: 'Push Test'});

    // Pass object into sendNotification
    // webpush.sendNotification(subscription, payload).catch(err => console.log(err))

});

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
    webpush.sendNotification(subscription, dataToSend)
}

//route to test send notification
app.get('/send-notification', (req, res) => {
    const subscription = dummyDb.subscription //get subscription from your databse here.
    const message = 'Hello World'
    sendNotification(subscription, message)
    res.json({ message: 'message sent' })
})

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))
