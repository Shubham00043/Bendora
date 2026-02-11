
const apiKey = "AQ.Ab8RN6L0HSPVNRBPqocRmrcz3LRcv25SU-iijvRiQULtx66mzw";
const query = "test";

async function testKey() {
  console.log("Testing API Key:", apiKey);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&type=video&maxResults=1`;
  
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}

testKey();
