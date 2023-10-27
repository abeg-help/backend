import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import * as React from "react";

const targetReached = () => {
    return (
      <Html lang="en" dir="ltr">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body style="background-color: #f4f4f4; font-family: 'Arial', sans-serif;">
      
        <table align="center" width="600" role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; margin: 40px auto; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <tbody>
            <tr>
              <td style="padding: 20px; text-align: center;">
                <h1 style="color: #4CAF50;">🎉 Target Reached! 🎉</h1>
                <p style="font-size: 16px; line-height: 24px; color: #555;">Dear [User],
      
                  We are thrilled to share the fantastic news with you! Thanks to your support and the generosity of our community, we've successfully reached our fundraising target.
      
                  Your contribution has played a vital role in making this achievement possible. Together, we are making a positive impact and turning our shared vision into reality.
      
                  Thank you for being part of this journey. We couldn't have done it without you!
      
                  Best regards,
      
                  AbegHelp
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      
        <table align="center" width="600" role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; margin: 20px auto;">
          <tbody>
            <tr>
              <td style="text-align: center;">
                <p style="font-size: 14px; color: #888;">If you have any questions or would like to learn more about our ongoing initiatives, feel free to contact us at [test@email.com].
      
                  Thank you again for your support!
      
                  AbegHelp.me
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      
      </body>
      </Html >
    )
  }
  
  export default targetReached
  