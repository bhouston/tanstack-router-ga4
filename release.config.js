export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/bhouston/tanstack-router-ga4.git',
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    ['@anolilab/semantic-release-pnpm', { pkgRoot: 'packages/tanstack-router-ga4' }],
    [
      '@semantic-release/github',
      {
        successCommentCondition: false,
        failCommentCondition: false,
        releasedLabels: false,
      },
    ],
  ],
};
