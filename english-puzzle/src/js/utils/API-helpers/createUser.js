export default async function (user) {
  const rawResponse = await fetch('https://afternoon-falls-25894.herokuapp.com/users', {
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

  if (rawResponse.status === 417) {
    throw Error('user with such email is already registered');
  }
  return console.log(rawResponse);
}
