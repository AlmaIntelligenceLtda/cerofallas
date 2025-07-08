import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import check from "@/assets/images/check.png";
import getStarted from "@/assets/images/get-started.png";
import message from "@/assets/images/message.png";
import noResult from "@/assets/images/no-result.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import signUpCar from "@/assets/images/signup-car.png";
import icon from "@/assets/images/icon.png";

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  getStarted,
  signUpCar,
  check,
  noResult,
  message,
  icon,
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
};

export const onboarding = [
  {
    id: 1,
    title: "Bienvenido a Cerofallas",
    description:
      "Hacemos honor a nuestro nombre, nuestra experiencia en el mercado nos posicionan como una empresa solida y de calidad.",
    image: images.onboarding1, // puede ser una grúa o maquinaria industrial
  },
  {
    id: 2,
    title: "Genera reportes útiles",
    description:
      "Completa los reportes antes y después de operar. Estos informes permiten un mejor seguimiento, mantenimiento y diagnóstico en los servicios de electromecánica.",
    image: images.onboarding2, // operario inspeccionando una máquina
  }
];


// constants/driverOnboarding.ts

export const driverOnboarding = [
  {
    id: 1,
    label: "Foto de la licencia de conducir (frente)",
    field: "licenseFront",
    type: "image",
  },
  {
    id: 2,
    label: "Foto de la licencia de conducir (reverso)",
    field: "licenseBack",
    type: "image",
  },
  {
    id: 3,
    label: "Foto de la cédula de identidad (frente)",
    field: "idFront",
    type: "image",
  },
  {
    id: 4,
    label: "Foto de la cédula de identidad (reverso)",
    field: "idBack",
    type: "image",
  },
  {
    id: 5,
    label: "Tipo de maquinaria",
    field: "machineType",
    type: "select",
    options: [
      "Excavadora",
      "Retroexcavadora",
      "Bulldozer",
      "Motoniveladora",
      "Cargador frontal",
      "Mini cargador",
      "Camión articulado",
      "Camión rígido",
      "Rodillo compactador",
      "Pala cargadora",
      "Grúa pluma",
      "Grúa hidráulica",
      "Grúa torre",
      "Grúa telescópica",
      "Plataforma elevadora",
      "Arrastre",
      "Perforadora",
      "Tractor oruga",
      "Barredora vial",
      "Camión aljibe",
      "Manipulador telescópico",
      "Topadora",
      "Fresadora de asfalto",
      "Hormigonera",
      "Cisterna"
    ],
  },
  {
    id: 6,
    label: "Años de experiencia",
    field: "maxLoad",
    placeholder: "Ej. 5 años",
    type: "number",
  },
  {
    id: 7,
    label: "¿Qué maquinarias has operado anteriormente?",
    field: "craneModel",
    placeholder: "Ej. Excavadora, Bulldozer, Grúa pluma...",
    type: "text",
  }
];


export const data = {
  onboarding,
  driverOnboarding,
};
