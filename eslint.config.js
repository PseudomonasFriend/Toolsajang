const nextConfig = require('eslint-config-next/core-web-vitals');

// eslint-config-next@16 + eslint-plugin-react@7.37.5는 ESLint 10 flat config에서
// context.getFilename() 호환성 문제가 있음. settings.react.version을 명시적 semver로
// 설정하면 detectReactVersion() 호출을 우회하여 크래시를 방지할 수 있음.
const fixedConfig = nextConfig.map((config) => {
  if (config.plugins && config.plugins.react) {
    return {
      ...config,
      settings: {
        ...config.settings,
        react: { version: '19.0.0' },
      },
    };
  }
  return config;
});

module.exports = [
  ...fixedConfig,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
