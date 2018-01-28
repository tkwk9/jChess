onmessage = (e) => {
  console.log(e.data);
  postMessage("completed");
};
