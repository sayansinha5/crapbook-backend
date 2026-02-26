/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { middleware } from './kernel.js'
import router from '@adonisjs/core/services/router'

import AuthController from '#controllers/auth_controller';
import OnboardingController from '#controllers/onboarding_controller';
import DocumentController from '#controllers/document_controller';
import GroupController from '#controllers/group_controller';
import UserController from '#controllers/user_controller';

// Root Route
router.get('/', async () => {
  return {
    message: 'Welcome to Adonis Backend API Infrastructure',
  }
})

// Auth Controller
router.post('/auth/check-email', [AuthController, 'checkEmail']).as('auth.checkEmail');
router.post('/auth/verify-user', [AuthController, 'verifyUser']).as('auth.verifyUser');
router.post('/auth/register', [AuthController, 'register']).as('auth.register');
router.post('/auth/login', [AuthController, 'login']).as('auth.login');
router.post('/auth/login/request-code', [AuthController, 'requestLoginCode']).as('auth.requestLoginCode');
router.post('/auth/login/verify-code', [AuthController, 'verifyLoginCode']).as('auth.verifyLoginCode');
// router.delete('/auth/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth());
router.get('/auth/me', [AuthController, 'me']).as('auth.me');

// Onboarding Controller
router.group(() => {
  router.post('/onboarding', [OnboardingController, 'store']).as('onboarding.store');
}).use(middleware.auth());

// User Profile
router.group(() => {
  router.get('/profile', [UserController, 'show']).as('profile.show');
  router.patch('/profile', [UserController, 'update']).as('profile.update');
}).use(middleware.auth());

// Document Controller
router.group(() => {
  router.get('/documents', [DocumentController, 'index']).as('documents.index');
  router.get('/documents/recent', [DocumentController, 'recent']).as('documents.recent');
  router.get('/documents/:document_uuid', [DocumentController, 'show']).as('documents.show');

  router.post('/documents', [DocumentController, 'store']).as('documents.store');
  router.post('/documents/:document_uuid/content/image', [DocumentController, 'uploadContentImage']).as('documents.uploadContentImage');

  router.patch('/documents/:document_uuid', [DocumentController, 'update']).as('documents.update');

  router.delete('/documents/:document_uuid', [DocumentController, 'destroy']).as('documents.destroy');
}).use(middleware.auth());

// Groups Controller
router.group(() => {
  router.get('/groups', [GroupController, 'index']).as('groups.index');
  router.get('/groups/recent', [GroupController, 'recent']).as('groups.recent');
  router.get('/groups/:group_uuid', [GroupController, 'show']).as('groups.show');
  router.get('/groups/:group_uuid/documents', [GroupController, 'documents']).as('groups.documents');

  router.post('/groups', [GroupController, 'store']).as('groups.store');

  router.patch('/groups/:group_uuid', [GroupController, 'update']).as('groups.update');

  router.delete('/groups/:group_uuid', [GroupController, 'destroy']).as('groups.destroy');
}).use(middleware.auth());
