export const siteConfig = {
  name: "ОЛТУОЛ",
  url: "https://oltuol.by",
  description: "Профессиональные ветеринарные защитные воротники оптом для клиник Беларуси.",
  links: {
    github: "https://github.com/your-repo", // Example link
    telegram: "https://t.me/oltuol",
    viber: "viber://chat?number=%2B375291234567", // Replace with actual number from env var
  },
  contact: {
    phone: "+375 (29) 123-45-67",
    phone_link: "tel:+375291234567", // Replace with actual number from env var
    email: "info@oltuol.by",
    unp: "123456789", // Replace with actual from env var
  }
}

// In a real project, you would use environment variables like this:
/*
export const siteConfig = {
  ...
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    unp: process.env.NEXT_PUBLIC_COMPANY_UNP,
    ...
  }
}

// And in your .env.local file:
// NEXT_PUBLIC_CONTACT_PHONE="+375 (29) 123-45-67"
// NEXT_PUBLIC_CONTACT_EMAIL="info@oltuol.by"
// NEXT_PUBLIC_COMPANY_UNP="123456789"
*/
