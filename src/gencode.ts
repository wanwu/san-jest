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
    output += `${namespace}.template = \`${templateResult.code}\`;\n`;
  }

  if (stylesResult) {
    const styleStr = (stylesResult as any[])
      .map(
        ({ code, moduleName }) =>
          `if(!this.data.get('${moduleName}')) {\n` +
          `  this.data.set('${moduleName}', {});\n` +
          `}\n` +
          `this.data.set('${moduleName}',Object.assign(\n` +
          `this.data.get('${moduleName}'), ${code}));\n`
      )
      .join('');

    output +=
      `  var styleFn = function () { ${styleStr} }\n` +
      `  ${namespace}.created = styleFn;\n`;
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
