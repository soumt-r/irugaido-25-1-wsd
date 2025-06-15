import locationsData from "../data/locations.json"
import phrasesData from "../data/phrases.json"
import vocabularyData from "../data/vocabulary.json"
import charactersData from "../data/characters.json"

// 데이터 타입 정의
export interface Location {
  id: string
  name: string
  nameJp: string
  description: string
  longDescription?: string
  image: string
  imageQuery?: string
  gallery?: string[]
  region: string
  prefecture: string
  address: string
  addressKr: string
  hours: string
  phone: string
  website: string
  rating: number
  tags: string[]
  isLocalRecommended: boolean
  localExpert?: {
    id: string
    name: string
  }
  relatedPhraseIds: string[]
  relatedVocabularyIds: string[]
  tips: string[]
  nearbyLocationIds: string[]
}

export interface Phrase {
  id: string
  situation: string
  situationJp: string
  jp: string
  kr: string
  audio: string
  level: string
  tags: string[]
  relatedLocationIds: string[]
  relatedVocabularyIds: string[]
}

export interface Vocabulary {
  id: string
  jp: string
  kr: string
  romaji: string
  example: string
  exampleKr: string
  category: string
  tags: string[]
  relatedPhraseIds: string[]
}

export interface Character {
  id: string
  character: string
  romaji: string
  type: string
  examples: string[]
  relatedVocabularyIds: string[]
}

// 지역 이름 매핑 (영어 ID -> 한글 이름)
export const regionNameMap: Record<string, string> = {
  hokkaido: "홋카이도",
  tohoku: "도호쿠",
  kanto: "간토",
  chubu: "추부",
  kinki: "긴키",
  chugoku: "주고쿠",
  shikoku: "시코쿠",
  kyushu: "규슈",
  okinawa: "오키나와",
}

// 도도부현 이름 매핑 (영어 ID -> 한글 이름)
export const prefectureNameMap: Record<string, string> = {
  hokkaido: "홋카이도",
  aomori: "아오모리현",
  iwate: "이와테현",
  miyagi: "미야기현",
  akita: "아키타현",
  yamagata: "야마가타현",
  fukushima: "후쿠시마현",
  ibaraki: "이바라키현",
  tochigi: "도치기현",
  gunma: "군마현",
  saitama: "사이타마현",
  chiba: "치바현",
  tokyo: "도쿄도",
  kanagawa: "가나가와현",
  niigata: "니가타현",
  toyama: "도야마현",
  ishikawa: "이시카와현",
  fukui: "후쿠이현",
  yamanashi: "야마나시현",
  nagano: "나가노현",
  gifu: "기후현",
  shizuoka: "시즈오카현",
  aichi: "아이치현",
  mie: "미에현",
  shiga: "시가현",
  kyoto: "교토부",
  osaka: "오사카부",
  hyogo: "효고현",
  nara: "나라현",
  wakayama: "와카야마현",
  tottori: "돗토리현",
  shimane: "시마네현",
  okayama: "오카야마현",
  hiroshima: "히로시마현",
  yamaguchi: "야마구치현",
  tokushima: "도쿠시마현",
  kagawa: "가가와현",
  ehime: "에히메현",
  kochi: "고치현",
  fukuoka: "후쿠오카현",
  saga: "사가현",
  nagasaki: "나가사키현",
  kumamoto: "구마모토현",
  oita: "오이타현",
  miyazaki: "미야자키현",
  kagoshima: "가고시마현",
  okinawa: "오키나와현",
}

// 데이터 로드 함수 - 서버 사이드에서만 사용
export async function getLocations(): Promise<Location[]> {
  try {
    return locationsData.locations || []
  } catch (error) {
    console.error("Error loading locations:", error)
    return []
  }
}

export async function getPhrases(): Promise<Phrase[]> {
  try {
    return phrasesData.phrases || []
  } catch (error) {
    console.error("Error loading phrases:", error)
    return []
  }
}

export async function getVocabulary(): Promise<Vocabulary[]> {
  try {
    return vocabularyData.vocabulary || []
  } catch (error) {
    console.error("Error loading vocabulary:", error)
    return []
  }
}

export async function getCharacters(): Promise<Character[]> {
  try {
    return charactersData.characters || []
  } catch (error) {
    console.error("Error loading characters:", error)
    return []
  }
}

// 특정 ID로 데이터 가져오기
export async function getLocationById(id: string): Promise<Location | null> {
  const locations = await getLocations()
  return locations.find((location) => location.id === id) || null
}

export async function getPhraseById(id: string): Promise<Phrase | null> {
  const phrases = await getPhrases()
  return phrases.find((phrase) => phrase.id === id) || null
}

export async function getVocabularyById(id: string): Promise<Vocabulary | null> {
  const vocabulary = await getVocabulary()
  return vocabulary.find((word) => word.id === id) || null
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const characters = await getCharacters()
  return characters.find((char) => char.id === id) || null
}

// 필터링 함수
export async function getLocationsByRegion(region: string): Promise<Location[]> {
  const locations = await getLocations()
  return locations.filter((location) => location.region === region || location.prefecture === region)
}

export async function getPhrasesByLevel(level: string): Promise<Phrase[]> {
  const phrases = await getPhrases()
  return phrases.filter((phrase) => phrase.level === level)
}

export async function getPhrasesBySituation(situation: string): Promise<Phrase[]> {
  const phrases = await getPhrases()
  return phrases.filter((phrase) => phrase.situation === situation)
}

export async function getVocabularyByCategory(category: string): Promise<Vocabulary[]> {
  const vocabulary = await getVocabulary()
  return vocabulary.filter((word) => word.category === category)
}

export async function getCharactersByType(type: string): Promise<Character[]> {
  const characters = await getCharacters()
  return characters.filter((char) => char.type === type)
}

// 관련 데이터 가져오기
export async function getRelatedPhrases(locationId: string): Promise<Phrase[]> {
  const phrases = await getPhrases()
  return phrases.filter((phrase) => phrase.relatedLocationIds.includes(locationId))
}

export async function getRelatedVocabulary(locationId: string): Promise<Vocabulary[]> {
  const location = await getLocationById(locationId)
  if (!location) return []

  const vocabulary = await getVocabulary()
  return vocabulary.filter((word) => location.relatedVocabularyIds.includes(word.id))
}

export async function getRelatedLocations(phraseId: string): Promise<Location[]> {
  const phrase = await getPhraseById(phraseId)
  if (!phrase) return []

  const locations = await getLocations()
  return locations.filter((location) => phrase.relatedLocationIds.includes(location.id))
}

export async function getVocabularyForPhrase(phraseId: string): Promise<Vocabulary[]> {
  const phrase = await getPhraseById(phraseId)
  if (!phrase) return []

  const vocabulary = await getVocabulary()
  return vocabulary.filter((word) => phrase.relatedVocabularyIds.includes(word.id))
}

export async function getPhrasesForVocabulary(vocabularyId: string): Promise<Phrase[]> {
  const vocabulary = await getVocabularyById(vocabularyId)
  if (!vocabulary) return []

  const phrases = await getPhrases()
  return phrases.filter((phrase) => vocabulary.relatedPhraseIds.includes(phrase.id))
}

export async function getLocationsForVocabulary(vocabularyId: string): Promise<Location[]> {
  const locations = await getLocations()
  return locations.filter((location) => location.relatedVocabularyIds.includes(vocabularyId))
}

export async function getNearbyLocations(locationId: string): Promise<Location[]> {
  const location = await getLocationById(locationId)
  if (!location) return []

  const locations = await getLocations()
  return locations.filter((loc) => location.nearbyLocationIds.includes(loc.id))
}

// 단어를 참조하는 장소와 회화 가져오기
export async function getLocationsReferencingVocabulary(vocabularyId: string): Promise<Location[]> {
  const locations = await getLocations()
  return locations.filter((location) => location.relatedVocabularyIds.includes(vocabularyId))
}

export async function getPhrasesReferencingVocabulary(vocabularyId: string): Promise<Phrase[]> {
  const phrases = await getPhrases()
  return phrases.filter((phrase) => phrase.relatedVocabularyIds.includes(vocabularyId))
}

// 특정 장소와 관련된 단어들 가져오기 (locations.json 기반)
export async function getVocabularyByLocation(locationId: string): Promise<Vocabulary[]> {
  const location = await getLocationById(locationId)
  if (!location) return []

  const vocabulary = await getVocabulary()
  return vocabulary.filter((word) => location.relatedVocabularyIds.includes(word.id))
}

// 랜덤 샘플 가져오기
export function getRandomSample<T>(array: T[], count: number): T[] {
  if (array.length <= count) return array

  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// 태그로 검색
export async function searchLocationsByTag(tag: string): Promise<Location[]> {
  const locations = await getLocations()
  return locations.filter((location) => location.tags.includes(tag))
}

export async function searchPhrasesByTag(tag: string): Promise<Phrase[]> {
  const phrases = await getPhrases()
  return phrases.filter((phrase) => phrase.tags.includes(tag))
}

export async function searchVocabularyByTag(tag: string): Promise<Vocabulary[]> {
  const vocabulary = await getVocabulary()
  return vocabulary.filter((word) => word.tags.includes(tag))
}

// 키워드로 검색
export async function searchLocationsByKeyword(keyword: string): Promise<Location[]> {
  const locations = await getLocations()
  const lowerKeyword = keyword.toLowerCase()

  return locations.filter(
    (location) =>
      location.name.toLowerCase().includes(lowerKeyword) ||
      location.nameJp.toLowerCase().includes(lowerKeyword) ||
      location.description.toLowerCase().includes(lowerKeyword) ||
      location.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword)),
  )
}

export async function searchPhrasesByKeyword(keyword: string): Promise<Phrase[]> {
  const phrases = await getPhrases()
  const lowerKeyword = keyword.toLowerCase()

  return phrases.filter(
    (phrase) =>
      phrase.jp.toLowerCase().includes(lowerKeyword) ||
      phrase.kr.toLowerCase().includes(lowerKeyword) ||
      phrase.situation.toLowerCase().includes(lowerKeyword) ||
      phrase.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword)),
  )
}

export async function searchVocabularyByKeyword(keyword: string): Promise<Vocabulary[]> {
  const vocabulary = await getVocabulary()
  const lowerKeyword = keyword.toLowerCase()

  return vocabulary.filter(
    (word) =>
      word.jp.toLowerCase().includes(lowerKeyword) ||
      word.kr.toLowerCase().includes(lowerKeyword) ||
      word.romaji.toLowerCase().includes(lowerKeyword) ||
      word.category.toLowerCase().includes(lowerKeyword) ||
      word.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword)),
  )
}
