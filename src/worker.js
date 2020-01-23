onmessage = function(event) {
  if (event.data.type === "ping") {
    console.log("message from window", event.data)
    setTimeout(() => {
      postMessage({ type: "pong" })
    }, 2500)
  }
}
