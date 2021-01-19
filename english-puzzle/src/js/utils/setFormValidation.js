/* eslint-disable no-param-reassign */
function checkEmail(email) {
  const pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if (pattern.test(email.value)) {
    email.classList.remove('invalid');
    return true;
  }
  email.classList.add('invalid');
  email.title = 'Email must contain at least 6 characters, at least 4 letters, the characters "@" and "."';
  return false;
}

function checkPassword(password) {
  const pattern = /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  if (pattern.test(password.value)) {
    password.classList.remove('invalid');
    return true;
  }
  password.classList.add('invalid');
  password.title = 'The password must contain at least 8 characters, at least one uppercase letter, one number and one special character from + -_ @ $!% *? & #.,;: [] {}';
  return false;
}

function checkForm(form, email, password) {
  const signin = form.querySelector('.signin_btn');
  const signup = form.querySelector('.signup_btn');

  const isEmailValid = checkEmail(email);
  const isPasswordValid = checkPassword(password);

  if (isEmailValid && isPasswordValid) {
    signin.classList.remove('btn-disabled');
    signup.classList.remove('btn-disabled');
    signin.disabled = false;
    signup.disabled = false;
  } else {
    signin.classList.add('btn-disabled');
    signup.classList.add('btn-disabled');
    signin.disabled = true;
    signup.disabled = true;
  }
}

export default function setFormValidation(form) {
  const email = form.querySelector('.input_email');
  const password = form.querySelector('.input_password');

  email.addEventListener('input', () => checkForm(form, email, password));
  password.addEventListener('input', () => checkForm(form, email, password));
}
