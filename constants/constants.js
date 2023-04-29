const dataBaseDev = 'mongodb://localhost:27017/myfilmsdb';
const secretKey = 'secret-key';
const regEx = /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,100}\.)([a-zA-Z]{2,6})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;
const messageIncorrectDataCreateMovie = 'Переданы некорректные данные при сохранении фильма';
const messageMovieNotFound = 'Карточка не найдена';
const messageUserNotFound = 'Пользователь не найден';
const messageAccessСonflict = 'Нельзя удалять фильмы других пользователей';
const messageIncorrectDataDeleteMovie = 'Переданы некорректные данные при удалении';
const messageSuccessfullyLoggedOut = 'Вы успешно вышли из системы';
const messageIncorrectDataGetUser = 'Переданы некорректные данные при запросе пользователя';
const messageIncorrectDataUpdateUser = 'Переданы некорректные данные при обновлении профиля пользователя';
const messageEmailСonflict = 'Пользователь с таким Email уже существует';
const messageNoAccess = 'Необходима авторизация';
const message404 = 'Страница не существует';

const allowedCors = [
  'https://belozerov.nomoredomains.monster',
  'http://belozerov.nomoredomains.monster',
  'https://api.nomoreparties.co/beatfilm-movies',
  'http://localhost:3000',
  'http://localhost:3001',
];

module.exports = {
  dataBaseDev,
  messageIncorrectDataCreateMovie,
  messageIncorrectDataDeleteMovie,
  messageMovieNotFound,
  messageAccessСonflict,
  messageSuccessfullyLoggedOut,
  messageUserNotFound,
  messageIncorrectDataGetUser,
  messageIncorrectDataUpdateUser,
  messageEmailСonflict,
  messageNoAccess,
  secretKey,
  regEx,
  message404,
  allowedCors,
};
