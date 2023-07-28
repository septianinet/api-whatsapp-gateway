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

const decrypt = (encrypted, toJSON = false) => {
  let message = crypto.AES.decrypt(encrypted, `${process.env.ENCRYPT_KEY}`);
  if (toJSON) {
    return JSON.parse(message);
  }

  return message.toString(crypto.enc.Utf8);
};

const sendMessage = async (payload) => {
  try {
    await client.sendMessage(formatNumber(payload.to), payload.text);
  } catch (error) {
    console.log(error);
  }
};

const sendBlastMessage = async (payload) => {
  const json = decrypt(payload);
  const data = JSON.parse(json);

  const numbers = data.cids.split(",");

  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    const payload = {
      to: number,
      text: data.text,
    };
    await sendMessage(payload);
  }
};

module.exports = {
  client,
  sendMessage,
  sendBlastMessage,
};
