const express = require("express");
const app = express();
const axios = require("axios");
let port = process.env.PORT || 3000;

console.log("outside class");

function call_endpoint() {
  let count = 0;
  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  app.get("/", async (req, res) => {
    res.send("Hello World !");
  });

  app.get("/stats", async (req, res) => {
    try {
      count += 1;
      console.log(count);
      if (count < 100) {
        const conn = await axios.get(
          "https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=34487577b4e7dcfe4b35aed0415b2f43"
        );

        let stats_data = conn.data.map((data) => {
          var symbol = data.symbol;
          var price = data.price;
          var change_price = data.change;
          var change_percent = data.changesPercentage;

          return { symbol, price, change_price, change_percent };
        });

        console.log("connected  stats");
        res.json(stats_data);
      } else {
        res.json(
          "Sorry, you have reach limit request.Please try again after 30 sec."
        );
        await delay(30000);
        count = 0;
      }
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/news", async (req, res) => {
    try {
      count += 1;
      console.log(count);
      if (count < 100) {
        const fetch = await axios.get(
          "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
        );

        let news_data = fetch.data.Data.map((data) => {
          // var date = new Date(data.published_on * 1000);
          // console.log(date);
          let title = data.title;
          let content = data.body;
          let author = data.source_info.name;
          let time_date = data.published_on;
          let url = data.url;
          let image_url = data.imageurl;
          return { title, content, author, time_date, image_url, url };
        });

        const response = await axios.get("https://data.messari.io/api/v1/news");

        response.data.data.map((data) => {
          var date = data.published_at;
          var unix_seconds = new Date(date).getTime() / 1000;
          let title = data.title;
          let content = data.content;
          let author = data.author.name;
          let time_date = unix_seconds;
          let url = data.url;
          let image_url =
            "https://roofequipmentllc.com/wp-content/uploads/2019/01/noimage.png";
          news_data.push({ title, content, author, time_date, image_url, url });
        });

        const connect = await axios.get(
          "https://newsdata.io/api/1/news?apikey=pub_54444018c610e2326920beff18d7fa232280"
        );

        connect.data.results.map((data) => {
          var date = data.pubDate;
          var unix_seconds = new Date(date).getTime() / 1000;
          let title = data.title;
          let content = data.description;
          let author =
            data.creator == null ? "no data for publisher" : data.creator;
          let time_date = unix_seconds;
          let url = data.link;
          let image_url =
            data.image_url == null
              ? "https://roofequipmentllc.com/wp-content/uploads/2019/01/noimage.png"
              : data.image_url;
          news_data.push({ title, content, author, time_date, image_url, url });
        });

        // let whole_news_data = [...news_data, news_data1];
        // console.log(whole_news_data[69]);

        console.log("connected news");
        res.json(news_data);
      } else {
        res.json(
          "Sorry, you have reach limit request.Please try again after 30 sec."
        );
        await delay(30000);
        count = 0;
      }
    } catch (error) {
      console.log(error);
    }
  });
}

call_endpoint();
app.listen(port, () => {
  console.log("This API listening on port http://localhost:3000");
});
