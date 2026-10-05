export type BookCondition = {
  grade: string; cover: string; spine: string; interior: string; markings: string;
};
export type GalleryImage = { label: string; src?: string; alt: string };
export type Book = {
  slug: string; archiveNumber: string; title: string; originalTitle: string;
  category: string; year: number; price: number | null; sold: boolean;
  author: string; publisher: string; language: string; isbn: string | null;
  pages: number; size: string; condition: BookCondition; description: string[];
  discoveryPlace: string; discoveryDate: string; discoveryNote: string;
  coverImage?: string; galleryImages: GalleryImage[]; color: string; ink: string;
};

// All catalogue entries and collection records are fictional prototype data.
const catalogue = [
  { id: "001", title: "비가 그친 뒤의 도쿄", subtitle: "雨のあとの東京", category: "일본 사진집", year: 1982, color: "#68746b", ink: "#f0eadc", status: "available", price: 85000 },
  { id: "002", title: "일상의 사물들", subtitle: "The Shape of Everyday Things", category: "디자인", year: 1974, color: "#c8b89a", ink: "#38372f", status: "available", price: 62000 },
  { id: "003", title: "도시의 작은 문화들", subtitle: "변화하는 도시의 기록", category: "문화 · 절판본", year: 1993, color: "#8f5141", ink: "#f4ead7", status: "archived" },
  { id: "004", title: "폼 — 제17호", subtitle: "FORM / No. 17", category: "빈티지 잡지", year: 1986, color: "#d8d5c9", ink: "#39494e", status: "available", price: 38000 },
  { id: "005", title: "고요한 색의 연구", subtitle: "Studies in Quiet Colour", category: "예술", year: 1979, color: "#354c60", ink: "#eee9db", status: "available", price: 74000 },
  { id: "006", title: "정원과 일상", subtitle: "庭と暮らし", category: "일본 사진집", year: 1971, color: "#b7b99b", ink: "#3c4738", status: "archived" },
  { id: "007", title: "활자의 풍경", subtitle: "인쇄된 형태의 수집", category: "타이포그래피", year: 1988, color: "#c69b6c", ink: "#44362c", status: "available", price: 56000 },
  { id: "008", title: "사물과 공간", subtitle: "Objects & Interiors", category: "건축 · 잡지", year: 1990, color: "#796d78", ink: "#f2e8dd", status: "archived" },
];

const records = [
  { slug: "tokyo-after-the-rain", author: "森田 晴", publisher: "青葉写真社", language: "일본어", pages: 128, size: "210 × 280 mm", place: "서울", date: "2026.09", description: ["비가 그친 도쿄의 골목을 따라 걷는 사진집입니다. 젖은 간판과 비어 있는 정류장, 창문에 남은 빛이 도시의 또 다른 표정을 보여줍니다.", "1980년대의 거리 풍경을 큰 사건 대신 작은 장면으로 담았습니다. 흑백 사진 사이의 긴 여백과 소박한 편집에서도 당시 사진 출판의 감각을 읽을 수 있습니다."], note: "서울의 오래된 헌책방에서 사진집 사이에 꽂혀 있던 책. 흐릿한 거리 사진과 첫 장의 여백이 눈에 들어와 천천히 펼쳐 보았습니다." },
  { slug: "shape-of-everyday-things", author: "Edward Mills", publisher: "Field Press", language: "영어", pages: 192, size: "190 × 250 mm", place: "런던", date: "2026.08", description: ["의자, 주전자, 손잡이처럼 매일 마주치는 사물의 형태를 살펴보는 디자인 서적입니다. 단정한 도해와 짧은 문장으로 물건을 바라보는 시선을 제안합니다.", "1970년대 산업 디자인의 관심이 생활 속으로 옮겨 가던 흔적을 담고 있습니다. 익숙한 물건을 낯설게 다시 보는 즐거움 때문에 수집했습니다."], note: "작은 중고서점의 디자인 서가에서 발견했습니다. 연필로 그린 주전자 도해가 인상적이었습니다." },
  { slug: "small-cultures-of-the-city", author: "김도윤", publisher: "산책출판", language: "한국어", pages: 224, size: "148 × 210 mm", place: "서울", date: "2026.07", description: ["도시의 작은 극장, 음반 가게와 독립적인 모임을 기록한 절판 문화 서적입니다. 장소의 이름보다 그곳을 드나들던 사람들의 목소리에 귀를 기울입니다.", "1990년대의 일상적인 문화가 어떻게 만들어졌는지 보여주는 조각들입니다. 사라진 장소를 기억하는 방식이 흥미로워 아카이브에 남겼습니다."], note: "주말 헌책 시장에서 발견했습니다. 이제는 사라진 거리의 이름들이 목차에 남아 있었습니다." },
  { slug: "form-no-17", author: "폼 편집부", publisher: "Form Editions", language: "영어", pages: 96, size: "220 × 290 mm", place: "도쿄", date: "2026.09", description: ["그래픽 디자인과 시각 문화를 다루던 독립 잡지의 제17호입니다. 실험적인 지면 구성과 제한된 색상 인쇄가 작은 출판물의 자유로운 감각을 보여줍니다.", "1980년대의 편집 디자인을 한 권의 물성으로 살펴볼 수 있습니다. 광고와 본문 사이에 놓인 활자와 이미지의 관계도 흥미롭습니다."], note: "도쿄의 인쇄물 전문점에서 다른 잡지들과 함께 발견했습니다. 큰 제호와 조용한 내지의 대비가 마음에 들었습니다." },
  { slug: "studies-in-quiet-colour", author: "Helen Ward", publisher: "Still House", language: "영어", pages: 160, size: "240 × 270 mm", place: "부산", date: "2026.06", description: ["낮은 채도의 색면과 작은 드로잉을 모은 예술 서적입니다. 작품을 촘촘하게 채우기보다 한 장씩 느리게 바라보도록 구성했습니다.", "1968년부터 1979년까지 이어진 색의 실험을 기록합니다. 오래된 종이에 남은 인쇄의 질감이 작품의 조용한 분위기와 잘 어울립니다."], note: "부산의 작은 책방에서 발견했습니다. 페이지를 넘길 때마다 달라지는 푸른색 때문에 오래 머물렀습니다." },
  { slug: "gardens-and-ordinary-days", author: "佐藤 文子", publisher: "緑書房", language: "일본어", pages: 112, size: "182 × 257 mm", place: "교토", date: "2026.05", description: ["정원과 그 곁의 생활을 기록한 일본 사진집입니다. 화려한 조경 대신 작은 화분, 흙길과 창가의 풍경을 담았습니다.", "1970년대 주거 문화 속에서 자연과 생활이 만나는 모습을 보여줍니다. 손이 닿는 크기의 정원을 오래 바라보는 태도가 이 책의 매력입니다."], note: "교토의 골목 책방에서 수집했습니다. 작은 정원의 사진 옆에 적힌 계절의 이름들이 기억에 남습니다." },
  { slug: "landscapes-of-type", author: "박서진", publisher: "글자공방", language: "한국어", pages: 176, size: "210 × 260 mm", place: "인천", date: "2026.08", description: ["간판, 포스터와 소책자에 쓰인 활자를 모은 타이포그래피 서적입니다. 반듯한 글자뿐 아니라 손으로 고쳐 쓴 흔적도 함께 살펴봅니다.", "1980년대 인쇄 문화의 여러 표정을 담았습니다. 글자를 정보와 풍경 사이에서 바라보는 시선이 흥미로워 수집했습니다."], note: "오래된 인쇄소 인근 헌책방에서 발견했습니다. 내지의 간판 사진들이 동네의 기억처럼 보였습니다." },
  { slug: "objects-and-interiors", author: "사물과 공간 편집부", publisher: "Room Journal", language: "영어", pages: 104, size: "230 × 300 mm", place: "서울", date: "2026.04", description: ["사람이 머문 공간과 그 안의 사물을 소개하는 건축 잡지입니다. 완벽하게 정돈된 실내보다 책과 도구가 쌓인 생활의 장면을 담았습니다.", "1990년대의 실내 풍경과 인쇄 사진의 따뜻한 색감을 함께 살펴볼 수 있습니다. 공간을 사용하는 사람의 취향이 자연스럽게 드러나는 기록입니다."], note: "서울의 벼룩시장에서 여러 건축 잡지와 함께 발견했습니다. 책으로 가득한 작은 방의 사진을 보고 골랐습니다." },
];

export const books: Book[] = catalogue.map((entry, index) => {
  const record = records[index];
  return {
    slug: record.slug, archiveNumber: `SMH-${String(index + 1).padStart(4, "0")}`,
    title: entry.title, originalTitle: [2, 6].includes(index) ? "" : entry.subtitle,
    category: entry.category, year: entry.year,
    price: "price" in entry ? entry.price! : null, sold: entry.status === "archived",
    author: record.author, publisher: record.publisher, language: record.language,
    isbn: null, pages: record.pages, size: record.size,
    condition: { grade: index === 3 ? "B" : "B+", cover: "가장자리에 약간의 사용감", spine: "양호하며 제본이 견고함", interior: "세월에 따른 자연스러운 변색", markings: "필기 없음" },
    description: record.description, discoveryPlace: record.place,
    discoveryDate: record.date, discoveryNote: record.note,
    coverImage: undefined,
    galleryImages: ["표지", "뒤표지", "책등", "내지", "세부 사진"].map((label) => ({ label, src: undefined, alt: `${entry.title} — ${label}` })),
    color: entry.color, ink: entry.ink,
  };
});

export function getBook(slug: string) { return books.find((book) => book.slug === slug); }
export function bookPrice(book: Book) { return book.sold ? "판매완료 / 아카이브" : `₩${book.price?.toLocaleString("ko-KR")}`; }