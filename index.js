import express from "express";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import axios from "axios";

dotenv.config();
var port = process.env.PORT || 4000;
var weather_api_key = process.env.WEATHER_API_KEY;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const app = express();

const getMumbaiTemp = async () => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${weather_api_key}&q=Delhi`
    );
    const temperature = response.data.current.temp_c;
    return temperature;
  } catch (error) {
    console.error(error);
  }
};

bot.command("start", async (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Hello there! Welcome to my TDelhi bot. From now you will get the temperature of Delhi every 10 seconds.",
    {}
  );
  const temperature = await getMumbaiTemp();
  bot.telegram.sendMessage(
    ctx.chat.id,
    `The temperature in Delhi is currently ${temperature} degrees Celsius.`
  );
  setInterval(async () => {
    const temperature = await getMumbaiTemp();
    bot.telegram.sendMessage(
      ctx.chat.id,
      `The temperature in Delhi is currently ${temperature} degrees Celsius.`
    );
  }, 10000);
});

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
  bot.launch();
});
