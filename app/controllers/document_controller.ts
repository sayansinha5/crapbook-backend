import type { HttpContext } from '@adonisjs/core/http'

import Document from '#models/document'
import DocumentTransformer from '#transformers/document_transformer'
import vine from '@vinejs/vine';

export default class DocumentController {
  async index({ response }: HttpContext) {

    const documents = await Document.all();

    return response.json({
      status: 'success',
      data: await DocumentTransformer.collection(documents),
    });
  }

  async recent({ response, auth }: HttpContext) {
    const documents = await Document.query().where('user_id', auth.user!.id).orderBy('updated_at', 'desc').limit(4);

    return response.json({
      status: 'success',
      data: await DocumentTransformer.collection(documents),
    });
  }

  async show({ response, params, auth }: HttpContext) {
    const document = await Document.query().where('user_id', auth.user!.id).where('uuid', params.document_uuid).first();

    if (!document) {
      return response.status(404).json({
        status: 'error',
        message: 'Document not found',
      });
    }

    return response.json({
      status: 'success',
      data: await DocumentTransformer.transform(document),
    });
  }

  async store({ response, auth }: HttpContext) {

    const user = auth.user;
    await user?.load('customer');

    const document = await Document.create({
      user_id: user?.id,
      customer_id: user?.customer?.id,
      editor_type: 'block_editor',
      title: 'Untitled',
    });

    return response.status(200).json({
      status: 'success',
      message: 'Document created successfully',
      data: await DocumentTransformer.transform(document),
    });
  }

  async update({ response, params, request }: HttpContext) {

    const { data } = request.all();

    let state: any = {};

    if (data.title) {
      state['title'] = data.title;
    }

    if (data.description) {
      state['description'] = data.description;
    }

    if (data.tags) {
      state['tags'] = data.tags;
    }

    if (data.content) {
      state['content'] = data.content;
    }

    if (data.content_json) {
      state['content_json'] = data.content_json;
    }

    if (data.content_markdown) {
      state['content_markdown'] = data.content_markdown;
    }

    const rules = vine.object({
      title: vine.string().optional().nullable(),
      description: vine.string().optional().nullable(),
      tags: vine.string().optional().nullable(),
      content: vine.string().optional().nullable(),
      content_json: vine.record(vine.any()).optional().nullable(),
      content_markdown: vine.string().optional(),
    });

    await vine.validate({ schema: rules, data: state });

    state['content_json'] = JSON.stringify(state['content_json']);
    const document = await Document.query().where('uuid', params.document_uuid).first();

    if (!document) {
      return response.status(402).json({
        status: 'error',
        message: 'Document not found',
      });
    }

    await document.merge(state).save();

    return response.status(200).json({
      status: 'success',
      message: 'Document updated successfully',
      data: await DocumentTransformer.transform(document),
    });
  }

  async destroy({ response, params }: HttpContext) {
    const document = await Document.query().where('uuid', params.document_uuid).first();

    if (!document) {
      return response.status(402).json({
        status: 'error',
        message: 'Document not found',
      });
    }

    await document.delete();

    return response.status(200).json({
      status: 'success',
      message: 'Document deleted successfully',
    });
  }
}
