




document.addEventListener("DOMContentLoaded", () => {
  // Identify which page is currently loaded
  const page = document.body.dataset.page;

  // Login form logic for form.html
  if (page === "form") {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Predefined credentials
      const validUsername = "nitish";
      const validPassword = "2030";

      if (username === validUsername && password === validPassword) {
        // Save login status in session storage
        sessionStorage.setItem("isLoggedIn", "true");

        // Redirect to main.html (landing page)
        window.location.href = "main.html";
      } else {
        // Show error message
        message.textContent = "Invalid username or password!";
        message.style.color = "red";
      }
    });
  }

  // Landing page logic for main.html
  if (page === "main") {
    // Check if the user is logged in
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      // Redirect to form.html if not logged in
      window.location.href = "index.html";
    } else {


      // Show landing page content .......*...*...*
  //    const greeting = document.getElementById("greeting");// it selects the paragraph of main.html 
  //    greeting.textContent = "Welcome to the landing page!"; //  and show this text
    }
    //...*....*....*



    // Logout button functionality
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", () => {
      // Clear session storage and redirect to form.html
      sessionStorage.clear();
      window.location.href = "index.html";
    });
  }
});






