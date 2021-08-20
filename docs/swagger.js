import { signUp } from './auth.swagger';

const docs = {
  openapi: '3.0.3',
  info: {
    title: 'Ecommerce API',
    description: 'An API for ecommerce works built using NodeJS & MongoDB',
    version: '1.0.0',
    contact: {
      name: 'Mahmoud Yasser',
      email: 'mle.mahmoud.yasser@gmail.com',
      url: 'https://github.com/Braineanear'
    }
  },
  servers: [
    {
      url: 'http://localhost:8000/api',
      description: 'Development Server'
    },
    {
      url: 'https://e-commerce-a-p-i.herokuapp.com',
      description: 'Production Server'
    }
  ],
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/auth': {
      post: signUp
    },
    '/user': {},
    '/category': {},
    '/product': {},
    '/cart': {},
    '/order': {},
    '/review': {}
  }
};

export default docs;
