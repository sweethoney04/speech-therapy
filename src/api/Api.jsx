export async function sendAudioToSTT(audioBlob) {

  const formData = new FormData();
  formData.append("audio", audioBlob, "speech.wav");

  const response = await fetch("http://127.0.0.1:8000/stt", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  return data;
}