const express = require("express");

const app = express();
const PORT = 3000;
process.env.PORT || PORT;

app.use(express.static(__dirname + "/dist/"));
app.listen(PORT, function () {
  console.log(`Приложение запущено на порту  ${PORT}!`);
});