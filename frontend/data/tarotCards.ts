export interface TarotCard {
    id: number;
    name: string; // 영문명 (서브)
    nameKo: string; // 한글명 (메인)
    image: string; // Path to image
    meaningUpright: string; // 정방향 의미
    meaningReversed: string; // 역방향 의미
    desc: string; // 카드 설명
}

export const majorArcana: TarotCard[] = [
    {
        id: 0,
        name: "The Fool",
        nameKo: "광대",
        image: "/tarot/major/card-0_the_fool-.png",
        meaningUpright: "새로운 시작, 순수함, 자발성, 자유로운 영혼",
        meaningReversed: "망설임, 무모함, 과도한 위험 감수",
        desc: "오늘은 머뭇거림을 버리고 마음이 이끄는 대로 새롭게 시작해보기 좋은 날입니다. 결과에 대한 두려움보다는 당신 안에 숨겨진 무한한 가능성을 믿고 한 걸음 내디뎌 보세요."
    },
    {
        id: 1,
        name: "The Magician",
        nameKo: "마법사",
        image: "/tarot/major/card-1_the_magician.png",
        meaningUpright: "창조력, 잠재력 발현, 재치, 영감에 찬 행동",
        meaningReversed: "조작, 빈약한 계획, 실력 발휘 부족",
        desc: "당신 앞에는 이미 필요한 모든 능력과 자원이 갖춰져 있습니다. 자신감을 가지고 주변 상황을 주도적으로 이끌어간다면 기대 이상의 멋진 결과를 만들어낼 수 있을 것입니다."
    },
    {
        id: 2,
        name: "The High Priestess",
        nameKo: "여사제",
        image: "/tarot/major/card-2_high_priestess.png",
        meaningUpright: "직관, 신성한 지혜, 여성성, 잠재의식",
        meaningReversed: "숨겨진 비밀, 직관의 단절, 고립과 침묵",
        desc: "논리적인 판단도 중요하지만, 오늘은 당신의 직관과 내면의 목소리에 귀를 기울여 보세요. 겉으로 드러난 상황 이면에 숨겨진 진짜 진실을 볼 수 있는 지혜가 필요한 하루입니다."
    },
    {
        id: 3,
        name: "The Empress",
        nameKo: "여황제",
        image: "/tarot/major/card-3_empress.png",
        meaningUpright: "여성성, 아름다움, 자연, 포용, 풍요",
        meaningReversed: "창작의 막힘, 타인에 대한 과도한 의존",
        desc: "당신의 노력과 정성이 풍성한 결실을 맺을 준비를 하고 있습니다. 오늘은 스스로를 아끼고, 주변 사람들을 따뜻하게 품어주는 여유롭고 풍요로운 마음가짐을 가져보세요."
    },
    {
        id: 4,
        name: "The Emperor",
        nameKo: "황제",
        image: "/tarot/major/card-4_emperor.png",
        meaningUpright: "권위, 확립, 체계 정립, 가부장적 힘",
        meaningReversed: "지배욕, 과도한 통제, 규율의 부족, 융통성 없음",
        desc: "명확한 원칙과 체계적인 계획이 오늘 하루를 든든하게 받쳐줄 것입니다. 감정에 흔들리기보다는 이성적이고 책임감 있는 태도로 당면한 문제들을 하나씩 통제해 나가세요."
    },
    {
        id: 5,
        name: "The Hierophant",
        nameKo: "교황",
        image: "/tarot/major/card-5-hierophant.png",
        meaningUpright: "영적 지혜, 종교적 신념, 순응, 전통, 제도",
        meaningReversed: "개인적 믿음 구축, 맹신에서의 탈피, 체제에 대한 도전",
        desc: "독창적인 방식보다는 검증된 방식과 전통적인 규칙을 따르는 것이 매끄러운 진행을 돕습니다. 막막할 때는 믿을 수 있는 선배나 멘토에게 조언을 구하는 것도 큰 도움이 될 것입니다."
    },
    {
        id: 6,
        name: "The Lovers",
        nameKo: "연인",
        image: "/tarot/major/card-6-lovers.png",
        meaningUpright: "사랑, 조화, 깊은 관계, 가치관의 일치, 중요한 선택",
        meaningReversed: "스스로에 대한 사랑의 결핍, 부조화, 불균형, 엇갈리는 가치관",
        desc: "관계와 소통에서 긍정적인 에너지가 넘치는 날입니다. 사랑하는 사람과의 유대를 깊게 하거나, 중요한 선택의 기로에서는 마음이 진정으로 끌리는 쪽을 솔직하게 선택해 보세요."
    },
    {
        id: 7,
        name: "The Chariot",
        nameKo: "전차",
        image: "/tarot/major/card-7-chariot.png",
        meaningUpright: "통제력, 의지, 성공, 행동, 결단력",
        meaningReversed: "규율 상실, 반대 세력, 방향성의 부재",
        desc: "강한 추진력과 흔들리지 않는 의지가 필요한 때입니다. 주변의 반대나 장애물에 굴하지 않고 당신의 목표를 향해 자신감 있게 밀어붙인다면 분명코 승리를 거머쥘 수 있습니다."
    },
    {
        id: 8,
        name: "Strength",
        nameKo: "힘",
        image: "/tarot/major/card-8-strength.png",
        meaningUpright: "내면의 힘, 용기, 부드러운 설득, 포용, 자비",
        meaningReversed: "자신감 부족, 회의감, 저하된 에너지, 감정 조절 실패",
        desc: "진정한 힘은 강압이 아니라 부드러움과 포용력에서 나옵니다. 화가 나거나 지치는 상황이 생기더라도, 짜증보다는 따뜻한 이해심으로 인내한다면 상대를 부드럽게 설득할 수 있습니다."
    },
    {
        id: 9,
        name: "The Hermit",
        nameKo: "은둔자",
        image: "/tarot/major/card-9-hermit.png",
        meaningUpright: "자아 성찰, 내면 여행, 고독한 시간, 내면의 인도",
        meaningReversed: "고립, 외로움, 현실 도피, 마음의 문을 닫음",
        desc: "시끌벅적한 외부 활동보다는 혼자만의 조용한 사색이 꼭 필요한 날입니다. 한 걸음 물러나 내면의 지혜를 탐구하며 마음의 에너지를 차분하게 충전하는 시간을 가져보세요."
    },
    {
        id: 10,
        name: "Wheel of Fortune",
        nameKo: "운명의 수레바퀴",
        image: "/tarot/major/card-10-whell_of_fortune.png",
        meaningUpright: "행운, 업보, 삶의 순환, 피할 수 없는 운명, 전환점",
        meaningReversed: "불운, 변화에 대한 저항, 끊기지 않는 악순환",
        desc: "우연한 기회나 예상치 못한 변화의 바람이 불어오고 있습니다. 흐름을 억지로 거스르려 하지 말고, 운명이 이끄는 새로운 전환점 앞에서 긍정적으로 기회를 붙잡아 보세요."
    },
    {
        id: 11,
        name: "Justice",
        nameKo: "정의",
        image: "/tarot/major/card-11-justice.png",
        meaningUpright: "정의, 공명정대, 진실, 인과응보, 법과 기준",
        meaningReversed: "불공평함, 편향된 심판, 무책임, 부정직",
        desc: "감정에 치우친 섣부른 판단보다는 객관적이고 공명정대한 시각이 필수적입니다. 해야 할 일과 하지 말아야 할 일을 명확하게 구분하고, 불균형한 요소들을 바로잡아 나가세요."
    },
    {
        id: 12,
        name: "The Hanged Man",
        nameKo: "매달린 사람",
        image: "/tarot/major/card-12-hanged-man.png",
        meaningUpright: "휴식, 순응, 내려놓음, 새로운 시각, 헌신",
        meaningReversed: "지연, 발전 없는 정체, 우유부단함",
        desc: "일이 뜻대로 풀리지 않는다면 억지로 밀어붙이기보다 잠시 멈춤을 선택하세요. 관점을 완전히 거꾸로 뒤집어 바라본다면, 정체된 상황을 타개할 새로운 깨달음을 얻게 될 것입니다."
    },
    {
        id: 13,
        name: "Death",
        nameKo: "죽음",
        image: "/tarot/major/card-13-death.png",
        meaningUpright: "끝맺음, 변화, 근본적인 전환, 낡은 것의 정리",
        meaningReversed: "변화에 대한 저항망, 개인적 집착, 속 시원한 해소의 지연",
        desc: "불필요해진 낡은 습관이나 미련을 과감하게 끊어내야 할 시점입니다. 끝맺음은 두려운 것이 아니며, 오히려 더 새롭고 건강한 시작을 위해 반드시 거쳐야 하는 정화의 과정입니다."
    },
    {
        id: 14,
        name: "Temperance",
        nameKo: "절제",
        image: "/tarot/major/card-14-temperance.png",
        meaningUpright: "균형, 중용, 인내심, 뚜렷한 목적",
        meaningReversed: "불균형, 극단적인 성향, 무절제, 재정비 필요",
        desc: "양극단으로 치우치지 않는 적절한 균형과 조화가 오늘 하루의 핵심입니다. 서두르지 말고 차분하게 인내하며, 어긋난 것들을 서로 잘 섞고 타협점을 찾아가는 지혜를 발휘해 보세요."
    },
    {
        id: 15,
        name: "The Devil",
        nameKo: "악마",
        image: "/tarot/major/card-15-devil.png",
        meaningUpright: "어두운 내면, 집착, 중독, 억압, 강렬한 유혹",
        meaningReversed: "구속에서의 해방, 어두움의 극복, 얽매임의 끊어짐",
        desc: "순간적인 유혹이나 끊어내지 못한 집착이 당신의 눈을 가리고 있지는 않은지 돌아보세요. 건강하지 못한 습관이나 지나친 세속적 욕심에서 이제는 스스로를 해방시켜야 할 때입니다."
    },
    {
        id: 16,
        name: "The Tower",
        nameKo: "탑",
        image: "/tarot/major/card-16-tower.png",
        meaningUpright: "갑작스러운 붕괴, 재난, 큰 혼란, 뜻밖의 진실, 불가항력",
        meaningReversed: "사적인 고통, 파국의 모면, 피하기 힘든 두려움",
        desc: "갑작스러운 계획의 차질이나 예상치 못한 변화에 당황할 수 있는 날입니다. 하지만 무너진 낡은 틀의 자리에는 훨씬 더 튼튼하고 새로운 기회가 세워질 테니 변화를 수용하세요."
    },
    {
        id: 17,
        name: "The Star",
        nameKo: "별",
        image: "/tarot/major/card-17-star.png",
        meaningUpright: "희망, 치유, 믿음, 긍정적 목표, 회복, 영적 충만",
        meaningReversed: "절망감, 무기력, 신념 상실, 현실과 동떨어짐",
        desc: "힘들었던 시간들을 뒤로하고 치유와 긍정적인 희망의 빛이 반짝이기 시작했습니다. 잃어버렸던 신념을 되찾고 당신이 진정 꿈꾸던 목표를 향해 낙관적인 마음으로 다가가 보세요."
    },
    {
        id: 18,
        name: "The Moon",
        nameKo: "달",
        image: "/tarot/major/card-18-moon.png",
        meaningUpright: "환상, 불확실성, 직관력, 숨겨진 진실, 불안과 두려움",
        meaningReversed: "공포의 해방, 드러나는 진상, 극복되는 혼돈",
        desc: "상황이 명확하지 않아 막연한 불안감이나 두려움이 피어오를 수 있습니다. 성급하게 결론을 내리기보다는 은연중에 전해지는 직관을 믿고 혼돈의 시기가 지나가기를 차분히 기다려 보세요."
    },
    {
        id: 19,
        name: "The Sun",
        nameKo: "태양",
        image: "/tarot/major/card-19-sun.png",
        meaningUpright: "긍정, 에너지, 발랄함, 성공, 넘치는 활력",
        meaningReversed: "일시적인 우울감, 열정의 하락, 감춰인 기쁨",
        desc: "먹구름이 걷히고 밝고 긍정적인 생명력이 가득 차오르는 눈부신 하루입니다. 어린아이처럼 순수하게 기뻐하고 활기차게 에너지를 발산한다면 모든 일이 순조롭게 성공할 것입니다."
    },
    {
        id: 20,
        name: "Judgement",
        nameKo: "심판",
        image: "/tarot/major/card-20-judgement.png",
        meaningUpright: "심판, 부활, 내면의 부름, 구원, 큰 각성",
        meaningReversed: "자기 회의, 심판에 대한 두려움, 변화의 거부",
        desc: "과거의 노력들이 드디어 제대로 된 평가와 보상을 받게 되는 각성의 순간입니다. 스스로를 짓눌렀던 한계에서 벗어나, 내면의 부름을 듣고 한 단계 새롭게 도약할 준비를 하세요."
    },
    {
        id: 21,
        name: "The World",
        nameKo: "세계",
        image: "/tarot/major/card-21-world.png",
        meaningUpright: "완성, 통합, 성취, 목표 도달, 해피엔딩, 여행",
        meaningReversed: "마무리의 지연, 미완성, 지지부진한 결말",
        desc: "오랜 시간 공들여온 일이 성공적으로 마무리되며 완벽한 매듭을 짓게 됩니다. 당신이 성취한 작고 큰 결실들을 충분히 축하하며, 마음의 조화와 평안 속에서 다음 여정을 준비하세요."
    }
];

export const tarotCards = [...majorArcana];
