/* 
  GLISTEN SCHOOLS — CENTRAL CONTENT FILE
  ---------------------------------------------------------------
  Update shared school details, navigation, footer contacts, and
  featured events here. Pages that use these components update
  automatically. See SITE_EDITING_GUIDE.md for simple instructions.
*/
window.GLISTEN_CONTENT = {
  schools: {
    main: {
      name: "Glisten Pre and Primary School",
      shortName: "Glisten",
      tagline: "Together We Excel",
      stage: "Standard One to Standard Seven",
      logo: "assets/images/logo.png",
      home: "index.html"
    },
    preparatory: {
      name: "Glisten Preparatory",
      shortName: "Preparatory",
      tagline: "Part of Glisten Schools",
      stage: "Baby Class, Middle Class and Pre-Unit",
      logo: "assets/images/preparatory/logo-preparatory.png",
      home: "glisten-preparatory.html"
    }
  },

  location: {
    short: "Mirerani, Simanjiro, Manyara",
    full: "Mirerani, Simanjiro, Manyara, Tanzania",
    maps: "https://maps.app.goo.gl/LzEmobrWxPrfxvT86"
  },

  contacts: {
    main: {
      phone: "+255 679 500 905",
      phoneHref: "+255679500905",
      email: "glistenschool1@gmail.com",
      whatsapp: "https://wa.me/255679500905?text=Hello%20Glisten%20Pre%20and%20Primary%20School%2C%20I%20would%20like%20to%20ask%20about%20admission."
    },
    preparatory: {
      phone: "+255 752 742 422",
      phoneHref: "+255752742422",
      email: "glistenprep641@gmail.com",
      whatsapp: "https://wa.me/255752742422?text=Hello%20Glisten%20Preparatory%2C%20I%20would%20like%20to%20ask%20about%20admission."
    }
  },

  socials: [
    {
      key: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/glisten_primary_school?igsh=MWF5MDg0eTNjajB0dA=="
    },
    {
      key: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61566457286087&mibextid=ZbWKwL"
    },
    {
      key: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@glistenschool-f1w?si=jyb9sXLDuIaitV_a"
    }
  ],

  navigation: [
    { label: "Home", href: "index.html" },
    {
      label: "Our Schools",
      children: [
        {
          label: "Glisten Pre and Primary School",
          description: "Standard One to Standard Seven",
          href: "index.html",
          accent: "blue"
        },
        {
          label: "Glisten Preparatory",
          description: "Baby, Middle and Pre-Unit",
          href: "glisten-preparatory.html",
          accent: "orange"
        }
      ]
    },
    { label: "About Us", href: "about.html" },
    { label: "Academics", href: "academics.html" },
    {
      label: "Results",
      compact: true,
      children: [
        {
          label: "Standard Four Results",
          description: "Official SFNA result links",
          href: "results-standard-four.html",
          accent: "blue"
        },
        {
          label: "Standard Seven Results",
          description: "Official PSLE result links",
          href: "results-standard-seven.html",
          accent: "gold"
        }
      ]
    },
    { label: "Admissions", href: "admissions.html" },
    {
      label: "School Life",
      compact: true,
      children: [
        {
          label: "Photo Gallery",
          description: "Learning, activities and school moments",
          href: "gallery.html",
          accent: "blue"
        },
        {
          label: "Highlights",
          description: "Important visits and memorable events",
          href: "highlights.html",
          accent: "gold"
        },
        {
          label: "Public School Calendar",
          description: "Important dates for parents and pupils",
          href: "calendar.html",
          accent: "gold",
          badge: "New"
        }
      ]
    },
    { label: "Contact Us", href: "contact.html", cta: true }
  ],

  events: [
    {
      id: "uhuru-torch-visit",
      category: "School Highlight",
      title: "Uhuru Torch Visit at Glisten",
      displayDate: "12 July",
      location: "Glisten Pre and Primary School",
      summary: "A memorable school-community moment as the Uhuru Torch reached Glisten Pre and Primary School, bringing pupils, staff, parents, leaders, and visitors together.",
      description: [
        "Glisten Pre and Primary School was honoured to welcome the Uhuru Torch during a joyful gathering involving pupils, members of staff, parents, community members, and visiting leaders.",
        "The visit created a memorable opportunity for our school community to celebrate unity, national pride, service, and the importance of education in building a stronger future."
      ],
      images: [
        {
          src: "assets/images/events/uhuru-torch-01.webp",
          alt: "Uhuru Torch ceremony at Glisten Pre and Primary School",
          caption: "The Uhuru Torch ceremony surrounded by pupils, staff, parents, and visitors at Glisten."
        },
        {
          src: "assets/images/events/uhuru-torch-02.webp",
          alt: "Uhuru Torch held during the Glisten school visit",
          caption: "A memorable moment during the Uhuru Torch visit at Glisten Pre and Primary School."
        },
        {
          src: "assets/images/events/uhuru-torch-03.webp",
          alt: "Uhuru Torch moving through the Glisten school gathering",
          caption: "The Uhuru Torch moving through the school gathering as pupils and visitors look on."
        },
        {
          src: "assets/images/events/uhuru-torch-04.webp",
          alt: "School representative welcoming an Uhuru Torch official at Glisten",
          caption: "A warm welcome and handshake during the Uhuru Torch visit at Glisten."
        },
        {
          src: "assets/images/events/uhuru-torch-05.webp",
          alt: "Glisten school community gathered around the Uhuru Torch",
          caption: "A proud Glisten Schools moment as pupils, staff, and leaders gather around the Uhuru Torch."
        }
      ]
    }
  ]
};
