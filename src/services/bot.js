const venom = require('venom-bot');
const qrcode = require("qrcode-terminal");
const crypto = require("crypto-js");

const wwebVersion = '2.2407.3';

let waClient;

function waInit() {
  venom.create({
    session: 'ot-whatsapp',
    puppeteerOptions: {
      args: ["--no-sandbox"],
    },
    logQR: true
  }).then(function(client) {
    waClient = client;
  })
}

const restartService = async () => {
  return await waClient.restartService();
}

const formatNumber = (number) => {
  if (!number.endsWith("@c.us")) {
    number += "@c.us";
  }

  return number;
};

const formatGroupNumber = (number, groupId) => {
  return `${groupId}@g.us`;
}

const isJson = (str) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

const decrypt = async (encrypted) => {
  let message = await crypto.AES.decrypt(encrypted, "p4$$1234");
  let json = await JSON.parse(message.toString(crypto.enc.Utf8));
  return json;
};

const screenshot = async () => {
  return await waClient.waPage.screenshot({path: 'screenshot.png'});
}

const sendMessage = async (payload) => {
  try {
    await waClient.sendText(formatNumber(payload.to), payload.text);
  } catch (error) {
    console.log(error);
  }
};

const getAllGroups = async () => {
  let groups = await waClient.getAllChatsGroups()
  return groups.map(function (group) {
    return {
      groupId: group.id.user,
      groupName: group.name,
    }
  });
}

const sendGroupMessage = async(payload) => {
  try {
    await waClient.sendText(formatGroupNumber(payload.to, payload.groupId), payload.text);
  } catch (error) {
    console.log(error);
  }
}

const sendBlastMessage = async (data) => {
  try {
    const parseJson = data;
    // The problem
    const json = await decrypt(parseJson.data);

    const numbers = json.cids.split(",");

    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      const payload = {
        to: number,
        text: json.text,
      };
      await sendMessage(payload);
      console.log("sended to:", payload.to);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  waInit,
  sendMessage,
  sendBlastMessage,
  sendGroupMessage,
  getAllGroups,
  screenshot,
  restartService
};
