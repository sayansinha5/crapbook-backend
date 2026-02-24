import type { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine';
import Group from '#models/group';
import GroupTransformer from '#transformers/group_transformer';
import DocumentTransformer from '#transformers/document_transformer';
import Document from '#models/document';

export default class GroupController {
  async index({ response, auth }: HttpContext) {

    const groups = await Group.query().where('user_id', auth.user!.id).orderBy('updated_at', 'desc');

    return response.json({
      status: 'success',
      data: await GroupTransformer.collection(groups),
    });
  }

  async recent({ response, auth }: HttpContext) {
    const groups = await Group.query().where('user_id', auth.user!.id).orderBy('updated_at', 'desc').limit(4);

    return response.json({
      status: 'success',
      data: await GroupTransformer.collection(groups),
    });
  }

  async documents({ response, params, auth }: HttpContext) {

    const group = await Group.query().where('user_id', auth.user!.id).where('uuid', params.group_uuid).first();

    if (!group) {
      return response.status(404).json({
        status: 'error',
        message: 'Group not found',
      });
    }

    const documents = await Document.query().where('user_id', auth.user!.id).where('group_id', group.id).orderBy('updated_at', 'desc');

    return response.json({
      status: 'success',
      data: await DocumentTransformer.collection(documents),
    });
  }

  async show({ response, params, auth }: HttpContext) {
    const group = await Group.query().where('user_id', auth.user!.id).where('uuid', params.group_uuid).first();

    if (!group) {
      return response.status(404).json({
        status: 'error',
        message: 'Group not found',
      });
    }

    return response.json({
      status: 'success',
      data: await GroupTransformer.transform(group),
    });
  }

  async store({ response, auth, request }: HttpContext) {

    const { data } = request.all();

    let rules = vine.object({
      name: vine.string(),
      description: vine.string().optional().nullable(),
    });

    let state: any = {
      user_id: auth.user?.id,
      customer_id: auth.user?.customer?.id,
      name: data.name,
      description: data.description,
    };

    await vine.validate({ schema: rules, data: state });

    const user = auth.user;
    await user?.load('customer');

    const group = await Group.query().where('user_id', user!.id).where('name', data.name).first();

    if (group) {
      return response.status(402).json({
        status: 'error',
        message: 'Group already exists',
      });
    }

    const newGroup = await Group.create({
      user_id: user?.id,
      customer_id: user?.customer?.id,
      name: state.name,
      description: state.description,
    });

    return response.status(200).json({
      status: 'success',
      message: 'Group created successfully',
      data: await GroupTransformer.transform(newGroup),
    });
  }

  async update({ response, params, request, auth }: HttpContext) {

    const { data } = request.all();

    let state: any = {};

    if (data.name) {
      state['name'] = data.name;
    }

    if (data.description) {
      state['description'] = data.description;
    }

    if (data.tags) {
      state['tags'] = data.tags;
    }

    const rules = vine.object({
      name: vine.string().optional().nullable(),
      description: vine.string().optional().nullable(),
      tags: vine.string().optional().nullable(),
    });

    await vine.validate({ schema: rules, data: state });

    const group = await Group.query().where('user_id', auth.user!.id).where('uuid', params.group_uuid).first();

    if (!group) {
      return response.status(402).json({
        status: 'error',
        message: 'Group not found',
      });
    }

    await group.merge(state).save();

    return response.status(200).json({
      status: 'success',
      message: 'Group updated successfully',
      data: await GroupTransformer.transform(group),
    });
  }

  async destroy({ response, params }: HttpContext) {
    const group = await Group.query().where('uuid', params.group_uuid).first();

    if (!group) {
      return response.status(402).json({
        status: 'error',
        message: 'Group not found',
      });
    }

    await group.delete();

    return response.status(200).json({
      status: 'success',
      message: 'Group deleted successfully',
    });
  }
}
