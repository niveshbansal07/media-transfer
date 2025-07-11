const fileInput = document.getElementById("fileInput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");
const output = document.getElementById("output");
const signalBox = document.getElementById("signalBox");
const connectBtn = document.getElementById("connectBtn");

// Create Peer
const peer = new SimplePeer({
  initiator: location.hash === "#1",
  trickle: false
});

// Generate and show signal code
peer.on("signal", data => {
  output.textContent = JSON.stringify(data);
  status.textContent = "📋 Copy this code and paste on other device.";
});

// On connection
peer.on("connect", () => {
  status.textContent = "✅ Connected! Now you can send a file.";
});

// Receive file
peer.on("data", data => {
  const blob = new Blob([data]);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "received_file";
  link.click();
  status.textContent = "📥 File received and downloaded.";
});

// Send file
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

// Manual Connect button (for mobile)
connectBtn.addEventListener("click", () => {
  try {
    const signalData = JSON.parse(signalBox.value.trim());
    peer.signal(signalData);
    status.textContent = "🔐 Signal received. Connecting...";
  } catch {
    status.textContent = "❌ Invalid code. Please check again.";
  }
});
