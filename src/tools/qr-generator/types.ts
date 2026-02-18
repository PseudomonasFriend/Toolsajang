/** QR 생성기 입력 */
export interface QrGeneratorInput {
  /** URL 또는 텍스트 */
  text: string;
  /** QR 크기 (px) */
  size?: number;
}
