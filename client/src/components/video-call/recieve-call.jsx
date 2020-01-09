import React from 'react'
import PropTypes from 'prop-types'
import "./phone.css";

export default function ReceiveCall() {
  return (
    <div class="phonering-alo-phone phonering-alo-green phonering-alo-show" id="phonering-alo-phoneIcon">
    <div class="phonering-alo-ph-circle"></div>
    <div class="phonering-alo-ph-circle-fill"></div>
    <a href="tel:+84123456789" class="pps-btn-img" title="Liên hệ">
    <div class="phonering-alo-ph-img-circle"></div>
  </a>
  </div>
  );
}

