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
import CustomerController from '#controllers/customer_controller';
import DocumentController from '#controllers/document_controller';

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

// Document Controller
router.group(() => {
  router.get('/documents', [DocumentController, 'index']).as('documents.index');
  router.get('/documents/recent', [DocumentController, 'recent']).as('documents.recent');
  router.get('/documents/:document_uuid', [DocumentController, 'show']).as('documents.show');

  router.post('/documents', [DocumentController, 'store']).as('documents.store');

  router.patch('/documents/:document_uuid', [DocumentController, 'update']).as('documents.update');

  router.delete('/documents/:document_uuid', [DocumentController, 'destroy']).as('documents.destroy');
}).use(middleware.auth());
