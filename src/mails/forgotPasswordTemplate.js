export const forgotPasswordTemplate = (otp) => {
  return `

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Flowin Reset Code</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f7fb;
  font-family:Arial,sans-serif;
">

  <!-- PREVIEW TEXT -->
  <div style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
  ">
    Your Flowin OTP is ${otp}
  </div>

  <div style="
    width:100%;
    padding:30px 15px;
    box-sizing:border-box;
  ">

    <div style="
      max-width:500px;
      margin:auto;
      background:white;
      border-radius:18px;
      overflow:hidden;
      border:1px solid #e5e7eb;
    ">

      <!-- HEADER -->
      <div style="
        background:linear-gradient(135deg,#2563eb,#7c3aed);
        padding:35px 20px;
        text-align:center;
      ">
        <h1 style="
          margin:0;
          color:white;
          font-size:32px;
          font-weight:bold;
        ">
          Flowin
        </h1>

        <p style="
          margin-top:10px;
          color:rgba(255,255,255,0.85);
          font-size:14px;
        ">
          Keep Flowing...
        </p>
      </div>

      <!-- BODY -->
      <div style="
        padding:40px 25px;
        text-align:center;
      ">

        <h2 style="
          margin-top:0;
          color:#111827;
          font-size:24px;
        ">
          Reset Your Password
        </h2>

        <p style="
          color:#6b7280;
          font-size:15px;
          line-height:1.7;
          margin-bottom:30px;
        ">
          Use the verification code below to reset your password.
          This OTP will expire in 10 minutes.
        </p>

        <!-- OTP BOX -->
        <div style="
          background:#111827;
          color:white;
          display:inline-block;
          padding:16px 20px;
          border-radius:12px;
          font-size:26px;
          font-weight:bold;
          letter-spacing:3px;
          line-height:1.4;
          text-align:center;
          max-width:100%;
          box-sizing:border-box;
          word-break:break-word;
        ">
          ${otp}
        </div>
        <p style="font-size:20px;">
  ${otp}
</p>

        <p style="
          color:#9ca3af;
          font-size:13px;
          line-height:1.6;
          margin-top:30px;
        ">
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="
        background:#f9fafb;
        padding:18px;
        text-align:center;
        color:#9ca3af;
        font-size:12px;
        border-top:1px solid #e5e7eb;
      ">
        Flow Through Memories
      </div>

    </div>

  </div>

</body>
</html>

  `;
};
