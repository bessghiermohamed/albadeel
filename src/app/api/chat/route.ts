import { NextRequest, NextResponse } from "next/server";

// We use z-ai-web-dev-sdk for real LLM chat
import ZAI from "z-ai-web-dev-sdk";

const SYSTEM_PROMPT = `أنت مساعد تعليمي ذكي في منصة البديل للطلبة الجزائريين.
تخصصك: المساعدة في المواد الدراسية لفرع PEP (السداسي الأول والثاني) - تخصص الأدب العربي.
المدرسة: المدرسة العليا للأساتذة ENS بالجزائر.

قواعدك:
- أجب دائماً بالعربية الفصحى
- كن مشجعاً وداعماً للطلاب
- قدم نصائح دراسية عملية ومفيدة
- إذا سُئلت عن شيء خارج التخصص، وجّه الطالب بلطف
- استخدم إيموجي بشكل معتدل لإضافة حيوية
- قدم إجابات منظمة مع نقاط واضحة`;

// Mock fallback responses for when API is unavailable
const mockResponses: Record<string, string> = {
  "ما هي أفضل طريقة للمذاكرة؟":
    "إليك أفضل طرق المذاكرة الفعّالة:\n\n1. **تقنية بومودورو**: ادرس 25 دقيقة ثم استرح 5 دقائق\n2. **المراجعة المتفرقة**: راجع المعلومات على فترات متباعدة\n3. **الاسترجاع النشط**: اختبر نفسك بدلاً من إعادة القراءة\n4. **تدوين الملاحظات بطريقتك**: اكتب بأسلوبك الخاص\n5. **الشرح للآخرين**: علّم زميلك لتثبيت المعلومة\n\nتذكّر: الجودة أهم من الكمية! 📚",
  "ساعدني في التخطيط":
    "بالتأكيد! إليك خطة دراسية نموذجية:\n\n📅 **الخطة الأسبوعية:**\n\n- **السبت-الأربعاء**: دراسة المواد الأساسية (3 ساعات يومياً)\n- **الخميس**: مراجعة شاملة + حل تمارين\n- **الجمعة**: راحة + مراجعة خفيفة\n\n⏰ **توزيع اليوم:**\n- 8:00-10:00 مادة صعبة\n- 10:30-12:00 مادة متوسطة\n- بعد الظهر: مراجعة + ملاحظات\n\nابدأ بالمواد الأصعب عندما تكون طاقتك في القمة! 💪",
  "نصائح للنجاح":
    "نصائح ذهبية للنجاح الدراسي:\n\n🏆 **التحفيز:**\n- حدد أهدافك بوضوح\n- كافئ نفسك عند الإنجاز\n\n📝 **الدراسة:**\n- لا تؤجل المهام\n- حضر الدرس قبل الحضور\n- راجع في نفس اليوم\n\n🧠 **الصحة النفسية:**\n- نم 7-8 ساعات\n- مارس الرياضة\n- تواصل مع زملائك\n\n💪 تذكّر: النجاح رحلة وليس وجهة! كل يوم هو فرصة جديدة للتقدم.",
};

const defaultResponse =
  "شكراً لسؤالك! أنا مساعدك التعليمي في البديل. يمكنني مساعدتك في:\n\n- 📚 نصائح المذاكرة والمراجعة\n- 📅 التخطيط الدراسي\n- 💡 شرح المفاهيم التربوية\n- 🎯 تحسين أدائك الأكاديمي\n\nجرّب سؤالي عن أي من هذه المواضيع!";

function getMockResponse(message: string): string {
  const lowerMessage = message.trim();
  for (const [key, value] of Object.entries(mockResponses)) {
    if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
      return value;
    }
  }
  if (lowerMessage.includes("مذاكر") || lowerMessage.includes("دراس")) {
    return mockResponses["ما هي أفضل طريقة للمذاكرة؟"];
  }
  if (lowerMessage.includes("تخطيط") || lowerMessage.includes("خطة") || lowerMessage.includes("جدول")) {
    return mockResponses["ساعدني في التخطيط"];
  }
  if (lowerMessage.includes("نجاح") || lowerMessage.includes("نصيح") || lowerMessage.includes("نصائح")) {
    return mockResponses["نصائح للنجاح"];
  }
  return defaultResponse;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessages = body.messages || [];

    if (!userMessages.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // Try real LLM first
    try {
      const zai = await ZAI.create();

      const chatMessages = [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...userMessages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      const response = await zai.chat.completions.create({
        messages: chatMessages,
        thinking: { type: "disabled" },
      });

      const aiMessage = response.choices?.[0]?.message?.content;

      if (aiMessage) {
        return NextResponse.json({ message: aiMessage });
      }
    } catch (llmError) {
      console.error("LLM API error, falling back to mock:", llmError);
    }

    // Fallback to mock responses
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || "";
    const mockReply = getMockResponse(lastUserMessage);

    return NextResponse.json({ message: mockReply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
