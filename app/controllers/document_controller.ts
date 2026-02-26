import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import sharp from 'sharp'
import { createId } from '@paralleldrive/cuid2'

import Document from '#models/document'
import DocumentTransformer from '#transformers/document_transformer'
import vine from '@vinejs/vine';
import DocumentContentFile from '#models/document_content_file';
import Group from '#models/group';

export default class DocumentController {
  async index({ response, auth }: HttpContext) {

    const documents = await Document.query().where('user_id', auth.user!.id).orderBy('updated_at', 'desc');

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

  async updateThumbnail({ response, params, request }: HttpContext) {

    const document = await Document.query().where('uuid', params.document_uuid).first();

    if (!document) {
      return response.status(404).json({
        status: 'error',
        message: 'Document not found',
      });
    }

    // Handle thumbnail update
    const thumbnail = request.file('thumbnail', { size: '4mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] });

    if (!thumbnail || !thumbnail.isValid) {
      return response.status(400).json({
        status: 'error',
        message: 'Thumbnail update failed',
      });
    }

    if (!thumbnail.tmpPath) {
      return response.status(400).json({
        status: 'error',
        message: 'Thumbnail file could not be processed',
      });
    }

    try {
      // Delete old thumbnail from disk if it exists
      if (document.thumbnail) {
        const oldThumbnailPath = `documents/${params.document_uuid}/thumbnail/${document.thumbnail}`
        await drive.use().delete(oldThumbnailPath).catch(() => {})
      }

      // Resize image to 242x322 (width x height) using sharp
      const resizedBuffer = await sharp(thumbnail.tmpPath)
        .resize(512, 512, { fit: 'outside', position: 'top' })
        .jpeg({ mozjpeg: true, quality: 85 })
        .toBuffer();

      // Generate random filename using cuid()
      const fileName = `${createId()}.jpg`;
      const thumbnailPath = `documents/${params.document_uuid}/thumbnail/${fileName}`;

      // Save resized image to disk
      await drive.use().put(thumbnailPath, resizedBuffer);

      // Update document thumbnail column with the image path (used for URL construction)
      document.thumbnail = fileName;
      await document.save();

    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Thumbnail processing failed',
      });
    }

    return response.status(200).json({
      status: 'success',
      message: 'Thumbnail updated successfully',
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

  async store({ request,response, auth }: HttpContext) {
    const { data } = request.all();

    let rules = vine.object({
      title: vine.string().optional().nullable(),
      group_id: vine.string().optional().nullable(),
    });

    let state: any = {
      title: data?.title,
      group_uuid: data?.group_id || null,
    };

    await vine.validate({ schema: rules, data: state });

    const user = auth.user;
    await user?.load('customer');

    let group = null;

    if(data?.group_id) {
      group = await Group.query().where('user_id', user!.id).where('uuid', state.group_uuid).first();

      if (!group) {
        return response.status(402).json({
          status: 'error',
          message: 'Group doesn\'t exist!',
        });
      }
    }

    const document = await Document.create({
      group_id: group?.id,
      user_id: user?.id,
      customer_id: user?.customer?.id,
      editor_type: 'block_editor',
      title: state.title || 'Untitled',
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

  async uploadContentImage({ response, params, request }: HttpContext) {

    const payload = request.all();

    // return response.status(200).json({
    //   status: 'success',
    //   message: 'Content Image upload successful',
    //   data: payload,
    // });

    const name = payload.name;
    const real_name = payload.real_name;
    const type = payload.content_image.type;
    const extension = payload.content_image.sub_type;
    const size = payload.content_image.size;

    // Handle content image upload
    const contentImage = request.file('content_image', { size: '4mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] });

    if (contentImage && contentImage.isValid) {
      const contentImagePath = "/documents/" + params.document_uuid + "/content/" + contentImage.clientName!;
      await contentImage.moveToDisk(contentImagePath);
    } else {
      return response.status(402).json({
        status: 'error',
        message: 'Content Image upload failed',
      });
    }

    const document = await Document.query().where('uuid', params.document_uuid).first();

    if (!document) {
      return response.status(402).json({
        status: 'error',
        message: 'Error in image upload. Document not found!',
      });
    }

    await DocumentContentFile.create({
      document_id: document?.id,
      name: name,
      real_name: real_name,
      type: type,
      extension: extension,
      size: size,
    });

    return response.status(200).json({
      status: 'success',
      message: 'Content Image upload successful',
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
