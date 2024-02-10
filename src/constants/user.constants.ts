export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const phoneRegexp = /^\+380\d{9}$/;
export const ALREADY_REGISTERED_ERROR =
  'Користувач з вказаною поштою чи номером телефону вже зареєстрований';
export const LOGIN_BAD_REQUEST_ERROR = 'Невірний логін або пароль';
export const USER_NOT_FOUND_ERROR = 'Користувача не знайдено';
export const PASSWORD_CHANGE_REQUEST_MESSAGE =
  'Лист з із інструкцією для зміни пароля відправлено';
export const PASSWORD_CHANGE_SUCCESS = 'Пароль успішно змінено';
export const ACCESS_ERROR = 'Недостатньо прав';
export const REMOVE_USER_SUCCESS = 'Користувача видалено';
