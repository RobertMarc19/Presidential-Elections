const registerForm = document.getElementById("registerCredentials");
const loginForm = document.getElementById("loginCredentials");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("Username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    try {
      const response = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
        }),
      });
      if (response.ok) {
        const result = await response.text();
        alert("Registration successful!");
        window.location.href = "login.html";
      }
    } catch (error) {
      console.error("Couldn't get the data", error);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("Username").value;
    const password = document.getElementById("password").value;
    try {
      const response = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("email", data.email);
        window.location.href = "landingpage.html";
      } else if (response.status == 401) {
        alert("Invalid username or password");
      } else {
        alert("An error occurred");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  });
}

async function displayCandidates() {
  try {
    const response = await fetch("/users/list");
    const data = await response.json();
    const tableBody = document.querySelector(".table.table-striped tbody");
    tableBody.innerHTML = "";
    let rank = 1;
    data.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rank++}</td>
        <td>${row.username}</td>
        <td>${row.votes}</td>
        <td>
        <input type="radio" name="candidate" value="${row.ID}">
      </td>
        `;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
  }
}

displayCandidates();

const username = sessionStorage.getItem("username");
if (username) {
  document.getElementById("panel").innerHTML = `${username}`;
  document.getElementById("candidate").style.display = "block";
  document.getElementById("vote").style.display = "block";
}

document.getElementById("candidate").addEventListener("click", async () => {
  try {
    const response = await fetch("/users/candidates", {
      method: "POST",
    });
    if (response.ok) {
      await displayCandidates();
    } else {
      const error = await response.text();
      alert(`Error: ${error}`);
    }
  } catch (error) {
    console.error(error);
  }
});


document.getElementById("vote").addEventListener("click", async () => {
  try {
    const candidateID = document.querySelector(
      'input[name="candidate"]:checked'
    ).value;
    const uEmail = sessionStorage.getItem("email");
    const response = await fetch("/candidates/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({candidateID, email: uEmail }),
    });
    if (response.ok) {
      alert("Vote submitted successfully!");
      await displayCandidates();
    } else {
      alert("You already voted!");
    }
  } catch (error) {
    console.error(error);
  }
});
