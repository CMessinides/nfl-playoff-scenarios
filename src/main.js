import App from "./App.svelte"

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
})

if (window.Worker) {
  const worker = new Worker("build/worker.js")
  worker.onmessage = (event) => console.log("message from worker", event.data)
  setInterval(() => {
    worker.postMessage({ type: "ping" })
  }, 5000)
}

export default app
