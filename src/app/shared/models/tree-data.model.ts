// import { uuid } from 'uuidv4';
import * as uuid from "uuid";
import { Plot, PlotContent } from "./plot";

export interface DendrogramData {
  data: {
    id: string;
    name: string;
  };
  depth: number;
  height: number;
  parent: DendrogramDataParent;
  x: number;
  y: number;
}

export interface DendrogramDataParent {
  children: DendrogramData[];
  data: {
    id: string;
    name: string;
    children: DendrogramData[];
  };
  depth: 3;
  height: 1;
  parent: {
    height: 4;
    depth: 2;
    x: 122.80701754385966;
  };
  x: 184.21052631578948;
  y: 480;
}

export function generateID() {
  return uuid.v4();
}

export function GenerateText(type: 'title' | 'description'): string {
  const titles: string[] = [
    "Fringilla hendrerit ex eget", 'Consectetur posuere enim', 'Nam blandit magna vel lacinia', 'Porttitor quis ultrices tortor',
    'Quisque hendrerit ex eget risus', 'Ullamcorper pulvinar libero', 'Bibendum metus viverra arcu', 'Cras eget porttitor nibh',
    'Quisque', 'Euismod amet sapien malesuada', 'sodales eu pulvinar lectus',
  ];

  const descriptions: string[] = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget congue neque. Nullam scelerisque arcu in felis molestie, eget malesuada ex efficitur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ornare suscipit arcu vitae malesuada. Curabitur et dapibus lectus. Suspendisse accumsan mi libero, at pretium diam volutpat mollis. Curabitur eget metus in dui fermentum malesuada ac quis quam. Nulla mattis mollis nulla non pharetra. Vestibulum venenatis risus at lectus feugiat varius. Integer eu dolor vulputate, ornare eros vitae, imperdiet leo. Aliquam auctor justo in eleifend placerat. Etiam erat lacus, cursus ac faucibus eget, eleifend sit amet diam. Nulla molestie ex sapien, in consequat purus facilisis vitae. Nam bibendum, sapien vitae pretium lacinia, quam nisi posuere odio, eget ullamcorper enim est et enim. Nam a felis molestie, iaculis odio eget, molestie mauris.",
    "Donec sodales leo et pellentesque dictum. Aliquam semper luctus sollicitudin. Donec placerat justo nec interdum condimentum. Aenean tempor tellus id hendrerit pellentesque. Sed semper ligula sed elit dictum aliquet. Ut fermentum enim in lectus iaculis, eget convallis nisl vulputate. Sed sodales sem eu tincidunt vestibulum. Sed pulvinar semper tellus, nec interdum justo mattis non. Fusce dolor massa, ullamcorper eu tincidunt auctor, condimentum ut tellus. Curabitur dolor arcu, vulputate id faucibus ac, rutrum non odio.",
    "Etiam eu sollicitudin nisi. Nunc condimentum vel arcu vel sagittis. Maecenas vestibulum volutpat ultricies. Nunc eget purus sapien. Nam sollicitudin nisi sit amet finibus euismod. Suspendisse pretium sapien sit amet mauris vestibulum porttitor. Vivamus vitae purus porttitor, ultrices orci pretium, fringilla orci. Proin facilisis rhoncus mi, eget ullamcorper nibh. Vestibulum condimentum mauris sit amet enim tincidunt, nec vestibulum metus vulputate. Phasellus dui nibh, consequat ut risus ac, facilisis feugiat felis. Donec fermentum, diam in sollicitudin rhoncus, velit arcu volutpat leo, quis lacinia elit metus vitae orci.",
    "Maecenas auctor aliquam tincidunt. Suspendisse ullamcorper lectus dui. Vivamus eget enim mollis arcu pretium tincidunt eu a neque. Proin imperdiet eros a odio sollicitudin, in faucibus metus porta. Integer egestas ligula vitae convallis luctus. Maecenas ut scelerisque urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. In vel sapien a neque lacinia tempor.",
    "Nullam non tempor nisi, ut porta ex. Aenean non mi et nibh feugiat congue id et lacus. Nunc sit amet justo eget felis bibendum interdum. Sed a augue vel mi tempor rhoncus quis ut est. Nulla facilisi. Aliquam et vehicula est. Duis quis dapibus turpis. Sed pulvinar sollicitudin pretium.",
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet tellus tincidunt, mollis diam sit amet, suscipit ligula. Nam molestie tincidunt ex, non pulvinar lectus interdum sed. In tincidunt aliquet est, eu aliquam nisl placerat quis. Aliquam vitae nibh massa. Praesent nulla nisl, varius sollicitudin blandit et, pretium quis lorem. Nam bibendum semper urna, id cursus dui euismod vitae. Duis hendrerit at enim vel eleifend. Sed sapien ipsum, egestas ac consequat vitae, rutrum non quam. Ut at nibh justo. In a justo pellentesque, imperdiet urna quis, cursus lectus. Sed tristique tortor ac massa dictum suscipit.`,
    `Vestibulum nec lacus fringilla, tempus mauris ac, bibendum sapien. Pellentesque vitae erat eget dui finibus ultricies in vel libero. Vivamus eget ultricies felis. Nullam et gravida lorem. Mauris at pharetra justo. Vivamus lectus massa, fringilla sed vehicula et, tempor vel dui. Praesent ut lobortis enim, nec porta lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris eget ligula dolor. Proin maximus lorem in diam blandit, vitae hendrerit sapien tincidunt. Cras nunc nibh, venenatis id sollicitudin a, condimentum in est. In luctus consectetur egestas. Sed nec tellus magna. Praesent ac odio sit amet turpis volutpat feugiat. Nullam diam mauris, sagittis a enim id, mollis feugiat nisl.`,
    `Nunc fringilla libero in metus pharetra, a ultrices ipsum pretium. Aliquam hendrerit ex eget risus posuere faucibus. Cras tristique, mauris id vestibulum pulvinar, justo metus luctus urna, id pellentesque mi ligula quis nulla. Fusce ac est justo. Cras eget tempor lectus. Aenean bibendum purus egestas egestas efficitur. Praesent eget tortor non turpis euismod euismod. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas porttitor vulputate risus et rutrum. Phasellus nec elit lobortis, mollis elit vel, efficitur est. Mauris et pellentesque magna, vitae fermentum urna. Integer tincidunt magna dolor, vitae posuere nunc iaculis et. Aliquam ut sem eu magna gravida imperdiet. Proin sit amet nunc lectus. Duis tristique vulputate elementum.`,
    `Maecenas lacinia quam eu quam varius semper. Nullam fringilla dapibus ligula, eget porttitor nibh vulputate ut. In hac habitasse platea dictumst. Sed lectus metus, lobortis a ultrices non, malesuada et mauris. Etiam ut facilisis sapien. Praesent iaculis rutrum arcu, at dapibus arcu venenatis a. Mauris ut velit vitae magna commodo convallis ac nec nibh.`,
    `Cras non ullamcorper mi. Nunc euismod, felis eu volutpat lacinia, nibh lorem viverra mauris, et maximus sapien metus sit amet tellus. Etiam non dictum ante. Suspendisse at metus viverra arcu pulvinar fringilla. Integer pulvinar nisl sed nulla bibendum molestie. Nulla malesuada maximus ex, a tempor erat egestas vitae. Mauris viverra tortor eget ante fermentum, a fringilla risus mollis. Nulla viverra, lacus id aliquam gravida, leo ex lobortis metus, dictum fringilla orci enim sit amet lorem. Suspendisse consequat sollicitudin nibh, in tempor diam bibendum a. Nulla finibus convallis est eu lobortis. Cras cursus, tortor sed porttitor auctor, sapien justo mollis nibh, vitae pellentesque neque sapien vel libero. Nam mollis interdum tortor vel pretium. Quisque pretium euismod diam et porttitor. In sit amet accumsan nisl. Suspendisse mattis ullamcorper nisl, pellentesque elementum lorem ultricies ac.`,
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc magna sem, lobortis ut dui eu, gravida eleifend nibh. Mauris vulputate ligula vitae pulvinar tincidunt. Aliquam ac mauris lectus. Mauris nisi purus, porttitor nec turpis sit amet, laoreet dapibus lectus. Curabitur et aliquet metus. Nam erat velit, efficitur quis pulvinar non, ultrices ac velit. Curabitur dignissim metus vitae enim hendrerit pellentesque vel vel quam. Aenean metus magna, tempus et orci at, vulputate tincidunt odio. Aliquam et mi ut sem iaculis semper vel vel sem. Aenean laoreet feugiat lorem ac iaculis. Suspendisse id sapien vitae ipsum ornare tincidunt id ornare odio. Sed lacinia ipsum ac massa convallis euismod. Vestibulum at sollicitudin metus, in tempor tortor. Sed in velit nisi. Nulla efficitur tellus imperdiet blandit luctus. Nulla id arcu ut orci porta rhoncus.`,
    `In aliquet nisi a posuere vulputate. Pellentesque ut leo augue. Morbi ullamcorper ex non tincidunt malesuada. Sed molestie erat urna, non hendrerit lectus ullamcorper ac. Suspendisse dapibus sagittis auctor. Pellentesque mi libero, tincidunt finibus nunc sed, sodales bibendum augue. Nulla tincidunt justo quam, sed finibus nunc tincidunt vitae. In hac habitasse platea dictumst. Maecenas congue ut ex ac porttitor. Praesent lacinia arcu eget viverra bibendum.`,
    `Sed viverra dui arcu, at posuere enim dictum ac. In interdum mattis molestie. Cras at pulvinar libero, ac ullamcorper enim. Vivamus sagittis non eros at venenatis. Proin consectetur lectus at urna mattis, eu eleifend tellus pretium. In vel enim arcu. Etiam placerat velit vitae rhoncus tempor. Pellentesque a dignissim justo, eu porttitor nisi. Duis pretium malesuada ante et faucibus. Donec mattis rutrum suscipit. Etiam sagittis eget magna id aliquam. Integer placerat ligula quis ligula ullamcorper molestie.`,
    `Quisque blandit magna vel lacinia fringilla. Mauris sit amet gravida tellus. Ut sagittis convallis bibendum. Sed dapibus velit sit amet sapien malesuada, a sagittis turpis ornare. Cras finibus arcu vel rutrum euismod. Nam fringilla tellus et nibh accumsan viverra. Vestibulum vestibulum mauris nec massa efficitur, quis sagittis velit volutpat. Donec porttitor aliquet arcu eleifend sagittis. Pellentesque viverra ac metus a pharetra. Etiam dolor justo, convallis id pellentesque non, vehicula eget risus. Donec vel dictum leo. Vestibulum commodo iaculis libero, sit amet faucibus sem dictum ac. Vestibulum rhoncus, diam sed convallis laoreet, turpis ante fringilla tortor, eu consequat sem nulla eu ipsum. Vivamus eleifend semper placerat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus finibus nulla eu odio iaculis elementum.`,
    `Aenean sed nisi nibh. Quisque molestie euismod hendrerit. Donec eu pulvinar lectus, quis ultrices tortor. Proin posuere felis non leo euismod, sed rutrum ligula sagittis. Morbi sagittis felis rutrum augue sollicitudin tincidunt. Aliquam imperdiet aliquam metus ac ultrices. In elit massa, accumsan id tempor sed, tincidunt et neque.`
  ]

  let max: number = 0;
  (type === 'title') ? max = titles.length : max = descriptions.length;

  const min = 0;

  // Generate a number between 0 and 10, including 10
  // // Math.floor(Math.random() * max) + 1;
  // Generate a random number between 2 and 10, including both 2 and 10
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return (type === 'title') ? titles[randomNumber] : descriptions[randomNumber];
}

export const formerData: PlotContent = {
  id: generateID(),
  name: "Application",
  children: [
    {
      id: generateID(),
      name: "Front-end",
      children: [
        {
          id: generateID(),
          name: "Gestures management",
        },
        {
          id: generateID(),
          name: "Data management",
          children: [
            {
              id: generateID(),
              name: "Lodash",
            },
          ],
        },
        {
          id: generateID(),
          name: "Fake API",
          children: [
            {
              id: generateID(),
              name: "JSON Server",
            },
            {
              id: generateID(),
              name: "Casual",
            },
          ],
        },
        {
          id: generateID(),
          name: "TypeScript",
        },
        {
          id: generateID(),
          name: "React",
          children: [
            {
              id: generateID(),
              name: "lifecycle",
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
                          name: "axios",
                        },
                      ],
                    },
                    {
                      id: generateID(),
                      name: "selectors",
                    },
                    {
                      id: generateID(),
                      name: "actions",
                    },
                    {
                      id: generateID(),
                      name: "slice",
                      children: [
                        {
                          id: generateID(),
                          name: "reducers",
                        },
                        {
                          id: generateID(),
                          name: "extra-reducers",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: generateID(),
              name: "I18n",
              children: [
                {
                  id: generateID(),
                  name: "fr",
                },
                {
                  id: generateID(),
                  name: "en",
                },
                {
                  id: generateID(),
                  name: "de",
                },
              ],
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
                      name: "Components",
                    },
                  ],
                },
              ],
            },
            {
              id: generateID(),
              name: "TsConfig",
            },
            {
              id: generateID(),
              name: "Linter",
            },
            {
              id: generateID(),
              name: "EnvFile",
              children: [
                {
                  id: generateID(),
                  name: "Development",
                },
                {
                  id: generateID(),
                  name: "Production",
                },
              ],
            },
            {
              id: generateID(),
              name: "SourceMap",
            },
            {
              id: generateID(),
              name: "Hooks",
              children: [
                {
                  id: generateID(),
                  name: "UseState",
                },
                {
                  id: generateID(),
                  name: "UseEffect",
                },
                {
                  id: generateID(),
                  name: "UseRef",
                },
                {
                  id: generateID(),
                  name: "UseCallback",
                },
              ],
            },
          ],
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
                  name: "Reactstrap",
                },
                {
                  id: generateID(),
                  name: "Material UI",
                },
                {
                  id: generateID(),
                  name: "Fontawesome",
                },
              ],
            },
            {
              id: generateID(),
              name: "Animation",
            },
            {
              id: generateID(),
              name: "Sass",
            },
            {
              id: generateID(),
              name: "Layout",
              children: [
                {
                  id: generateID(),
                  name: "Grid",
                },
                {
                  id: generateID(),
                  name: "Flexbox",
                },
              ],
            },
            {
              id: generateID(),
              name: "Components",
              children: [
                {
                  id: generateID(),
                  name: "Inputs",
                },
                {
                  id: generateID(),
                  name: "Typography",
                },
              ],
            },
          ],
        },
        {
          id: generateID(),
          name: "Testing",
          children: [
            {
              id: generateID(),
              name: "Cypress",
            },
            {
              id: generateID(),
              name: "Jest",
            },
          ],
        },
      ],
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
                  name: "API",
                },
                {
                  id: generateID(),
                  name: "Scripts",
                  children: [
                    {
                      id: generateID(),
                      name: "Cron Job",
                    },
                  ],
                },
                {
                  id: generateID(),
                  name: "Socket-io",
                },
              ],
            },
            {
              id: generateID(),
              name: "Koa",
              children: [
                {
                  id: generateID(),
                  name: "API",
                },
                {
                  id: generateID(),
                  name: "Socket-io",
                },
              ],
            },
            {
              id: generateID(),
              name: "Modules",
              children: [
                {
                  id: generateID(),
                  name: "cors",
                },
                {
                  id: generateID(),
                  name: "helmet",
                },
                {
                  id: generateID(),
                  name: "body-parser",
                },
                {
                  id: generateID(),
                  name: "dotenv",
                },
                {
                  id: generateID(),
                  name: "pg",
                },
                {
                  id: generateID(),
                  name: "mongoose",
                },
                {
                  id: generateID(),
                  name: "typeorm",
                },
              ],
            },
          ],
        },
      ],
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
              name: "Mongoose",
            },
          ],
        },
        {
          id: generateID(),
          name: "Postgres",
          children: [
            {
              id: generateID(),
              name: "DB-migrate",
            },
          ],
        },
      ],
    },
    {
      id: generateID(),
      name: "Docker",
      children: [
        {
          id: generateID(),
          name: "Docker-compose",
        },
        {
          id: generateID(),
          name: "Dockerfile",
        },
      ],
    },
    {
      id: generateID(),
      name: "System",
      children: [
        {
          id: generateID(),
          name: "WebHooks",
        },
        {
          id: generateID(),
          name: "Automation",
        },
      ],
    },
  ],
};

export const data: Plot[] = [
  {
    id: generateID(),
    title: GenerateText('title'),
    description: GenerateText('description'),
    content: {
      id: generateID(),
      name: GenerateText('title'),
      description: GenerateText('description'),
      children: [
        {
          id: generateID(),
          name: GenerateText('title'),
          description: GenerateText('description'),
          children: [
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
              ],
            },
            {
              id: generateID(),
              name: "Fake API",
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
              ],
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                  ],
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                      children: [
                        {
                          id: generateID(),
                          name: GenerateText('title'),
                          description: GenerateText('description'),
                        },
                      ],
                    },
                  ],
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                  ],
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                  ],
                },
              ],
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
              ],
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
              ],
            },
          ],
        },
      ],
    }
  },
  {
    id: generateID(),
    title: GenerateText('title'),
    description: GenerateText('description'),
    content: {
      id: generateID(),
      name: GenerateText('title'),
      description: GenerateText('description'),
      children: [
        {
          id: generateID(),
          name: GenerateText('title'),
          description: GenerateText('description'),
          children: [
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
              ],
            },
            {
              id: generateID(),
              name: "Fake API",
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
              ],
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                  ],
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                      children: [
                        {
                          id: generateID(),
                          name: GenerateText('title'),
                          description: GenerateText('description'),
                        },
                      ],
                    },
                  ],
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                  ],
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                  ],
                },
              ],
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
              ],
            },
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
              ],
            },
          ],
        },
        {
          id: generateID(),
          name: GenerateText('title'),
          description: GenerateText('description'),
          children: [
            {
              id: generateID(),
              name: GenerateText('title'),
              description: GenerateText('description'),
              children: [
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                  ],
                },
                {
                  id: generateID(),
                  name: GenerateText('title'),
                  description: GenerateText('description'),
                  children: [
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                    {
                      id: generateID(),
                      name: GenerateText('title'),
                      description: GenerateText('description'),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  }
];

export const flare = {
  name: "flare",
  children: [
    {
      name: "analytics",
      children: [
        {
          name: "cluster",
          children: [
            {
              name: "AgglomerativeCluster",
              size: 3938,
            },
            {
              name: "CommunityStructure",
              size: 3812,
            },
            {
              name: "HierarchicalCluster",
              size: 6714,
            },
            {
              name: "MergeEdge",
              size: 743,
            },
          ],
        },
        {
          name: "graph",
          children: [
            {
              name: "BetweennessCentrality",
              size: 3534,
            },
            {
              name: "LinkDistance",
              size: 5731,
            },
            {
              name: "MaxFlowMinCut",
              size: 7840,
            },
            {
              name: "ShortestPaths",
              size: 5914,
            },
            {
              name: "SpanningTree",
              size: 3416,
            },
          ],
        },
        {
          name: "optimization",
          children: [
            {
              name: "AspectRatioBanker",
              size: 7074,
            },
          ],
        },
      ],
    },
    {
      name: "animate",
      children: [
        {
          name: "Easing",
          size: 17010,
        },
        {
          name: "FunctionSequence",
          size: 5842,
        },
        {
          name: "interpolate",
          children: [
            {
              name: "ArrayInterpolator",
              size: 1983,
            },
            {
              name: "ColorInterpolator",
              size: 2047,
            },
            {
              name: "DateInterpolator",
              size: 1375,
            },
            {
              name: "Interpolator",
              size: 8746,
            },
            {
              name: "MatrixInterpolator",
              size: 2202,
            },
            {
              name: "NumberInterpolator",
              size: 1382,
            },
            {
              name: "ObjectInterpolator",
              size: 1629,
            },
            {
              name: "PointInterpolator",
              size: 1675,
            },
            {
              name: "RectangleInterpolator",
              size: 2042,
            },
          ],
        },
        {
          name: "ISchedulable",
          size: 1041,
        },
        {
          name: "Parallel",
          size: 5176,
        },
        {
          name: "Pause",
          size: 449,
        },
        {
          name: "Scheduler",
          size: 5593,
        },
        {
          name: "Sequence",
          size: 5534,
        },
        {
          name: "Transition",
          size: 9201,
        },
        {
          name: "Transitioner",
          size: 19975,
        },
        {
          name: "TransitionEvent",
          size: 1116,
        },
        {
          name: "Tween",
          size: 6006,
        },
      ],
    },
    {
      name: "data",
      children: [
        {
          name: "converters",
          children: [
            {
              name: "Converters",
              size: 721,
            },
            {
              name: "DelimitedTextConverter",
              size: 4294,
            },
            {
              name: "GraphMLConverter",
              size: 9800,
            },
            {
              name: "IDataConverter",
              size: 1314,
            },
            {
              name: "JSONConverter",
              size: 2220,
            },
          ],
        },
        {
          name: "DataField",
          size: 1759,
        },
        {
          name: "DataSchema",
          size: 2165,
        },
        {
          name: "DataSet",
          size: 586,
        },
        {
          name: "DataSource",
          size: 3331,
        },
        {
          name: "DataTable",
          size: 772,
        },
        {
          name: "DataUtil",
          size: 3322,
        },
      ],
    },
    {
      name: "display",
      children: [
        {
          name: "DirtySprite",
          size: 8833,
        },
        {
          name: "LineSprite",
          size: 1732,
        },
        {
          name: "RectSprite",
          size: 3623,
        },
        {
          name: "TextSprite",
          size: 10066,
        },
      ],
    },
    {
      name: "flex",
      children: [
        {
          name: "FlareVis",
          size: 4116,
        },
      ],
    },
    {
      name: "physics",
      children: [
        {
          name: "DragForce",
          size: 1082,
        },
        {
          name: "GravityForce",
          size: 1336,
        },
        {
          name: "IForce",
          size: 319,
        },
        {
          name: "NBodyForce",
          size: 10498,
        },
        {
          name: "Particle",
          size: 2822,
        },
        {
          name: "Simulation",
          size: 9983,
        },
        {
          name: "Spring",
          size: 2213,
        },
        {
          name: "SpringForce",
          size: 1681,
        },
      ],
    },
    {
      name: "query",
      children: [
        {
          name: "AggregateExpression",
          size: 1616,
        },
        {
          name: "And",
          size: 1027,
        },
        {
          name: "Arithmetic",
          size: 3891,
        },
        {
          name: "Average",
          size: 891,
        },
        {
          name: "BinaryExpression",
          size: 2893,
        },
        {
          name: "Comparison",
          size: 5103,
        },
        {
          name: "CompositeExpression",
          size: 3677,
        },
        {
          name: "Count",
          size: 781,
        },
        {
          name: "DateUtil",
          size: 4141,
        },
        {
          name: "Distinct",
          size: 933,
        },
        {
          name: "Expression",
          size: 5130,
        },
        {
          name: "ExpressionIterator",
          size: 3617,
        },
        {
          name: "Fn",
          size: 3240,
        },
        {
          name: "If",
          size: 2732,
        },
        {
          name: "IsA",
          size: 2039,
        },
        {
          name: "Literal",
          size: 1214,
        },
        {
          name: "Match",
          size: 3748,
        },
        {
          name: "Maximum",
          size: 843,
        },
        {
          name: "methods",
          children: [
            {
              name: "add",
              size: 593,
            },
            {
              name: "and",
              size: 330,
            },
            {
              name: "average",
              size: 287,
            },
            {
              name: "count",
              size: 277,
            },
            {
              name: "distinct",
              size: 292,
            },
            {
              name: "div",
              size: 595,
            },
            {
              name: "eq",
              size: 594,
            },
            {
              name: "fn",
              size: 460,
            },
            {
              name: "gt",
              size: 603,
            },
            {
              name: "gte",
              size: 625,
            },
            {
              name: "iff",
              size: 748,
            },
            {
              name: "isa",
              size: 461,
            },
            {
              name: "lt",
              size: 597,
            },
            {
              name: "lte",
              size: 619,
            },
            {
              name: "max",
              size: 283,
            },
            {
              name: "min",
              size: 283,
            },
            {
              name: "mod",
              size: 591,
            },
            {
              name: "mul",
              size: 603,
            },
            {
              name: "neq",
              size: 599,
            },
            {
              name: "not",
              size: 386,
            },
            {
              name: "or",
              size: 323,
            },
            {
              name: "orderby",
              size: 307,
            },
            {
              name: "range",
              size: 772,
            },
            {
              name: "select",
              size: 296,
            },
            {
              name: "stddev",
              size: 363,
            },
            {
              name: "sub",
              size: 600,
            },
            {
              name: "sum",
              size: 280,
            },
            {
              name: "update",
              size: 307,
            },
            {
              name: "variance",
              size: 335,
            },
            {
              name: "where",
              size: 299,
            },
            {
              name: "xor",
              size: 354,
            },
            {
              name: "_",
              size: 264,
            },
          ],
        },
        {
          name: "Minimum",
          size: 843,
        },
        {
          name: "Not",
          size: 1554,
        },
        {
          name: "Or",
          size: 970,
        },
        {
          name: "Query",
          size: 13896,
        },
        {
          name: "Range",
          size: 1594,
        },
        {
          name: "StringUtil",
          size: 4130,
        },
        {
          name: "Sum",
          size: 791,
        },
        {
          name: "Variable",
          size: 1124,
        },
        {
          name: "Variance",
          size: 1876,
        },
        {
          name: "Xor",
          size: 1101,
        },
      ],
    },
    {
      name: "scale",
      children: [
        {
          name: "IScaleMap",
          size: 2105,
        },
        {
          name: "LinearScale",
          size: 1316,
        },
        {
          name: "LogScale",
          size: 3151,
        },
        {
          name: "OrdinalScale",
          size: 3770,
        },
        {
          name: "QuantileScale",
          size: 2435,
        },
        {
          name: "QuantitativeScale",
          size: 4839,
        },
        {
          name: "RootScale",
          size: 1756,
        },
        {
          name: "Scale",
          size: 4268,
        },
        {
          name: "ScaleType",
          size: 1821,
        },
        {
          name: "TimeScale",
          size: 5833,
        },
      ],
    },
    {
      name: "util",
      children: [
        {
          name: "Arrays",
          size: 8258,
        },
        {
          name: "Colors",
          size: 10001,
        },
        {
          name: "Dates",
          size: 8217,
        },
        {
          name: "Displays",
          size: 12555,
        },
        {
          name: "Filter",
          size: 2324,
        },
        {
          name: "Geometry",
          size: 10993,
        },
        {
          name: "heap",
          children: [
            {
              name: "FibonacciHeap",
              size: 9354,
            },
            {
              name: "HeapNode",
              size: 1233,
            },
          ],
        },
        {
          name: "IEvaluable",
          size: 335,
        },
        {
          name: "IPredicate",
          size: 383,
        },
        {
          name: "IValueProxy",
          size: 874,
        },
        {
          name: "math",
          children: [
            {
              name: "DenseMatrix",
              size: 3165,
            },
            {
              name: "IMatrix",
              size: 2815,
            },
            {
              name: "SparseMatrix",
              size: 3366,
            },
          ],
        },
        {
          name: "Maths",
          size: 17705,
        },
        {
          name: "Orientation",
          size: 1486,
        },
        {
          name: "palette",
          children: [
            {
              name: "ColorPalette",
              size: 6367,
            },
            {
              name: "Palette",
              size: 1229,
            },
            {
              name: "ShapePalette",
              size: 2059,
            },
            {
              name: "SizePalette",
              size: 2291,
            },
          ],
        },
        {
          name: "Property",
          size: 5559,
        },
        {
          name: "Shapes",
          size: 19118,
        },
        {
          name: "Sort",
          size: 6887,
        },
        {
          name: "Stats",
          size: 6557,
        },
        {
          name: "Strings",
          size: 22026,
        },
      ],
    },
    {
      name: "vis",
      children: [
        {
          name: "axis",
          children: [
            {
              name: "Axes",
              size: 1302,
            },
            {
              name: "Axis",
              size: 24593,
            },
            {
              name: "AxisGridLine",
              size: 652,
            },
            {
              name: "AxisLabel",
              size: 636,
            },
            {
              name: "CartesianAxes",
              size: 6703,
            },
          ],
        },
        {
          name: "controls",
          children: [
            {
              name: "AnchorControl",
              size: 2138,
            },
            {
              name: "ClickControl",
              size: 3824,
            },
            {
              name: "Control",
              size: 1353,
            },
            {
              name: "ControlList",
              size: 4665,
            },
            {
              name: "DragControl",
              size: 2649,
            },
            {
              name: "ExpandControl",
              size: 2832,
            },
            {
              name: "HoverControl",
              size: 4896,
            },
            {
              name: "IControl",
              size: 763,
            },
            {
              name: "PanZoomControl",
              size: 5222,
            },
            {
              name: "SelectionControl",
              size: 7862,
            },
            {
              name: "TooltipControl",
              size: 8435,
            },
          ],
        },
        {
          name: "data",
          children: [
            {
              name: "Data",
              size: 20544,
            },
            {
              name: "DataList",
              size: 19788,
            },
            {
              name: "DataSprite",
              size: 10349,
            },
            {
              name: "EdgeSprite",
              size: 3301,
            },
            {
              name: "NodeSprite",
              size: 19382,
            },
            {
              name: "render",
              children: [
                {
                  name: "ArrowType",
                  size: 698,
                },
                {
                  name: "EdgeRenderer",
                  size: 5569,
                },
                {
                  name: "IRenderer",
                  size: 353,
                },
                {
                  name: "ShapeRenderer",
                  size: 2247,
                },
              ],
            },
            {
              name: "ScaleBinding",
              size: 11275,
            },
            {
              name: "Tree",
              size: 7147,
            },
            {
              name: "TreeBuilder",
              size: 9930,
            },
          ],
        },
        {
          name: "events",
          children: [
            {
              name: "DataEvent",
              size: 2313,
            },
            {
              name: "SelectionEvent",
              size: 1880,
            },
            {
              name: "TooltipEvent",
              size: 1701,
            },
            {
              name: "VisualizationEvent",
              size: 1117,
            },
          ],
        },
        {
          name: "legend",
          children: [
            {
              name: "Legend",
              size: 20859,
            },
            {
              name: "LegendItem",
              size: 4614,
            },
            {
              name: "LegendRange",
              size: 10530,
            },
          ],
        },
        {
          name: "operator",
          children: [
            {
              name: "distortion",
              children: [
                {
                  name: "BifocalDistortion",
                  size: 4461,
                },
                {
                  name: "Distortion",
                  size: 6314,
                },
                {
                  name: "FisheyeDistortion",
                  size: 3444,
                },
              ],
            },
            {
              name: "encoder",
              children: [
                {
                  name: "ColorEncoder",
                  size: 3179,
                },
                {
                  name: "Encoder",
                  size: 4060,
                },
                {
                  name: "PropertyEncoder",
                  size: 4138,
                },
                {
                  name: "ShapeEncoder",
                  size: 1690,
                },
                {
                  name: "SizeEncoder",
                  size: 1830,
                },
              ],
            },
            {
              name: "filter",
              children: [
                {
                  name: "FisheyeTreeFilter",
                  size: 5219,
                },
                {
                  name: "GraphDistanceFilter",
                  size: 3165,
                },
                {
                  name: "VisibilityFilter",
                  size: 3509,
                },
              ],
            },
            {
              name: "IOperator",
              size: 1286,
            },
            {
              name: "label",
              children: [
                {
                  name: "Labeler",
                  size: 9956,
                },
                {
                  name: "RadialLabeler",
                  size: 3899,
                },
                {
                  name: "StackedAreaLabeler",
                  size: 3202,
                },
              ],
            },
            {
              name: "layout",
              children: [
                {
                  name: "AxisLayout",
                  size: 6725,
                },
                {
                  name: "BundledEdgeRouter",
                  size: 3727,
                },
                {
                  name: "CircleLayout",
                  size: 9317,
                },
                {
                  name: "CirclePackingLayout",
                  size: 12003,
                },
                {
                  name: "DendrogramLayout",
                  size: 4853,
                },
                {
                  name: "ForceDirectedLayout",
                  size: 8411,
                },
                {
                  name: "IcicleTreeLayout",
                  size: 4864,
                },
                {
                  name: "IndentedTreeLayout",
                  size: 3174,
                },
                {
                  name: "Layout",
                  size: 7881,
                },
                {
                  name: "NodeLinkTreeLayout",
                  size: 12870,
                },
                {
                  name: "PieLayout",
                  size: 2728,
                },
                {
                  name: "RadialTreeLayout",
                  size: 12348,
                },
                {
                  name: "RandomLayout",
                  size: 870,
                },
                {
                  name: "StackedAreaLayout",
                  size: 9121,
                },
                {
                  name: "TreeMapLayout",
                  size: 9191,
                },
              ],
            },
            {
              name: "Operator",
              size: 2490,
            },
            {
              name: "OperatorList",
              size: 5248,
            },
            {
              name: "OperatorSequence",
              size: 4190,
            },
            {
              name: "OperatorSwitch",
              size: 2581,
            },
            {
              name: "SortOperator",
              size: 2023,
            },
          ],
        },
        {
          name: "Visualization",
          size: 16540,
        },
      ],
    },
  ],
};
