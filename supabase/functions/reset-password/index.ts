import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  email: string;
}

// Generate cryptographically secure random password (8 characters)
function generateSecurePassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: ResetPasswordRequest = await req.json();
    
    console.log(`Password reset requested for email: ${email}`);

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if user exists
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error fetching users:", userError);
      throw new Error("사용자 조회 중 오류가 발생했습니다.");
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`User not found for email: ${email}`);
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "등록된 이메일이 확인되면 임시 비밀번호가 발송됩니다."
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate temporary password
    const tempPassword = generateSecurePassword();
    console.log(`Generated temporary password for user: ${user.id}`);

    // Update user password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: tempPassword }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      throw new Error("비밀번호 업데이트 중 오류가 발생했습니다.");
    }

    // Send email with temporary password
    const emailResponse = await resend.emails.send({
      from: "리포트랙 <onboarding@resend.dev>",
      to: [email],
      subject: "[리포트랙] 임시 비밀번호 발급 안내",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            임시 비밀번호 발급 안내
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            안녕하세요, 리포트랙입니다.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            요청하신 임시 비밀번호는 다음과 같습니다:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
            <code style="font-size: 24px; font-weight: bold; color: #4CAF50; letter-spacing: 2px;">
              ${tempPassword}
            </code>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #d32f2f; font-weight: bold;">
            ⚠️ 보안을 위해 로그인 후 즉시 새로운 비밀번호로 변경해 주시기 바랍니다.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #888; margin-top: 30px;">
            본인이 요청하지 않은 경우, 이 이메일을 무시하시고 고객센터로 문의해주세요.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            리포트랙 | 대학생을 위한 검증된 자료 저장소
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error("Error sending email:", emailResponse.error);
      throw new Error("이메일 발송 중 오류가 발생했습니다.");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "임시 비밀번호가 이메일로 발송되었습니다."
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in reset-password function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "비밀번호 재설정 중 오류가 발생했습니다."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
