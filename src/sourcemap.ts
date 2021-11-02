import path from 'path';
const sourceMap = require('source-map'); // lock version

const splitRE = /\r?\n/g;

export default function (
  scriptResult: {
    code: string;
    map: any;
    externalSrc: string;
  },
  src: string,
  filename: string
) {
  const file = path.basename(filename);
  const map = new sourceMap.SourceMapGenerator();

  const scriptFromExternalSrc = scriptResult && scriptResult.externalSrc;

  const srcContent = scriptFromExternalSrc ? scriptResult.externalSrc : src;

  map.setSourceContent(file, srcContent);
  if (scriptResult) {
    let inputMapConsumer =
      scriptResult.map && new sourceMap.SourceMapConsumer(scriptResult.map);
    scriptResult.code.split(splitRE).forEach(function (_, index) {
      let ln = index + 1;
      let originalLine = inputMapConsumer
        ? inputMapConsumer.originalPositionFor({ line: ln, column: 0 }).line
        : ln;
      if (originalLine) {
        map.addMapping({
          source: file,
          generated: {
            line: ln,
            column: 0,
          },
          original: {
            line: originalLine,
            column: 0,
          },
        });
      }
    });
  }

  if (scriptFromExternalSrc) {
    return map;
  }

  return map;
}
