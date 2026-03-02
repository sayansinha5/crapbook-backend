import Document from '#models/document';
import env from '#start/env';
import type { HttpContext } from '@adonisjs/core/http'

export default class AiController {

  async ask({request, response }: HttpContext) {

    // const fastApiResponse = await fetch('http://localhost:8000/ai/stream', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(request.body())
    // })

    const fastApiResponse = await fetch(`${env.get('FAST_API_URL')}/ai/ask/stream`, {
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

  async streamDocumentResponses({ request, response, params, auth }: HttpContext) {
    const { data } = request.all();

    const documentUuid = params.document_uuid;
    const documentContentMarkdown = data.document_content;
    const userQuery = data.user_query;

    const document = await Document.query().where('user_id', auth.user!.id).where('uuid', documentUuid).first();

    if (!document) {
      return response.status(404).json({
        status: 'error',
        message: 'Document not found',
      });
    }

    const payload = {
      document_title: document.title,
      document_content_markdown: documentContentMarkdown,
      user_query: userQuery,
    };

    const fastApiResponse = await fetch(`${env.get('FAST_API_URL')}/ai/documents/${documentUuid}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
