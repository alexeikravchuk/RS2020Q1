export default async function loginUser(user) {
  const rawResponse = await fetch('https://afternoon-falls-25894.herokuapp.com/signin', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  }
  if (rawResponse.status === 403) {
    throw new Error('Incorrect password');
  }
  throw new Error('User with such email is not registered');
}
