let isButtonClicked = false;

async function loadTranslations(language) {
  try {
    const response = await fetch(`translations/${language}.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to load translations (${response.status} ${response.statusText})`
      );
    }
    const translations = await response.json();

    updatePageTitle(language);
    updateMetatags(language);

    Object.entries(translations).forEach(([section, sectionTranslations]) => {
      Object.entries(sectionTranslations).forEach(([key, value]) => {
        document
          .querySelectorAll(`[data-translate="${section}_${key}"]`)
          .forEach((element) => {
            if (isButtonClicked) {
              element.classList.add("fade-out-language");

              setTimeout(() => {
                element.innerHTML = value;
                element.classList.replace(
                  "fade-out-language",
                  "fade-in-language"
                );

                setTimeout(() => {
                  element.classList.remove("fade-in-language");
                }, 500);
              }, 500);
            } else {
              element.innerHTML = value;
            }
          });
      });
    });
    isButtonClicked = false;
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

const languageTitles = {
  es: "Portafolio Profesional de Adrián: Educación, Trayectoria, Habilidades y Más",
  en: "Professional Portfolio of Adrian: Education, Career, Skills, and More",
  jp: "アドリアンのプロフェッショナルポートフォリオ：教育、キャリア、スキル、およびその他",
  zh: "阿德里安的专业作品集：教育、职业生涯、技能及更多",
};

const metatags = {
  description: {
    es: "Visita mi sitio web para conocer mi perfil profesional detallado. Aquí encontrarás información sobre mi formación académica, experiencia laboral, competencias y logros relevantes en diversos ámbitos.",
    en: "Visit my website to explore my detailed professional profile. Here you will find information about my academic background, work experience, skills, and notable achievements across various fields.",
    jp: "私のウェブサイトを訪れて、詳細なプロフェッショナルプロファイルをご覧ください。ここでは、私の学歴、職歴、スキル、そしてさまざまな分野での顕著な業績についての情報が見つかります。",
    zh: "访问我的网站，了解我的详细专业资料。您将在这里找到关于我的学术背景、工作经验、技能以及在各个领域取得的显著成就的信息。",
  },
  keys: {
    es: "Currículum, CV, Física, Programación, adrian, adrianrguez96, Web Personal",
    en: "Resume, CV, Physics, Programming, adrian, adrianrguez96, Personal Website",
    jp: "履歴書, CV, 物理学, プログラミング, アドリアン, adrianrguez96, 個人ウェブサイト",
    zh: "简历, CV, 物理学, 编程, 阿德里安, adrianrguez96, 个人网站",
  },
};

function updatePageTitle(language) {
  document.title = languageTitles[language] || languageTitles.es;
}

function updateMetatags(language) {
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", metatags.description[language]);
  document
    .querySelector('meta[name="keywords"]')
    .setAttribute("content", metatags.keys[language]);
}

async function changeLanguage(language) {
  isButtonClicked = true;
  document.documentElement.lang = language;
  await loadTranslations(language);

  document.querySelectorAll(".language-switcher").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === language);
  });
}

function detectLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  const userLang = navigator.language || navigator.userLanguage;
  const langCode =
    langParam ||
    (userLang.startsWith("en")
      ? "en"
      : userLang.startsWith("ja")
      ? "ja"
      : userLang.startsWith("ko")
      ? "ko"
      : userLang.startsWith("zh")
      ? "zh"
      : "es");
  loadTranslations(langCode);
}

function setProfilePicture(username) {
  const profilePicElement = document.getElementById("profilePic");
  if (profilePicElement) {
    profilePicElement.src = `https://github.com/${username}.png`;
  }
}

function handleHeroAnimation() {
  const h2 = document.querySelector(".hero-content h2");
  const symbols = document.querySelectorAll(
    ".hero-content .symbol-left, .hero-content .symbol-right"
  );
  const animation = "appearFromCenter 3s ease forwards";

  symbols.forEach((symbol) => (symbol.style.opacity = 0));

  h2.addEventListener("animationend", () => {
    symbols.forEach((symbol) => {
      symbol.style.opacity = "";
      symbol.style.animation = animation;
      symbol.addEventListener(
        "animationend",
        () => {
          symbol.style.animation = "";
        },
        { once: true }
      );
    });
  });
}

function enableSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document
        .getElementById(link.getAttribute("href").substring(1))
        ?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function redirectToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

function setupToolButtons() {
  document.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tool-content").forEach((content) => {
        content.style.display = "none";
        content.classList.remove("active");
      });
      const content = document.getElementById(btn.getAttribute("data-target"));
      content.style.display = "block";
      setTimeout(() => content.classList.add("active"), 50);
    });
  });
}

function setupSkillButtons() {
  document.querySelectorAll(".skill-button").forEach((button) => {
    button.addEventListener("click", function () {
      const target = document.querySelector(this.dataset.target);
      document.querySelectorAll(".skill").forEach((skill) => {
        skill.classList.toggle("active", skill === target);
        skill.style.display = skill === target ? "block" : "none";
      });
      document.querySelectorAll(".skill-button").forEach((btn) => {
        btn.classList.toggle("active", btn === this);
      });
    });
  });
}

function setupSwiper() {
  new Swiper(".certification-list", {
    slidesPerView: 1,
    spaceBetween: 12,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function initialize() {
  detectLanguage();
  setProfilePicture("adrianrguez96");
  handleHeroAnimation();
  enableSmoothScrolling();
  setupToolButtons();
  setupSkillButtons();
  setupSwiper();
}

document.addEventListener("DOMContentLoaded", initialize);
