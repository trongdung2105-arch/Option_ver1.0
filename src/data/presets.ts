import { DecisionAnalysis } from '../types/decision';

export const PRESET_DECISIONS: DecisionAnalysis[] = [
  {
    id: 'preset-freemium-vs-flat20',
    createdAt: new Date().toISOString(),
    dilemma: 'Tôi nên cung cấp phần mềm của mình miễn phí kèm theo các tính năng trả phí (Freemium), hay tính phí cố định 20 đô la/tháng cho gói cao cấp?',
    contextNotes: 'Sản phẩm B2B/Prosumer năng suất làm việc, đội ngũ 2 người sáng lập, ngân sách marketing tự thân (bootstrapped).',
    summary: 'Sự đánh đổi cốt lõi giữa "Tốc độ viral lan tỏa và phễu người dùng khổng lồ nhưng chi phí vận hành cao" (Freemium) so với "Dòng tiền dương tức thì, khách hàng chất lượng cao nhưng đòi hỏi uy tín thương hiệu lớn" (Flat $20/mo).',
    language: 'vi',
    options: [
      {
        id: 'opt-freemium',
        name: 'Mô hình Freemium (Miễn phí + Mua thêm)',
        tagline: 'Mở rộng quy mô nhanh, xây dựng hiệu ứng mạng lưới',
        description: 'Cung cấp phiên bản miễn phí đủ tốt cho 90% nhu cầu cơ bản và khóa các tính năng nâng cao (AI, tích hợp team, bảo mật) sau gói trả phí.',
        pros: [
          {
            id: 'f-pro-1',
            text: 'Tạo phễu Marketing tự nhiên & Viral Loop',
            explanation: 'Người dùng miễn phí trải nghiệm không rào cản và trở thành đại sứ giới thiệu cho bạn bè đồng nghiệp.',
            weight: 9,
            category: 'Tăng trưởng',
          },
          {
            id: 'f-pro-2',
            text: 'Thu thập lượng lớn dữ liệu & phản hồi để hoàn thiện sản phẩm',
            explanation: 'Hàng ngàn người dùng active giúp phát hiện bug nhanh, xác thực Product-Market Fit liên tục.',
            weight: 8,
            category: 'Sản phẩm',
          },
          {
            id: 'f-pro-3',
            text: 'Chi phí tiếp cận khách hàng (CAC) thấp hơn về dài hạn',
            explanation: 'Không cần đốt tiền chạy quảng cáo khi có lượng đăng ký tự nhiên mỗi ngày.',
            weight: 8,
            category: 'Chi phí',
          },
        ],
        cons: [
          {
            id: 'f-con-1',
            text: 'Áp lực chi phí máy chủ & hỗ trợ khách hàng miễn phí',
            explanation: 'Người dùng free thường đặt nhiều câu hỏi support và tốn tài nguyên cloud nhưng không mang lại doanh thu.',
            weight: 8,
            category: 'Vận hành',
          },
          {
            id: 'f-con-2',
            text: 'Tỉ lệ chuyển đổi thường chỉ 2% - 5%',
            explanation: 'Cần hàng chục nghìn lượt đăng ký mới nuôi nổi đội ngũ nếu không có quỹ đầu tư rót vốn.',
            weight: 9,
            category: 'Tài chính',
          },
          {
            id: 'f-con-3',
            text: 'Ranh giới tính năng (Paywall) cực khó cân bằng',
            explanation: 'Nếu bản free quá hào phóng thì không ai mua; nếu bản free quá cùi thì người dùng bỏ đi ngay.',
            weight: 7,
            category: 'Chiến lược',
          },
        ],
        swot: {
          strengths: [
            'Rào cản gia nhập bằng 0 cho người dùng mới',
            'Tốc độ tăng trưởng người dùng đăng ký cực nhanh',
            'Sở hữu tập khách hàng tiềm năng lớn để tiếp thị nội bộ',
          ],
          weaknesses: [
            'Dòng tiền chậm, đòi hỏi vốn dự trữ lớn',
            'Gánh nặng vận hành hạ tầng cho người dùng không trả phí',
            'Dễ bị phân tâm bởi phản hồi từ người không chịu chi tiền',
          ],
          opportunities: [
            'Tận dụng hiệu ứng mạng lưới (Network Effect)',
            'Mở rộng bán gói Team / Enterprise khi nhân viên dùng thử trước',
            'Thu hút nhà đầu tư mạo hiểm nhờ chỉ số tăng trưởng ấn tượng',
          ],
          threats: [
            'Cháy vốn trước khi đạt điểm hòa vốn (Break-even)',
            'Các chi phí AI API tiêu tốn ngân sách khi người free lạm dụng',
          ],
        },
      },
      {
        id: 'opt-flat20',
        name: 'Tính phí cố định 20$/tháng (Free Trial 14 ngày)',
        tagline: 'Dòng tiền bền vững, lọc khách hàng giá trị thực',
        description: 'Không có bản miễn phí vĩnh viễn. Người dùng có 14 ngày dùng thử miễn phí không cần thẻ tín dụng, sau đó phải trả 20$/tháng.',
        pros: [
          {
            id: 'flat-pro-1',
            text: 'Dòng tiền dương và lợi nhuận trên mỗi khách hàng cao ngay lập tức',
            explanation: 'Chỉ cần 100 khách hàng là bạn đã có 2.000$/tháng (ARR 24.000$) để tự nuôi sống dự án.',
            weight: 9,
            category: 'Tài chính',
          },
          {
            id: 'flat-pro-2',
            text: 'Lọc tệp người dùng chất lượng cao, giải quyết nỗi đau thật',
            explanation: 'Khách hàng sẵn sàng trả 20$ thường là chuyên gia hoặc doanh nghiệp, tôn trọng sản phẩm và feedback nghiêm túc.',
            weight: 9,
            category: 'Khách hàng',
          },
          {
            id: 'flat-pro-3',
            text: 'Hạ tầng máy chủ gọn nhẹ, chi phí API kiểm soát 100%',
            explanation: 'Mỗi người dùng tạo ra chi phí server thì đều đóng tiền bù đắp và đem lại biên lợi nhuận cao.',
            weight: 8,
            category: 'Vận hành',
          },
        ],
        cons: [
          {
            id: 'flat-con-1',
            text: 'Rào cản thanh toán cao, số lượng đăng ký ban đầu thấp',
            explanation: 'Người dùng đắn đo rất kỹ trước khi nhập thẻ thanh toán 20$/tháng, đòi hỏi trang đích phải cực kỳ thuyết phục.',
            weight: 8,
            category: 'Tăng trưởng',
          },
          {
            id: 'flat-con-2',
            text: 'Kỳ vọng dịch vụ và trải nghiệm sản phẩm rất khắt khe',
            explanation: 'Khi trả 20$, khách hàng đòi hỏi độ ổn định 99.9%, hỗ trợ nhanh và giải quyết được vấn đề thực tế ngay.',
            weight: 7,
            category: 'Vận hành',
          },
          {
            id: 'flat-con-3',
            text: 'Phải chủ động tìm kiếm và làm marketing bán hàng (Direct Sales/SEO)',
            explanation: 'Sản phẩm không tự lan tỏa mạnh mẽ như bản miễn phí, cần có chiến lược phân phối sắc bén.',
            weight: 8,
            category: 'Marketing',
          },
        ],
        swot: {
          strengths: [
            'Doanh thu dự đoán được (MRR) ngay từ ngày đầu',
            'Tập trung phục vụ 100% người trả tiền',
            'Định vị thương hiệu cao cấp, chuyên nghiệp',
          ],
          weaknesses: [
            'Tốc độ lan truyền thương hiệu chậm hơn',
            'Cần kỹ năng bán hàng và xây dựng lòng tin cao',
          ],
          opportunities: [
            'Mở rộng lên các gói Business 50$-100$/tháng khi sản phẩm mở rộng',
            'Tự chủ tài chính mà không phụ thuộc vào nhà đầu tư bên ngoài',
            'Cung cấp dịch vụ khách hàng 1-1 tạo sự trung thành tuyệt đối',
          ],
          threats: [
            'Bị đối thủ Freemium có nguồn vốn lớn hút sạch thị phần ban đầu',
            'Tỉ lệ hủy gói (Churn Rate) nếu người dùng không thấy giá trị hàng tháng',
          ],
        },
      },
    ],
    comparisonMatrix: {
      criteria: [
        { id: 'c-rev', name: 'Dòng tiền ngắn hạn & Tự chủ tài chính', description: 'Khả năng đem lại tiền mặt nuôi đội ngũ ngay trong 3 tháng đầu', weight: 9 },
        { id: 'c-growth', name: 'Tốc độ thu hút người dùng & Lan tỏa', description: 'Độ lớn của phễu người dùng và nhận diện thương hiệu', weight: 8 },
        { id: 'c-burn', name: 'Kiểm soát chi phí hạ tầng & API AI', description: 'Hạn chế rủi ro hóa đơn cloud và API tăng đột biến ngoài tầm kiểm soát', weight: 8 },
        { id: 'c-support', name: 'Áp lực chăm sóc khách hàng', description: 'Mức độ quá tải ticket hỗ trợ trên quy mô đội ngũ nhỏ', weight: 7 },
        { id: 'c-val', name: 'Khả năng xác thực mức độ sẵn sàng chi trả', description: 'Chứng minh người dùng có thực sự cần sản phẩm đến mức rút ví', weight: 9 },
      ],
      scores: [
        {
          criteriaId: 'c-rev',
          scoresByOption: [
            { optionId: 'opt-freemium', score: 4 },
            { optionId: 'opt-flat20', score: 9 },
          ],
          commentary: 'Phí cố định $20 mang lại doanh thu tức thì; Freemium cần lượng người dùng khổng lồ mới hòa vốn.',
        },
        {
          criteriaId: 'c-growth',
          scoresByOption: [
            { optionId: 'opt-freemium', score: 9 },
            { optionId: 'opt-flat20', score: 5 },
          ],
          commentary: 'Freemium vượt trội về lan tỏa truyền miệng nhờ rào cản bằng 0.',
        },
        {
          criteriaId: 'c-burn',
          scoresByOption: [
            { optionId: 'opt-freemium', score: 4 },
            { optionId: 'opt-flat20', score: 9 },
          ],
          commentary: 'Tính phí $20 đảm bảo mọi người dùng đều bù đắp chi phí server và API AI.',
        },
        {
          criteriaId: 'c-support',
          scoresByOption: [
            { optionId: 'opt-freemium', score: 4 },
            { optionId: 'opt-flat20', score: 8 },
          ],
          commentary: 'Đội 2 người sẽ dễ bị kiệt sức nếu hỗ trợ hàng nghìn người dùng miễn phí.',
        },
        {
          criteriaId: 'c-val',
          scoresByOption: [
            { optionId: 'opt-freemium', score: 5 },
            { optionId: 'opt-flat20', score: 10 },
          ],
          commentary: 'Không có cách kiểm tra nhu cầu thật nào tốt hơn việc yêu cầu khách hàng thanh toán.',
        },
      ],
    },
    towsTactics: [
      {
        type: 'SO',
        title: 'Chiến thuật Hybrid: Dùng thử 14 ngày không cần thẻ + Gói $20',
        action: 'Cho phép người dùng trải nghiệm trọn vẹn toàn bộ tính năng cao cấp trong 14 ngày. Sau 14 ngày, nếu họ không mua, chuyển tài khoản sang chế độ Read-Only thay vì cho dùng mãi mãi.',
        relevantOption: 'Mô hình Tính phí cố định $20/tháng',
      },
      {
        type: 'WO',
        title: 'Giảm rào cản tâm lý bằng chính sách Hoàn tiền 30 ngày',
        action: 'Cam kết "Hoàn tiền 100% không cần lý do trong 30 ngày" để triệt tiêu sự nghi ngại của người mua mới.',
        relevantOption: 'Mô hình Tính phí cố định $20/tháng',
      },
      {
        type: 'ST',
        title: 'Chống đối thủ Freemium bằng dịch vụ White-glove Onboarding',
        action: 'Đích thân founder gọi điện hoặc hỗ trợ setup 1-1 cho 50 khách hàng đầu tiên để tạo sự trung thành vượt bậc.',
        relevantOption: 'Mô hình Tính phí cố định $20/tháng',
      },
      {
        type: 'WT',
        title: 'Giới hạn Token AI cho bản dùng thử',
        action: 'Đặt quota sử dụng rõ ràng trong thời gian thử nghiệm để tránh bị lạm dụng bot cày chi phí API.',
        relevantOption: 'Cả hai lựa chọn',
      },
    ],
    verdict: {
      recommendedOptionId: 'opt-flat20',
      headline: 'The Tiebreaker chọn: Bắt đầu với $20/tháng (Free Trial 14 ngày)',
      rationale: 'Đối với một đội ngũ khởi nghiệp 2 người tự thân (bootstrapped), tiền mặt và sự tập trung là mạng sống. Bắt đầu với $20/tháng giúp bạn chứng minh ngay liệu phần mềm có giải quyết "nỗi đau sâu sắc" hay không, đồng thời bảo vệ bạn khỏi thảm họa chi phí server/API từ hàng vạn người dùng free.',
      confidenceScore: 84,
      keyConditions: [
        'Sản phẩm là công cụ giải quyết bài toán năng suất hoặc kinh doanh cụ thể giúp người dùng tiết kiệm hoặc kiếm ra nhiều hơn 20$.',
        'Đội ngũ chưa có quỹ đầu tư lớn để đốt tiền nuôi hạ tầng miễn phí.',
        'Có sẵn trang landing page nêu bật case study hoặc demo trực quan rõ ràng.',
      ],
    },
  },
  {
    id: 'preset-chicago-vs-austin',
    createdAt: new Date().toISOString(),
    dilemma: 'Should I accept the VP promotion in Chicago requiring relocation, or stay at my fully remote senior role in Austin?',
    contextNotes: 'Current comp $170k in Austin (no state income tax). Chicago offer is $240k + equity bonus, but requires moving with spouse and cold winters.',
    summary: 'A classic tension between rapid executive career trajectory with prestige vs high quality of life, tax efficiency, and remote freedom.',
    language: 'en',
    options: [
      {
        id: 'opt-chicago',
        name: 'Take VP Promotion in Chicago',
        tagline: 'Accelerate to executive leadership with +41% base salary',
        description: 'Relocate to Chicago HQ, manage a team of 18, expand industry network and resume title.',
        pros: [
          { id: 'c-pro-1', text: 'Substantial salary boost & equity expansion', explanation: 'Moves base from $170k to $240k with target 30% performance bonus.', weight: 9, category: 'Financial' },
          { id: 'c-pro-2', text: 'Executive VP title leapfrogs 3-5 years', explanation: 'Direct springboard into future C-level roles or top-tier tech board seats.', weight: 9, category: 'Career' },
          { id: 'c-pro-3', text: 'In-person presence with senior leadership', explanation: 'High visibility with CEO and investors drives sponsorship.', weight: 8, category: 'Influence' },
        ],
        cons: [
          { id: 'c-con-1', text: 'Relocation friction & severe winter adaptation', explanation: 'High cost of moving, adjustment for spouse, harsh Midwest winters.', weight: 8, category: 'Lifestyle' },
          { id: 'c-con-2', text: 'Illinois state income tax + higher city expenses', explanation: 'Tax difference chips away ~12-15% of the gross compensation uplift.', weight: 7, category: 'Financial' },
          { id: 'c-con-3', text: 'Loss of remote calendar autonomy', explanation: 'Demands long hours in office with commute stress.', weight: 8, category: 'Time' },
        ],
        swot: {
          strengths: ['Immediate executive stature', 'Steep leadership learning curve', 'High compensation base'],
          weaknesses: ['Drastic lifestyle disruption', 'Increased daily stress and commute'],
          opportunities: ['Paves path to Chief Operating Officer / President in 4 years', 'World-class Chicago cultural and dining scene'],
          threats: ['Cultural mismatch with HQ politics', 'Potential spouse career compromise'],
        },
      },
      {
        id: 'opt-austin',
        name: 'Stay Remote Senior in Austin',
        tagline: 'Preserve freedom, lifestyle, low taxes, and work-life harmony',
        description: 'Maintain flexible remote senior schedule in Texas with zero state income tax and thriving social circle.',
        pros: [
          { id: 'a-pro-1', text: 'Maximum daily autonomy and zero commute', explanation: 'Control over deep work hours, gym, family life, and remote peace.', weight: 9, category: 'Lifestyle' },
          { id: 'a-pro-2', text: 'Texas 0% state income tax advantage', explanation: 'Keep significantly more net pay per dollar earned.', weight: 8, category: 'Financial' },
          { id: 'a-pro-3', text: 'Established community and mild winter weather', explanation: 'Spouse is settled, robust social network, outdoors lifestyle.', weight: 8, category: 'Personal' },
        ],
        cons: [
          { id: 'a-con-1', text: 'Career plateau risk as remote contributor', explanation: 'Out of sight, out of mind for executive succession planning.', weight: 8, category: 'Career' },
          { id: 'a-con-2', text: 'Opportunity cost of leaving $70k+ on the table', explanation: 'Compensatory gap compounds over retirement horizon.', weight: 8, category: 'Financial' },
        ],
        swot: {
          strengths: ['High psychological safety', 'Zero relocation costs', 'Proven high performance'],
          weaknesses: ['Limited scope of organizational authority'],
          opportunities: ['Time to build side consultancy or angel investments', 'Negotiate targeted remote raise'],
          threats: ['Eventual corporate RTO mandate might force a choice later anyway'],
        },
      },
    ],
    comparisonMatrix: {
      criteria: [
        { id: 'cr-fin', name: 'Net Financial Growth', description: 'Net take-home after cost of living and tax adjustments', weight: 8 },
        { id: 'cr-car', name: '5-Year Career Trajectory', description: 'Acceleration toward long-term executive goals', weight: 9 },
        { id: 'cr-hap', name: 'Day-to-Day Happiness & Health', description: 'Commute, physical well-being, weather, and free time', weight: 9 },
        { id: 'cr-rel', name: 'Family & Relationship Alignment', description: 'Spouse satisfaction and community continuity', weight: 9 },
      ],
      scores: [
        { criteriaId: 'cr-fin', scoresByOption: [{ optionId: 'opt-chicago', score: 8 }, { optionId: 'opt-austin', score: 7 }], commentary: 'Chicago yields more absolute dollars, though taxes narrow the gap.' },
        { criteriaId: 'cr-car', scoresByOption: [{ optionId: 'opt-chicago', score: 9 }, { optionId: 'opt-austin', score: 5 }], commentary: 'VP role is an unmistakable career accelerator.' },
        { criteriaId: 'cr-hap', scoresByOption: [{ optionId: 'opt-chicago', score: 6 }, { optionId: 'opt-austin', score: 9 }], commentary: 'Austin offers dramatically higher day-to-day autonomy.' },
        { criteriaId: 'cr-rel', scoresByOption: [{ optionId: 'opt-chicago', score: 5 }, { optionId: 'opt-austin', score: 9 }], commentary: 'Uprooting family creates real friction unless spouse is thrilled.' },
      ],
    },
    towsTactics: [
      {
        type: 'SO',
        title: 'Counter-Offer Leverage Strategy',
        action: 'Use the Chicago VP offer as leverage to request a remote promotion to Director in Austin with a $205k adjustment.',
        relevantOption: 'Stay Remote Senior in Austin',
      },
      {
        type: 'WO',
        title: 'Pre-Relocation 2-Year Sunset Clause',
        action: 'If taking Chicago, negotiate a 2-year executive contract with guaranteed remote transition after initial team build.',
        relevantOption: 'Take VP Promotion in Chicago',
      },
    ],
    verdict: {
      recommendedOptionId: 'opt-chicago',
      headline: 'The Tiebreaker Verdict: Take the Chicago VP leap (with a 2-year sprint mindset)',
      rationale: 'Executive title inflection points rarely open up with such a clean compensation jump. While day-to-day comfort favors Austin, the regret of playing it safe usually outweighs the transient discomfort of a 2-year relocation sprint that forever sets your resume at the executive tier.',
      confidenceScore: 78,
      keyConditions: [
        'Spouse is genuinely on board or has viable remote/local career avenues in Chicago.',
        'You treat the move as an intentional 2 to 3 year career sprint rather than a permanent relocation.',
      ],
    },
  },
];
