const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const testsRouter = require("./routes/Tests");
const usersRouter = require("./routes/Users");
const groupsRouter = require("./routes/Groups");
const companiesRouter = require("./routes/Companies");


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//application/json
app.use(bodyParser.json({ limit: "50mb" }));

let ip = require("ip");
console.dir("현재 사용중인 내부 ip...");
console.log("ip : 'http://" + ip.address() + "',");

console.log();

mongoose
  .connect(
    `mongodb+srv://soyoung:qnstksalcqudfufcjfl@cluster0.c7eeq.mongodb.net/avocado_hero?authSource=admin&replicaSet=atlas-rkqtpg-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`,
    {}
  )
  .then(() => {
    console.log(
      "MongoDB Connected!! ① http://localhost:5000 ② http://" +
        ip.address() +
        ":5000"
    );
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("서버가 동작하고 있습니다.");
});

app.listen(5000, function () {
  console.log("listening on 5000");
});

/* GET. */
app.get('/ip', function (req, res, next) {
    res.json(ip.address())
});

app.use("/testsRouter", testsRouter);
app.use("/usersRouter", usersRouter);
app.use("/groupsRouter", groupsRouter);
app.use("/companiesRouter", companiesRouter);