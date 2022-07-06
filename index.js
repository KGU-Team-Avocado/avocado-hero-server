const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const testsRouter = require("./routes/Tests");
const usersRouter = require("./routes/Users");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//application/json
app.use(bodyParser.json({ limit: "50mb" }));

let ip = require("ip");
console.dir("현재 사용중인 내부 ip...");
console.log("ip : 'http://" + ip.address() + "',");
// console.dir('위 한 줄을 복사해서 config.js의 ip 줄에 그대로 덮어쓰기 하세요.');
// console.dir('위의 ip가 맞지 않는 경우 cmd에서 ipconfig를 통해 ip를 확인하세요.');
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

app.use("/testsRouter", testsRouter);
app.use("/usersRouter", usersRouter);
