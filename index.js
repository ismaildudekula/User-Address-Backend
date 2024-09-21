const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./database');
const User = require('./models/user');
const Address = require('./models/address');

const app = express();
app.use(bodyParser.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define associations
User.associate({ Address });
Address.associate = (models) => {
    Address.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
    });
};

// Sync database
sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});

// Routes
app.post('/register', async (req, res) => {
    const { name, address } = req.body;
    try {
        const user = await User.create({ name });
        const userAddress = await Address.create({ address, userId: user.id });
        res.status(201).json({ user, address: userAddress });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Address,
                as: 'addresses'
            }]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
