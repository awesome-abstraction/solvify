

export const processIntent = async (text) => {
  const response = await fetch('http://127.0.0.1:105/solver?' + new URLSearchParams({
    prompt: text,
  }))
  const textResponse = await response.text();
  console.log(textResponse)
  return textResponse
  // const stream = new ReadableStream({
  //   start(controller) {
  //     return pump();
  //     function pump() {
  //       return reader.read().then(({ done, value }) => {
  //         // When no more data needs to be consumed, close the stream
  //         if (done) {
  //           controller.close();
  //           return;
  //         }
  //         // Enqueue the next data chunk into our target stream
  //         controller.enqueue(value);
  //         return pump();
  //       });
  //     }
  //   },
  // });
}