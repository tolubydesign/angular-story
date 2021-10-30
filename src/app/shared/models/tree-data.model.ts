// import { uuid } from 'uuidv4';
import * as uuid from 'uuid';
import { PlotContent } from './plot';

export const treeData: PlotContent = {
  id: generateID(),
  name: "Application",
  children: [
    {
      id: generateID(),
      name: "Front-end",
      children: [
        {
          id: generateID(),
          name: "Gestures management"
        },
        {
          id: generateID(),
          name: "Data management",
          children: [
            {
              id: generateID(),
              name: "Lodash"
            }
          ]
        },
        {
          id: generateID(),
          name: "Fake API",
          children: [
            {
              id: generateID(),
              name: "JSON Server"
            },
            {
              id: generateID(),
              name: "Casual"
            }
          ]
        },
        {
          id: generateID(),
          name: "TypeScript"
        },
        {
          id: generateID(),
          name: "React",
          children: [
            {
              id: generateID(),
              name: "lifecycle"
            },
            {
              id: generateID(),
              name: "Redux",
              children: [
                {
                  id: generateID(),
                  name: "Ducks",
                  children: [
                    {
                      id: generateID(),
                      name: "async-thunks",
                      children: [
                        {
                          id: generateID(),
                          name: "axios"
                        }
                      ]
                    },
                    {
                      id: generateID(),
                      name: "selectors"
                    },
                    {
                      id: generateID(),
                      name: "actions"
                    },
                    {
                      id: generateID(),
                      name: "slice",
                      children: [
                        {
                          id: generateID(),
                          name: "reducers"
                        },
                        {
                          id: generateID(),
                          name: "extra-reducers"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: generateID(),
              name: "I18n",
              children: [
                {
                  id: generateID(),
                  name: "fr"
                },
                {
                  id: generateID(),
                  name: "en"
                },
                {
                  id: generateID(),
                  name: "de"
                }
              ]
            },
            {
              id: generateID(),
              name: "Router",
              children: [
                {
                  id: generateID(),
                  name: "Pages",
                  children: [
                    {
                      id: generateID(),
                      name: "Components"
                    }
                  ]
                }
              ]
            },
            {
              id: generateID(),
              name: "TsConfig"
            },
            {
              id: generateID(),
              name: "Linter"
            },
            {
              id: generateID(),
              name: "EnvFile",
              children: [
                {
                  id: generateID(),
                  name: "Development"
                },
                {
                  id: generateID(),
                  name: "Production"
                }
              ]
            },
            {
              id: generateID(),
              name: "SourceMap"
            },
            {
              id: generateID(),
              name: "Hooks",
              children: [
                {
                  id: generateID(),
                  name: "UseState"
                },
                {
                  id: generateID(),
                  name: "UseEffect"
                },
                {
                  id: generateID(),
                  name: "UseRef"
                },
                {
                  id: generateID(),
                  name: "UseCallback"
                }
              ]
            }
          ]
        },
        {
          id: generateID(),
          name: "Design system",
          children: [
            {
              id: generateID(),
              name: "Libraries",
              children: [
                {
                  id: generateID(),
                  name: "Reactstrap"
                },
                {
                  id: generateID(),
                  name: "Material UI"
                },
                {
                  id: generateID(),
                  name: "Fontawesome"
                }
              ]
            },
            {
              id: generateID(),
              name: "Animation"
            },
            {
              id: generateID(),
              name: "Sass"
            },
            {
              id: generateID(),
              name: "Layout",
              children: [
                {
                  id: generateID(),
                  name: "Grid"
                },
                {
                  id: generateID(),
                  name: "Flexbox"
                }
              ]
            },
            {
              id: generateID(),
              name: "Components",
              children: [
                {
                  id: generateID(),
                  name: "Inputs"
                },
                {
                  id: generateID(),
                  name: "Typography"
                }
              ]
            }
          ]
        },
        {
          id: generateID(),
          name: "Testing",
          children: [
            {
              id: generateID(),
              name: "Cypress"
            },
            {
              id: generateID(),
              name: "Jest"
            }
          ]
        }
      ]
    },
    {
      id: generateID(),
      name: "Back-end",
      children: [
        {
          id: generateID(),
          name: "NodeJS",
          children: [
            {
              id: generateID(),
              name: "Express",
              children: [
                {
                  id: generateID(),
                  name: "API"
                },
                {
                  id: generateID(),
                  name: "Scripts",
                  children: [
                    {
                      id: generateID(),
                      name: "Cron Job"
                    }
                  ]
                },
                {
                  id: generateID(),
                  name: "Socket-io"
                }
              ]
            },
            {
              id: generateID(),
              name: "Koa",
              children: [
                {
                  id: generateID(),
                  name: "API"
                },
                {
                  id: generateID(),
                  name: "Socket-io"
                }
              ]
            },
            {
              id: generateID(),
              name: "Modules",
              children: [
                {
                  id: generateID(),
                  name: "cors"
                },
                {
                  id: generateID(),
                  name: "helmet"
                },
                {
                  id: generateID(),
                  name: "body-parser"
                },
                {
                  id: generateID(),
                  name: "dotenv"
                },
                {
                  id: generateID(),
                  name: "pg"
                },
                {
                  id: generateID(),
                  name: "mongoose"
                },
                {
                  id: generateID(),
                  name: "typeorm"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: generateID(),
      name: "Database",
      children: [
        {
          id: generateID(),
          name: "MongoDB",
          children: [
            {
              id: generateID(),
              name: "Mongoose"
            }
          ]
        },
        {
          id: generateID(),
          name: "Postgres",
          children: [
            {
              id: generateID(),
              name: "DB-migrate"
            }
          ]
        }
      ]
    },
    {
      id: generateID(),
      name: "Docker",
      children: [
        {
          id: generateID(),
          name: "Docker-compose"
        },
        {
          id: generateID(),
          name: "Dockerfile"
        }
      ]
    },
    {
      id: generateID(),
      name: "System",
      children: [
        {
          id: generateID(),
          name: "WebHooks"
        },
        {
          id: generateID(),
          name: "Automation"
        }
      ]
    }
  ]
};


function generateID() {
    return uuid.v4();
}
