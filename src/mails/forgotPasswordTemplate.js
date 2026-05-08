export const forgotPasswordTemplate = (otp) => {
  return `

   <div style="
      margin:0;
      padding:40px 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      font-family: Arial, sans-serif;
   ">

      <div style="
         max-width:500px;
         margin:auto;
         background:#ffffff;
         border-radius:20px;
         overflow:hidden;
         box-shadow:0 10px 30px rgba(0,0,0,0.2);
      ">

         <div style="
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            padding:30px;
            text-align:center;
            color:white;
         ">
            <h1 style="
               margin:0;
               font-size:32px;
            ">
               🔐 Password Reset
            </h1>

            <p style="
               margin-top:10px;
               opacity:0.9;
               font-size:15px;
            ">
               Secure OTP Verification
            </p>
         </div>

         <div style="
            padding:40px 30px;
            text-align:center;
         ">

            <h2 style="
               color:#333;
               margin-bottom:15px;
            ">
               Hello 👋
            </h2>

            <p style="
               color:#666;
               font-size:16px;
               line-height:1.6;
            ">
               Use the OTP below to reset your password.
               This OTP is valid for only
               <b>10 minutes</b>.
            </p>

            <div style="
               margin:35px auto;
               background: linear-gradient(135deg, #ff512f, #dd2476);
               color:white;
               font-size:38px;
               font-weight:bold;
               letter-spacing:10px;
               padding:18px;
               border-radius:14px;
               width:fit-content;
               min-width:250px;
               box-shadow:0 6px 20px rgba(221,36,118,0.3);
            ">
               ${otp}
            </div>

            <p style="
               color:#888;
               font-size:14px;
               margin-top:25px;
            ">
               If you did not request this email,
               you can safely ignore it.
            </p>

         </div>

         <div style="
            background:#f5f5f5;
            padding:18px;
            text-align:center;
            color:#777;
            font-size:12px;
         ">
            © 2026 IntrenProject • Secure Authentication System
         </div>

      </div>

   </div>

   `;
};
