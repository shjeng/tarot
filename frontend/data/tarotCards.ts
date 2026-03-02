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
        image: "/tarot/major/00_the_fool.jpg",
        meaningUpright: "새로운 시작, 순수함, 자발성, 자유로운 영혼",
        meaningReversed: "망설임, 무모함, 과도한 위험 감수",
        desc: "위험을 모른 채 벼랑 끝에 서 있는 젊은이로, 무한한 잠재력과 자유로운 출발을 상징합니다."
    },
    {
        id: 1,
        name: "The Magician",
        nameKo: "마법사",
        image: "/tarot/major/01_the_magician.jpg",
        meaningUpright: "창조력, 잠재력 발현, 재치, 영감에 찬 행동",
        meaningReversed: "조작, 빈약한 계획, 실력 발휘 부족",
        desc: "한 손은 하늘을, 다른 한 손은 땅을 가리키며 정신과 물질세계를 연결하는 능력을 보여줍니다."
    },
    {
        id: 2,
        name: "The High Priestess",
        nameKo: "여사제",
        image: "/tarot/major/02_the_high_priestess.jpg",
        meaningUpright: "직관, 신성한 지혜, 여성성, 잠재의식",
        meaningReversed: "숨겨진 비밀, 직관의 단절, 고립과 침묵",
        desc: "지식과 신비의 베일을 지키며 두 기둥 사이에 앉아 있는 지혜로운 여성이 직관을 따르라 조언합니다."
    },
    {
        id: 3,
        name: "The Empress",
        nameKo: "여황제",
        image: "/tarot/major/03_the_empress.jpg",
        meaningUpright: "여성성, 아름다움, 자연, 포용, 풍요",
        meaningReversed: "창작의 막힘, 타인에 대한 과도한 의존",
        desc: "자연에 둘러싸인 아름다운 여성이 왕좌에 앉아 다산과 넉넉하고 따뜻한 풍요로움을 상징합니다."
    },
    {
        id: 4,
        name: "The Emperor",
        nameKo: "황제",
        image: "/tarot/major/04_the_emperor.jpg",
        meaningUpright: "권위, 확립, 체계 정립, 가부장적 힘",
        meaningReversed: "지배욕, 과도한 통제, 규율의 부족, 융통성 없음",
        desc: "보주와 홀을 들고 돌로 된 왕좌에 앉은 엄격한 군주로, 흔들림 없는 안정과 통제력을 은유합니다."
    },
    {
        id: 5,
        name: "The Hierophant",
        nameKo: "교황",
        image: "/tarot/major/05_the_hierophant.jpg",
        meaningUpright: "영적 지혜, 종교적 신념, 순응, 전통, 제도",
        meaningReversed: "개인적 믿음 구축, 맹신에서의 탈피, 체제에 대한 도전",
        desc: "두 신도에게 축복을 내리며 두 기둥 사이에 앉아 있는 종교적 지도자가 전통과 규범을 안내합니다."
    },
    {
        id: 6,
        name: "The Lovers",
        nameKo: "연인",
        image: "/tarot/major/06_the_lovers.jpg",
        meaningUpright: "사랑, 조화, 깊은 관계, 가치관의 일치, 중요한 선택",
        meaningReversed: "스스로에 대한 사랑의 결핍, 부조화, 불균형, 엇갈리는 가치관",
        desc: "천사 아래에 서 있는 남녀의 모습으로, 결합과 중요한 삶의 선택의 기로를 상징합니다."
    },
    {
        id: 7,
        name: "The Chariot",
        nameKo: "전차",
        image: "/tarot/major/07_the_chariot.jpg",
        meaningUpright: "통제력, 의지, 성공, 행동, 결단력",
        meaningReversed: "규율 상실, 반대 세력, 방향성의 부재",
        desc: "전차에 탄 전사가 이질적인 두 마리의 스핑크스를 이끄는 모습으로, 강력한 의지로 이뤄내는 승리를 보여줍니다."
    },
    {
        id: 8,
        name: "Strength",
        nameKo: "힘",
        image: "/tarot/major/08_strength.jpg",
        meaningUpright: "내면의 힘, 용기, 부드러운 설득, 포용, 자비",
        meaningReversed: "자신감 부족, 회의감, 저하된 에너지, 감정 조절 실패",
        desc: "사자를 길들이는 부드러운 여성의 묘사하며, 진정한 강함은 폭력이 아닌 자비와 포용에서 옴을 나타냅니다."
    },
    {
        id: 9,
        name: "The Hermit",
        nameKo: "은둔자",
        image: "/tarot/major/09_the_hermit.jpg",
        meaningUpright: "자아 성찰, 내면 여행, 고독한 시간, 내면의 인도",
        meaningReversed: "고립, 외로움, 현실 도피, 마음의 문을 닫음",
        desc: "자신만의 진리를 찾기 위해 외딴 산꼭대기에서 홀로 등불을 들고 발밑을 밝히는 노인의 모습입니다."
    },
    {
        id: 10,
        name: "Wheel of Fortune",
        nameKo: "운명의 수레바퀴",
        image: "/tarot/major/10_wheel_of_fortune.jpg",
        meaningUpright: "행운, 업보, 삶의 순환, 피할 수 없는 운명, 전환점",
        meaningReversed: "불운, 변화에 대한 저항, 끊기지 않는 악순환",
        desc: "생명의 굴레를 도는 수레바퀴 주위에 다양한 생물들이 돌고 있는 모습으로, 돌고 도는 삶을 상징합니다."
    },
    {
        id: 11,
        name: "Justice",
        nameKo: "정의",
        image: "/tarot/major/11_justice.jpg",
        meaningUpright: "정의, 공명정대, 진실, 인과응보, 법과 기준",
        meaningReversed: "불공평함, 편향된 심판, 무책임, 부정직",
        desc: "저울과 검을 들고 보라색 장막 앞에 앉아, 객관적인 진실과 감정에 치우치지 않는 공명정대함을 보여줍니다."
    },
    {
        id: 12,
        name: "The Hanged Man",
        nameKo: "매달린 사람",
        image: "/tarot/major/12_the_hanged_man.jpg",
        meaningUpright: "휴식, 순응, 내려놓음, 새로운 시각, 헌신",
        meaningReversed: "지연, 발전 없는 정체, 우유부단함",
        desc: "나무에 거꾸로 매달려 있지만 평온한 얼굴을 한 남자로, 잠시 멈춤을 통한 관점의 극적인 전환을 요구합니다."
    },
    {
        id: 13,
        name: "Death",
        nameKo: "죽음",
        image: "/tarot/major/13_death.jpg",
        meaningUpright: "끝맺음, 변화, 근본적인 전환, 낡은 것의 정리",
        meaningReversed: "변화에 대한 저항망, 개인적 집착, 속 시원한 해소의 지연",
        desc: "흰 말을 탄 해골 기사는 절망적인 파멸이 아닌, 불필요한 것의 종결과 생명력 있는 재탄생을 상징합니다."
    },
    {
        id: 14,
        name: "Temperance",
        nameKo: "절제",
        image: "/tarot/major/14_temperance.jpg",
        meaningUpright: "균형, 중용, 인내심, 뚜렷한 목적",
        meaningReversed: "불균형, 극단적인 성향, 무절제, 재정비 필요",
        desc: "한 발은 땅에, 한 발은 물에 담근 채 두 컵 사이로 조심스레 물을 섞고 있는 천사가 절제와 조화로움을 상징합니다."
    },
    {
        id: 15,
        name: "The Devil",
        nameKo: "악마",
        image: "/tarot/major/15_the_devil.jpg",
        meaningUpright: "어두운 내면, 집착, 중독, 억압, 강렬한 유혹",
        meaningReversed: "구속에서의 해방, 어두움의 극복, 얽매임의 끊어짐",
        desc: "목이 쇠사슬로 묶인 남녀 위에 서 있는 악마로, 뗄 수 없게 얽혀 버린 세속적이며 물질적인 욕망을 뜻합니다."
    },
    {
        id: 16,
        name: "The Tower",
        nameKo: "탑",
        image: "/tarot/major/16_the_tower.jpg",
        meaningUpright: "갑작스러운 붕괴, 재난, 큰 혼란, 뜻밖의 진실, 불가항력",
        meaningReversed: "사적인 고통, 파국의 모면, 피하기 힘든 두려움",
        desc: "벼락을 맞아 무너지는 탑에서 사람들이 떨어지는 모습으로, 낡은 가치관이나 상황이 파괴되며 찾아오는 혁명적 변화입니다."
    },
    {
        id: 17,
        name: "The Star",
        nameKo: "별",
        image: "/tarot/major/17_the_star.jpg",
        meaningUpright: "희망, 치유, 믿음, 긍정적 목표, 회복, 영적 충만",
        meaningReversed: "절망감, 무기력, 신념 상실, 현실과 동떨어짐",
        desc: "별이 빛나는 밤하늘 아래, 대지와 물에 끊임없이 생명수를 붓는 여인으로 무한한 자애와 밝은 희망을 상징합니다."
    },
    {
        id: 18,
        name: "The Moon",
        nameKo: "달",
        image: "/tarot/major/18_the_moon.jpg",
        meaningUpright: "환상, 불확실성, 직관력, 숨겨진 진실, 불안과 두려움",
        meaningReversed: "공포의 해방, 드러나는 진상, 극복되는 혼돈",
        desc: "달을 향해 짖는 개와 늑대, 물에서 기어 나오는 가재의 형상으로 미지의 두려움과 잠재의식 속 예감을 보여줍니다."
    },
    {
        id: 19,
        name: "The Sun",
        nameKo: "태양",
        image: "/tarot/major/19_the_sun.jpg",
        meaningUpright: "긍정, 에너지, 발랄함, 성공, 넘치는 활력",
        meaningReversed: "일시적인 우울감, 열정의 하락, 감춰인 기쁨",
        desc: "거대한 태양 아래 하얀 말에서 뛰노는 벗은 아이의 모습으로, 한 점 부끄러움 없는 맑은 기쁨과 확고한 성공을 나타냅니다."
    },
    {
        id: 20,
        name: "Judgement",
        nameKo: "심판",
        image: "/tarot/major/20_judgement.jpg",
        meaningUpright: "심판, 부활, 내면의 부름, 구원, 큰 각성",
        meaningReversed: "자기 회의, 심판에 대한 두려움, 변화의 거부",
        desc: "구원을 부르는 천사의 나팔 소리에 관에서 깨어난 사람들을 그리며, 지난 행적의 귀결과 진정한 재탄생을 알립니다."
    },
    {
        id: 21,
        name: "The World",
        nameKo: "세계",
        image: "/tarot/major/21_the_world.jpg",
        meaningUpright: "완성, 통합, 성취, 목표 도달, 해피엔딩, 여행",
        meaningReversed: "마무리의 지연, 미완성, 지지부진한 결말",
        desc: "월계관 안에서 춤추는 사람과 그를 감싼 네 가지 생물들로 굳건하게 쟁취해낸 최종적인 완성과 조화를 상징합니다."
    }
];

export const tarotCards = [...majorArcana];
