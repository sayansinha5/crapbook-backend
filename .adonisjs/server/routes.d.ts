import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.checkEmail': { paramsTuple?: []; params?: {} }
    'auth.verifyUser': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.requestLoginCode': { paramsTuple?: []; params?: {} }
    'auth.verifyLoginCode': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'onboarding.store': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.recent': { paramsTuple?: []; params?: {} }
    'documents.show': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'documents.store': { paramsTuple?: []; params?: {} }
    'documents.uploadContentImage': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'documents.updateThumbnail': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'documents.update': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'documents.destroy': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.recent': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
    'groups.documents': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
    'groups.store': { paramsTuple?: []; params?: {} }
    'groups.update': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
    'groups.destroy': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
    'ai.stream': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.recent': { paramsTuple?: []; params?: {} }
    'documents.show': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.recent': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
    'groups.documents': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.recent': { paramsTuple?: []; params?: {} }
    'documents.show': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.recent': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
    'groups.documents': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
  }
  POST: {
    'auth.checkEmail': { paramsTuple?: []; params?: {} }
    'auth.verifyUser': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.requestLoginCode': { paramsTuple?: []; params?: {} }
    'auth.verifyLoginCode': { paramsTuple?: []; params?: {} }
    'onboarding.store': { paramsTuple?: []; params?: {} }
    'documents.store': { paramsTuple?: []; params?: {} }
    'documents.uploadContentImage': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'groups.store': { paramsTuple?: []; params?: {} }
    'ai.stream': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'profile.update': { paramsTuple?: []; params?: {} }
    'documents.updateThumbnail': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'documents.update': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'groups.update': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
  }
  DELETE: {
    'documents.destroy': { paramsTuple: [ParamValue]; params: {'document_uuid': ParamValue} }
    'groups.destroy': { paramsTuple: [ParamValue]; params: {'group_uuid': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}