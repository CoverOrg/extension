(function () {
  "use strict";
  if (window.__coverInjected) return;
  window.__coverInjected = true;

  const CSS = `
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #000; z-index: 2147483647; position: static;
      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .cv-fab {
      position: fixed; bottom: 20px; right: 20px;
      width: 42px; height: 42px; background: #000; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 2147483647;
      box-shadow: 0 2px 12px rgba(0,0,0,.28); transition: transform .2s cubic-bezier(.4,0,.2,1), box-shadow .2s cubic-bezier(.4,0,.2,1); border: none;
    }
    .cv-fab:hover { transform: scale(1.1); box-shadow: 0 4px 18px rgba(0,0,0,.32); }
    .cv-fab:active { transform: scale(.92); box-shadow: 0 1px 6px rgba(0,0,0,.2); }
    .cv-fab svg { width: 18px; height: 18px; }

    .cv-panel {
      position: fixed; bottom: 72px; right: 20px;
      width: 340px; max-height: 560px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0,0,0,.14), 0 4px 20px rgba(0,0,0,.1);
      display: none; flex-direction: column; overflow: hidden;
      border: 1px solid rgba(0,0,0,.06);
    }
    .cv-panel.open { display: flex; animation: cvUp .32s cubic-bezier(.16,1,.3,1); }
    @keyframes cvUp { from { opacity: 0; transform: translateY(14px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

    .cv-hdr {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; border-bottom: 1px solid #F0F0F0;
      background: #FAFAFA;
    }
    .cv-hdr-left { display: flex; align-items: center; gap: 8px; }
    .cv-hdr-logo { width: 24px; height: 24px; background: #000; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .cv-hdr-logo svg { width: 12px; height: 12px; }
    .cv-hdr-title { font-size: 13px; font-weight: 700; letter-spacing: -.1px; }
    .cv-hdr-close { width: 26px; height: 26px; border-radius: 6px; border: none; background: none; color: #999; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all .15s cubic-bezier(.4,0,.2,1); }
    .cv-hdr-close:hover { color: #000; background: #F0F0F0; }

    .cv-tabs { display: flex; border-bottom: 1px solid #F0F0F0; background: #FAFAFA; }
    .cv-tab { flex: 1; padding: 10px 0; border: none; background: none; font-size: 10px; font-weight: 600; color: #AAA; cursor: pointer; position: relative; text-align: center; letter-spacing: .3px; transition: color .2s cubic-bezier(.4,0,.2,1); }
    .cv-tab:hover { color: #555; }
    .cv-tab.active { color: #000; }
    .cv-tab.active::after { content: ''; position: absolute; bottom: 0; left: 25%; right: 25%; height: 2px; background: #000; border-radius: 1px; transition: all .25s cubic-bezier(.4,0,.2,1); }

    .cv-body { flex: 1; overflow-y: auto; padding: 18px 16px; scroll-behavior: smooth; }
    .cv-body::-webkit-scrollbar { width: 3px; }
    .cv-body::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 3px; }

    .cv-sec { margin-bottom: 16px; }
    .cv-stitle {
      font-size: 10px; font-weight: 700; color: #999;
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
    }
    .cv-section-heading {
      font-size: 14px; font-weight: 800; color: #000; letter-spacing: -.3px; margin-bottom: 12px;
    }
    .cv-card { background: #FAFAFA; border: 1px solid #F0F0F0; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.03); }
    .cv-card + .cv-card { margin-top: 5px; }
    .cv-div { height: 1px; background: #F0F0F0; margin: 14px 0; }
    .cv-row { display: flex; align-items: center; justify-content: space-between; }
    .cv-row + .cv-row { margin-top: 5px; }
    .cv-lbl { font-size: 11px; color: #999; }
    .cv-val { font-size: 12px; font-weight: 600; color: #000; }

    .cv-btn {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px 16px; border-radius: 10px; border: none; font-size: 12px; font-weight: 600;
      cursor: pointer; width: 100%; font-family: inherit; letter-spacing: .1px; transition: all .2s cubic-bezier(.4,0,.2,1);
    }
    .cv-btn-blk { background: #000; color: #fff; }
    .cv-btn-blk:hover { background: #1a1a1a; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,.18); }
    .cv-btn-blk:active { transform: translateY(0); box-shadow: none; }
    .cv-btn-gry { background: #F5F5F5; color: #000; border: 1px solid #E8E8E8; }
    .cv-btn-gry:hover { background: #EEEEEE; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
    .cv-btn-sm { padding: 6px 12px; font-size: 10px; border-radius: 7px; width: auto; }
    .cv-btn-outline { background: #fff; color: #000; border: 1.5px solid #000; }
    .cv-btn-outline:hover { background: #F5F5F5; }

    .cv-inp, .cv-sel, .cv-txa {
      width: 100%; padding: 9px 12px;
      background: #ffffff !important;
      background-color: #ffffff !important;
      border: 1.5px solid #E8E8E8; border-radius: 8px;
      color: #000000 !important;
      font-size: 12px; outline: none; font-family: inherit; transition: border-color .2s cubic-bezier(.4,0,.2,1), box-shadow .2s cubic-bezier(.4,0,.2,1);
      -webkit-text-fill-color: #000000 !important;
      box-shadow: none !important;
      caret-color: #000000;
    }
    .cv-inp:focus, .cv-sel:focus, .cv-txa:focus {
      border-color: #000;
      background: #ffffff !important;
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
      box-shadow: 0 0 0 3px rgba(0,0,0,.08) !important;
    }
    .cv-inp:not(:placeholder-shown),
    .cv-txa:not(:placeholder-shown) {
      color: #000000 !important;
      -webkit-text-fill-color: #000000 !important;
    }
    .cv-inp::placeholder, .cv-txa::placeholder {
      color: #BBBBBB !important;
      -webkit-text-fill-color: #BBBBBB !important;
      opacity: 1;
    }
    .cv-inp:-webkit-autofill,
    .cv-inp:-webkit-autofill:hover,
    .cv-inp:-webkit-autofill:focus,
    .cv-inp:-webkit-autofill:active,
    .cv-txa:-webkit-autofill,
    .cv-txa:-webkit-autofill:hover,
    .cv-txa:-webkit-autofill:focus,
    .cv-txa:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 100px #ffffff inset !important;
      -webkit-text-fill-color: #000000 !important;
      background-color: #ffffff !important;
      color: #000000 !important;
    }
    .cv-txa { resize: vertical; min-height: 60px; }
    .cv-sel {
      appearance: none; cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") !important;
      background-repeat: no-repeat !important; background-position: right 10px center !important; padding-right: 28px;
    }
    .cv-field { margin-bottom: 10px; }
    .cv-field-lbl { display: block; font-size: 10px; font-weight: 600; color: #888; margin-bottom: 5px; text-transform: uppercase; letter-spacing: .5px; }

    .cv-phone-wrap { display: flex; gap: 6px; align-items: center; }
    .cv-phone-prefix {
      flex-shrink: 0; padding: 9px 10px; background: #F5F5F5;
      border: 1.5px solid #E8E8E8; border-radius: 8px; font-size: 12px;
      font-weight: 600; color: #000; white-space: nowrap;
    }
    .cv-phone-inp { flex: 1; }
    .cv-inp-error { border-color: #D00 !important; }
    .cv-err-msg { font-size: 10px; color: #D00; margin-top: 3px; }

    .cv-status { display: inline-flex; padding: 2px 7px; border-radius: 5px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .3px; }
    .cv-status-created    { background: #F0F0F0; color: #666; }
    .cv-status-paid       { background: #E8E8E8; color: #000; }
    .cv-status-seller_confirmed { background: #000; color: #fff; }
    .cv-status-shipped    { background: #333; color: #fff; }
    .cv-status-delivered  { background: #000; color: #fff; }
    .cv-status-released   { background: #E8E8E8; color: #333; }
    .cv-status-disputed   { background: #1a1a1a; color: #fff; }

    .cv-ordnum {
      font-family: 'SF Mono', 'Roboto Mono', monospace; font-size: 14px; font-weight: 700;
      letter-spacing: 2px; padding: 10px; background: #F9F9F9; border: 1.5px dashed #D8D8D8;
      border-radius: 10px; text-align: center; user-select: all;
    }

    .cv-track { display: flex; flex-direction: column; }
    .cv-step { display: flex; align-items: flex-start; gap: 10px; position: relative; padding-bottom: 14px; }
    .cv-step:last-child { padding-bottom: 0; }
    .cv-step:not(:last-child)::after { content: ''; position: absolute; left: 8px; top: 20px; width: 1.5px; height: calc(100% - 20px); background: #E0E0E0; border-radius: 1px; }
    .cv-step.done:not(:last-child)::after { background: #000; }
    .cv-step-dot { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; flex-shrink: 0; transition: all .2s; }
    .cv-step.done .cv-step-dot { background: #000; color: #fff; }
    .cv-step.active .cv-step-dot { background: #fff; border: 2px solid #000; color: #000; }
    .cv-step.pending .cv-step-dot { background: #F0F0F0; color: #CCC; border: 1px solid #E0E0E0; }
    .cv-step-lbl { font-size: 11px; font-weight: 500; }
    .cv-step.pending .cv-step-lbl { color: #CCC; }
    .cv-step-time { font-size: 9px; color: #BBB; margin-top: 1px; }

    .cv-toasts {
      position: fixed; bottom: 76px; right: 20px; width: 340px;
      display: flex; flex-direction: column-reverse; align-items: center; gap: 6px;
      z-index: 2147483647; pointer-events: none;
    }
    .cv-toast {
      background: #111; color: #fff; border-radius: 20px; padding: 9px 18px;
      font-size: 12px; font-weight: 500; box-shadow: 0 4px 18px rgba(0,0,0,.22);
      animation: cvTIn .28s cubic-bezier(.16,1,.3,1); pointer-events: auto;
      white-space: nowrap; line-height: 1.4;
    }
    .cv-toast.out { animation: cvTOut .2s ease forwards; }
    @keyframes cvTIn { from { opacity:0; transform:translateY(8px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
    @keyframes cvTOut { to { opacity:0; transform:translateY(6px) scale(.96); } }

    .cv-msg { padding: 10px 12px; border-radius: 8px; font-size: 11px; margin-bottom: 10px; line-height: 1.5; }
    .cv-msg-info { background: #F7F7F7; color: #666; border: 1px solid #EBEBEB; }
    .cv-msg-warn { background: #FFF8F0; color: #7A4000; border: 1px solid #FFE4BB; }
    .cv-msg-err  { background: #FFF3F3; color: #660000; border: 1px solid #FFD6D6; }

    .cv-back {
      display: inline-flex; align-items: center; gap: 4px; padding: 5px 0;
      margin-bottom: 12px; border: none; background: none; font-size: 11px;
      font-weight: 600; color: #888; cursor: pointer; transition: color .15s cubic-bezier(.4,0,.2,1);
    }
    .cv-back:hover { color: #000; }
    .cv-back svg { width: 14px; height: 14px; }

    .cv-share { display: flex; align-items: center; gap: 6px; background: #F7F7F7; border-radius: 8px; padding: 7px 10px; margin-top: 8px; }
    .cv-share span { flex: 1; font-size: 10px; color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; letter-spacing: 1px; }
    .cv-share-btn { padding: 5px 10px; border-radius: 6px; border: 1px solid #DDD; background: #fff; font-size: 10px; font-weight: 600; cursor: pointer; transition: all .15s; display: inline-flex; align-items: center; gap: 3px; }
    .cv-share-btn:hover { background: #F0F0F0; }

    .cv-upload {
      border: 1.5px dashed #DDD; border-radius: 9px; padding: 14px;
      text-align: center; cursor: pointer; color: #C0C0C0; font-size: 11px;
      transition: all .2s cubic-bezier(.4,0,.2,1); display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .cv-upload:hover { border-color: #999; color: #777; }
    .cv-upload.has { border-color: #000; color: #000; border-style: solid; }

    .cv-empty { text-align: center; padding: 32px 16px; color: #CCC; font-size: 12px; }

    .cv-ord {
      padding: 11px 12px; border: 1px solid #EFEFEF; border-radius: 10px;
      cursor: pointer; transition: all .2s cubic-bezier(.4,0,.2,1); margin-bottom: 6px; background: #fff;
    }
    .cv-ord:hover { border-color: #000; box-shadow: 0 2px 10px rgba(0,0,0,.08); transform: translateY(-1px); }

    .cv-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .cv-stat { background: #F9F9F9; border: 1px solid #F0F0F0; border-radius: 10px; padding: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,.03); }
    .cv-stat-num { font-size: 17px; font-weight: 800; letter-spacing: -.5px; }
    .cv-stat-lbl { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: .5px; margin-top: 3px; }

    .cv-receipt { border: 1px solid #EFEFEF; border-radius: 12px; padding: 20px; text-align: center; background: #FAFAFA; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
    .cv-receipt-chk { width: 40px; height: 40px; border-radius: 50%; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
    .cv-receipt-title { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
    .cv-receipt-sub { font-size: 11px; color: #888; }

    .cv-tl-item { display: flex; gap: 10px; padding: 7px 0; border-bottom: 1px solid #F5F5F5; }
    .cv-tl-item:last-child { border-bottom: none; }
    .cv-tl-dot { width: 5px; height: 5px; border-radius: 50%; background: #000; flex-shrink: 0; margin-top: 5px; }
    .cv-tl-text { font-size: 11px; color: #666; flex: 1; }
    .cv-tl-time { font-size: 9px; color: #BBB; }

    .cv-otp-inputs { display: flex; gap: 7px; justify-content: center; margin: 16px 0; }
    .cv-otp-inp {
      width: 42px; height: 48px; text-align: center; font-size: 18px; font-weight: 700;
      border: 1.5px solid #E0E0E0; border-radius: 9px; outline: none; font-family: inherit;
      transition: border-color .2s cubic-bezier(.4,0,.2,1), box-shadow .2s cubic-bezier(.4,0,.2,1);
      background: #ffffff !important; background-color: #ffffff !important;
      color: #000 !important; -webkit-text-fill-color: #000 !important;
      box-shadow: none !important;
    }
    .cv-otp-inp:focus { border-color: #000; box-shadow: 0 0 0 3px rgba(0,0,0,.08) !important; }
    .cv-otp-inp:-webkit-autofill,
    .cv-otp-inp:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 100px #ffffff inset !important;
      -webkit-text-fill-color: #000 !important;
    }

    .cv-onboarding { text-align: center; padding-top: 10px; }
    .cv-onboarding-logo { width: 44px; height: 44px; background: #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
    .cv-onboarding-logo svg { width: 22px; height: 22px; }
    .cv-onboarding h2 { font-size: 17px; font-weight: 800; margin-bottom: 5px; letter-spacing: -.4px; }
    .cv-onboarding p { font-size: 12px; color: #888; margin-bottom: 18px; line-height: 1.5; }

    .cv-avatar-wrap { display: flex; justify-content: center; margin-bottom: 18px; }
    .cv-avatar {
      width: 60px; height: 60px; border-radius: 50%; background: #F0F0F0;
      border: 2px dashed #D0D0D0; display: flex; flex-direction: column;
      align-items: center; justify-content: center; cursor: pointer; transition: all .2s cubic-bezier(.4,0,.2,1);
      overflow: hidden; position: relative; gap: 3px;
    }
    .cv-avatar:hover { border-color: #000; }
    .cv-avatar.has { border-style: solid; border-color: #000; }
    .cv-avatar img { width: 100%; height: 100%; object-fit: cover; position: absolute; top:0; left:0; }
    .cv-avatar-lbl { font-size: 9px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: .3px; }

    .cv-kyc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    .cv-kyc-grid .cv-upload { padding: 12px 6px; }

    .cv-breakdown-row { display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0; color: #555; }
    .cv-breakdown-row.total { font-weight: 700; font-size: 13px; color: #000; border-top: 1px solid #EBEBEB; margin-top: 5px; padding-top: 7px; }

    .cv-pay-methods { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
    .cv-pay-pill {
      padding: 5px 10px; border-radius: 20px; border: 1.5px solid #E0E0E0;
      font-size: 10px; font-weight: 600; cursor: pointer; transition: all .2s cubic-bezier(.4,0,.2,1);
      background: #fff; color: #666;
    }
    .cv-pay-pill:hover { border-color: #999; color: #333; }
    .cv-pay-pill.selected { border-color: #000; background: #000; color: #fff; }

    .cv-note { font-size: 10px; color: #999; margin-top: 6px; line-height: 1.5; }

    .cv-pay-step { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F0F0F0; }
    .cv-pay-step:last-child { border-bottom: none; }
    .cv-pay-step-num { width: 22px; height: 22px; border-radius: 50%; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
    .cv-pay-step-text { font-size: 12px; color: #444; flex: 1; line-height: 1.4; }
    .cv-pay-step-text strong { color: #000; }

    .cv-action-row { display: flex; gap: 7px; }
    .cv-action-row .cv-btn { flex: 1; }

    .cv-pm-accordion { display: flex; flex-direction: column; gap: 5px; }
    .cv-pm-row {
      border: 1.5px solid #E8E8E8; border-radius: 9px; overflow: hidden;
      background: #fff; transition: border-color .2s cubic-bezier(.4,0,.2,1);
    }
    .cv-pm-row.open { border-color: #000; }
    .cv-pm-row-hdr {
      display: flex; align-items: center; justify-content: space-between;
      padding: 9px 12px; cursor: pointer; user-select: none;
    }
    .cv-pm-row-hdr:hover { background: #FAFAFA; }
    .cv-pm-row-label { font-size: 12px; font-weight: 600; color: #000; }
    .cv-pm-arrow { font-size: 9px; color: #999; transition: transform .15s; }
    .cv-pm-sub { padding: 0 12px 10px; background: #fff; }

    .cv-ordid-actions { display: flex; gap: 4px; flex-shrink: 0; }
    .cv-ordid-btn {
      position: relative; width: 30px; height: 30px; border-radius: 7px;
      border: 1px solid #E8E8E8; background: #fff; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .15s cubic-bezier(.4,0,.2,1);
    }
    .cv-ordid-btn:hover { background: #F5F5F5; border-color: #999; }
    .cv-ordid-btn-dark { background: #000 !important; border-color: #000 !important; color: #fff !important; }
    .cv-ordid-btn-dark svg { color: #fff; fill: #fff; }
    .cv-ordid-btn-dark:hover { background: #222 !important; border-color: #222 !important; }
    .cv-ordid-icon { display: flex; align-items: center; }
    .cv-ordid-icon svg { width: 14px; height: 14px; }
    .cv-ordid-tip {
      position: absolute; bottom: calc(100% + 5px); left: 50%; transform: translateX(-50%);
      background: #111; color: #fff; font-size: 9px; font-weight: 600; white-space: nowrap;
      padding: 3px 7px; border-radius: 5px; opacity: 0; pointer-events: none; transition: opacity .15s;
    }
    .cv-ordid-tip::after {
      content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
      border: 4px solid transparent; border-top-color: #111;
    }
    .cv-ordid-btn:hover .cv-ordid-tip { opacity: 1; }

    /* Product image preview */
    .cv-prod-img-wrap {
      border-radius: 10px; overflow: hidden; margin-bottom: 10px;
      background: #F5F5F5; position: relative;
    }
    .cv-prod-img-wrap img {
      width: 100%; height: 130px; object-fit: cover; display: block;
    }
    .cv-prod-img-badge {
      position: absolute; bottom: 8px; left: 8px;
      background: rgba(0,0,0,.72); color: #fff; padding: 3px 8px;
      border-radius: 6px; font-size: 10px; font-weight: 600;
      backdrop-filter: blur(4px);
    }
  `;

  const I = {
    shield: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 18c-3.63-.93-6-4.68-6-8.91V6.3l6-2.25 6 2.25v4.79c0 4.23-2.37 7.98-6 8.91zm-1-6.59L8.88 12.3 7.47 13.7 11 17.23l5.53-5.53-1.41-1.41L11 13.41z" fill="currentColor"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/></svg>`,
    store: `<svg viewBox="0 0 24 24" fill="none"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" fill="currentColor"/></svg>`,
    back: `<svg viewBox="0 0 24 24" fill="none"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z" fill="currentColor"/></svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="currentColor"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.66 0-3.2-.5-4.486-1.357l-.32-.191-2.87.852.852-2.87-.191-.32A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="currentColor"/></svg>`,
    add: `<svg viewBox="0 0 24 24" fill="none"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>`,
  };

  const SK = "cover_orders",
    AK = "cover_auth";
  const $ = (id) => shadow.getElementById(id);
  const body = () => $("cv-body");

  const PAY_METHODS = [
    "Easypaisa",
    "JazzCash",
    "Nayapay",
    "SadaPay",
    "Raast",
    "Bank Transfer",
    "Visa",
    "Mastercard",
  ];
  const PAYOUT_METHODS = [
    "Easypaisa",
    "JazzCash",
    "Nayapay",
    "SadaPay",
    "Raast",
    "Bank Transfer",
  ];
  const CITIES = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Gujranwala",
  ];

  function genOrderNum() {
    const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let p1 = "",
      p2 = "";
    for (let i = 0; i < 4; i++) {
      p1 += c[Math.floor(Math.random() * c.length)];
      p2 += c[Math.floor(Math.random() * c.length)];
    }
    return "COV-" + p1 + "-" + p2;
  }
  function loadOrders(cb) {
    chrome.storage.local.get(SK, (r) => cb(r[SK] || []));
  }
  function saveOrders(o, cb) {
    const x = {};
    x[SK] = o;
    chrome.storage.local.set(x, cb);
  }
  function loadAuth(cb) {
    chrome.storage.local.get(AK, (r) => cb(r[AK] || null));
  }
  function saveAuth(a, cb) {
    const x = {};
    x[AK] = a;
    chrome.storage.local.set(x, cb);
  }
  function fmtTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return (
      d.toLocaleDateString("en", { month: "short", day: "numeric" }) +
      " " +
      d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })
    );
  }
  function fmtRel(ts) {
    const diff = Date.now() - ts,
      m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    return Math.floor(h / 24) + "d ago";
  }
  function sLabel(s) {
    return (s || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const STEP_ORDER = [
    "created",
    "paid",
    "seller_confirmed",
    "shipped",
    "delivered",
    "released",
  ];
  const STEP_LABELS = {
    created: "Order Created",
    paid: "Payment Submitted",
    seller_confirmed: "Seller Confirmed",
    shipped: "Shipped",
    delivered: "Delivered & Verified",
    released: "Payment Released",
  };

  let orders = [],
    auth = null,
    activeTab = "home",
    selOrd = null,
    panelOpen = false,
    filter = "all";

  // Build DOM
  const hostEl = document.createElement("div");
  hostEl.id = "cover-host";
  const shadow = hostEl.attachShadow({ mode: "open" });
  document.documentElement.appendChild(hostEl);
  const styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  shadow.appendChild(styleEl);

  const toastBox = document.createElement("div");
  toastBox.className = "cv-toasts";
  shadow.appendChild(toastBox);

  const fab = document.createElement("button");
  fab.className = "cv-fab";
  fab.innerHTML = `<span style="color:#fff;">${I.shield}</span>`;
  shadow.appendChild(fab);

  const panel = document.createElement("div");
  panel.className = "cv-panel";
  panel.innerHTML = `
    <div class="cv-hdr">
      <div class="cv-hdr-left">
        <div class="cv-hdr-logo"><span style="color:#fff;">${I.shield}</span></div>
        <span class="cv-hdr-title">Cover</span>
      </div>
      <button class="cv-hdr-close" id="cv-x">&times;</button>
    </div>
    <div class="cv-tabs" id="cv-tabs">
      <button class="cv-tab active" data-t="home">Home</button>
      <button class="cv-tab" data-t="create">New</button>
      <button class="cv-tab" data-t="orders">Orders</button>
      <button class="cv-tab" data-t="seller">Seller</button>
      <button class="cv-tab" data-t="settings">Settings</button>
    </div>
    <div class="cv-body" id="cv-body"></div>`;
  shadow.appendChild(panel);

  // ── FIX #3: Prevent host page from intercepting keyboard/focus ──
  // Stop keyboard events from leaving shadow DOM
  ["keydown", "keypress", "keyup"].forEach((evt) => {
    panel.addEventListener(evt, (e) => e.stopPropagation());
  });
  // Stop mouse/touch events from propagating to host page
  ["mousedown", "mouseup", "click", "touchstart", "touchend"].forEach((evt) => {
    panel.addEventListener(evt, (e) => e.stopPropagation());
    fab.addEventListener(evt, (e) => e.stopPropagation());
  });
  // Stop focusin from leaving shadow DOM (prevents host page focus-stealing listeners)
  panel.addEventListener("focusin", (e) => e.stopPropagation());
  panel.addEventListener("focusout", (e) => e.stopPropagation());

  // Focus guard: when a shadow input has focus, aggressively prevent host page from stealing it
  let _fg = null;
  function startFocusGuard() {
    if (_fg) return;
    _fg = setInterval(() => {
      if (!panelOpen) {
        clearInterval(_fg);
        _fg = null;
        return;
      }
      if (shadow.activeElement) {
        const ae = document.activeElement;
        if (ae && ae !== hostEl && !hostEl.contains(ae)) {
          ae.blur();
        }
      }
    }, 50);
  }
  function stopFocusGuard() {
    if (_fg) {
      clearInterval(_fg);
      _fg = null;
    }
  }

  // Start guard when a shadow input/textarea/select receives focus
  panel.addEventListener("focusin", (e) => {
    const t = e.target;
    if (
      t &&
      (t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.tagName === "SELECT")
    ) {
      // Blur any focused element in the host page
      const ae = document.activeElement;
      if (ae && ae !== hostEl && !hostEl.contains(ae)) {
        ae.blur();
      }
      startFocusGuard();
    }
  });
  panel.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!shadow.activeElement) stopFocusGuard();
    }, 150);
  });

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "cv-toast";
    t.textContent = msg;
    toastBox.appendChild(t);
    setTimeout(() => {
      t.classList.add("out");
      setTimeout(() => t.remove(), 200);
    }, 3000);
  }

  // Product image helper
  function prodImgHtml(img, price, currency) {
    if (!img) return "";
    const badge = price
      ? `<div class="cv-prod-img-badge">${currency || "PKR"} ${Number(price).toLocaleString()}</div>`
      : "";
    return `<div class="cv-prod-img-wrap"><img src="${img}" />${badge}</div>`;
  }

  let regPhone = "";

  function renderOnboarding() {
    body().innerHTML = `
      <div class="cv-onboarding">
        <div class="cv-onboarding-logo"><span style="color:#fff;">${I.shield}</span></div>
        <h2>Welcome to Cover</h2>
        <p>Secure escrow for every online transaction.</p>
      </div>
      <div class="cv-field">
        <label class="cv-field-lbl">WhatsApp Number</label>
        <div class="cv-phone-wrap">
          <div class="cv-phone-prefix">🇵🇰 +92</div>
          <input class="cv-inp cv-phone-inp" id="ob-phone" placeholder="3001234567" maxlength="10" inputmode="numeric" />
        </div>
        <div class="cv-err-msg" id="ob-phone-err" style="display:none;"></div>
      </div>
      <button class="cv-btn cv-btn-blk" id="ob-send" style="margin-top:6px;">Continue</button>
      <p class="cv-note" style="text-align:center;margin-top:10px;">You'll be registered as a buyer. Sellers can upgrade anytime.</p>`;
    $("ob-phone").oninput = (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
      $("ob-phone-err").style.display = "none";
      e.target.classList.remove("cv-inp-error");
    };
    $("ob-send").onclick = () => {
      const ph = $("ob-phone").value.trim();
      const err = $("ob-phone-err");
      if (!ph) {
        err.textContent = "Enter your number";
        err.style.display = "";
        $("ob-phone").classList.add("cv-inp-error");
        return;
      }
      if (ph.length !== 10) {
        err.textContent = "Must be exactly 10 digits";
        err.style.display = "";
        $("ob-phone").classList.add("cv-inp-error");
        return;
      }
      regPhone = "+92" + ph;
      renderOTP();
    };
  }

  function renderOTP() {
    body().innerHTML = `
      <div class="cv-onboarding">
        <div class="cv-onboarding-logo"><span style="color:#fff;">${I.shield}</span></div>
        <h2>Verify</h2>
        <p>Enter the 4-digit code sent to<br><strong>${regPhone}</strong></p>
        <div class="cv-otp-inputs">
          <input class="cv-otp-inp" maxlength="1" data-idx="0" />
          <input class="cv-otp-inp" maxlength="1" data-idx="1" />
          <input class="cv-otp-inp" maxlength="1" data-idx="2" />
          <input class="cv-otp-inp" maxlength="1" data-idx="3" />
        </div>
      </div>
      <button class="cv-btn cv-btn-blk" id="ob-vrfy">Verify</button>
      <button class="cv-btn cv-btn-gry" style="margin-top:7px;" id="ob-back">← Back</button>`;
    const ins = body().querySelectorAll(".cv-otp-inp");
    ins[0].focus();
    ins.forEach((inp, i) => {
      inp.oninput = (e) => {
        if (e.target.value && i < 3) ins[i + 1].focus();
      };
      inp.onkeydown = (e) => {
        if (e.key === "Backspace" && !e.target.value && i > 0)
          ins[i - 1].focus();
      };
    });
    $("ob-back").onclick = () => renderOnboarding();
    $("ob-vrfy").onclick = () => {
      const code = Array.from(ins)
        .map((i) => i.value)
        .join("");
      if (code.length < 4) {
        toast("Enter 4-digit code");
        return;
      }
      renderBuyerSetup();
    };
  }

  const PM_CONFIG = {
    Easypaisa: {
      label: "Easypaisa",
      fields: [
        {
          id: "pm-mobile",
          label: "Mobile Number",
          placeholder: "03XX-XXXXXXX",
          type: "tel",
        },
      ],
    },
    JazzCash: {
      label: "JazzCash",
      fields: [
        {
          id: "pm-mobile",
          label: "Mobile Number",
          placeholder: "03XX-XXXXXXX",
          type: "tel",
        },
      ],
    },
    Nayapay: {
      label: "Nayapay",
      fields: [
        {
          id: "pm-mobile",
          label: "Mobile Number",
          placeholder: "03XX-XXXXXXX",
          type: "tel",
        },
      ],
    },
    SadaPay: {
      label: "SadaPay",
      fields: [
        {
          id: "pm-mobile",
          label: "Mobile Number",
          placeholder: "03XX-XXXXXXX",
          type: "tel",
        },
      ],
    },
    Raast: {
      label: "Raast",
      fields: [
        {
          id: "pm-iban",
          label: "IBAN / Account Number",
          placeholder: "PK00XXXX0000000000000000",
          type: "text",
        },
      ],
    },
    "Bank Transfer": {
      label: "Bank Transfer",
      fields: [
        {
          id: "pm-iban",
          label: "IBAN",
          placeholder: "PK00XXXX0000000000000000",
          type: "text",
        },
        {
          id: "pm-bank",
          label: "Bank Name",
          placeholder: "e.g. HBL, UBL, MCB",
          type: "text",
        },
      ],
    },
    Visa: {
      label: "Visa / Mastercard",
      fields: [
        {
          id: "pm-cname",
          label: "Name on Card",
          placeholder: "As on card",
          type: "text",
        },
        {
          id: "pm-cnum",
          label: "Card Number",
          placeholder: "XXXX XXXX XXXX XXXX",
          type: "tel",
        },
        { id: "pm-cvv", label: "CVV", placeholder: "XXX", type: "tel" },
      ],
    },
  };
  const PM_KEYS = Object.keys(PM_CONFIG);

  function buildPayMethodAccordion(containerId, selectedKey) {
    const rows = PM_KEYS.map((k) => {
      const cfg = PM_CONFIG[k];
      const isOpen = k === selectedKey;
      const subFields = cfg.fields
        .map(
          (f) =>
            `<div style="margin-top:8px;"><label class="cv-field-lbl">${f.label}</label><input class="cv-inp" id="${containerId}-${f.id}" type="${f.type}" placeholder="${f.placeholder}" style="background:#fff;" /></div>`,
        )
        .join("");
      return `<div class="cv-pm-row${isOpen ? " open" : ""}" data-pmk="${k}" id="${containerId}-row-${k.replace(/\s/g, "_")}"><div class="cv-pm-row-hdr"><span class="cv-pm-row-label">${cfg.label}</span><span class="cv-pm-arrow">${isOpen ? "▲" : "▼"}</span></div><div class="cv-pm-sub" style="display:${isOpen ? "block" : "none"};">${subFields}</div></div>`;
    }).join("");
    return `<div class="cv-pm-accordion" id="${containerId}-accordion">${rows}</div>`;
  }
  function wirePayMethodAccordion(containerId, onSelect) {
    const accordion = shadow.getElementById(containerId + "-accordion");
    if (!accordion) return;
    accordion.querySelectorAll(".cv-pm-row").forEach((row) => {
      const hdr = row.querySelector(".cv-pm-row-hdr");
      hdr.onclick = () => {
        const k = row.dataset.pmk;
        const isNowOpen = !row.classList.contains("open");
        accordion.querySelectorAll(".cv-pm-row").forEach((r) => {
          r.classList.remove("open");
          r.querySelector(".cv-pm-sub").style.display = "none";
          r.querySelector(".cv-pm-arrow").textContent = "▼";
        });
        if (isNowOpen) {
          row.classList.add("open");
          row.querySelector(".cv-pm-sub").style.display = "block";
          row.querySelector(".cv-pm-arrow").textContent = "▲";
          if (onSelect) onSelect(k);
        } else {
          if (onSelect) onSelect(null);
        }
      };
    });
  }
  function getPayMethodValues(containerId) {
    const accordion = shadow.getElementById(containerId + "-accordion");
    if (!accordion) return {};
    const openRow = accordion.querySelector(".cv-pm-row.open");
    if (!openRow) return {};
    const k = openRow.dataset.pmk;
    const cfg = PM_CONFIG[k];
    const vals = { method: k };
    cfg.fields.forEach((f) => {
      const el = shadow.getElementById(containerId + "-" + f.id);
      if (el) vals[f.id] = el.value.trim();
    });
    return vals;
  }

  function renderBuyerSetup() {
    const cityOpts = CITIES.map((c) => `<option>${c}</option>`).join("");
    const accordionHtml = buildPayMethodAccordion("bs-pm", "Easypaisa");
    body().innerHTML = `
      <button class="cv-back" id="bs-back">${I.back} Back</button>
      <div style="font-size:15px;font-weight:800;margin-bottom:16px;letter-spacing:-.3px;">Your Profile</div>
      <div class="cv-avatar-wrap"><div class="cv-avatar" id="bs-avatar"><span style="color:#C0C0C0;">${I.camera}</span><span class="cv-avatar-lbl">Photo</span></div><input type="file" id="bs-avatar-file" accept="image/*" style="display:none"/></div>
      <div class="cv-field"><label class="cv-field-lbl">Full Name</label><input class="cv-inp" id="bs-name" placeholder="Your full name" style="background:#fff;" /></div>
      <div class="cv-field"><label class="cv-field-lbl">City</label><select class="cv-sel" id="bs-city" style="background:#fff;"><option value="">Select city</option>${cityOpts}</select></div>
      <div class="cv-field"><label class="cv-field-lbl">Default Payment Method</label><div style="font-size:10px;color:#999;margin-bottom:8px;">Select a method and enter your details. Saved securely for fast checkout.</div>${accordionHtml}</div>
      <button class="cv-btn cv-btn-blk" id="bs-save" style="margin-top:12px;">Create Account</button>`;
    $("bs-back").onclick = () => renderOTP();
    $("bs-avatar").onclick = () => $("bs-avatar-file").click();
    $("bs-avatar-file").onchange = (e) => {
      if (e.target.files.length) {
        const url = URL.createObjectURL(e.target.files[0]);
        $("bs-avatar").innerHTML = `<img src="${url}" />`;
        $("bs-avatar").classList.add("has");
      }
    };
    let selBsMethod = "Easypaisa";
    wirePayMethodAccordion("bs-pm", (k) => {
      if (k) selBsMethod = k;
    });
    const epRow = shadow.getElementById("bs-pm-row-Easypaisa");
    if (epRow) {
      epRow.classList.add("open");
      epRow.querySelector(".cv-pm-sub").style.display = "block";
    }
    $("bs-save").onclick = () => {
      const name = $("bs-name").value.trim();
      if (!name) {
        toast("Enter your name");
        return;
      }
      const pmVals = getPayMethodValues("bs-pm");
      if (!pmVals.method) {
        toast("Select a payment method");
        return;
      }
      const accountVal =
        pmVals["pm-mobile"] || pmVals["pm-iban"] || pmVals["pm-cnum"] || "";
      const a = {
        role: "buyer",
        phone: regPhone,
        name,
        city: $("bs-city").value,
        paymentMethod: pmVals.method,
        paymentAccount: accountVal,
        paymentDetails: pmVals,
        verified: true,
      };
      saveAuth(a, () => {
        auth = a;
        toast("Welcome to Cover");
        activeTab = "home";
        updateTabs();
        renderHome();
      });
    };
  }

  function renderSellerKYC(fromSettings) {
    const cityOpts = CITIES.map((c) => `<option>${c}</option>`).join("");
    const payoutPillsHtml = PAYOUT_METHODS.map(
      (m) => `<button class="cv-pay-pill" data-v="${m}">${m}</button>`,
    ).join("");
    let selPayout = "Easypaisa";
    body().innerHTML = `
      <button class="cv-back" id="sk-back">${I.back} Back</button>
      <div style="font-size:15px;font-weight:800;margin-bottom:16px;letter-spacing:-.3px;">Seller Verification</div>
      <div class="cv-field"><label class="cv-field-lbl">Full Name (as on CNIC)</label><input class="cv-inp" id="sk-name" placeholder="Full legal name" value="${auth ? auth.name : ""}" /></div>
      <div class="cv-field"><label class="cv-field-lbl">CNIC Number</label><input class="cv-inp" id="sk-cnic" placeholder="XXXXX-XXXXXXX-X" /></div>
      <div class="cv-field"><label class="cv-field-lbl">City</label><select class="cv-sel" id="sk-city"><option value="">Select city</option>${cityOpts}</select></div>
      <div class="cv-stitle" style="margin-top:4px;">CNIC Images</div>
      <div class="cv-kyc-grid"><div class="cv-upload" id="sk-front"><span style="color:#C0C0C0;">${I.camera}</span><span>Front</span></div><div class="cv-upload" id="sk-back-img"><span style="color:#C0C0C0;">${I.camera}</span><span>Back</span></div></div>
      <input type="file" id="sk-f-file" style="display:none" /><input type="file" id="sk-b-file" style="display:none" />
      <div class="cv-field" style="margin-top:10px;"><label class="cv-field-lbl">Verification Video (Selfie holding CNIC)</label><div class="cv-upload" id="sk-video"><span style="color:#C0C0C0;">${I.video}</span><span>Upload Video</span></div><input type="file" id="sk-v-file" accept="video/*" style="display:none" /></div>
           <div class="cv-div"></div>
           <div style="font-size:13px;font-weight:800;margin-bottom:12px;">Payout Details</div>
           <div class="cv-field"><label class="cv-field-lbl">Payout Method</label><div class="cv-pay-methods" id="sk-payout-pills">${payoutPillsHtml}</div></div>
           <div class="cv-field"><label class="cv-field-lbl">Account / IBAN / Phone</label><input class="cv-inp" id="sk-acc" placeholder="Your payout account" /></div>
           <div class="cv-field"><label class="cv-field-lbl">Account Holder Name</label><input class="cv-inp" id="sk-hname" placeholder="Name on account" /></div>
           <button class="cv-btn cv-btn-blk" id="sk-save">${fromSettings ? "Become a Seller" : "Register & Continue"}</button>`;

    $("sk-back").onclick = () =>
      fromSettings ? renderSettings() : renderOnboarding();
    $("sk-front").onclick = () => $("sk-f-file").click();
    $("sk-back-img").onclick = () => $("sk-b-file").click();
    $("sk-video").onclick = () => $("sk-v-file").click();
    $("sk-f-file").onchange = (e) => {
      if (e.target.files.length) {
        $("sk-front").innerHTML =
          `<span style="color:#000;">${I.check}</span><span>Front ✓</span>`;
        $("sk-front").classList.add("has");
      }
    };
    $("sk-b-file").onchange = (e) => {
      if (e.target.files.length) {
        $("sk-back-img").innerHTML =
          `<span style="color:#000;">${I.check}</span><span>Back ✓</span>`;
        $("sk-back-img").classList.add("has");
      }
    };
    $("sk-v-file").onchange = (e) => {
      if (e.target.files.length) {
        $("sk-video").innerHTML =
          `<span style="color:#000;">${I.check}</span><span>Video ✓</span>`;
        $("sk-video").classList.add("has");
      }
    };

    body()
      .querySelectorAll("#sk-payout-pills .cv-pay-pill")
      .forEach((p) => {
        p.onclick = () => {
          selPayout = p.dataset.v;
          body()
            .querySelectorAll("#sk-payout-pills .cv-pay-pill")
            .forEach((x) =>
              x.classList.toggle("selected", x.dataset.v === selPayout),
            );
        };
      });

    $("sk-save").onclick = () => {
      const name = $("sk-name").value.trim(),
        cnic = $("sk-cnic").value.trim();
      if (!name || !cnic) {
        toast("Fill name and CNIC");
        return;
      }
      if (fromSettings && auth) {
        auth.role = "seller";
        auth.cnic = cnic;
        auth.name = name;
        auth.city = $("sk-city").value;
        auth.payoutMethod = selPayout;
        auth.payoutAccount = $("sk-acc").value.trim();
        auth.payoutName = $("sk-hname").value.trim();
        auth.verified = true;
        saveAuth(auth, () => {
          toast("Seller account activated");
          renderSettings();
        });
      } else {
        const a = {
          role: "seller",
          phone: regPhone,
          name,
          cnic,
          city: $("sk-city").value,
          payoutMethod: selPayout,
          payoutAccount: $("sk-acc").value.trim(),
          payoutName: $("sk-hname").value.trim(),
          verified: true,
        };
        saveAuth(a, () => {
          auth = a;
          toast("Seller registered");
          activeTab = "home";
          updateTabs();
          renderHome();
        });
      }
    };
  }

  // ── HOME ──
  function renderHome() {
    loadOrders((ex) => {
      orders = ex;
      if (!auth) {
        renderOnboarding();
        return;
      }
      const active = orders.filter(
        (o) => !["released", "disputed"].includes(o.status),
      );
      const completed = orders.filter((o) => o.status === "released");
      const totalProtected = completed.reduce((s, o) => s + o.total, 0);
      const recent = orders.slice(0, 3);
      const initial = (auth.name || "U").charAt(0).toUpperCase();

      let recentHtml = recent.length
        ? recent
            .map(
              (o) => `
                 <div class="cv-ord" data-oid="${o.id}">
                   <div class="cv-row">
                     <span class="cv-val" style="font-size:11px;">${o.product.name}</span>
                     <span class="cv-val" style="font-size:11px;">${o.currency} ${o.total.toLocaleString()}</span>
                   </div>
                   <div class="cv-row" style="margin-top:3px;">
                     <span class="cv-lbl" style="font-family:monospace;font-size:9px;">${o.id}</span>
                     <span class="cv-status cv-status-${o.status}">${sLabel(o.status)}</span>
                   </div>
                 </div>`,
            )
            .join("")
        : '<div class="cv-empty">No orders yet</div>';

      body().innerHTML = `
             <div class="cv-sec" style="display:flex;align-items:center;gap:10px;">
               <div style="width:38px;height:38px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0;">${initial}</div>
               <div style="flex:1;">
                 <div style="font-size:13px;font-weight:700;">${auth.name}</div>
                 <div style="font-size:10px;color:#999;">${auth.role === "seller" ? "Verified Seller" : "Buyer"} · ${auth.phone}</div>
               </div>
             </div>
             <div class="cv-div"></div>
             <div class="cv-sec">
               <div class="cv-stats">
                 <div class="cv-stat"><div class="cv-stat-num">${active.length}</div><div class="cv-stat-lbl">Active</div></div>
                 <div class="cv-stat"><div class="cv-stat-num">${completed.length}</div><div class="cv-stat-lbl">Done</div></div>
                 <div class="cv-stat"><div class="cv-stat-num">${totalProtected > 0 ? "₨" + (totalProtected / 1000).toFixed(0) + "k" : "0"}</div><div class="cv-stat-lbl">Protected</div></div>
               </div>
             </div>
             <div class="cv-div"></div>
             <div class="cv-sec">
               <div class="cv-stitle">Recent Orders</div>
               ${recentHtml}
             </div>`;

      body()
        .querySelectorAll(".cv-ord")
        .forEach((el) => {
          el.onclick = () => {
            selOrd = orders.find((x) => x.id === el.dataset.oid);
            if (selOrd) renderDetail();
          };
        });
    });
  }

  // ── CREATE ORDER ──
  function renderCreate() {
    if (!auth) {
      renderOnboarding();
      return;
    }
    body().innerHTML = `
           <div class="cv-section-heading">New Order</div>
           <div class="cv-stitle">Product Details</div>
           <div class="cv-field"><label class="cv-field-lbl">Product / Service Name</label><input class="cv-inp" id="c-prod" placeholder="e.g. iPhone 15 Pro" /></div>
           <div class="cv-field"><label class="cv-field-lbl">Product Link (URL)</label><input class="cv-inp" id="c-link" placeholder="https://..." /></div>
           <div class="cv-field">
             <label class="cv-field-lbl">Product Image</label>
             <div class="cv-upload" id="c-img-drop" style="flex-direction:row;gap:10px;padding:10px 12px;">
               <span style="color:#C0C0C0;" id="c-img-icon">${I.camera}</span>
               <span id="c-img-lbl" style="font-size:11px;">Tap to upload product photo</span>
             </div>
             <input type="file" id="c-img-file" accept="image/*" style="display:none"/>
           </div>
           <div class="cv-field"><label class="cv-field-lbl">Product Amount (PKR)</label><input class="cv-inp" id="c-amt" type="number" placeholder="0" /></div>
           <div class="cv-field"><label class="cv-field-lbl">Delivery Charges (PKR)</label><input class="cv-inp" id="c-del" type="number" placeholder="0" /></div>
           <div class="cv-card" style="margin-bottom:14px;">
             <div class="cv-breakdown-row"><span>Product</span><span id="c-bp">PKR 0.00</span></div>
             <div class="cv-breakdown-row"><span>Delivery</span><span id="c-bd">PKR 0.00</span></div>
             <div class="cv-breakdown-row"><span>Cover Fee (5%)</span><span id="c-bf">PKR 0.00</span></div>
             <div class="cv-breakdown-row total"><span>Total</span><span id="c-bt">PKR 0.00</span></div>
           </div>
           <div class="cv-div"></div>
           <div class="cv-section-heading">Seller Details</div>
           <div class="cv-field"><label class="cv-field-lbl">Seller Name</label><input class="cv-inp" id="c-sn" placeholder="Full name or shop" /></div>
           <div class="cv-field"><label class="cv-field-lbl">Seller WhatsApp</label><input class="cv-inp" id="c-sw" placeholder="+92 300 1234567" /></div>
           <button class="cv-btn cv-btn-blk" id="c-go" style="margin-top:4px;">Create Order</button>`;

    let productImgData = null;
    $("c-img-drop").onclick = () => $("c-img-file").click();
    $("c-img-file").onchange = (e) => {
      if (e.target.files.length) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
          productImgData = ev.target.result;
          $("c-img-lbl").textContent = file.name;
          $("c-img-icon").style.color = "#000";
          $("c-img-drop").classList.add("has");
        };
        reader.readAsDataURL(file);
      }
    };

    const calc = () => {
      const a = parseFloat($("c-amt").value) || 0;
      const d = parseFloat($("c-del").value) || 0;
      const fee = Math.ceil((a + d) * 0.05 * 100) / 100;
      $("c-bp").textContent = "PKR " + a.toFixed(2);
      $("c-bd").textContent = "PKR " + d.toFixed(2);
      $("c-bf").textContent = "PKR " + fee.toFixed(2);
      $("c-bt").textContent = "PKR " + (a + d + fee).toFixed(2);
    };
    $("c-amt").oninput = calc;
    $("c-del").oninput = calc;

    $("c-go").onclick = () => {
      const prod = $("c-prod").value.trim(),
        link = $("c-link").value.trim(),
        img = productImgData || null;
      const amt = parseFloat($("c-amt").value),
        del = parseFloat($("c-del").value) || 0;
      const sn = $("c-sn").value.trim(),
        sw = $("c-sw").value.trim();
      if (!prod || !amt || !sn) {
        toast("Fill required fields");
        return;
      }
      const id = genOrderNum();
      const fee = Math.ceil((amt + del) * 0.05 * 100) / 100;
      const total = amt + del + fee;
      const sellerPayout = amt + del;
      const o = {
        id,
        product: { name: prod, link, img },
        amount: amt,
        delivery: del,
        coverFee: fee,
        total,
        sellerPayout,
        currency: "PKR",
        seller: { name: sn, whatsapp: sw },
        buyer: null,
        sellerDelivery: null,
        status: "created",
        timeline: [
          { status: "created", time: Date.now(), note: "Order created" },
        ],
        createdAt: Date.now(),
        dispute: null,
      };
      loadOrders((ex) => {
        ex.unshift(o);
        saveOrders(ex, () => {
          selOrd = o;
          toast("Order created");
          renderDetail();
        });
      });
    };
  }

  // ── ORDER DETAIL ──
  function renderDetail() {
    const o = selOrd;
    if (!o) return;
    const ci = STEP_ORDER.indexOf(o.status);
    const steps = STEP_ORDER.map((s, i) => {
      const cls = i <= ci ? (i === ci ? "active" : "done") : "pending";
      const dot = i < ci ? I.check : i + 1;
      const tl = o.timeline.find((t) => t.status === s);
      return `<div class="cv-step ${cls}"><div class="cv-step-dot">${dot}</div><div><div class="cv-step-lbl">${STEP_LABELS[s]}</div>${tl ? `<div class="cv-step-time">${fmtTime(tl.time)}</div>` : ""}</div></div>`;
    }).join("");

    let actHtml = "";
    if (o.status === "created") {
      actHtml = `<div class="cv-msg cv-msg-info">Submit payment to proceed. The seller will confirm your order after verification.</div><button class="cv-btn cv-btn-blk" id="od-pay">Proceed to Payment</button>`;
    } else if (o.status === "paid") {
      actHtml = `<div class="cv-msg cv-msg-info">Payment submitted. Awaiting seller confirmation...</div>`;
    } else if (o.status === "seller_confirmed") {
      actHtml = `<div class="cv-msg cv-msg-info">Seller accepted the order. Waiting for shipment...</div>`;
    } else if (o.status === "shipped") {
      actHtml = `<div class="cv-msg cv-msg-info">Your item has been shipped. Confirm once received.</div><div class="cv-action-row"><button class="cv-btn cv-btn-blk" id="od-deliver">Confirm Delivery</button><button class="cv-btn cv-btn-gry" id="od-dis1">Dispute</button></div>`;
    } else if (o.status === "delivered") {
      actHtml = `<div class="cv-msg cv-msg-info">Delivery confirmed. Payment is being released to the seller.</div>`;
    } else if (o.status === "released") {
      actHtml = `<div class="cv-receipt"><div class="cv-receipt-chk">${I.check}</div><div class="cv-receipt-title">Complete</div><div class="cv-receipt-sub">PKR ${o.sellerPayout.toLocaleString()} released to seller</div></div>`;
    } else if (o.status === "disputed") {
      actHtml = `<div class="cv-msg cv-msg-err">Dispute in progress. Cover team is reviewing.</div>`;
    }

    const showOrderId = o.status !== "created";

    const buyerHtml = o.buyer
      ? `<div class="cv-div"></div><div class="cv-stitle">Payment Proof</div><div class="cv-card">
               <div class="cv-row"><span class="cv-lbl">Method</span><span class="cv-val">${o.buyer.paymentMethod}</span></div>
               <div class="cv-row"><span class="cv-lbl">Tx ID</span><span class="cv-val" style="font-family:monospace;font-size:10px;">${o.buyer.transactionId}</span></div>
               <div class="cv-row"><span class="cv-lbl">Name</span><span class="cv-val">${o.buyer.name}</span></div>
              </div>`
      : "";
    const delivHtml = o.sellerDelivery
      ? `<div class="cv-div"></div><div class="cv-stitle">Delivery</div><div class="cv-card">
               <div class="cv-row"><span class="cv-lbl">Tracking</span><span class="cv-val" style="font-family:monospace;font-size:10px;">${o.sellerDelivery.trackingId}</span></div>
               <div class="cv-row"><span class="cv-lbl">Courier</span><span class="cv-val">${o.sellerDelivery.courier}</span></div>
              </div>`
      : "";
    const tlHtml = o.timeline
      .map(
        (t) =>
          `<div class="cv-tl-item"><span class="cv-tl-dot"></span><div class="cv-tl-text">${t.note || sLabel(t.status)}</div><div class="cv-tl-time">${fmtTime(t.time)}</div></div>`,
      )
      .join("");

    const disputeBtn = ["paid", "seller_confirmed"].includes(o.status)
      ? `<div class="cv-div"></div><button class="cv-btn cv-btn-gry" id="od-dis2">Raise Dispute</button>`
      : "";

    body().innerHTML = `
           <button class="cv-back" id="od-back">${I.back} Back</button>
           ${showOrderId ? `<div class="cv-sec"><div class="cv-ordnum">${o.id}</div></div>` : ""}
           <div class="cv-sec">
             ${prodImgHtml(o.product.img, o.amount, o.currency)}
             <div style="font-size:13px;font-weight:700;margin-bottom:6px;">${o.product.name}</div>
             <div class="cv-card">
               <div class="cv-breakdown-row"><span>Product</span><span>PKR ${o.amount.toFixed(2)}</span></div>
               <div class="cv-breakdown-row"><span>Delivery</span><span>PKR ${o.delivery.toFixed(2)}</span></div>
               <div class="cv-breakdown-row"><span>Cover Fee</span><span>PKR ${o.coverFee.toFixed(2)}</span></div>
               <div class="cv-breakdown-row total"><span>Total</span><span>PKR ${o.total.toFixed(2)}</span></div>
             </div>
             <div style="font-size:10px;color:#999;margin-top:5px;">Seller: ${o.seller.name} · <span class="cv-status cv-status-${o.status}">${sLabel(o.status)}</span></div>
           </div>
           ${buyerHtml}${delivHtml}
           <div class="cv-div"></div>
           <div class="cv-stitle">Progress</div>
           <div class="cv-track">${steps}</div>
           <div class="cv-div"></div>
           <div class="cv-stitle">Activity</div>
           ${tlHtml}
           ${disputeBtn}
           <div class="cv-div"></div>
           ${actHtml}`;

    $("od-back").onclick = () => {
      selOrd = null;
      activeTab = "orders";
      updateTabs();
      renderOrders();
    };
    $("od-pay")?.addEventListener("click", () => renderPaymentPage(o));
    $("od-deliver")?.addEventListener("click", () => renderDeliveryConfirm(o));
    $("od-dis1")?.addEventListener("click", () => renderDispute(o));
    $("od-dis2")?.addEventListener("click", () => renderDispute(o));
  }

  // ── PAYMENT PAGE ──
  let checkoutMethod = null;

  function renderPaymentPage(o) {
    const savedMethod = auth?.paymentMethod || "your saved method";
    const savedAccount = auth?.paymentAccount || "";
    body().innerHTML = `
           <button class="cv-back" id="pp-back">${I.back} Back</button>
           <div style="font-size:15px;font-weight:800;margin-bottom:2px;">Submit Payment Proof</div>
           <div style="font-size:11px;color:#888;margin-bottom:14px;">Funds held by Cover until you confirm delivery.</div>
           <div class="cv-card" style="margin-bottom:12px;">
             <div class="cv-breakdown-row"><span>Product + Delivery</span><span>PKR ${o.sellerPayout.toFixed(2)}</span></div>
             <div class="cv-breakdown-row"><span>Cover Escrow Fee (5%)</span><span>PKR ${o.coverFee.toFixed(2)}</span></div>
             <div class="cv-breakdown-row total"><span>Total to Pay</span><span>PKR ${o.total.toFixed(2)}</span></div>
           </div>
           <div class="cv-card" style="margin-bottom:12px;">
             <div class="cv-stitle">Your Saved Method</div>
             <div class="cv-row"><span class="cv-lbl">Method</span><span class="cv-val">${savedMethod}</span></div>
             ${savedAccount ? `<div class="cv-row"><span class="cv-lbl">Account</span><span class="cv-val" style="font-family:monospace;">${savedAccount}</span></div>` : ""}
             <div style="margin-top:8px;font-size:10px;color:#999;">Send <strong>PKR ${o.total.toFixed(2)}</strong> to Cover's escrow account using ${savedMethod}, then upload your screenshot below.</div>
           </div>
           <div class="cv-field"><label class="cv-field-lbl">Transaction / Reference ID</label><input class="cv-inp" id="pf-tx" placeholder="e.g. TXN-123456789" style="background:#fff;" /></div>
           <div class="cv-field"><label class="cv-field-lbl">Payment Screenshot</label>
             <div class="cv-upload" id="pf-img-drop" style="flex-direction:row;gap:10px;padding:10px 12px;">
               <span style="color:#C0C0C0;" id="pf-img-icon">${I.camera}</span>
               <span id="pf-img-lbl" style="font-size:11px;">Attach payment screenshot</span>
             </div>
             <input type="file" id="pf-img-file" accept="image/*" style="display:none"/>
           </div>
           <div class="cv-field"><label class="cv-field-lbl">Delivery Address</label><textarea class="cv-txa" id="pf-addr" placeholder="Full delivery address" style="background:#fff;">${auth?.address || ""}</textarea></div>
           <div class="cv-msg cv-msg-warn">🔒 Only pay via your <strong>${savedMethod}</strong> account. Never pay to an unknown account.</div>
           <button class="cv-btn cv-btn-blk" id="pf-go" style="margin-top:10px;">Confirm — I've Paid</button>`;

    $("pp-back").onclick = () => renderDetail();
    $("pf-img-drop").onclick = () => $("pf-img-file").click();
    $("pf-img-file").onchange = (e) => {
      if (e.target.files.length) {
        $("pf-img-lbl").textContent = e.target.files[0].name + " ✓";
        $("pf-img-icon").style.color = "#000";
        $("pf-img-drop").classList.add("has");
      }
    };
    $("pf-go").onclick = () => {
      const tx = $("pf-tx").value.trim();
      if (!tx) {
        toast("Enter transaction ID");
        return;
      }
      o.buyer = {
        paymentMethod: savedMethod,
        transactionId: tx,
        name: auth?.name || "",
        phone: auth?.phone || "",
        address: $("pf-addr").value.trim(),
      };
      o.status = "paid";
      o.timeline.push({
        status: "paid",
        time: Date.now(),
        note: "Payment via " + savedMethod + " (Ref: " + tx + ")",
      });
      loadOrders((ex) => {
        const i = ex.findIndex((x) => x.id === o.id);
        if (i >= 0) ex[i] = o;
        saveOrders(ex, () => {
          toast("Payment submitted!");
          renderPaymentSuccess(o);
        });
      });
    };
  }

  function renderPaymentSuccess(o) {
    const waMsg = encodeURIComponent(
      "Cover Order: " +
        o.id +
        "\nProduct: " +
        o.product.name +
        "\nSeller Receives: PKR " +
        o.sellerPayout.toFixed(2) +
        "\n\nOpen Cover → Seller tab → enter order number to confirm.",
    );
    const waNum = o.seller.whatsapp
      ? o.seller.whatsapp.replace(/[^0-9]/g, "")
      : "";

    body().innerHTML = `
           <div style="text-align:center;padding:10px 0 16px;">
             <div style="width:44px;height:44px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">${I.check}</div>
             <div style="font-size:15px;font-weight:800;">Payment Submitted</div>
             <div style="font-size:11px;color:#888;margin-top:4px;">Share your order ID with the seller to begin verification.</div>
           </div>
           <div class="cv-card" style="margin-bottom:12px;">
             <div class="cv-stitle">Order ID — share with seller</div>
             <div style="display:flex;align-items:center;gap:8px;">
               <div class="cv-ordnum" style="flex:1;margin:0;font-size:12px;letter-spacing:1.5px;">${o.id}</div>
               <div class="cv-ordid-actions">
                 <button class="cv-ordid-btn cv-ordid-btn-dark" id="ps-cp"><span class="cv-ordid-icon">${I.copy}</span><span class="cv-ordid-tip">Copy</span></button>
                 <button class="cv-ordid-btn cv-ordid-btn-dark" id="ps-wa"><span class="cv-ordid-icon">${I.whatsapp}</span><span class="cv-ordid-tip">Share</span></button>
               </div>
             </div>
             <p class="cv-note" style="margin-top:6px;">Send this to <strong>${o.seller.name}</strong> so they can look up your order in the Seller tab.</p>
           </div>
           <div class="cv-card" style="margin-bottom:14px;">
             <div class="cv-breakdown-row"><span>Product + Delivery</span><span>PKR ${o.sellerPayout.toFixed(2)}</span></div>
             <div class="cv-breakdown-row"><span>Cover Fee (5%)</span><span>PKR ${o.coverFee.toFixed(2)}</span></div>
             <div class="cv-breakdown-row total"><span>Total You Paid</span><span>PKR ${o.total.toFixed(2)}</span></div>
           </div>
           <button class="cv-btn cv-btn-blk" id="ps-orders">View in Orders</button>`;

    $("ps-cp").onclick = () =>
      navigator.clipboard.writeText(o.id).then(() => toast("Order ID copied"));
    $("ps-wa").onclick = () => {
      if (waNum) {
        window.open("https://wa.me/" + waNum + "?text=" + waMsg, "_blank");
      } else {
        navigator.clipboard
          .writeText(o.id + " — " + o.product.name)
          .then(() => toast("Order details copied"));
      }
    };
    $("ps-orders").onclick = () => {
      selOrd = o;
      activeTab = "orders";
      updateTabs();
      renderOrders();
    };
  }

  function renderDeliveryConfirm(o) {
    body().innerHTML = `
           <button class="cv-back" id="dc-back">${I.back} Back</button>
           <div style="font-size:15px;font-weight:800;margin-bottom:6px;">Confirm Delivery</div>
           <div class="cv-msg cv-msg-info">Confirm you received: <strong>${o.product.name}</strong></div>
           <div class="cv-field"><label class="cv-field-lbl">Unboxing / Delivery Video (recommended)</label><div class="cv-upload" id="dc-vid"><span style="color:#C0C0C0;">${I.video}</span><span>Upload Video</span></div><input type="file" id="dc-vfile" accept="video/*" style="display:none" /></div>
           <div class="cv-field"><label class="cv-field-lbl">Notes (optional)</label><textarea class="cv-txa" id="dc-notes" placeholder="Any notes about the delivery..."></textarea></div>
           <button class="cv-btn cv-btn-blk" id="dc-go">Confirm — Item Received</button>`;

    $("dc-vid").onclick = () => $("dc-vfile").click();
    $("dc-vfile").onchange = (e) => {
      if (e.target.files.length) {
        $("dc-vid").innerHTML =
          `<span style="color:#000;">${I.check}</span><span>Video ✓</span>`;
        $("dc-vid").classList.add("has");
      }
    };
    $("dc-back").onclick = () => renderDetail();
    $("dc-go").onclick = () => {
      o.status = "delivered";
      o.timeline.push({
        status: "delivered",
        time: Date.now(),
        note: "Buyer confirmed delivery",
      });
      loadOrders((ex) => {
        const i = ex.findIndex((x) => x.id === o.id);
        if (i >= 0) ex[i] = o;
        saveOrders(ex, () => {
          toast("Delivery confirmed. Releasing payment...");
          setTimeout(() => {
            o.status = "released";
            o.timeline.push({
              status: "released",
              time: Date.now(),
              note: "Payment released automatically",
            });
            loadOrders((ex2) => {
              const j = ex2.findIndex((x) => x.id === o.id);
              if (j >= 0) ex2[j] = o;
              saveOrders(ex2, () => renderDetail());
            });
          }, 2000);
          renderDetail();
        });
      });
    };
  }

  function renderDispute(o) {
    body().innerHTML = `
           <button class="cv-back" id="ds-back">${I.back} Back</button>
           <div style="font-size:15px;font-weight:800;margin-bottom:16px;">Raise Dispute</div>
           <div class="cv-field"><label class="cv-field-lbl">Issue</label><select class="cv-sel" id="ds-r"><option>Item not received</option><option>Not as described</option><option>Damaged</option><option>Seller not responding</option><option>Suspected scam</option><option>Other</option></select></div>
           <div class="cv-field"><label class="cv-field-lbl">Description</label><textarea class="cv-txa" id="ds-d" placeholder="Describe the issue in detail..."></textarea></div>
           <div class="cv-field"><label class="cv-field-lbl">Proof (Image / Video)</label><div class="cv-upload" id="ds-up"><span style="color:#C0C0C0;">${I.camera}</span><span>Upload Files</span></div><input type="file" id="ds-file" accept="image/*,video/*" multiple style="display:none" /></div>
           <button class="cv-btn cv-btn-blk" id="ds-go">Submit Dispute</button>`;

    $("ds-up").onclick = () => $("ds-file").click();
    $("ds-file").onchange = (e) => {
      if (e.target.files.length) {
        $("ds-up").innerHTML =
          `<span style="color:#000;">${I.check}</span><span>${e.target.files.length} File(s) ✓</span>`;
        $("ds-up").classList.add("has");
      }
    };
    $("ds-back").onclick = () => renderDetail();
    $("ds-go").onclick = () => {
      const d = $("ds-d").value.trim();
      if (!d) {
        toast("Describe the issue");
        return;
      }
      const r = $("ds-r").value;
      o.status = "disputed";
      o.dispute = { reason: r, description: d, time: Date.now() };
      o.timeline.push({
        status: "disputed",
        time: Date.now(),
        note: "Dispute: " + r,
      });
      loadOrders((ex) => {
        const i = ex.findIndex((x) => x.id === o.id);
        if (i >= 0) ex[i] = o;
        saveOrders(ex, () => {
          toast("Dispute submitted");
          renderDetail();
        });
      });
    };
  }

  // ── ORDERS ──
  function renderOrders() {
    if (!auth) {
      renderOnboarding();
      return;
    }
    loadOrders((ex) => {
      orders = ex;
      const chips = [
        ["all", "All"],
        ["active", "Active"],
        ["shipped", "Shipped"],
        ["released", "Done"],
        ["disputed", "Disputed"],
      ];
      let filtered =
        filter === "all"
          ? ex
          : filter === "active"
            ? ex.filter((o) => !["released", "disputed"].includes(o.status))
            : ex.filter((o) => o.status === filter);
      let list = filtered.length
        ? filtered
            .map(
              (o) => `
                 <div class="cv-ord" data-oid="${o.id}">
                   <div class="cv-row"><span class="cv-val" style="font-size:11px;">${o.product.name}</span><span class="cv-val" style="font-size:11px;">PKR ${o.total.toLocaleString()}</span></div>
                   <div class="cv-row" style="margin-top:3px;"><span class="cv-lbl" style="font-size:9px;font-family:monospace;">${o.id} · ${fmtRel(o.createdAt)}</span><span class="cv-status cv-status-${o.status}">${sLabel(o.status)}</span></div>
                 </div>`,
            )
            .join("")
        : '<div class="cv-empty">No orders found</div>';

      body().innerHTML = `
             <div class="cv-sec">
               <input class="cv-inp" id="o-search" placeholder="Search orders..." style="margin-bottom:10px;"/>
               <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px;">
                 ${chips.map((c) => `<button class="cv-btn cv-btn-sm ${filter === c[0] ? "cv-btn-blk" : "cv-btn-gry"}" data-f="${c[0]}">${c[1]}</button>`).join("")}
               </div>
               ${list}
             </div>`;

      body()
        .querySelectorAll("[data-f]")
        .forEach((el) => {
          el.onclick = () => {
            filter = el.dataset.f;
            renderOrders();
          };
        });
      body()
        .querySelectorAll(".cv-ord")
        .forEach((el) => {
          el.onclick = () => {
            selOrd = orders.find((x) => x.id === el.dataset.oid);
            if (selOrd) renderDetail();
          };
        });
      $("o-search")?.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        body()
          .querySelectorAll(".cv-ord")
          .forEach((el) => {
            el.style.display =
              el.dataset.oid.toLowerCase().includes(q) ||
              el.textContent.toLowerCase().includes(q)
                ? ""
                : "none";
          });
      });
    });
  }

  // ── SELLER LOOKUP ──
  function renderSeller() {
    if (!auth) {
      renderOnboarding();
      return;
    }
    body().innerHTML = `
           <div style="font-size:15px;font-weight:800;margin-bottom:4px;">Seller Portal</div>
           <div style="font-size:11px;color:#888;margin-bottom:16px;">Enter the buyer's order number to manage this order.</div>
           <div class="cv-field">
             <label class="cv-field-lbl">Order Number</label>
             <input class="cv-inp" id="sl-id" placeholder="COV-XXXX-XXXX" style="font-family:monospace;letter-spacing:1.5px;text-align:center;font-size:13px;font-weight:700;text-transform:uppercase;" />
           </div>
           <button class="cv-btn cv-btn-blk" id="sl-go">Look Up Order</button>`;

    $("sl-id").oninput = (e) => {
      e.target.value = e.target.value.toUpperCase();
    };
    $("sl-go").onclick = () => {
      const num = $("sl-id").value.trim().toUpperCase();
      if (!num) return;
      loadOrders((ex) => {
        const o = ex.find((x) => x.id === num);
        if (!o) {
          toast("Order not found");
          return;
        }
        selOrd = o;
        renderSellerOrder(o);
      });
    };
  }

  function renderSellerOrder(o) {
    let bi = o.buyer
      ? `<div class="cv-stitle">Buyer Payment</div><div class="cv-card">
               <div class="cv-row"><span class="cv-lbl">Buyer Name</span><span class="cv-val">${o.buyer.name}</span></div>
               <div class="cv-row"><span class="cv-lbl">Method</span><span class="cv-val">${o.buyer.paymentMethod}</span></div>
               <div class="cv-row"><span class="cv-lbl">Transaction ID</span><span class="cv-val" style="font-family:monospace;font-size:10px;">${o.buyer.transactionId}</span></div>
               ${o.buyer.phone ? `<div class="cv-row"><span class="cv-lbl">Phone</span><span class="cv-val">${o.buyer.phone}</span></div>` : ""}
              </div>`
      : '<div class="cv-msg cv-msg-info">Awaiting buyer payment proof.</div>';

    let di = o.sellerDelivery
      ? `<div class="cv-div"></div><div class="cv-stitle">Shipment</div><div class="cv-card">
               <div class="cv-row"><span class="cv-lbl">Tracking</span><span class="cv-val" style="font-family:monospace;font-size:10px;">${o.sellerDelivery.trackingId}</span></div>
               <div class="cv-row"><span class="cv-lbl">Courier</span><span class="cv-val">${o.sellerDelivery.courier}</span></div>
              </div>`
      : "";

    let act = "";
    if (o.status === "created")
      act =
        '<div class="cv-msg cv-msg-info">Waiting for buyer to submit payment...</div>';
    else if (o.status === "paid")
      act = `
           <div class="cv-msg cv-msg-info">Buyer submitted payment. Review and accept or reject.</div>
           <div class="cv-action-row">
             <button class="cv-btn cv-btn-gry" id="sl-rej">Reject</button>
             <button class="cv-btn cv-btn-blk" id="sl-acc">Accept Order</button>
           </div>`;
    else if (o.status === "seller_confirmed")
      act =
        '<button class="cv-btn cv-btn-blk" id="sl-ship">Mark as Shipped</button>';
    else if (o.status === "shipped")
      act =
        '<div class="cv-msg cv-msg-info">Waiting for buyer to confirm delivery...</div>';
    else if (o.status === "delivered")
      act =
        '<div class="cv-msg cv-msg-info">Delivery confirmed. Releasing payment.</div>';
    else if (o.status === "released")
      act = `<div class="cv-receipt"><div class="cv-receipt-chk">${I.check}</div><div class="cv-receipt-title">Payment Released</div><div class="cv-receipt-sub">PKR ${o.sellerPayout.toFixed(2)} sent to you</div></div>`;
    else if (o.status === "disputed")
      act =
        '<div class="cv-msg cv-msg-err">This order is under dispute. Cover team will contact you.</div>';

    body().innerHTML = `
           <button class="cv-back" id="sl-back">${I.back} Back</button>
           <div class="cv-sec">
             <div class="cv-ordnum" style="margin-bottom:10px;">${o.id}</div>
             ${prodImgHtml(o.product.img, o.amount, o.currency)}
             <div style="font-size:13px;font-weight:700;margin-bottom:6px;">${o.product.name}</div>
             <div class="cv-card">
               <div class="cv-breakdown-row"><span>Product</span><span>PKR ${o.amount.toFixed(2)}</span></div>
               <div class="cv-breakdown-row"><span>Delivery</span><span>PKR ${o.delivery.toFixed(2)}</span></div>
               <div class="cv-breakdown-row total"><span>You Receive</span><span>PKR ${o.sellerPayout.toFixed(2)}</span></div>
             </div>
             <div style="margin-top:6px;"><span class="cv-status cv-status-${o.status}">${sLabel(o.status)}</span></div>
           </div>
           <div class="cv-div"></div>${bi}${di}<div class="cv-div"></div>${act}`;

    $("sl-back").onclick = () => renderSeller();
    $("sl-rej")?.addEventListener("click", () => {
      o.status = "disputed";
      o.timeline.push({
        status: "disputed",
        time: Date.now(),
        note: "Seller rejected payment",
      });
      loadOrders((ex) => {
        const i = ex.findIndex((x) => x.id === o.id);
        if (i >= 0) ex[i] = o;
        saveOrders(ex, () => {
          toast("Order rejected");
          renderSellerOrder(o);
        });
      });
    });
    $("sl-acc")?.addEventListener("click", () => {
      o.status = "seller_confirmed";
      o.timeline.push({
        status: "seller_confirmed",
        time: Date.now(),
        note: "Seller accepted",
      });
      loadOrders((ex) => {
        const i = ex.findIndex((x) => x.id === o.id);
        if (i >= 0) ex[i] = o;
        saveOrders(ex, () => {
          toast("Order accepted");
          renderSellerOrder(o);
        });
      });
    });
    $("sl-ship")?.addEventListener("click", () => renderShipForm(o));
  }

  function renderShipForm(o) {
    body().innerHTML = `
           <button class="cv-back" id="sh-back">${I.back} Back</button>
           <div style="font-size:15px;font-weight:800;margin-bottom:16px;">Mark as Shipped</div>
           <div class="cv-field"><label class="cv-field-lbl">Tracking ID</label><input class="cv-inp" id="sh-t" placeholder="TCS-123456789" /></div>
           <div class="cv-field"><label class="cv-field-lbl">Courier Service</label><select class="cv-sel" id="sh-c"><option>TCS</option><option>Leopards</option><option>M&P</option><option>DHL</option><option>FedEx</option><option>By Hand</option></select></div>
           <div class="cv-field"><label class="cv-field-lbl">Handover Video (recommended)</label><div class="cv-upload" id="sh-vid"><span style="color:#C0C0C0;">${I.video}</span><span>Upload Video</span></div><input type="file" id="sh-vfile" accept="video/*" style="display:none" /></div>
           ${auth && auth.payoutAccount ? `<div class="cv-msg cv-msg-info" style="margin-top:8px;">Payout will go to: <strong>${auth.payoutMethod}</strong> · ${auth.payoutAccount}</div>` : `<div class="cv-msg cv-msg-warn">No payout details on file. Update them in Settings.</div>`}
           <button class="cv-btn cv-btn-blk" id="sh-go" style="margin-top:8px;">Confirm Shipped</button>`;

    $("sh-vid").onclick = () => $("sh-vfile").click();
    $("sh-vfile").onchange = (e) => {
      if (e.target.files.length) {
        $("sh-vid").innerHTML =
          `<span style="color:#000;">${I.check}</span><span>Video ✓</span>`;
        $("sh-vid").classList.add("has");
      }
    };
    $("sh-back").onclick = () => renderSellerOrder(o);
    $("sh-go").onclick = () => {
      const tid = $("sh-t").value.trim(),
        cour = $("sh-c").value;
      if (!tid) {
        toast("Enter tracking ID");
        return;
      }
      o.sellerDelivery = {
        trackingId: tid,
        courier: cour,
        payoutMethod: auth?.payoutMethod || "",
        payoutAccount: auth?.payoutAccount || "",
        payoutName: auth?.payoutName || "",
      };
      o.status = "shipped";
      o.timeline.push({
        status: "shipped",
        time: Date.now(),
        note: "Shipped via " + cour + " (" + tid + ")",
      });
      loadOrders((ex) => {
        const i = ex.findIndex((x) => x.id === o.id);
        if (i >= 0) ex[i] = o;
        saveOrders(ex, () => {
          toast("Marked as shipped");
          renderSellerOrder(o);
        });
      });
    };
  }

  // ── SETTINGS ──
  function renderSettings() {
    if (!auth) {
      renderOnboarding();
      return;
    }
    const isS = auth.role === "seller";
    let payoutPillsHtml = "";
    if (isS) {
      payoutPillsHtml = PAYOUT_METHODS.map(
        (m) =>
          `<button class="cv-pay-pill${m === (auth.payoutMethod || "Easypaisa") ? " selected" : ""}" data-v="${m}">${m}</button>`,
      ).join("");
    }
    let upgradeHtml = !isS
      ? `
           <div class="cv-div"></div>
           <div class="cv-sec">
             <div class="cv-stitle">Upgrade</div>
             <div class="cv-card" style="display:flex;align-items:center;gap:12px;">
               <div style="flex:1;"><div style="font-size:12px;font-weight:700;margin-bottom:3px;">Become a Seller</div><div style="font-size:10px;color:#888;">Accept secure payments from buyers.</div></div>
               <button class="cv-btn cv-btn-blk cv-btn-sm" id="st-upgrade" style="white-space:nowrap;">Verify →</button>
             </div>
           </div>`
      : "";

    body().innerHTML = `
           <div style="font-size:15px;font-weight:800;margin-bottom:14px;">Settings</div>
           <div class="cv-sec">
             <div class="cv-stitle">Profile</div>
             <div class="cv-card">
               <div class="cv-row"><span class="cv-lbl">Name</span><span class="cv-val">${auth.name}</span></div>
               <div class="cv-row"><span class="cv-lbl">Role</span><span class="cv-val">${isS ? "Verified Seller" : "Buyer"}</span></div>
               <div class="cv-row"><span class="cv-lbl">Phone</span><span class="cv-val">${auth.phone}</span></div>
               ${auth.city ? `<div class="cv-row"><span class="cv-lbl">City</span><span class="cv-val">${auth.city}</span></div>` : ""}
             </div>
           </div>
           ${
             isS
               ? `
           <div class="cv-div"></div>
           <div class="cv-sec">
             <div class="cv-stitle">Payout Details</div>
             <div class="cv-field"><label class="cv-field-lbl">Payout Method</label><div class="cv-pay-methods" id="st-payout-pills">${payoutPillsHtml}</div></div>
             <div class="cv-field"><label class="cv-field-lbl">Account / IBAN</label><input class="cv-inp" id="st-a" value="${auth.payoutAccount || ""}" /></div>
             <div class="cv-field"><label class="cv-field-lbl">Account Holder</label><input class="cv-inp" id="st-h" value="${auth.payoutName || ""}" /></div>
             <button class="cv-btn cv-btn-blk" id="st-s">Save Payout Details</button>
           </div>`
               : `
           <div class="cv-div"></div>
           <div class="cv-sec">
             <div class="cv-stitle">Default Payment</div>
             <div class="cv-field"><label class="cv-field-lbl">Method</label><div class="cv-pay-methods" id="st-pay-pills">${PAY_METHODS.map((m) => `<button class="cv-pay-pill${m === (auth.paymentMethod || "Easypaisa") ? " selected" : ""}" data-v="${m}">${m}</button>`).join("")}</div></div>
             <div class="cv-field"><label class="cv-field-lbl">Account / Phone</label><input class="cv-inp" id="st-acc" value="${auth.paymentAccount || ""}" placeholder="Account number" /></div>
             <button class="cv-btn cv-btn-blk" id="st-s">Save</button>
           </div>`
           }
           ${upgradeHtml}
           <div class="cv-div"></div>
           <button class="cv-btn cv-btn-gry" id="st-lo">Sign Out</button>`;

    let selPayoutMethod = auth.payoutMethod || "Easypaisa";
    let selPayMethodSt = auth.paymentMethod || "Easypaisa";

    if (isS) {
      body()
        .querySelectorAll("#st-payout-pills .cv-pay-pill")
        .forEach((p) => {
          p.onclick = () => {
            selPayoutMethod = p.dataset.v;
            body()
              .querySelectorAll("#st-payout-pills .cv-pay-pill")
              .forEach((x) =>
                x.classList.toggle("selected", x.dataset.v === selPayoutMethod),
              );
          };
        });
      $("st-s").onclick = () => {
        auth.payoutMethod = selPayoutMethod;
        auth.payoutAccount = $("st-a").value.trim();
        auth.payoutName = $("st-h").value.trim();
        saveAuth(auth, () => {
          toast("Payout details saved");
        });
      };
    } else {
      body()
        .querySelectorAll("#st-pay-pills .cv-pay-pill")
        .forEach((p) => {
          p.onclick = () => {
            selPayMethodSt = p.dataset.v;
            body()
              .querySelectorAll("#st-pay-pills .cv-pay-pill")
              .forEach((x) =>
                x.classList.toggle("selected", x.dataset.v === selPayMethodSt),
              );
          };
        });
      $("st-s").onclick = () => {
        auth.paymentMethod = selPayMethodSt;
        auth.paymentAccount = $("st-acc").value.trim();
        saveAuth(auth, () => {
          toast("Settings saved");
        });
      };
    }

    $("st-upgrade")?.addEventListener("click", () => renderSellerKYC(true));
    $("st-lo").onclick = () => {
      saveAuth(null, () => {
        auth = null;
        toast("Signed out");
        renderHome();
      });
    };
  }

  // ── TAB WIRING ──
  const renderers = {
    home: renderHome,
    create: renderCreate,
    orders: renderOrders,
    seller: renderSeller,
    settings: renderSettings,
  };
  function updateTabs() {
    panel
      .querySelectorAll(".cv-tab")
      .forEach((t) => t.classList.toggle("active", t.dataset.t === activeTab));
  }

  fab.addEventListener("click", () => {
    panelOpen = !panelOpen;
    panel.classList.toggle("open", panelOpen);
    if (panelOpen) {
      selOrd = null;
      loadAuth((a) => {
        auth = a;
        renderers[activeTab]();
      });
    }
  });
  $("cv-x").addEventListener("click", () => {
    panelOpen = false;
    panel.classList.remove("open");
    stopFocusGuard();
  });
  panel.querySelectorAll(".cv-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTab = tab.dataset.t;
      selOrd = null;
      updateTabs();
      loadAuth((a) => {
        auth = a;
        renderers[activeTab]();
      });
    });
  });

  // ── Inject "Pay with Cover" on marketplace pages ──
  setTimeout(() => {
    const u = location.href.toLowerCase();
    if (
      !/marketplace|checkout|payment|pay|cart|ebay|olx|amazon|etsy|daraz/.test(
        u,
      )
    )
      return;
    document
      .querySelectorAll(
        'button[type="submit"],[class*="pay" i],[class*="buy" i]',
      )
      .forEach((btn) => {
        if (btn.dataset.coverBtn) return;
        btn.dataset.coverBtn = "1";
        const cb = document.createElement("button");
        cb.textContent = "🛡 Pay with Cover";
        cb.style.cssText =
          "display:inline-flex;padding:8px 16px;margin:4px;background:#000;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:system-ui,sans-serif;";
        cb.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          panelOpen = true;
          panel.classList.add("open");
          activeTab = "create";
          updateTabs();
          loadAuth((a) => {
            auth = a;
            renderCreate();
          });
        };
        btn.parentNode.insertBefore(cb, btn.nextSibling);
      });
  }, 1500);
})();
