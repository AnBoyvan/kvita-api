export const userConstants = {
  REGISTER_SUCCESS: 'Користувача зареєстровано',
  REFRESH_TOKEN_INVALID_ERROR: 'Токен недійсний',
  REFRESH_TOKEN_MISSING_ERROR: 'Необхідний токен',
  REFRESH_TOKEN_EXPIRED_ERROR: 'Термін дії токена закінчився',
  ALREADY_REGISTERED_ERROR:
    'Користувач з вказаною поштою чи номером телефону вже зареєстрований',
  LOGIN_BAD_REQUEST_ERROR: 'Невірний логін або пароль',
  PASSWORD_BAD_REQUEST_ERROR: 'Невірний пароль',
  NOT_FOUND_ERROR: 'Користувача не знайдено',
  PASSWORD_CHANGE_REQUEST_MESSAGE:
    'Лист з із інструкцією для зміни пароля відправлено',
  PASSWORD_CHANGE_SUCCESS: 'Пароль успішно змінено',
  ACCESS_ERROR: 'Недостатньо прав',
  REMOVE_SUCCESS: 'Користувача видалено',
  DTO: {
    id: 'ID користувача вказано невірно',
    name: 'Вкажіть ім’я',
    email: 'Пошту вказано невірно',
    phone: 'Вкажіть номер в форматі: +380ХХХХХХХХХ',
    password:
      'Пароль повинен містити мінімум 6 символів, включаючи цифри, літери та спеціальні символи',
    role: 'Роль не відповідає допустимим значенням',
    discount: 'Знижка повинна бути додатнім числом',
  },
};
