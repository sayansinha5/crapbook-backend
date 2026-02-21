import Group from '#models/group'

export default class GroupTransformer {
  public static async transform(group: Group) {

    return {
      id: group.uuid,

      ...(group.user && {
        user: {
          id: group.user.uuid,
          username: group.user.username,
          first_name: group.user.first_name,
          last_name: group.user.last_name,
          full_name: `${group.user.first_name} ${group.user.last_name}`.trim(),
          email: group.user.email,
          phone_number: group.user.phone_number,
          is_email_verified: group.user.is_email_verified,
          is_phone_number_verified: group.user.is_phone_number_verified,
          is_onboarding_complete: group.user.is_onboarding_complete,
          onboarding_answers: group.user.onboarding_answers,
          is_banned: group.user.is_banned,
        },
      }),

      ...(group.customer && {
        customer: {
          id: group.customer.uuid,
          username: group.customer.username,
          first_name: group.customer.first_name,
          last_name: group.customer.last_name,
          full_name: `${group.customer.first_name} ${group.customer.last_name}`.trim(),
          email: group.customer.email,
          phone_number: group.customer.phone_number,
        },
      }),

      name: group.name,
      description: group.description,
      tags: group.tags,

      created_at: group.createdAt,
      updated_at: group.updatedAt,
    }
  }

  public static async collection(groups: Group[]) {
    return Promise.all(groups.map((group) => this.transform(group)))
  }
}
