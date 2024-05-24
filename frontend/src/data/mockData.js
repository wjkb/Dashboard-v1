export const mockDataAllBots = [
  {
    id: 1,
    phone: "90000001",
    name: "Lim Wei Jie",
    email: "limweijie@gmail.com",
    persona: "Middle-aged man",
    model: "Llama 2",
    platforms: ["Facebook", "WhatsApp"],
  },
  {
    id: 2,
    phone: "90000002",
    name: "Chua Mei Ling",
    email: "chuameiling@gmail.com",
    persona: "Middle-aged man",
    model: "Llama 3",
    platforms: ["WhatsApp", "Telegram"],
  },
  {
    id: 3,
    phone: "90000003",
    name: "Ahmad Yusof",
    email: "ahmadyusof@gmail.com",
    persona: "Old man",
    model: "Llama 2",
    platforms: ["Facebook"],
  },
  {
    id: 4,
    phone: "90000004",
    name: "Wong Li Hua",
    email: "wonglihua@gmail.com",
    persona: "Young woman",
    model: "Llama 2",
    platforms: ["Facebook", "Telegram"],
  },
  {
    id: 5,
    phone: "90000005",
    name: "Tan Wei",
    email: "tanwei@gmail.com",
    persona: "Young man",
    model: "Llama 3",
    platforms: ["Facebook", "WhatsApp"],
  },
  {
    id: 6,
    phone: "90000006",
    name: "Lim Mei Ling",
    email: "limmeiling@gmail.com",
    persona: "Middle-aged woman",
    model: "Llama 2",
    platforms: ["WhatsApp", "Telegram"],
  },
  {
    id: 7,
    phone: "90000007",
    name: "Rajendra Kumar",
    email: "rajendrakumar@gmail.com",
    persona: "Old man",
    model: "Llama 3",
    platforms: ["Facebook"],
  },
  {
    id: 8,
    phone: "90000008",
    name: "Loh Jia Hui",
    email: "lohjiahui@gmail.com",
    persona: "Middle-aged woman",
    model: "Llama 2",
    platforms: ["Telegram"],
  },
  {
    id: 9,
    phone: "90000009",
    name: "Soh Wei Lun",
    email: "sohweilun@gmail.com",
    persona: "Young man",
    model: "Llama 3",
    platforms: ["Facebook", "WhatsApp", "Telegram"],
  },
];

export const mockDataContacts = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    age: 35,
    phone: "(665)121-5454",
    address: "0912 Won Street, Alabama, SY 10001",
    city: "New York",
    zipCode: "10001",
    registrarId: 123512,
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    age: 42,
    phone: "(421)314-2288",
    address: "1234 Main Street, New York, NY 10001",
    city: "New York",
    zipCode: "13151",
    registrarId: 123512,
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    age: 45,
    phone: "(422)982-6739",
    address: "3333 Want Blvd, Estanza, NAY 42125",
    city: "New York",
    zipCode: "87281",
    registrarId: 4132513,
  },
  {
    id: 4,
    name: "Anya Stark",
    email: "anyastark@gmail.com",
    age: 16,
    phone: "(921)425-6742",
    address: "1514 Main Street, New York, NY 22298",
    city: "New York",
    zipCode: "15551",
    registrarId: 123512,
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    email: "daenerystargaryen@gmail.com",
    age: 31,
    phone: "(421)445-1189",
    address: "11122 Welping Ave, Tenting, CD 21321",
    city: "Tenting",
    zipCode: "14215",
    registrarId: 123512,
  },
  {
    id: 6,
    name: "Ever Melisandre",
    email: "evermelisandre@gmail.com",
    age: 150,
    phone: "(232)545-6483",
    address: "1234 Canvile Street, Esvazark, NY 10001",
    city: "Esvazark",
    zipCode: "10001",
    registrarId: 123512,
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    email: "ferraraclifford@gmail.com",
    age: 44,
    phone: "(543)124-0123",
    address: "22215 Super Street, Everting, ZO 515234",
    city: "Evertin",
    zipCode: "51523",
    registrarId: 123512,
  },
  {
    id: 8,
    name: "Rossini Frances",
    email: "rossinifrances@gmail.com",
    age: 36,
    phone: "(222)444-5555",
    address: "4123 Ever Blvd, Wentington, AD 142213",
    city: "Esteras",
    zipCode: "44215",
    registrarId: 512315,
  },
  {
    id: 9,
    name: "Harvey Roxie",
    email: "harveyroxie@gmail.com",
    age: 65,
    phone: "(444)555-6239",
    address: "51234 Avery Street, Cantory, ND 212412",
    city: "Colunza",
    zipCode: "111234",
    registrarId: 928397,
  },
  {
    id: 10,
    name: "Enteri Redack",
    email: "enteriredack@gmail.com",
    age: 42,
    phone: "(222)444-5555",
    address: "4123 Easer Blvd, Wentington, AD 142213",
    city: "Esteras",
    zipCode: "44215",
    registrarId: 533215,
  },
  {
    id: 11,
    name: "Steve Goodman",
    email: "stevegoodmane@gmail.com",
    age: 11,
    phone: "(444)555-6239",
    address: "51234 Fiveton Street, CunFory, ND 212412",
    city: "Colunza",
    zipCode: "1234",
    registrarId: 92197,
  },
];

export const facebookConversations = [
  {
    botId: 1,
    botName: "Lim Wei Jie",
    conversations: [
      {
        user: "User123",
        messages: [
          {
            timestamp: "2024-05-15T14:30:00Z",
            message: "Hello, can you help me with my order?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T14:31:00Z",
            message:
              "Sure, I'd be happy to assist. Could you please provide your order number?",
            direction: "outgoing",
          },
          {
            timestamp: "2024-05-15T14:32:00Z",
            message: "It's 12345.",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T14:33:00Z",
            message: "Thank you. I'll check the status for you now.",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User789",
        messages: [
          {
            timestamp: "2024-05-15T15:30:00Z",
            message: "Hey Lim, do you know the store hours for today?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T15:31:00Z",
            message: "Yes, the store is open from 9 AM to 8 PM today.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
  {
    botId: 3,
    botName: "Ahmad Yusof",
    conversations: [
      {
        user: "User456",
        messages: [
          {
            timestamp: "2024-05-15T15:00:00Z",
            message:
              "Hi Ahmad, can you tell me the best way to learn programming?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T15:01:00Z",
            message:
              "Certainly! I recommend starting with online tutorials and practicing by building small projects.",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User321",
        messages: [
          {
            timestamp: "2024-05-15T16:00:00Z",
            message:
              "Hey, can you suggest some online courses for data science?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T16:01:00Z",
            message: "Sure! Coursera and edX offer great data science courses.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
  {
    botId: 4,
    botName: "Wong Li Hua",
    conversations: [
      {
        user: "User789",
        messages: [
          {
            timestamp: "2024-05-15T16:00:00Z",
            message: "Can you suggest some good books on personal finance?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T16:01:00Z",
            message:
              "Of course! 'Rich Dad Poor Dad' by Robert Kiyosaki and 'The Total Money Makeover' by Dave Ramsey are great choices.",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User654",
        messages: [
          {
            timestamp: "2024-05-15T17:00:00Z",
            message:
              "Hi Li Hua, what are the best investment options for beginners?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T17:01:00Z",
            message:
              "I recommend starting with index funds and ETFs. They are low-cost and diversified.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
];

export const whatsappConversations = [
  {
    botId: 1,
    botName: "Lim Wei Jie",
    conversations: [
      {
        user: "User123",
        messages: [
          {
            timestamp: "2024-05-15T14:00:00Z",
            message: "Hey Lim, can you recommend a good restaurant nearby?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T14:01:00Z",
            message:
              "Sure, how about trying 'The Fancy Feast'? It's highly rated.",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User456",
        messages: [
          {
            timestamp: "2024-05-15T15:00:00Z",
            message: "Lim, do you know if the pharmacy is open today?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T15:01:00Z",
            message: "Yes, it's open until 6 PM today.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
  {
    botId: 2,
    botName: "Chua Mei Ling",
    conversations: [
      {
        user: "User789",
        messages: [
          {
            timestamp: "2024-05-15T15:30:00Z",
            message: "Hi, I need help with setting up my new phone.",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T15:31:00Z",
            message: "I'd be happy to help. What model is it?",
            direction: "outgoing",
          },
          {
            timestamp: "2024-05-15T15:32:00Z",
            message: "It's an iPhone 13.",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T15:33:00Z",
            message:
              "Great choice! Let's start by turning it on and connecting to Wi-Fi.",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User321",
        messages: [
          {
            timestamp: "2024-05-15T16:30:00Z",
            message: "Hey Chua, how do I transfer my contacts to a new phone?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T16:31:00Z",
            message:
              "You can use the 'Move to iOS' app if you're switching to an iPhone. For Android, use Google Backup.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
  {
    botId: 5,
    botName: "Tan Wei",
    conversations: [
      {
        user: "User789",
        messages: [
          {
            timestamp: "2024-05-15T16:30:00Z",
            message: "Tan, can you remind me of my schedule for tomorrow?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T16:31:00Z",
            message:
              "You have a meeting at 10 AM, lunch with Sarah at 1 PM, and a gym session at 6 PM.",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User654",
        messages: [
          {
            timestamp: "2024-05-15T17:45:00Z",
            message:
              "Hi Tan, can you set a reminder for my doctor's appointment next week?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T17:46:00Z",
            message: "Sure, what time is your appointment?",
            direction: "outgoing",
          },
          {
            timestamp: "2024-05-15T17:47:00Z",
            message: "It's at 3 PM on Tuesday.",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T17:48:00Z",
            message: "Got it. I've set a reminder for you.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
];

export const telegramConversations = [
  {
    botId: 2,
    botName: "Chua Mei Ling",
    conversations: [
      {
        user: "User123",
        messages: [
          {
            timestamp: "2024-05-15T14:15:00Z",
            message:
              "Hello Chua, can you help me find a good recipe for dinner?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T14:16:00Z",
            message:
              "Sure! How about trying a simple stir-fry with vegetables and chicken?",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User456",
        messages: [
          {
            timestamp: "2024-05-15T15:45:00Z",
            message: "Hi Chua, do you have any tips for meal prepping?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T15:46:00Z",
            message:
              "Yes! Start by planning your meals for the week and prepping ingredients in advance.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
  {
    botId: 6,
    botName: "Lim Mei Ling",
    conversations: [
      {
        user: "User456",
        messages: [
          {
            timestamp: "2024-05-15T15:45:00Z",
            message: "Hi, can you recommend some good movies to watch?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T15:46:00Z",
            message:
              "Sure! 'Inception', 'The Matrix', and 'The Shawshank Redemption' are all excellent choices.",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User321",
        messages: [
          {
            timestamp: "2024-05-15T16:15:00Z",
            message: "Hey Lim, any suggestions for TV shows?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T16:16:00Z",
            message:
              "Yes! 'Stranger Things', 'Breaking Bad', and 'The Crown' are highly recommended.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
  {
    botId: 9,
    botName: "Soh Wei Lun",
    conversations: [
      {
        user: "User789",
        messages: [
          {
            timestamp: "2024-05-15T16:45:00Z",
            message: "Hey Soh, what's the weather like today?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T16:46:00Z",
            message:
              "It's sunny with a chance of rain in the afternoon. Perfect for a morning walk!",
            direction: "outgoing",
          },
        ],
      },
      {
        user: "User654",
        messages: [
          {
            timestamp: "2024-05-15T17:00:00Z",
            message: "Hi Soh, can you give me an update on the stock market?",
            direction: "incoming",
          },
          {
            timestamp: "2024-05-15T17:01:00Z",
            message:
              "The market is up by 2% today, with tech stocks leading the gains.",
            direction: "outgoing",
          },
        ],
      },
    ],
  },
];

// export const mockPieData = [
//   {
//     id: "hack",
//     label: "hack",
//     value: 239,
//     color: "hsl(104, 70%, 50%)",
//   },
//   {
//     id: "make",
//     label: "make",
//     value: 170,
//     color: "hsl(162, 70%, 50%)",
//   },
//   {
//     id: "go",
//     label: "go",
//     value: 322,
//     color: "hsl(291, 70%, 50%)",
//   },
//   {
//     id: "lisp",
//     label: "lisp",
//     value: 503,
//     color: "hsl(229, 70%, 50%)",
//   },
//   {
//     id: "scala",
//     label: "scala",
//     value: 584,
//     color: "hsl(344, 70%, 50%)",
//   },
// ];

// export const mockLineData = [
//   {
//     id: "japan",
//     color: tokens("dark").greenAccent[500],
//     data: [
//       {
//         x: "plane",
//         y: 101,
//       },
//       {
//         x: "helicopter",
//         y: 75,
//       },
//       {
//         x: "boat",
//         y: 36,
//       },
//       {
//         x: "train",
//         y: 216,
//       },
//       {
//         x: "subway",
//         y: 35,
//       },
//       {
//         x: "bus",
//         y: 236,
//       },
//       {
//         x: "car",
//         y: 88,
//       },
//       {
//         x: "moto",
//         y: 232,
//       },
//       {
//         x: "bicycle",
//         y: 281,
//       },
//       {
//         x: "horse",
//         y: 1,
//       },
//       {
//         x: "skateboard",
//         y: 35,
//       },
//       {
//         x: "others",
//         y: 14,
//       },
//     ],
//   },
//   {
//     id: "france",
//     color: tokens("dark").blueAccent[300],
//     data: [
//       {
//         x: "plane",
//         y: 212,
//       },
//       {
//         x: "helicopter",
//         y: 190,
//       },
//       {
//         x: "boat",
//         y: 270,
//       },
//       {
//         x: "train",
//         y: 9,
//       },
//       {
//         x: "subway",
//         y: 75,
//       },
//       {
//         x: "bus",
//         y: 175,
//       },
//       {
//         x: "car",
//         y: 33,
//       },
//       {
//         x: "moto",
//         y: 189,
//       },
//       {
//         x: "bicycle",
//         y: 97,
//       },
//       {
//         x: "horse",
//         y: 87,
//       },
//       {
//         x: "skateboard",
//         y: 299,
//       },
//       {
//         x: "others",
//         y: 251,
//       },
//     ],
//   },
//   {
//     id: "us",
//     color: tokens("dark").redAccent[200],
//     data: [
//       {
//         x: "plane",
//         y: 191,
//       },
//       {
//         x: "helicopter",
//         y: 136,
//       },
//       {
//         x: "boat",
//         y: 91,
//       },
//       {
//         x: "train",
//         y: 190,
//       },
//       {
//         x: "subway",
//         y: 211,
//       },
//       {
//         x: "bus",
//         y: 152,
//       },
//       {
//         x: "car",
//         y: 189,
//       },
//       {
//         x: "moto",
//         y: 152,
//       },
//       {
//         x: "bicycle",
//         y: 8,
//       },
//       {
//         x: "horse",
//         y: 197,
//       },
//       {
//         x: "skateboard",
//         y: 107,
//       },
//       {
//         x: "others",
//         y: 170,
//       },
//     ],
//   },
// ];

export const mockGeographyData = [
  {
    id: "AFG",
    value: 520600,
  },
  {
    id: "AGO",
    value: 949905,
  },
  {
    id: "ALB",
    value: 329910,
  },
  {
    id: "ARE",
    value: 675484,
  },
  {
    id: "ARG",
    value: 432239,
  },
  {
    id: "ARM",
    value: 288305,
  },
  {
    id: "ATA",
    value: 415648,
  },
  {
    id: "ATF",
    value: 665159,
  },
  {
    id: "AUT",
    value: 798526,
  },
  {
    id: "AZE",
    value: 481678,
  },
  {
    id: "BDI",
    value: 496457,
  },
  {
    id: "BEL",
    value: 252276,
  },
  {
    id: "BEN",
    value: 440315,
  },
  {
    id: "BFA",
    value: 343752,
  },
  {
    id: "BGD",
    value: 920203,
  },
  {
    id: "BGR",
    value: 261196,
  },
  {
    id: "BHS",
    value: 421551,
  },
  {
    id: "BIH",
    value: 974745,
  },
  {
    id: "BLR",
    value: 349288,
  },
  {
    id: "BLZ",
    value: 305983,
  },
  {
    id: "BOL",
    value: 430840,
  },
  {
    id: "BRN",
    value: 345666,
  },
  {
    id: "BTN",
    value: 649678,
  },
  {
    id: "BWA",
    value: 319392,
  },
  {
    id: "CAF",
    value: 722549,
  },
  {
    id: "CAN",
    value: 332843,
  },
  {
    id: "CHE",
    value: 122159,
  },
  {
    id: "CHL",
    value: 811736,
  },
  {
    id: "CHN",
    value: 593604,
  },
  {
    id: "CIV",
    value: 143219,
  },
  {
    id: "CMR",
    value: 630627,
  },
  {
    id: "COG",
    value: 498556,
  },
  {
    id: "COL",
    value: 660527,
  },
  {
    id: "CRI",
    value: 60262,
  },
  {
    id: "CUB",
    value: 177870,
  },
  {
    id: "-99",
    value: 463208,
  },
  {
    id: "CYP",
    value: 945909,
  },
  {
    id: "CZE",
    value: 500109,
  },
  {
    id: "DEU",
    value: 63345,
  },
  {
    id: "DJI",
    value: 634523,
  },
  {
    id: "DNK",
    value: 731068,
  },
  {
    id: "DOM",
    value: 262538,
  },
  {
    id: "DZA",
    value: 760695,
  },
  {
    id: "ECU",
    value: 301263,
  },
  {
    id: "EGY",
    value: 148475,
  },
  {
    id: "ERI",
    value: 939504,
  },
  {
    id: "ESP",
    value: 706050,
  },
  {
    id: "EST",
    value: 977015,
  },
  {
    id: "ETH",
    value: 461734,
  },
  {
    id: "FIN",
    value: 22800,
  },
  {
    id: "FJI",
    value: 18985,
  },
  {
    id: "FLK",
    value: 64986,
  },
  {
    id: "FRA",
    value: 447457,
  },
  {
    id: "GAB",
    value: 669675,
  },
  {
    id: "GBR",
    value: 757120,
  },
  {
    id: "GEO",
    value: 158702,
  },
  {
    id: "GHA",
    value: 893180,
  },
  {
    id: "GIN",
    value: 877288,
  },
  {
    id: "GMB",
    value: 724530,
  },
  {
    id: "GNB",
    value: 387753,
  },
  {
    id: "GNQ",
    value: 706118,
  },
  {
    id: "GRC",
    value: 377796,
  },
  {
    id: "GTM",
    value: 66890,
  },
  {
    id: "GUY",
    value: 719300,
  },
  {
    id: "HND",
    value: 739590,
  },
  {
    id: "HRV",
    value: 929467,
  },
  {
    id: "HTI",
    value: 538961,
  },
  {
    id: "HUN",
    value: 146095,
  },
  {
    id: "IDN",
    value: 490681,
  },
  {
    id: "IND",
    value: 549818,
  },
  {
    id: "IRL",
    value: 630163,
  },
  {
    id: "IRN",
    value: 596921,
  },
  {
    id: "IRQ",
    value: 767023,
  },
  {
    id: "ISL",
    value: 478682,
  },
  {
    id: "ISR",
    value: 963688,
  },
  {
    id: "ITA",
    value: 393089,
  },
  {
    id: "JAM",
    value: 83173,
  },
  {
    id: "JOR",
    value: 52005,
  },
  {
    id: "JPN",
    value: 199174,
  },
  {
    id: "KAZ",
    value: 181424,
  },
  {
    id: "KEN",
    value: 60946,
  },
  {
    id: "KGZ",
    value: 432478,
  },
  {
    id: "KHM",
    value: 254461,
  },
  {
    id: "OSA",
    value: 942447,
  },
  {
    id: "KWT",
    value: 414413,
  },
  {
    id: "LAO",
    value: 448339,
  },
  {
    id: "LBN",
    value: 620090,
  },
  {
    id: "LBR",
    value: 435950,
  },
  {
    id: "LBY",
    value: 75091,
  },
  {
    id: "LKA",
    value: 595124,
  },
  {
    id: "LSO",
    value: 483524,
  },
  {
    id: "LTU",
    value: 867357,
  },
  {
    id: "LUX",
    value: 689172,
  },
  {
    id: "LVA",
    value: 742980,
  },
  {
    id: "MAR",
    value: 236538,
  },
  {
    id: "MDA",
    value: 926836,
  },
  {
    id: "MDG",
    value: 840840,
  },
  {
    id: "MEX",
    value: 353910,
  },
  {
    id: "MKD",
    value: 505842,
  },
  {
    id: "MLI",
    value: 286082,
  },
  {
    id: "MMR",
    value: 915544,
  },
  {
    id: "MNE",
    value: 609500,
  },
  {
    id: "MNG",
    value: 410428,
  },
  {
    id: "MOZ",
    value: 32868,
  },
  {
    id: "MRT",
    value: 375671,
  },
  {
    id: "MWI",
    value: 591935,
  },
  {
    id: "MYS",
    value: 991644,
  },
  {
    id: "NAM",
    value: 701897,
  },
  {
    id: "NCL",
    value: 144098,
  },
  {
    id: "NER",
    value: 312944,
  },
  {
    id: "NGA",
    value: 862877,
  },
  {
    id: "NIC",
    value: 90831,
  },
  {
    id: "NLD",
    value: 281879,
  },
  {
    id: "NOR",
    value: 224537,
  },
  {
    id: "NPL",
    value: 322331,
  },
  {
    id: "NZL",
    value: 86615,
  },
  {
    id: "OMN",
    value: 707881,
  },
  {
    id: "PAK",
    value: 158577,
  },
  {
    id: "PAN",
    value: 738579,
  },
  {
    id: "PER",
    value: 248751,
  },
  {
    id: "PHL",
    value: 557292,
  },
  {
    id: "PNG",
    value: 516874,
  },
  {
    id: "POL",
    value: 682137,
  },
  {
    id: "PRI",
    value: 957399,
  },
  {
    id: "PRT",
    value: 846430,
  },
  {
    id: "PRY",
    value: 720555,
  },
  {
    id: "QAT",
    value: 478726,
  },
  {
    id: "ROU",
    value: 259318,
  },
  {
    id: "RUS",
    value: 268735,
  },
  {
    id: "RWA",
    value: 136781,
  },
  {
    id: "ESH",
    value: 151957,
  },
  {
    id: "SAU",
    value: 111821,
  },
  {
    id: "SDN",
    value: 927112,
  },
  {
    id: "SDS",
    value: 966473,
  },
  {
    id: "SEN",
    value: 158085,
  },
  {
    id: "SLB",
    value: 178389,
  },
  {
    id: "SLE",
    value: 528433,
  },
  {
    id: "SLV",
    value: 353467,
  },
  {
    id: "ABV",
    value: 251,
  },
  {
    id: "SOM",
    value: 445243,
  },
  {
    id: "SRB",
    value: 202402,
  },
  {
    id: "SUR",
    value: 972121,
  },
  {
    id: "SVK",
    value: 319923,
  },
  {
    id: "SVN",
    value: 728766,
  },
  {
    id: "SWZ",
    value: 379669,
  },
  {
    id: "SYR",
    value: 16221,
  },
  {
    id: "TCD",
    value: 101273,
  },
  {
    id: "TGO",
    value: 498411,
  },
  {
    id: "THA",
    value: 506906,
  },
  {
    id: "TJK",
    value: 613093,
  },
  {
    id: "TKM",
    value: 327016,
  },
  {
    id: "TLS",
    value: 607972,
  },
  {
    id: "TTO",
    value: 936365,
  },
  {
    id: "TUN",
    value: 898416,
  },
  {
    id: "TUR",
    value: 237783,
  },
  {
    id: "TWN",
    value: 878213,
  },
  {
    id: "TZA",
    value: 442174,
  },
  {
    id: "UGA",
    value: 720710,
  },
  {
    id: "UKR",
    value: 74172,
  },
  {
    id: "URY",
    value: 753177,
  },
  {
    id: "USA",
    value: 658725,
  },
  {
    id: "UZB",
    value: 550313,
  },
  {
    id: "VEN",
    value: 707492,
  },
  {
    id: "VNM",
    value: 538907,
  },
  {
    id: "VUT",
    value: 650646,
  },
  {
    id: "PSE",
    value: 476078,
  },
  {
    id: "YEM",
    value: 957751,
  },
  {
    id: "ZAF",
    value: 836949,
  },
  {
    id: "ZMB",
    value: 714503,
  },
  {
    id: "ZWE",
    value: 405217,
  },
  {
    id: "KOR",
    value: 171135,
  },
];
