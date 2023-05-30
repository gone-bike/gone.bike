/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
  defaultLocale: "en",
  locales: [
      "it", "fr", "es"
  ],
  routes: {
    it: {
      "create-report": "segnala-furto",
      "report": {
        "[id]": "denuncia",
      }
    },
    es: {

      report: "denuncia",
    },
    fr: {
      report: "reportfr"
    }
  },


};
