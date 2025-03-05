(function () {
   const app = document.querySelector('.app');
   const socket = io();

   app.querySelector(".join-screen #username").addEventListener("input", function () {
      removeInputError();
   });

   let uname;
   app.querySelector(".join-screen #join-user").addEventListener("click", () => {
      let username = app.querySelector(".join-screen #username").value;

      if (username.length == 0) {
         ShowInputError("⚠️ Username is required!");
         return;
      }
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
   });

   app.querySelector(".chat-screen #send-message").addEventListener("click", () => {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
         return;
      }
      renderMessage("my", {
         username: uname,
         text: message
      });

      socket.emit("chat", {
         username: uname,
         text: message
      });
      app.querySelector(".chat-screen #message-input").value = "";
   });

   app.querySelector(".chat-screen #exit-chat").addEventListener("click", () => {
      socket.emit("exituser", uname);
      window.location.href =  "/"; // Redirect to Another Page
      // window.location.href = window.location.href
   });
   
   socket.on("update", (update) => {
      renderMessage("update", update);
   });
   socket.on("chat", (message) => {
      renderMessage("other", message);
   });

   function renderMessage(type, message) {
      let messageContainer = document.querySelector(".chat-screen .messages");
      if (type == "my") {
         let el = document.createElement("div");
         el.setAttribute("class", "message my-message");
         el.innerHTML = `
            <div>
               <div class="name">You</div>
               <div class="test">${message.text}</div>
            </div>
         `;
         messageContainer.appendChild(el);
      }
      else if (type == "other") {
         let el = document.createElement("div");
         el.setAttribute("class", "message other-message");
         el.innerHTML = `
            <div>
               <div class="name">${message.username}</div>
               <div class="test">${message.text}</div>
            </div>
         `;
         messageContainer.appendChild(el);
      }
      else if (type == "update") {
         let el = document.createElement("div");
         el.setAttribute("class", "update");
         el.innerText = message;
         messageContainer.appendChild(el);
      }
      // scroll to end
      messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
   }
   
})();

function ShowInputError(errorMessage) {
   const usernameInput = document.querySelector(".app .join-screen #username")
   usernameInput.classList.add("error");
   // Change placeholder text
   usernameInput.placeholder = `${errorMessage}`;

   // Add shaking animation
   usernameInput.classList.add("shake");

   // Remove animation after 500ms
   setTimeout(() => {
      usernameInput.classList.remove("shake");
   }, 500);
}

function removeInputError() {
   const usernameInput = document.querySelector(".app .join-screen #username")
   usernameInput.classList.remove("error");
}