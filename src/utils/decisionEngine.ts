import type { DecisionAnalysis, OptionModel, TOWSTactic } from '../types/decision.ts';

export function getOptionLabel(opt: any, fallback: string): string {
  if (!opt) return fallback;
  if (typeof opt === 'string' && opt.trim().length > 0) return opt.trim();
  if (typeof opt === 'object' && opt.name && typeof opt.name === 'string' && opt.name.trim().length > 0) {
    return opt.name.trim();
  }
  return fallback;
}

export function buildStrategicDecision(
  dilemma: string,
  userOptions: any[] = [],
  contextNotes: string = '',
  language: string = 'vi'
): DecisionAnalysis {
  const isVi = language === 'vi';
  const optA = getOptionLabel(userOptions[0], isVi ? 'Lựa chọn A: Đột phá & Chấp nhận thử thách mới' : 'Option A: Leap forward & embrace new venture');
  const optB = getOptionLabel(userOptions[1], isVi ? 'Lựa chọn B: Tối ưu hóa & Khai thác nguồn lực hiện tại' : 'Option B: Optimize & leverage existing stability');

  const options: OptionModel[] = [
    {
      id: 'opt-a',
      name: optA,
      tagline: isVi ? 'Chiến lược tiên phong, tối đa hóa tiềm năng dài hạn' : 'High-growth frontier with scalable potential',
      description: isVi 
        ? `Lựa chọn tập trung vào sự tăng trưởng, mở rộng giới hạn năng lực và tự chủ quyết định. ${contextNotes ? `Ngữ cảnh: ${contextNotes}` : ''}`
        : `Focused on expansion, high ceiling of upside, and active decision autonomy. ${contextNotes ? `Context: ${contextNotes}` : ''}`,
      pros: [
        { id: 'pa-1', text: isVi ? 'Tiềm năng tăng trưởng không giới hạn' : 'Unlimited upside ceiling', explanation: isVi ? 'Tạo ra tài sản riêng và cơ hội nhân rộng quy mô trong tương lai.' : 'Builds compound equity and scalable momentum.', category: isVi ? 'Tăng trưởng' : 'Growth', weight: 8 },
        { id: 'pa-2', text: isVi ? 'Tự chủ và làm chủ vận mệnh' : 'Total autonomy & ownership', explanation: isVi ? 'Tự do thử nghiệm, quyết định tốc độ và định hướng phát triển.' : 'Direct control over priorities and strategic roadmap.', category: isVi ? 'Tâm lý' : 'Autonomy', weight: 9 },
        { id: 'pa-3', text: isVi ? 'Gia tốc học hỏi vượt bậc qua thực chiến' : 'Accelerated steep learning curve', explanation: isVi ? 'Đối mặt trực tiếp với thị trường rèn luyện bản lĩnh và mạng lưới quan hệ.' : 'Confronting real-world market friction builds unmatched domain competence.', category: isVi ? 'Năng lực' : 'Capability', weight: 7 },
      ],
      cons: [
        { id: 'ca-1', text: isVi ? 'Rủi ro tài chính và dòng tiền ban đầu' : 'Initial cash flow & volatility risk', explanation: isVi ? 'Đòi hỏi vốn mồi và giai đoạn hòa vốn có thể kéo dài hơn dự tính.' : 'Requires capital buffer and longer runway than expected.', category: isVi ? 'Tài chính' : 'Financial', weight: 8 },
        { id: 'ca-2', text: isVi ? 'Áp lực tâm lý và gánh nặng trách nhiệm' : 'High cognitive load & responsibility', explanation: isVi ? 'Mọi sai lầm trực tiếp do bản thân gánh chịu, cần kỷ luật thép.' : 'All operational friction falls directly upon your shoulders.', category: isVi ? 'Sức khỏe' : 'Well-being', weight: 7 },
      ],
      swot: {
        strengths: isVi 
          ? ['Lợi thế linh hoạt, phản ứng nhanh', 'Động lực tự thân cực lớn', 'Không bị ràng buộc bởi quy trình cứng nhắc']
          : ['Agile decision making', 'Uncompromised intrinsic motivation', 'Freedom from bureaucratic friction'],
        weaknesses: isVi 
          ? ['Nguồn lực ban đầu có hạn', 'Thiếu hệ thống hỗ trợ sẵn có', 'Cần đa nhiệm liên tục']
          : ['Finite initial runway', 'Absence of legacy safety net', 'High multi-tasking tax'],
        opportunities: isVi 
          ? ['Thị trường ngách đang thiếu giải pháp chất lượng', 'Xây dựng thương hiệu cá nhân/doanh nghiệp vững chắc', 'Kết nối các đối tác chiến lược']
          : ['Unserved niche market pockets', 'Compounding personal and enterprise equity', 'New strategic alliance formation'],
        threats: isVi 
          ? ['Biến động thị trường vĩ mô', 'Chi phí phát sinh ngoài dự kiến', 'Cạnh tranh từ các đối thủ lớn']
          : ['Macro volatility', 'Unforeseen operational overhead', 'Established incumbent pressure'],
      },
    },
    {
      id: 'opt-b',
      name: optB,
      tagline: isVi ? 'Chiến lược phòng thủ kiên cố, tích lũy nền tảng' : 'Defensive compounder, cash-flow certainty',
      description: isVi 
        ? `Lựa chọn ưu tiên sự an toàn, bảo toàn vốn và khai thác tối đa nguồn lực vững chắc đã có.`
        : `Prioritizes steady predictability, risk mitigation, and low volatility compounding.`,
      pros: [
        { id: 'pb-1', text: isVi ? 'Dòng tiền và cuộc sống ổn định, dễ dự báo' : 'Predictable steady cash flow', explanation: isVi ? 'Giảm bớt lo âu về chi phí sinh hoạt hay áp lực nợ nần.' : 'Eliminates existential runway anxiety and allows methodical planning.', category: isVi ? 'Tài chính' : 'Finance', weight: 8 },
        { id: 'pb-2', text: isVi ? 'Có sẵn quy trình và nguồn lực hỗ trợ' : 'Pre-existing structure & support', explanation: isVi ? 'Tận dụng được hệ sinh thái và kinh nghiệm đã tích lũy sẵn.' : 'Leverages established infrastructure and institutional safeguards.', category: isVi ? 'Vận hành' : 'Operations', weight: 7 },
        { id: 'pb-3', text: isVi ? 'Dễ cân bằng cuộc sống và giữ nhịp độ' : 'Sustainable pacing & balance', explanation: isVi ? 'Ít đối mặt với những cú sốc bất ngờ ngoài tầm kiểm soát.' : 'Protects against sudden existential shocks and burnout spikes.', category: isVi ? 'Cuộc sống' : 'Lifestyle', weight: 6 },
      ],
      cons: [
        { id: 'cb-1', text: isVi ? 'Trần phát triển và thu nhập bị giới hạn' : 'Hard upside ceiling', explanation: isVi ? 'Tốc độ tăng trưởng thường bị ràng buộc bởi các yếu tố bên ngoài.' : 'Your rate of return is capped by institutional boundaries.', category: isVi ? 'Cơ hội' : 'Opportunity', weight: 8 },
        { id: 'cb-2', text: isVi ? 'Cảm giác tiếc nuối (FOMO) về lâu dài' : 'Long-term regret of inaction', explanation: isVi ? 'Nguy cơ tự hỏi "giá như ngày ấy mình dám làm" khi nhìn lại 5-10 năm sau.' : 'Risk of nagging regret wondering "what could have been" years later.', category: isVi ? 'Tâm lý' : 'Psychology', weight: 7 },
      ],
      swot: {
        strengths: isVi 
          ? ['Nền tảng vững chắc, ít rủi ro mất trắng', 'Thu nhập đều đặn', 'Kinh nghiệm quen thuộc']
          : ['High baseline resilience', 'Steady recurring yield', 'Familiar execution muscle'],
        weaknesses: isVi 
          ? ['Khó bứt phá đột biến', 'Phụ thuộc vào người khác / tổ chức', 'Dễ rơi vào vùng an toàn trì trệ']
          : ['Inelastic upside', 'Institutional dependency', 'Comfort-zone inertia'],
        opportunities: isVi 
          ? ['Tích lũy vốn thêm trong 1-2 năm trước khi hành động', 'Học hỏi và quan sát thị trường từ xa', 'Xây dựng dự án tay trái (Side-project)']
          : ['Accumulating extra dry powder', 'Low-risk external market observation', 'Testing via low-stakes side venture'],
        threats: isVi 
          ? ['Mất dần nhiệt huyết và độ nhạy bén', 'Lạm phát chi phí cơ hội', 'Thị trường thay đổi làm giảm giá trị năng lực cũ']
          : ['Atrophy of entrepreneurial appetite', 'Opportunity cost compounding', 'Gradual skillset depreciation'],
      },
    },
  ];

  const towsTactics: TOWSTactic[] = [
    { type: 'SO', title: isVi ? 'Chiến thuật Bứt phá (Maxi-Maxi)' : 'Growth Engine (SO)', action: isVi ? 'Tận dụng toàn bộ kinh nghiệm quản lý và sự linh hoạt để phục vụ nhóm khách hàng trung thành đầu tiên.' : 'Deploy core domain experience immediately to delight an early adopter niche.', relevantOption: optA },
    { type: 'WO', title: isVi ? 'Chiến thuật Vượt khó (Mini-Maxi)' : 'Buffer Building (WO)', action: isVi ? 'Khắc phục hạn chế vốn mồi bằng cách chia nhỏ lộ trình (Milestones) và tối ưu chi phí mặt bằng.' : 'Mitigate limited capital by time-boxing milestones and negotiating lean overhead.', relevantOption: optA },
    { type: 'ST', title: isVi ? 'Chiến thuật Phòng thủ (Maxi-Mini)' : 'Defensive Moat (ST)', action: isVi ? 'Dùng nguồn thu ổn định để đầu tư vào các khóa đào tạo nâng cao hoặc xây dựng quỹ dự phòng 6 tháng.' : 'Leverage recurring income to build a mandatory 6-month war chest before expanding.', relevantOption: optB },
    { type: 'WT', title: isVi ? 'Chiến thuật Né rủi ro (Mini-Mini)' : 'Risk Containment (WT)', action: isVi ? 'Nếu chọn phương án an toàn, tuyệt đối không được ngủ quên; hãy đặt mục tiêu cụ thể cho 6 tháng tới.' : 'If choosing stability, establish active side experiments to prevent skill stagnation.', relevantOption: optB },
  ];

  return {
    id: `decision-${Date.now()}`,
    createdAt: new Date().toISOString(),
    dilemma,
    language: (isVi ? 'vi' : 'en') as 'vi' | 'en',
    summary: isVi 
      ? `Bài toán "${dilemma}" phản ánh sự giằng co kinh điển giữa tính an toàn vững chắc và tiềm năng bứt phá không giới hạn. Cần cân nhắc giữa chi phí cơ hội ngắn hạn và giá trị tích lũy dài hạn.`
      : `The dilemma "${dilemma}" balances the classic trade-off between baseline certainty and asymmetric upside potential.`,
    options,
    comparisonMatrix: {
      criteria: [
        { id: 'crit-1', name: isVi ? 'Tiềm năng Tăng trưởng & Bứt phá' : 'Upside Ceiling & Growth', description: isVi ? 'Khả năng nhân quy mô và tạo ra đột phá' : 'Ability to scale non-linearly', weight: 9 },
        { id: 'crit-2', name: isVi ? 'Mức độ An toàn & Dòng tiền' : 'Financial Safety & Runway', description: isVi ? 'Mức độ chắc chắn về tài chính trong 12 tháng tới' : 'Certainty of cash flow and stability', weight: 8 },
        { id: 'crit-3', name: isVi ? 'Mức độ Tự chủ & Làm chủ' : 'Autonomy & Ownership', description: isVi ? 'Quyền tự quyết định đường đi và thời gian' : 'Command over roadmap and schedule', weight: 8 },
        { id: 'crit-4', name: isVi ? 'Tốc độ Phát triển Năng lực' : 'Skillset Acceleration', description: isVi ? 'Tốc độ tích lũy kỹ năng và kinh nghiệm thực chiến' : 'Rate of acquiring hard, scarce capabilities', weight: 7 },
        { id: 'crit-5', name: isVi ? 'Khả năng Quản trị Căng thẳng' : 'Stress & Sustainability', description: isVi ? 'Mức độ giữ gìn sức khỏe tinh thần và năng lượng' : 'Sustainability of daily stress and workload', weight: 7 },
      ],
      scores: [
        { criteriaId: 'crit-1', scoresByOption: [{ optionId: 'opt-a', score: 9 }, { optionId: 'opt-b', score: 5 }], commentary: isVi ? 'Phương án A vượt trội hoàn toàn về trần phát triển' : 'Option A has an uncapped ceiling.' },
        { criteriaId: 'crit-2', scoresByOption: [{ optionId: 'opt-a', score: 4 }, { optionId: 'opt-b', score: 9 }], commentary: isVi ? 'Phương án B áp đảo về tính an toàn tài chính' : 'Option B provides decisive risk containment.' },
        { criteriaId: 'crit-3', scoresByOption: [{ optionId: 'opt-a', score: 9 }, { optionId: 'opt-b', score: 4 }], commentary: isVi ? 'Phương án A cho bạn 100% quyền kiểm soát' : 'Option A guarantees self-determination.' },
        { criteriaId: 'crit-4', scoresByOption: [{ optionId: 'opt-a', score: 9 }, { optionId: 'opt-b', score: 6 }], commentary: isVi ? 'Thực chiến mở dự án mới thúc đẩy học hỏi cực nhanh' : 'Navigating the unknown accelerates compound growth.' },
        { criteriaId: 'crit-5', scoresByOption: [{ optionId: 'opt-a', score: 4 }, { optionId: 'opt-b', score: 8 }], commentary: isVi ? 'Phương án B ít biến động và dễ thở hơn về tâm lý' : 'Option B preserves emotional bandwidth.' },
      ],
    },
    towsTactics,
    verdict: {
      recommendedOptionId: 'opt-a',
      headline: isVi ? `Chọn ${optA}: Thời điểm hành động có giá trị hơn sự hoàn hảo` : `Choose ${optA}: Decisive execution beats passive waiting`,
      rationale: isVi 
        ? `Phân tích tổng hợp cho thấy bài toán của bạn đã tích lũy đủ các điều kiện cần về năng lực và kinh nghiệm. Rủi ro lớn nhất ở giai đoạn này không phải là thử nghiệm thất bại, mà là chi phí cơ hội của việc đứng yên trong khi ngọn lửa nhiệt huyết phai nhạt.`
        : `Comprehensive evaluation shows you have acquired the prerequisite threshold of experience. The dominant hazard is not trial friction, but the compounding cost of inaction.`,
      confidenceScore: 78,
      keyConditions: isVi 
        ? ['Duy trì kỷ luật ngân sách nghiêm ngặt trong 6 tháng đầu', 'Có quỹ dự phòng cá nhân ít nhất 3-6 tháng', 'Sẵn sàng điều chỉnh mô hình kinh doanh nhanh theo phản hồi thực tế']
        : ['Strict financial discipline during the first 6 months', 'A personal safety reserve of at least 3-6 months', 'Willingness to pivot rapidly based on direct customer signal'],
    },
  };
}
