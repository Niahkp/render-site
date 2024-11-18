const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(cors());
app.use(express.static("public"));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const lunchMenu = [
        {
            "_id": 1,
            "name": "Salad",
            "img_name": "images/salad.jpeg",
            "description": "Fresh hand tossed salad with your choice of dressing.",
            "price": "$10.00",
            "options": ["Ranch", "Italian", "Caesar"]
        },
        {
            "_id": 2,
            "name": "Nachos",
            "img_name": "images/nachos.jpeg",
            "description": "A basket of hot nachos, made with chips, pulled chicken, jalapenos, and cheese.",
            "price": "$8.50",
            "options": ["Extra cheese", "Sour cream", "Guacamole"]
        },
        {
            "_id": 3,
            "name": "Wings",
            "img_name": "images/wings-new.jpg",
            "description": "Traditional styled wings with your choice of sauce.",
            "price": "$12.00",
            "options": ["BBQ", "Buffalo", "Teriyaki"]
        },
        {
            "_id": 4,
            "name": "Chilli Cheese Fries",
            "img_name": "images/chilliecheesfries-new.jpg",
            "description": "A basket of hot fries with homemade chilli, cheese, and jalapenos.",
            "price": "$8.00",
            "options": ["Add sour cream", "Extra cheese"]
        },
        {
            "_id": 5,
            "name": "Bacon Cheeseburger",
            "img_name": "images/burger.jpeg",
            "description": "Juicy burger, served with bacon, lettuce, tomato, onions, ketchup, mustard, and mayo.",
            "price": "$11.50",
            "options": ["Add avocado", "Extra patty"]
        },
        {
            "_id": 6,
            "name": "Philly Cheesesteak",
            "img_name": "images/phillycheese-new.jpg",
            "description": "Tasty cheesesteak, served on a roll with flavorful steak bites, onions, peppers, and cheese.",
            "price": "$12.00",
            "options": ["Add mushrooms", "Extra cheese"]
        },
        {
            "_id": 7,
            "name": "Hotdog",
            "img_name": "images/hotdog-new.jpg",
            "description": "Hotdog served with homemade chilli, ketchup, mustard, and shredded cheese.",
            "price": "$6.00",
            "options": ["Add jalapenos", "Extra mustard"]
        },
        {
            "_id": 8,
            "name": "Patty Melt",
            "img_name": "images/pattymelt-new.jpg",
            "description": "Patty Melt served on sandwhich bread with steak, cheese, and onions.",
            "price": "$8.50",
            "options": ["Extra cheese", "Extra steak", "No onions"]
        },
        {
            "_id": 9,
            "name": "Red Velvet Cake",
            "img_name": "images/red-velvet copy.jpg",
            "description": "Homemade delicious, moist red velvet cake with cream cheese icing.",
            "price": "$5.00",
            "options": ["Add ice cream", "Extra icing"]
        },
        {
            "_id": 10,
            "name": "Milkshake",
            "img_name": "images/shake.jpg",
            "description": "Milkshake with your choice of flavor.",
            "price": "$4.00",
            "options": ["Chocolate", "Vanilla", "Strawberry"]
        },
        {
            "_id": 11,
            "name": "Peach Cobbler",
            "img_name": "images/cobbler.jpeg",
            "description": "Homemade southern peach cobbler, with fresh peaches.",
            "price": "$5.50",
            "options": ["Add ice cream"]
        },
        {
            "_id": 12,
            "name": "Cheesecake",
            "img_name": "images/cheesecke.jpeg",
            "description": "Delightful fresh cheesecake.",
            "price": "$6.00",
            "options": ["Add strawberries", "Add chocolate sauce"]
        },
        {
            "_id": 13,
            "name": "Water",
            "img_name": "images/h20.jpeg",
            "description": "Refreshing bottled water.",
            "price": "$1.00",
            "options": []
        },
        {
            "_id": 14,
            "name": "Pepsi",
            "img_name": "images/pepsi.jpeg",
            "description": "Chilled Pepsi soda.",
            "price": "$1.50",
            "options": []
        },
        {
            "_id": 15,
            "name": "Lemonade",
            "img_name": "images/lemonade.jpeg",
            "description": "Freshly squeezed lemonade.",
            "price": "$2.00",
            "options": []
        },
        {
            "_id": 16,
            "name": "Sprite",
            "img_name": "images/sprite.jpeg",
            "description": "Chilled Sprite soda.",
            "price": "$1.50",
            "options": []
        },
        {
            "_id": 17,
            "name": "Fruit Punch",
            "img_name": "images/fruitpunch.jpeg",
            "description": "Fruity and refreshing punch.",
            "price": "$2.00",
            "options": []
        },
        {
            "_id": 18,
            "name": "Sweet Tea",
            "img_name": "images/tea.jpeg",
            "description": "Homemade sweet tea.",
            "price": "$2.00",
            "options": []
        }
    ];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
      
app.get("/api/house_plans", (req, res) => {
    res.json(lunchMenu);
});

app.post("/api/house_plans", upload.single("img"), (req, res) => {
  console.log("In post request");

  const result = validateMenuItem(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const newItem = {
    _id: lunchMenu.length + 1,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
  };

  if (req.file) {
    // newItem.img_name = req.file.filename;
    newItem.img_name = "images/" + req.file.filename;
  }

    lunchMenu.push(newItem);

  console.log(newItem);
  res.status(200).send(newItem);
});

const validateMenuItem = (newItem) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().positive().required(),
    img_name: Joi.string().optional(),
  });

  return schema.validate(newItem);
};

app.listen(3006, () => {
  console.log("Listening...");
});