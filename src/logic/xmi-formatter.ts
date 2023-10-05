import * as vkbeautify from 'vkbeautify';

export function formatXmi(xmi: string): string {
  return vkbeautify.xml(xmi);
}