const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const crypto = require("crypto-js");

const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

const formatNumber = (number) => {
  if (!number.endsWith("@c.us")) {
    number += "@c.us";
  }

  return number;
};

const isJson = (str) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

const decrypt = (encrypted) => {
  console.log("enc:", encrypted);
  let message = crypto.AES.decrypt(encrypted, `${process.env.ENCRYPT_KEY}`);
  // console.log("message:", message);

  return JSON.parse(message.toString(crypto.enc.Utf8));
};

const sendMessage = async (payload) => {
  try {
    await client.sendMessage(formatNumber(payload.to), payload.text);
  } catch (error) {
    console.log(error);
  }
};

const sendBlastMessage = async (data) => {
  try {
    console.log(data);
    // const parseJson = JSON.parse(data);
    // The problem
    const json = decrypt(data.data);

    console.log("json:", json);

    const numbers = json.cids.split(",");

    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      const payload = {
        to: number,
        text: json.text,
      };
      console.log(payload);
      // await sendMessage(payload);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  client,
  sendMessage,
  sendBlastMessage,
};
