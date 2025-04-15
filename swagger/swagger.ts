import { type } from 'os';

const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
  autoHeaders: false,
});

const doc = {
  info: {
    version: '1.0.0',
    title: 'Circle-App API',
    description: 'Wellcome Circle-App API!',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    '@schemas': {
      LoginDTO: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      UpdateProfileDTO: {
        type: 'object',
        properties: {
          fullName: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          bio: {
            type: 'string',
          },
          avatarUrl: {
            type: 'file',
          },
          bannerUrl: {
            type: 'file',
          },
        },
      },
      RegisterDTO: {
        type: 'object',
        properties: {
          fullName: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      ForgotPasswordDTO: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
        },
      },
      ResetPasswordDTO: {
        type: 'object',
        properties: {
          oldPassword: {
            type: 'string',
          },
          newPassword: {
            type: 'string',
          },
        },
      },
      CreateThreadDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
          images: {
            type: 'file',
          },
        },
      },
      UpdateThreadDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
          images: {
            type: 'file',
          },
        },
      },
      CreateLikeDTO: {
        type: 'object',
        properties: {
          threadId: {
            type: 'string',
          },
        },
      },
      CreateFollowDTO: {
        type: 'object',
        properties: {
          followedId: {
            type: 'string',
          },
        },
      },
    },
  },
  host: 'localhost:3000',
};

const outputFile = './swagger-output.json';
const routes = ['src/index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
