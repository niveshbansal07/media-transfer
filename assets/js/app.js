const fileInput = document.getElementById("fileInput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");
const output = document.getElementById("output");

const peer = new SimplePeer({ initiator: location.hash === "#1", trickle: false });

peer.on("signal", data => {
  output.textContent = JSON.stringify(data);
  status.textContent = "Copy and send this code to your friend";
});

peer.on("connect", () => {
  status.textContent = "🔗 Connected! Ready to send.";
});

peer.on("data", data => {
  const blob = new Blob([data]);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "received_file";
  link.click();
  status.textContent = "✅ File received!";
});

sendBtn.onclick = () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    peer.send(reader.result);
    status.textContent = "📤 File sent!";
  };
  reader.readAsArrayBuffer(file);
};

window.addEventListener("paste", e => {
  try {
    const data = JSON.parse(e.clipboardData.getData("text"));
    peer.signal(data);
    status.textContent = "🔐 Signal received. Connecting...";
  } catch (err) {
    status.textContent = "❌ Invalid peer code";
  }
});
