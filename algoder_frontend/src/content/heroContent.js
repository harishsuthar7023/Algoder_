// src/content/heroContent.js

const heroContent = {
  heading: "Empower Your Trading with ALGODER",
  highlight: "ALGODER",
  subheading:
    "Build, test, and deploy your own algorithmic trading strategies with ease and confidence.",
  buttons: [
    {
      label: "Chat on WhatsApp",
      type: "primary",
      action: () => {
        window.open("https://wa.me/916376076985", "_blank"); // अपना नंबर यहाँ डालें
      },
    },
    {
      label: "About More",
      type: "secondary",
      action: () => {
        window.location.href = "/#/about"; // अपने 'About' पेज की path डालें
      },
    },
  ],
};

export default heroContent;
