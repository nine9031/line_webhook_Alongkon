const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const port = 4000;

//create server
const app = express();

//middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome, this is a Webhook for Line Chatbot !!!</h1>");
});
app.post("/webhook", (req, res) => {
  //create webhook client
  const agent = new WebhookClient({
    request: req,
    response: res,
  });
  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function bodyMassIndex(agent) {
    let weight = agent.parameters.weight;
    let height = agent.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);

    let result = "ขออภัย หนูไม่เข้าใจ";

    if (bmi < 18.5) {
      result = "คุณผอมไป กินข้าวบ้างนะ";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      result = "คุณหุ่นดีจุงเบย";
    } else if (bmi >= 23 && bmi <= 24.9) {
      result = "คุณเริ่มจะท้วมแล้วนะ";
    } else if ((bmi >= 25.8) & (bmi <= 29.9)) {
      result = "คุณอ้วนละ ออกกำลังกายหน่อยนะ";
    } else if (bmi > 30) {
      result = "คุณอ้วนเกินไปละ หาหมอเหอะ";
    }
    const flexMessage = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "BMI Calculation Result",
              weight: "bold",
              size: "lg",
              align: "center",
            },
          ],
        },
        hero: {
          type: "image",
          url: "https://lirp.cdn-website.com/69c0b277/dms3rep/multi/opt/BMI+levels-1920w.jpg",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "fit",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "ดัชนีมวลการของคุณ",
              weight: "bold",
              size: "md",
              margin: "md",
            },
            {
              type: "text",
              text: "ส่วนสูงของคุณครือ " + height * 100 + " เซนติเมตร",
              size: "sm",
              margin: "sm",
            },
            {
              type: "text",
              text: "น้ำหนักของคุณครือ " + weight + " กิโลกรัม",
              size: "sm",
              margin: "sm",
            },
            {
              type: "separator",
              margin: "lg",
            },
            {
              type: "text",
              text: "BMI: " + bmi,
              weight: "bold",
              size: "xl",
              align: "center",
              margin: "lg",
              color: "#00b900",
            },
            {
              type: "text",
              text: result,
              align: "center",
              size: "sm",
              margin: "md",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "รายละเอียดเพิ่มเติม",
                uri: "https://samitivejchinatown.com/th/article/health/BMI-calculator",
              },
              style: "primary",
              color: "#1DB446",
            },
          ],
        },
      },
    };
    //   agent.add(result);
    let payload = new Payload(`LINE`, flexMessage, {
      sendAsMessage: true,
    });
    agent.add(result);
  }
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);

  intentMap.set("BMI - custom - yes", bodyMassIndex);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log("servier is running at http://localhost:" + port);
});
