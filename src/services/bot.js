const {Client, LocalAuth} = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal');

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
    authStrategy: new LocalAuth()
})

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log('Client is ready!');
});

const formatNumber = (number) => {
    if (!number.endsWith('@c.us')) {
        number += '@c.us'
    }

    return number
}

const sendMessage = async (payload) => {
    await client.sendMessage(formatNumber(payload.to), payload.body)
}

const sendBlastMessage = async (payload) => {
    console.log(payload)
    const numbers = payload.cids.split(',')

    for (let i = 0; i < numbers.length; i++) {
        const number = numbers[i];

        await client.sendMessage(formatNumber(number), payload.text)
    }
}

module.exports = {
    client,
    sendMessage,
    sendBlastMessage
}
