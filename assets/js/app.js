// Get all required elements
const fileInput = document.getElementById("fileInput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");
const output = document.getElementById("output");

// Create a SimplePeer connection
const peer = new SimplePeer({
  initiator: location.hash === "#1", // Only initiator when URL has #1
  trickle: false
});

// When signal data is generated (only on sender side), show it
peer.on("signal", data => {
  const signalJSON = JSON.stringify(data);
  output.textContent = signalJSON;
  status.textContent = "📋 Copy the above code and paste it in other device.";
});

// When connection is established
peer.on("connect", () => {
  status.textContent = "✅ Connected! Now you can send a file.";
});

// When data (file) is received
peer.on("data", data => {
  const blob = new Blob([data]);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "received_file";
  link.click();
  status.textContent = "📥 File received and downloaded.";
});

// When Send button is clicked
sendBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    status.textContent = "⚠️ Please choose a file first.";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    peer.send(reader.result);
    status.textContent = "📤 File sent!";
  };
  reader.readAsArrayBuffer(file);
});

// Listen for paste event to receive signal JSON
window.addEventListener("paste", event => {
  try {
    const pasteData = event.clipboardData.getData("text");
    const signalData = JSON.parse(pasteData);
    peer.signal(signalData);
    status.textContent = "🔐 Signal received. Connecting...";
  } catch (err) {
    status.textContent = "❌ Invalid signal code pasted.";
  }
});
