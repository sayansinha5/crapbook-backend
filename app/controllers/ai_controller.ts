import type { HttpContext } from '@adonisjs/core/http'

export default class AiController {

  async stream({ request, response }: HttpContext) {

    // const fastApiResponse = await fetch('http://localhost:8000/ai/stream', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(request.body())
    // })

    const fastApiResponse = await fetch('http://host.docker.internal:8000/ai/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.body())
    })

    const origin = request.header('origin') ?? '*'
    response.response.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
    })

    const reader = fastApiResponse.body!.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      response.response.write(value)
    }

    response.response.end()
  }
}
