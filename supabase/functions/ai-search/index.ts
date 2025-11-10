import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Received search query:', query);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Search in database first
    console.log('Searching database for related resources...');
    const { data: resources, error: dbError } = await supabase
      .from('resources')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,major.ilike.%${query}%,type.ilike.%${query}%`)
      .limit(10);

    if (dbError) {
      console.error('Database search error:', dbError);
    }

    console.log('Found resources:', resources?.length || 0);

    // Prepare context for AI
    const dbContext = resources && resources.length > 0
      ? `다음은 데이터베이스에서 찾은 관련 자료입니다:\n\n${resources.map((r, i) => 
          `${i + 1}. **${r.title}**\n   - 설명: ${r.description || '없음'}\n   - 전공: ${r.major || '없음'}\n   - 유형: ${r.type || '없음'}\n   - 링크: ${r.link || '없음'}`
        ).join('\n\n')}`
      : '데이터베이스에서 관련 자료를 찾지 못했습니다.';

    // Call Lovable AI with streaming
    console.log('Calling Lovable AI...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `너는 학습자료 및 논문 요약 전문 검색 도우미야.
사용자가 입력한 주제, 개념, 키워드에 따라 아래 두 단계를 거쳐 응답해.

1️⃣ 우선 내가 제공한 데이터베이스 자료에서 관련 내용을 찾아 정리한다.
2️⃣ 만약 관련 자료가 없거나 부족할 경우, 웹에서 신뢰할 수 있는 최신 논문이나 연구자료를 찾아 요약한다.

각 결과는 아래 형식으로 출력하라:

📘 **제목:** [자료 또는 논문 제목]
🎓 **핵심 개념:** [핵심 키워드나 연구 개념 3개]
🔗 **출처:** [내부 문서 링크 또는 외부 웹 주소]
📝 **요약:** [간단한 설명]

만약 등록된 자료와 외부 검색 모두에서 결과를 찾지 못하면 다음과 같이 응답하라:
"현재 해당 주제와 직접 관련된 자료를 찾을 수 없습니다.
다음은 유사하거나 관련된 주제 제안입니다:"
- [유사 주제 1]
- [유사 주제 2]
- [유사 주제 3]

응답 시, 학습자가 이해하기 쉽게 설명하고, 복잡한 논문 개념은 쉬운 비유나 예시를 덧붙여라.
전문 용어는 그대로 유지하되, 초심자도 이해 가능한 설명을 함께 제공하라.`
          },
          {
            role: 'user',
            content: `검색 주제: "${query}"\n\n${dbContext}`
          }
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: '크레딧이 부족합니다. 워크스페이스 설정에서 크레딧을 추가해주세요.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('AI gateway error');
    }

    // Stream the response
    return new Response(aiResponse.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });

  } catch (error) {
    console.error('Error in ai-search function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
