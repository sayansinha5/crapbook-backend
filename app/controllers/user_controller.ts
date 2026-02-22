import type { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine';
import User from '#models/user';
import Customer from '#models/customer';
import UserTransformer from '#transformers/user_transformer';

export default class UserController {
  async show({ response, auth }: HttpContext) {
    const user = await User.query().where('id', auth.user!.id).first();

    if (!user) {
      return response.status(402).json({
        status: 'error',
        message: 'User not found',
      });
    }

    return response.status(200).json({
      status: 'success',
      data: await UserTransformer.transform(user),
    });
  }

  async update({ response, request, auth }: HttpContext) {
    const { data } = request.all();

    const state: any = {}

    if(data.first_name) {
      state['first_name'] = data.first_name;
    }

    if(data.last_name) {
      state['last_name'] = data.last_name;
    }

    if(data.phone_number) {
      state['phone_number'] = data.phone_number;
    }

    if(data.email) {
      state['email'] = data.email;
    }

    const rules = vine.object({
      first_name: vine.string().optional().nullable(),
      last_name: vine.string().optional().nullable(),
      email: vine.string().email().normalizeEmail().optional().nullable(),
      phone_number: vine.string().optional().nullable(),
    });

    await vine.validate({ schema: rules, data: state });

    const user = await User.query().where('id', auth.user!.id).first();
    const customer = await Customer.query().where('user_id', auth.user!.id).first();

    if (!user) {
      return response.status(402).json({
        status: 'error',
        message: 'User not found',
      });
    }

    if (!customer) {
      return response.status(402).json({
        status: 'error',
        message: 'Customer not found',
      });
    }

    await user.merge(state).save();
    await customer.merge(state).save();

    return response.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: await UserTransformer.transform(user),
    });
  }
}
