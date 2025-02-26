// lib/swaggerStyles.ts

export interface SwaggerStylesConfig {
  customSiteTitle: string;
  customfavIcon: string;
  isExplorer: boolean;
  customJs: string;
  customCssUrl: string;
  customCss: string;
  swaggerOptions: {
    persistAuthorization: boolean;
  };
}

const swaggerStyles: SwaggerStylesConfig = {
  customSiteTitle: 'Circle App API',
  customfavIcon: 'NONE',
  isExplorer: true,
  customJs:
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
  customCssUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customCss: `
              .swagger-ui .topbar { display: none }
              .information-container.wrapper { background:rgb(0, 255, 60); padding: 2rem }
              .information-container .info { margin: 0 }
              .information-container .info .main { margin: 0 !important}
              .information-container .info .main .title { color:rgb(0, 0, 0)}
              .renderedMarkdown p { margin: 0 !important; color:rgb(0, 0, 0) !important }
              `,
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export default swaggerStyles;
