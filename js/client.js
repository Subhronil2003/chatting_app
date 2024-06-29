const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio = new Audio("pika-pikachu-14757.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position.trim()); // Remove any leading/trailing whitespace
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

const name1 = prompt("Enter your name to join : ");
socket.emit("new-user-joined", name1);

socket.on("user-joined", (name1) => {
  append(`${name1} joined the chat`, "right");
});

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent page reload
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send-message", { message, name1 });
  messageInput.value = "";
});

socket.on("receive-message", (data) => {
  append(`${data.name1}: ${data.message}`, "left");
});

socket.on("user-left", (name1) => {
  append(`${name1} left the chat`, "left");
});

socket.on("disconnect", () => {
  append(`You have been disconnected`, "right");
});
