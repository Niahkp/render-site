const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(cors());
app.use(express.static("public"));
const mongoose = require("mongoose");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect("mongodb+srv://1C6nxN9BFodYsydO:1C6nxN9BFodYsydO@cluster0.l57jg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const lunchSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  img_name: String,
});

const lunchMenu = mongoose.model("lunchMenu", lunchSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
      
app.get("/api/house_plans", async (req, res) => {
    const lunches = await lunchMenu.find();
    res.json(lunches);
});

// app.get("/api/house_plans/:id", async (req, res) => {
//   const newItem = await lunchMenu.findOne({ _id: id});
//   res.send(newItem);
// });

app.post("/api/house_plans", upload.single("img"), async (req, res) => {
  console.log("In post request");

  const result = validateMenuItem(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const newItem = new lunchMenu({
  //  _id: lunchMenu.length + 1,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
  });

  if (req.file) {
    //  newItem.img_name = req.file.filename;
    newItem.img_name = "images/" + req.file.filename;
  }

  const newlunchMenu = await newItem.save();
  res.send(newlunchMenu);

    // lunchMenu.push(newItem);

  // console.log(newItem);
  // res.status(200).send(newItem);
});

app.put("/api/house_plans/:id", upload.single("img"), async (req, res) => {
  // const id = parseInt(req.params.id);
  // const item = lunchMenu.find((menuItem) => menuItem._id === id);

  // if (!item) {
  //   return res.status(404).send("Item not found.");
  // }


  const result = validateMenuItem(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const fieldsToUpdate = {
    name: req.body.name,
    price: parseFloat(req.body.price),
    description: req.body.description,
  };

  if (req.file) {
    fieldsToUpdate.img_name = req.file.filename;
  }

  const wentThrough = await lunchMenu.updateOne(
    { _id: req.params.id }, 
    fieldsToUpdate
  );

  const upadatedItem = await lunchMenu.findOne({ _id: req.params.id });
  res.send(upadatedItem);

  // res.status(200).send(item);
});

app.delete("/api/house_plans/:id", async (req, res) => {
  // console.log("Current lunchMenu:", lunchMenu);
  // const index = lunchMenu.find((menuItem) => menuItem._id === parseInt(req.params.id));
  const newItem = await lunchMenu.findByIdAndDelete(req.params.id);
  res.send(newItem);
  // if (!index) {
  //   return res.status(404).send("Item not found.");
  // }

  // const removedItem = lunchMenu.splice(index, 1);
  // res.status(200).send(removedItem[0]);
});

const validateMenuItem = (newItem) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().positive().required(),
    img_name: Joi.string().optional(),
  });

  return schema.validate(newItem);
};

app.listen(3006, () => {
  console.log("Listening...");
});