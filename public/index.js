const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 80;

app.use(bodyParser.json());
app.use(cors());

let orders = [];

// Route to add new order
app.post('/addOrder', (req, res) => {
    const { tableNumber, foodItem } = req.body;
    if (!tableNumber || !foodItem) {
        return res.status(400).json({ error: 'Laua number ja toit on vajalikud' });
    }

    const order = { id: orders.length + 1, tableNumber, foodItem, time: new Date().toISOString(), status: 'valmimisel' };
    orders.push(order);
    console.log('Uus tellimus:', order);

    // Send the updated list of orders with details to both interfaces
    res.json({ message: 'Tellimus on lisatud', orders });
});

// Route to mark an order as done
app.post('/markAsDone', (req, res) => {
    const orderId = req.body.orderId;
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'Valmis';
        console.log('Order marked as done:', orders[orderIndex]);
        // Send the updated list of orders with details to both interfaces
        res.json({ message: 'Tellimus on valmis', orders });
    } else {
        res.status(404).json({ error: 'Tellimust ei leitud' });
    }
});
app.post('/deleteOrder', (req, res) => {
    const orderId = req.body.orderId;
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1); // Remove the order from the orders array
        console.log('Order deleted:', orderId);
        // Send the updated list of orders with details to both interfaces
        res.json({ message: 'Order deleted successfully', orders });
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// Route to get all orders
app.get('/orders', (req, res) => {
    // Adjust the time format in the orders array
    const adjustedOrders = orders.map(order => {
        // Assuming the time is in ISO 8601 format ('YYYY-MM-DDTHH:mm:ss.sssZ')
        // You can adjust the time format as needed
        const isoTime = order.time;
        const date = new Date(isoTime);
        const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        // Return the order object with adjusted time format
        return { ...order, time: formattedTime };
    });

    // Send the adjusted orders data as the response
    res.json({ orders: adjustedOrders });
});

app.listen(PORT, () => {
    console.log(`Keeni Punkri köögi server töötab!!!!`);
});
