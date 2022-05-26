const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js')
const token = '5147060913:AAHKyBpAVto7yN_tBSpX3sMiyeqIGHVTpAA';

const bot = new TelegramApi(token, {polling: true});

bot.setMyCommands([
	{command: '/start', description: 'Стартовое приветствие'},
	{command: '/info', description: 'Информация о пользователе пользователя'},
	{command: '/game', description: 'Игра в "угадай число" с пользователем'}
])

const chats = {}

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен будешь её угадать!');
	const randomNumber = Math.floor((Math.random() * 10));
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, 'Давай отгадывай :)', gameOptions);
}

const start = () => {
	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;
	
		if (text === '/start') {
			await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/5da/0e3/5da0e317-7329-3b47-abe1-daa34938b6a3/192/12.webp');
			return bot.sendMessage(chatId, 'Добро пожаловать в гости к дяде Егору!');
		}
	
		if (text === '/info') {
			return bot.sendMessage (chatId, `Тебя зовут: ${msg.from.first_name}!`);
		}

		if (text === '/game') {
			return startGame(chatId);
		}

		return bot.sendMessage(chatId, 'Я тебя не понял, попробуй ещё раз!');
	})

	bot.on('callback_query', msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === '/again') {
			return startGame(chatId);
		}
		if (data == chats[chatId]) {
			return bot.sendMessage(chatId, `Ты угадал! Молодец! Загаданное число: ${chats[chatId]}`, againOptions);
		} else {
			return bot.sendMessage(chatId, `Ты не угадал! МЕГАПЛОХ :( Загаданное число: ${chats[chatId]}`, againOptions);
		}
	})
}

start();