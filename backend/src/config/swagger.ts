import swaggerJSDoc from 'swagger-jsdoc';
import { config } from '../config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MedTrack 360 API',
    version: '1.0.0',
    description: 'API Documentation for MedTrack 360 Backend',
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/v1`,
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);

