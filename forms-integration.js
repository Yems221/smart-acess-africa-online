(function () {
  'use strict';

  var WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxtn2AE0cJGDIAjGSZpFK_FIsXpgvhNg3QryMJM1O1ldwB-JWMJ2BYRpqDIfz8thho5pA/exec';
  var starts = {
    booking_popup: Date.now(),
    footer_contact: Date.now()
  };

  function postPayload(payload) {
    var body = new URLSearchParams({
      payload: JSON.stringify(payload)
    }).toString();

    return fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: body,
      keepalive: true
    });
  }

  function basePayload(formType, opts) {
    opts = opts || {};
    return {
      form_type: formType,
      lang: opts.lang || ((document.documentElement.lang || 'fr').toLowerCase().indexOf('en') === 0 ? 'en' : 'fr'),
      submitted_at: new Date().toISOString(),
      page_url: opts.page_url || window.location.href,
      website: opts.website || '',
      form_started_at: Number(opts.form_started_at || starts[formType] || Date.now()),
      contact_email: opts.contact_email || '',
      contact_first_name: opts.contact_first_name || '',
      contact_last_name: opts.contact_last_name || '',
      raw: opts.raw || {}
    };
  }

  window.SAAFormsBridge = {
    markStart: function (formType, atMs) {
      starts[formType] = Number(atMs || Date.now());
    },

    submitBooking: function (raw, meta) {
      meta = meta || {};
      var payload = basePayload('booking_popup', {
        lang: meta.lang,
        page_url: meta.page_url,
        website: meta.website || '',
        form_started_at: meta.form_started_at || starts.booking_popup,
        contact_email: raw.email || '',
        raw: raw
      });
      return postPayload(payload);
    },

    submitFooter: function (raw, meta) {
      meta = meta || {};
      var payload = basePayload('footer_contact', {
        lang: meta.lang,
        page_url: meta.page_url,
        website: meta.website || '',
        form_started_at: meta.form_started_at || starts.footer_contact,
        contact_email: raw.email || '',
        contact_first_name: raw.first_name || '',
        contact_last_name: raw.last_name || '',
        raw: raw
      });
      return postPayload(payload);
    }
  };
})();
