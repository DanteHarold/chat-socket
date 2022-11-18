const $miFormulario = document.querySelector("form");

$miFormulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {};

  for (let el of $miFormulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }

  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((err) => {
      console.log(err);
    });
});

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  // const responsePayload = decodeJwtResponse(response.credential);

  // console.log("ID: " + responsePayload.sub);
  // console.log("Full Name: " + responsePayload.name);
  // console.log("Given Name: " + responsePayload.given_name);
  // console.log("Family Name: " + responsePayload.family_name);
  // console.log("Image URL: " + responsePayload.picture);
  // console.log("Email: " + responsePayload.email);

  //console.log("id_token", response.credential);

  const body = { id_token: response.credential };

  fetch("http://localhost:3000/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token, usuario }) => {
      console.log(token);
      localStorage.setItem("email", usuario.correo);
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch(console.warn);
}

const button = document.getElementById("google-signout");
button.addEventListener("click", () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
    console.log("consent revoked");
  });
});
