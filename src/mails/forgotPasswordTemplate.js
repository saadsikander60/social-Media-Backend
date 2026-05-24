export const forgotPasswordTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Flowin OTP</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#0f172a;
  font-family:Arial,sans-serif;
">

  <div style="
    width:100%;
    padding:40px 15px;
    box-sizing:border-box;
  ">

    <!-- CARD -->
    <div style="
      max-width:520px;
      margin:auto;
      background:#111827;
      border-radius:24px;
      overflow:hidden;
      border:1px solid rgba(255,255,255,0.08);
    ">

      <!-- HEADER -->
      <div style="
        background:linear-gradient(135deg,#2563eb,#7c3aed);
        padding:45px 25px;
        text-align:center;
      ">

        <h1 style="
          margin:0;
          color:white;
          font-size:42px;
          font-weight:900;
          letter-spacing:1px;
        ">
          Flowin
        </h1>

        <p style="
          margin-top:12px;
          color:rgba(255,255,255,0.82);
          font-size:15px;
        ">
          Flow Through Memories
        </p>

      </div>

      <!-- BODY -->
      <div style="
        padding:45px 30px;
        text-align:center;
      ">

        <h2 style="
          margin-top:0;
          margin-bottom:18px;
          color:#ffffff;
          font-size:28px;
        ">
          Password Reset OTP
        </h2>

        <p style="
          color:#9ca3af;
          font-size:15px;
          line-height:1.8;
          margin-bottom:35px;
        ">
          Use the verification code below to reset your password.
          This OTP is valid for only 10 minutes.
        </p>

        <!-- OTP -->
        <div style="
          background:linear-gradient(135deg,#3b82f6,#8b5cf6);
          color:white;
          padding:18px 24px;
          border-radius:18px;
          font-size:34px;
          font-weight:900;
          letter-spacing:8px;
          display:inline-block;
          line-height:1.4;
        ">
          ${otp}
        </div>

        <p style="
          color:#6b7280;
          font-size:13px;
          line-height:1.7;
          margin-top:40px;
        ">
          If you did not request this password reset,
          you can safely ignore this email.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="
        border-top:1px solid rgba(255,255,255,0.06);
        padding:20px;
        text-align:center;
        color:#6b7280;
        font-size:12px;
        background:#0b1220;
      ">
        Flow Through Memories
      </div>

    </div>

  </div>

</body>

</html>
`;
};
