import Document from '#models/document'

export default class DocumentTransformer {
  public static async transform(document: Document) {

    return {
      id: document.uuid,

      ...(document.group && {
        group: {
          id: document.group.uuid,
          name: document.group.name,
          description: document.group.description,
          tags: document.group.tags,
          created_at: document.group.createdAt,
          updated_at: document.group.updatedAt,
        },
      }),

      ...(document.user && {
        user: {
          id: document.user.uuid,
          username: document.user.username,
          first_name: document.user.first_name,
          last_name: document.user.last_name,
          full_name: `${document.user.first_name} ${document.user.last_name}`.trim(),
          email: document.user.email,
          phone_number: document.user.phone_number,
          is_email_verified: document.user.is_email_verified,
          is_phone_number_verified: document.user.is_phone_number_verified,
          is_onboarding_complete: document.user.is_onboarding_complete,
          onboarding_answers: document.user.onboarding_answers,
          is_banned: document.user.is_banned,
        },
      }),

      ...(document.customer && {
        customer: {
          id: document.customer.uuid,
          username: document.customer.username,
          first_name: document.customer.first_name,
          last_name: document.customer.last_name,
          full_name: `${document.customer.first_name} ${document.customer.last_name}`.trim(),
          email: document.customer.email,
          phone_number: document.customer.phone_number,
        },
      }),

      thumbnail: document.thumbnail,
      editor_type: document.editor_type,
      title: document.title,
      description: document.description,
      tags: document.tags,
      content: document.content,
      content_json: document.content_json,
      content_markdown: document.content_markdown,

      created_at: document.createdAt,
      updated_at: document.updatedAt,
    }
  }

  public static async collection(documents: Document[]) {
    return Promise.all(documents.map((document) => this.transform(document)))
  }
}
