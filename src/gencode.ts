const namespace = 'options';

export default (
  templateResult: any,
  scriptResult: any,
  stylesResult: any
): { code: string; map: any } => {
  let output = '';

  if (scriptResult) {
    output += `${scriptResult.code};\n`;
  } else {
    output +=
      `Object.defineProperty(exports, "__esModule", {\n` +
      `  value: true\n` +
      `});\n` +
      'module.exports.default = {};\n';
  }

  output +=
    `var ${namespace} = typeof exports.default === 'function' ` +
    `? exports.default.prototype ` +
    `: exports.default\n`;

  if (templateResult) {
    if (templateResult.compileANode) {
      output += `${namespace}.${templateResult.compileANode} = ${templateResult.code};\n`;
    } else if (typeof templateResult.code === 'string') {
      output += `${namespace}.template = ${templateResult.code};\n`;
    }
  }

  if (stylesResult) {
    const styleStr = (stylesResult as any[])
      .map((code) => `$style = Object.assign($style, ${code});\n`)
      .join('');

    output += `
    var origin = ${namespace}.initData;
    ${namespace}.initData = origin
    ? function () {
        var $style = {};
        ${styleStr}
        return Object.assign({}, origin.call(this), {$style: $style});
    } : function () {
      return {$style: $style};
    }`;
  }

  return {
    code: output,
    map: {
      mappings: '',
      names: [],
      sources: [],
      version: 3,
    },
  };
};
