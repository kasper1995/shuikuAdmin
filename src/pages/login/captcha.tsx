import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getCaptcha } from "@/api/user.api";

const CaptchaImg = forwardRef((props, ref) => {
  const [captcha, setCaptcha] = useState<string>('');
  const [captchaId, setCaptchaID] = useState<string>('');

  const handleInit = async () => {
    const res = await getCaptcha();
    console.log(res);
    if (res.Code === 0) {
      const { CaptchaB64, CaptchaID } = res.Data;

      setCaptcha(CaptchaB64);
      setCaptchaID(CaptchaID);
    }
  }

  useImperativeHandle(ref, () => ({
    getCaptchaID: () => captchaId
  }));

  useEffect(() => {
    handleInit();
  }, []);

  return (
    <img alt="" src={captcha} style={{cursor:'pointer'}} onClick={handleInit} />
  );
});

export default CaptchaImg;
