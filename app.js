async function download() {
  const url = document.getElementById("url").value;
  const status = document.getElementById("status");

  if (!url) {
    status.innerText = "Masukkan link TikTok dulu.";
    return;
  }

  status.innerText = "⏳ Memproses video...";

  const res = await fetch("/.netlify/functions/download", {
    method: "POST",
    body: JSON.stringify({ url })
  });

  const data = await res.json();

  if (data.success) {
    status.innerText = "✅ Siap diunduh...";
    window.location.href = data.download;
  } else {
    status.innerText = "❌ Gagal memproses video.";
  }
}
